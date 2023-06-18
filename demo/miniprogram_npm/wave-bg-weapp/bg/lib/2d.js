"use strict";
// This is free and unencumbered software released into the public domain
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeNoise2D = void 0;
var shuffle_seed_1 = require("./shuffle_seed");
var NORM_2D = 1.0 / 47.0;
var SQUISH_2D = (Math.sqrt(2 + 1) - 1) / 2;
var STRETCH_2D = (1 / Math.sqrt(2 + 1) - 1) / 2;
function contribution2D(multiplier, xsb, ysb) {
    return {
        dx: -xsb - multiplier * SQUISH_2D,
        dy: -ysb - multiplier * SQUISH_2D,
        xsb: xsb,
        ysb: ysb,
    };
}
function makeNoise2D(clientSeed) {
    var contributions = [];
    for (var i = 0; i < p2D.length; i += 4) {
        var baseSet = base2D[p2D[i]];
        var previous = null;
        var current = null;
        for (var k = 0; k < baseSet.length; k += 3) {
            current = contribution2D(baseSet[k], baseSet[k + 1], baseSet[k + 2]);
            if (previous === null)
                contributions[i / 4] = current;
            else
                previous.next = current;
            previous = current;
        }
        current.next = contribution2D(p2D[i + 1], p2D[i + 2], p2D[i + 3]);
    }
    var lookup = [];
    for (var i = 0; i < lookupPairs2D.length; i += 2) {
        lookup[lookupPairs2D[i]] = contributions[lookupPairs2D[i + 1]];
    }
    var perm = new Uint8Array(256);
    var perm2D = new Uint8Array(256);
    var source = new Uint8Array(256);
    for (var i = 0; i < 256; i++)
        source[i] = i;
    var seed = new Uint32Array(1);
    seed[0] = clientSeed;
    seed = shuffle_seed_1.default(shuffle_seed_1.default(shuffle_seed_1.default(seed)));
    for (var i = 255; i >= 0; i--) {
        seed = shuffle_seed_1.default(seed);
        var r = new Uint32Array(1);
        r[0] = (seed[0] + 31) % (i + 1);
        if (r[0] < 0)
            r[0] += i + 1;
        perm[i] = source[r[0]];
        perm2D[i] = perm[i] & 0x0e;
        source[r[0]] = source[i];
    }
    return function (x, y) {
        var stretchOffset = (x + y) * STRETCH_2D;
        var xs = x + stretchOffset;
        var ys = y + stretchOffset;
        var xsb = Math.floor(xs);
        var ysb = Math.floor(ys);
        var squishOffset = (xsb + ysb) * SQUISH_2D;
        var dx0 = x - (xsb + squishOffset);
        var dy0 = y - (ysb + squishOffset);
        var xins = xs - xsb;
        var yins = ys - ysb;
        var inSum = xins + yins;
        var hash = (xins - yins + 1) |
            (inSum << 1) |
            ((inSum + yins) << 2) |
            ((inSum + xins) << 4);
        var value = 0;
        for (var c = lookup[hash]; c !== undefined; c = c.next) {
            var dx = dx0 + c.dx;
            var dy = dy0 + c.dy;
            var attn = 2 - dx * dx - dy * dy;
            if (attn > 0) {
                var px = xsb + c.xsb;
                var py = ysb + c.ysb;
                var indexPartA = perm[px & 0xff];
                var index = perm2D[(indexPartA + py) & 0xff];
                var valuePart = gradients2D[index] * dx + gradients2D[index + 1] * dy;
                value += attn * attn * attn * attn * valuePart;
            }
        }
        return value * NORM_2D;
    };
}
exports.makeNoise2D = makeNoise2D;
var base2D = [
    [1, 1, 0, 1, 0, 1, 0, 0, 0],
    [1, 1, 0, 1, 0, 1, 2, 1, 1],
];
var gradients2D = [
    5,
    2,
    2,
    5,
    -5,
    2,
    -2,
    5,
    5,
    -2,
    2,
    -5,
    -5,
    -2,
    -2,
    -5,
];
var lookupPairs2D = [
    0,
    1,
    1,
    0,
    4,
    1,
    17,
    0,
    20,
    2,
    21,
    2,
    22,
    5,
    23,
    5,
    26,
    4,
    39,
    3,
    42,
    4,
    43,
    3,
];
var p2D = [
    0,
    0,
    1,
    -1,
    0,
    0,
    -1,
    1,
    0,
    2,
    1,
    1,
    1,
    2,
    2,
    0,
    1,
    2,
    0,
    2,
    1,
    0,
    0,
    0,
];

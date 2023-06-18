"use strict";
// This is free and unencumbered software released into the public domain
Object.defineProperty(exports, "__esModule", { value: true });
function shuffleSeed(seed) {
    var newSeed = new Uint32Array(1);
    newSeed[0] = seed[0] * 1664525 + 1013904223;
    return newSeed;
}
exports.default = shuffleSeed;

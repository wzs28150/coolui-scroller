/**
 * 2D Perlin (OpenSimplex) noise
 *
 * 移植自 `src/wxcomponents/wave-bg/bg/lib/noise.js`（public domain），
 * 只是把 CommonJS 改成 ESM 并补上类型，算法与取值完全一致，
 * 保证跨端画出的波浪与微信原生组件一致。
 */

interface Contribution {
  dx: number
  dy: number
  xsb: number
  ysb: number
  next?: Contribution
}

/** 二维噪声采样函数 */
export type Noise2D = (x: number, y: number) => number

const NORM_2D = 1.0 / 47.0
const SQUISH_2D = (Math.sqrt(2 + 1) - 1) / 2
const STRETCH_2D = (1 / Math.sqrt(2 + 1) - 1) / 2

const base2D = [
  [1, 1, 0, 1, 0, 1, 0, 0, 0],
  [1, 1, 0, 1, 0, 1, 2, 1, 1],
]
const gradients2D = [5, 2, 2, 5, -5, 2, -2, 5, 5, -2, 2, -5, -5, -2, -2, -5]
const lookupPairs2D = [
  0, 1, 1, 0, 4, 1, 17, 0, 20, 2, 21, 2, 22, 5, 23, 5, 26, 4, 39, 3, 42, 4, 43, 3,
]
const p2D = [0, 0, 1, -1, 0, 0, -1, 1, 0, 2, 1, 1, 1, 2, 2, 0, 1, 2, 0, 2, 1, 0, 0, 0]

// 返回类型交给 TS 推断（显式写 Uint32Array 在 TS5.7+ 会因泛型参数默认值不同而报错）
const shuffleSeed = (seed: Uint32Array) => {
  const next = new Uint32Array(1)
  next[0] = seed[0] * 1664525 + 1013904223
  return next
}

const contribution2D = (multiplier: number, xsb: number, ysb: number): Contribution => {
  return {
    dx: -xsb - multiplier * SQUISH_2D,
    dy: -ysb - multiplier * SQUISH_2D,
    xsb,
    ysb,
  }
}

/**
 * 生成一个二维噪声函数
 * @param clientSeed 随机种子（一般用 Date.now()）
 */
export function makeNoise2D(clientSeed: number): Noise2D {
  const contributions: Contribution[] = []
  for (let i = 0; i < p2D.length; i += 4) {
    const baseSet = base2D[p2D[i]]
    let previous: Contribution | null = null
    let current: Contribution | null = null
    for (let k = 0; k < baseSet.length; k += 3) {
      current = contribution2D(baseSet[k], baseSet[k + 1], baseSet[k + 2])
      if (previous === null) {
        contributions[i / 4] = current
      } else {
        previous.next = current
      }
      previous = current
    }
    if (current) {
      current.next = contribution2D(p2D[i + 1], p2D[i + 2], p2D[i + 3])
    }
  }

  const lookup: Array<Contribution | undefined> = []
  for (let i = 0; i < lookupPairs2D.length; i += 2) {
    lookup[lookupPairs2D[i]] = contributions[lookupPairs2D[i + 1]]
  }

  const perm = new Uint8Array(256)
  const perm2D = new Uint8Array(256)
  const source = new Uint8Array(256)
  for (let i = 0; i < 256; i++) {
    source[i] = i
  }
  let seed = new Uint32Array(1)
  seed[0] = clientSeed
  seed = shuffleSeed(shuffleSeed(shuffleSeed(seed)))
  for (let i = 255; i >= 0; i--) {
    seed = shuffleSeed(seed)
    const r = new Uint32Array(1)
    r[0] = (seed[0] + 31) % (i + 1)
    if (r[0] < 0) {
      r[0] += i + 1
    }
    perm[i] = source[r[0]]
    perm2D[i] = perm[i] & 0x0e
    source[r[0]] = source[i]
  }

  return (x: number, y: number): number => {
    const stretchOffset = (x + y) * STRETCH_2D
    const xs = x + stretchOffset
    const ys = y + stretchOffset
    const xsb = Math.floor(xs)
    const ysb = Math.floor(ys)
    const squishOffset = (xsb + ysb) * SQUISH_2D
    const dx0 = x - (xsb + squishOffset)
    const dy0 = y - (ysb + squishOffset)
    const xins = xs - xsb
    const yins = ys - ysb
    const inSum = xins + yins
    const hash =
      (xins - yins + 1) | (inSum << 1) | ((inSum + yins) << 2) | ((inSum + xins) << 4)
    let value = 0
    for (let c: Contribution | undefined = lookup[hash]; c !== undefined; c = c.next) {
      const dx = dx0 + c.dx
      const dy = dy0 + c.dy
      const attn = 2 - dx * dx - dy * dy
      if (attn > 0) {
        const px = xsb + c.xsb
        const py = ysb + c.ysb
        const indexPartA = perm[px & 0xff]
        const index = perm2D[(indexPartA + py) & 0xff]
        const valuePart = gradients2D[index] * dx + gradients2D[index + 1] * dy
        value += attn * attn * attn * attn * valuePart
      }
    }
    return value * NORM_2D
  }
}

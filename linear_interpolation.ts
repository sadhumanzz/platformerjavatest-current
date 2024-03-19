/**
 * Linear interpolate on the scale given by `a` to `b`, using `t` as the point on that scale.
 */
const lerp = (a: number, b: number, t: number) => a + t * (b - a);

/**
 * Inverse Linar Interpolation, get the fraction between `a` and `b` on which `v` resides.
 */
const inLerp = (a: number, b: number, v: number) => (v - a) / (b - a);

/**
 * Remap values from one linear scale to another.
 *
 * `oMin` and `oMax` are the scale on which the original value resides,
 * `rMin` and `rMax` are the scale to which it should be mapped.
 */
const remap = (
    v: number,
    oMin: number,
    oMax: number,
    rMin: number,
    rMax: number
) => lerp(rMin, rMax, inLerp(oMin, oMax, v));
/**
 * @param {int} value 
 * @param {int} valueMin 
 * @param {int} valueMax 
 * @param {int} min 
 * @param {int} max
 * @returns {int} mapped value
 */
export function map(value, valueMin, valueMax, targetMin, targetMax) {
    return targetMin + (((value - valueMin) * (targetMax - targetMin)) / (valueMax - valueMin));
}

/**
 * @param {int} value 
 * @param {int} min 
 * @param {int} max 
 * @returns {int} constrained value
 */
export function constrain(value, min, max) {
    return Math.min(Math.max(value, min), max)
}


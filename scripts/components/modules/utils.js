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


/**
 * @param {string} attrToFind missing attr
 * @param {array} attrList list of attributes
 * @return {string | undefined} text value from attribute
 */
export function getAttrText(attrToFind, attrList) {
    attrList = [...attrList];
    for (let i = 0; i < attrList.length; i++) {
        const attr = attrList[i];
        if(attr.name === attrToFind) {
            return attr.textContent;
        }
    }
    return undefined;
}

/**
 * @param {string} attrToFind missing attr
 * @param {array} attrList list of attributes
 * @return {object | undefined} object value from attribute
 */
export function getAttrObj(attrToFind, attrList) {
    attrList = [...attrList];
    for (let i = 0; i < attrList.length; i++) {
        const attr = attrList[i];
        if(attr.name === attrToFind) {
            try {
                return JSON.parse(attr.textContent);
            }
            catch {
                return undefined
            }
        }
    }
    return undefined;
}

/**
 * @param {string} attrToFind missing attr
 * @param {array} attrList list of attributes
 * @return {Bool} text value from attribute
 */
export function hasAttr(attrToFind, attrList) {
    attrList = [...attrList];
    for (let i = 0; i < attrList.length; i++) {
        const attr = attrList[i];
        if(attr.name === attrToFind) {
            return true;
        }
    }
    return false;
}
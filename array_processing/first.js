function first(array, defaultValue = null) {
    return Array.isArray(array) && array.length > 0 ? array[0] : defaultValue;
}

module.exports = first;
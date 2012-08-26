exports.objectMapValues = objectMapValues;

function objectMapValues(obj, func) {
    var result = {};
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            result[key] = func(key, obj[key]);
        }
    }
    return result;
};

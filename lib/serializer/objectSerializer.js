
module.exports.serialize = (object) => {
    return JSON.stringify(object, function (key, value) {
        if (typeof value === 'function') {
            const functionAsString = value.toString();
            return functionAsString.indexOf("function") >= 0 ? functionAsString : "function "+functionAsString;
        }

        if(value instanceof Error){
            return {
                message : value.message,
                stack   : value.stack
            }
        }

        return value;
    });
};

module.exports.deserialize = (object) => {
    return JSON.parse(object, function (key, value) {
        if (value && typeof value === "string" && value.substr(0,8) == "function") {
            var startBody = value.indexOf('{') + 1;
            var endBody = value.lastIndexOf('}');
            var startArgs = value.indexOf('(') + 1;var endArgs = value.indexOf(')');
            return new Function(value.substring(startArgs, endArgs), value.substring(startBody, endBody));
        }
        return value;
    });
};
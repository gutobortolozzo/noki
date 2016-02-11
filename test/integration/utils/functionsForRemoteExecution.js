module.exports.fibonacci = (limit) => {
    return fibonacci(limit);
};

module.exports.fibonacciPromise = (limit) => {
    return new Promise((resolve, _) => {
        const result = fibonacci(limit);
        setTimeout(() => {
            resolve(result);
        }, 500);
    });
};

module.exports.rejected = () => {
    return new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error("Test rejection"));
        }, 500);
    });
};

const fibonacci = (limit) => {
    var a = 0, b = 1, f = 1;

    for(var i = 2; i <= limit; i++) {
        f = a + b;
        a = b;
        b = f;
    }

    return f;
};
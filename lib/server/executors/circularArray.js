const _ = require("underscore");

class CircularArray {

    constructor() {
        this.executors = [];
    }

    putExecutorIfAbsent(executor) {

        const includes = _.includes(this.executors, (element) => element.host == executor.host);

        if(!includes) this.executors.push(executor);
    }

    next() {

        var temp = this.executors.shift();
        this.executors.push(temp);

        return this.executors[0];
    }
}

module.exports = CircularArray;
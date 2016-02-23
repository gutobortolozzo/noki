"use strict";
const _ = require("underscore");

class CircularArray {

    constructor() {
        this.executors = [];
        this.position = 0;
        this.putSemaphore = false;
    }

    putExecutors(executors) {

        if(this.putSemaphore) return;

        this.executors.splice(0, this.executors.length);

        _.uniq(executors, executor => executor.host)
            .forEach(executor => this.executors.push(executor));

        this.position = 0;
    }

    next() {
        this.putSemaphore = true;
        const executor = this.executors[this.position];
        this.position++;

        if(this.position >= this.executors.length)
            this.position = 0;

        this.putSemaphore = false;
        return executor;
    }

    size() {
        return this.executors.length;
    }
}

module.exports = CircularArray;
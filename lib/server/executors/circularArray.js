"use strict";
const _ = require("underscore");

class CircularArray {

    constructor() {
        this.executors = [];
        this.position = 0;
    }

    putExecutors(executors) {

        const positionToRemove = [];

        this.executors.forEach((executor, position) => {
            var toRemove = true;

            executors.forEach((currentElement) => {
                if(executor.host == currentElement.host)
                    toRemove = false;
            });

            if(toRemove) positionToRemove.push(position);
        });

        positionToRemove.forEach((position) => this.executors.splice(position, 1));

        executors.forEach((executor) => {

            const filtered = this.executors.filter((currentElement) => currentElement.host == executor.host);

            if (filtered.length > 0) return;

            this.executors.push(executor);
        });
    }

    next() {

        //var temp = this.executors.shift();
        //if(!temp) return temp;
        //this.executors.push(temp);
        //return this.executors[0]

        const executor = this.executors[this.position];
        this.position++;

        if(this.position >= this.executors.length)
            this.position = 0;

        return executor;
    }

    size() {
        return this.executors.length;
    }
}

module.exports = CircularArray;
"use strict";
const _ = require('underscore');

class CircularTTLArray {

    /**
     *
     * @param ttl, if no TTL suplied, default will be 1500ms
     */
    constructor(ttl) {
        this.executors = [];
        this.currentPosition = 0;
        this.defaultTimeout = ttl || 1500;
    }

    push(executor) {

        const clonedExecutor = _.clone(executor);

        clonedExecutor.ttlRemover = (timeout) => {

            const remove = () => {
                const index = this.executors.findIndex((current) => current.host == clonedExecutor.host);
                this.executors.splice(index, 1);
            };

            return setTimeout(remove, timeout);
        };

        clonedExecutor.ttlRemover(this.defaultTimeout);

        this.executors.push(clonedExecutor);
    }

    next() {

        if(this.currentPosition >= this.size())
            this.currentPosition = 0;

        const executor = this.executors[this.currentPosition];
        this.currentPosition++;

        return executor;
    }

    size() {
        return this.executors.length;
    }
};

module.exports = CircularTTLArray;
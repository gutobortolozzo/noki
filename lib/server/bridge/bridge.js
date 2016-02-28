"use strict";
const sniffer = require('./../sniffer/slaveSniffer');
const consumer = require('../consumer/consumer');
const CircularArray = require('../executors/circularArray');
const assert = require('assert');
const _ = require('underscore');
const ip = require('ip');
/**
 *
 * @param options
 * options = {
 *     port : 3000,
 * }
 *
 * @return Bridge
 */
const Bridge = function(options) {

    const executors = new CircularArray();
    const bridgeOptions = _.clone(options);

    _.defaults(bridgeOptions, {
        port : 3000
    });

    const sniffing = sniffer.sniff(bridgeOptions.port);

    sniffing.on("message", (executor) => {
        executors.putExecutors([executor]);
    });

    /**
     *
     * @param command
     * options = {
     *     process : () => {
     *         return {
     *             result : processingResult || processingResult can be one object or one promise
     *         }
     *     }
     * }
     *
     * @return promise {
     *      result : remote processing result,
      *     executor : executor information
     * }
     */
    this.execute = (command) => {

        assert(!!command, "Command cannot be null");
        assert(!!command.process, "Command must have one function process");

        const executor = executors.next();

        if(!executor) return Promise.reject(new Error("No executor available"));

        return consumer.execute(command, executor.port, executor.host)
            .then((response) => {
                response.executor = executor;
                return response;
            });
    };

    /**
     * Prevent sniffer from sniffing new executors, this action can't be undone.
     */
    this.stopSniffer = () => sniffer.kill();
};

module.exports = Bridge;
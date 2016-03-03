"use strict";
const sniffer = require('./../sniffer/slaveSniffer');
const consumer = require('../consumer/consumer');
const CircularTTLArray = require('../executors/circularTTLArray');
const EventEmitter = require('events');
const assert = require('assert');
const _ = require('underscore');
const ip = require('ip');
/**
 *
 * @param options
 * options = {
 *     port      : 3000,
 *     dgramPort : 41234
 * }
 *
 * @return Bridge
 */
const Bridge = function(options) {

    const executors = new CircularTTLArray();
    const bridgeOptions = _.clone(options);

    _.defaults(bridgeOptions, {
        port      : 3000,
        dgramPort : 41234
    });

    bridgeOptions.emitter = new EventEmitter();
    const sniffing = sniffer.sniff(bridgeOptions);

    sniffing.on("message", (executor) => {
        executors.push(executor);
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

    /**
     * @return EventEmitter
     *      events
     *          - error           : error object
     *          - executor-stats  : stats object
     */
    this.emitter = () => bridgeOptions.emitter;
};

module.exports = Bridge;
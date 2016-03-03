"use strict";
const dgram = require('dgram');
const EventEmitter = require('events');

let server;

/**
 * @param options = {
 *     port      : 3000,
 *     dgramPort : 41234
 *     emitter   : optional event emitter instance
 * }
 *
 * @emit EventEmitter
 *      events
 *          - error
 *          - message : Object with executor machine status
 *
 * @return EventEmitter
 *      events
 *           - error
 *           - message : { host : port }
 */
module.exports.sniff = (options) => {

    server = dgram.createSocket('udp4');

    const emitter = new EventEmitter();

    server.on('error', (err) => {
        emitter.emit('error', err);
        !options.emitter || options.emitter.emit("error", error);
        server.close();
    });

    server.on('message', (msg, rinfo) => {
        const executorInformation = JSON.parse(msg);

        !options.emitter || options.emitter.emit("executor-stats", executorInformation);

        const executor = {
            host : rinfo.address,
            port : options.port
        };

        emitter.emit("message", executor);
    });

    server.bind(options.dgramPort);

    return emitter;
};

/**
 * Kill current udp dgram running
 */
module.exports.kill = () => {
    server.close();
};
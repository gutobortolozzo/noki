"use strict";
const dgram = require('dgram');
const EventEmitter = require('events');

let server;

/**
 * @param options = {
 *     port      : 3000,
 *     dgramPort : 41234
 * }
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
        server.close();
    });

    server.on('message', (msg, rinfo) => {
        //const parsed = JSON.parse(msg);

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
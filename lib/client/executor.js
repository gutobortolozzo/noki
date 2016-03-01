"use strict";
const net = require('net');
const _ = require('underscore');
const register = require('./register/register');
const serializer = require('../serializer/objectSerializer');

let server;
let clientBroadcaster;
/**
 *
 * @param port
 * @param context, the context of functions/objects to be exposed to remote execution
 * @param options, Optional or {
 *      broadcast : "255.255.255.255",
 *      dgramPort : 41234
 * }
 */
module.exports.listen = (port, context, options) => {
    const withDefaultOptions = defaultOptions(options);

    clientBroadcaster = register.startExecutorBroadcast(withDefaultOptions);

    server = createServer(context);
    server.listen(port);
};

module.exports.kill = () => {
    clientBroadcaster.close();
    server.close();
};

const defaultOptions = (options) => {

    const cloned = _.clone(options || {});

    _.defaults(cloned, {
        broadcast : "255.255.255.255",
        dgramPort : 41234
    });

    return cloned;
};

const createServer = (context) => {
    return net.createServer((socket) => {
        socket.on('data', (data) => commandProcessor(data, socket, context));
    });
};

const commandProcessor = (data, socket, context) => {

    const command = serializer.deserialize(data.toString());

    const result = command.process(context);

    Promise.resolve(result)
        .then((response) => writeResponseToServer(response, socket))
        .catch((response) => writeResponseToServer(response, socket));
};

const writeResponseToServer = (response, socket) => {
    const serialized = serializer.serialize({
        result : response
    });

    socket.write(serialized);
};
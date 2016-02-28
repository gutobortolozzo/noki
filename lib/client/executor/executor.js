"use strict";
const net = require('net');
const register = require('./selfRegister');
const serializer = require('../../serializer/objectSerializer');

let server;
let clientBroadcaster;

module.exports.listen = (port, context) => {
    clientBroadcaster = register.startExecutorBroadcast();
    server = createServer(context);
    server.listen(port);
};

module.exports.kill = () => {
    clientBroadcaster.close();
    server.close();
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
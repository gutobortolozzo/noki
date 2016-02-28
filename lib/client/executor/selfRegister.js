const dgram = require('dgram');

/**
 *
 * @param options = {
 *      broadcast : '255.255.255.255',
 *      dgramPort : 41234
 * }
 * @returns dgram socket
 */
module.exports.startExecutorBroadcast = (options) => {

    const client = dgram.createSocket("udp4");

    const payload = JSON.stringify({});

    const sendMessage = () => client.send(payload, 0, payload.length, options.dgramPort, options.broadcast);

    const binder = () => {
        client.setBroadcast(true);
        const timer = setInterval(sendMessage, 1000);
        client.on('close', () => clearInterval(timer));
    };

    client.bind(binder);

    return client;
};
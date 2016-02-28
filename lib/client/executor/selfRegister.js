const dgram = require('dgram');

module.exports.startExecutorBroadcast = () => {

    const client = dgram.createSocket("udp4");

    const payload = JSON.stringify({});

    const sendMessage = () => client.send(payload, 0, payload.length, 41234, "255.255.255.255");

    const binder = () => {
        client.setBroadcast(true);
        const timer = setInterval(sendMessage, 1000);
        client.on('close', () => clearInterval(timer));
    };

    client.bind(binder);

    return client;
};
const net = require('net');
const Socket = net.Socket;
const _ = require('underscore');
const ip = require('ip');

const checkPort = function(port, host, timeout) {
    const socket = new Socket();

    const response = {
        port   : port,
        host   : host,
    };

    return new Promise((resolve, _) => {
        socket.on('connect', () => {
            response.status = 'open';
            resolve(response);
        });

        socket.on('timeout', () => {
            socket.destroy();
            response.status = 'timeout';
            resolve(response);
        });

        socket.on('error', (exception) => {
            response.status = 'error';
            resolve(response);
        });

        socket.on('close', (exception) => {
            response.status = 'closed';
            resolve(response);
        });

        socket.setTimeout(timeout);
        socket.connect(port, host);
    });
};

/**
 *
 * @param options
 * options = {
 *     port     : 3000,
 *     timeout  : 1500,
 *     ipRange  : '192.168.0' || machine server ip
 * }
 *
 * @return promise [{
 *      port : 13340,
 *      host : machine ip,
 * }]
 */
module.exports.sniff = (options) => {

    const currentIp = ip.address();
    const sniffOptions = _.clone(options);

    _.defaults(sniffOptions, {
        port    : 3000,
        timeout : 1500,
        ipRange : currentIp.slice(0, currentIp.lastIndexOf('\.'))
    });

    const promises = [];

    for (var index = 1; index <= 255; index++) {
        promises.push(checkPort(sniffOptions.port, sniffOptions.ipRange+'.'+index, sniffOptions.timeout));
    }

    const mapper = (responses) => {
        return responses.map((response) => {
            return {
                port : response.port,
                host : response.host
            }
        });
    };

    return Promise.all(promises)
        .then(responses => responses.filter((response) => response.status == 'open'))
        .then(mapper);
};
const net = require('net');
const Socket = net.Socket;
const _ = require('underscore');
const ip = require('ip');

const STATE_AVAILABLE = "AVAILABLE";
const STATE_BUSY = "BUSY";

const checkPort = function(port, host, timeout) {
    const socket = new Socket();

    const response = {
        port   : port,
        host   : host,
        state  : STATE_AVAILABLE
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
 *      state : STATE_AVAILABLE | STATE_BUSY
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

    for (let index = 1; index <= 255; index++) {
        promises.push(checkPort(sniffOptions.port, sniffOptions.ipRange+'.'+index, sniffOptions.timeout));
    }

    return Promise.all(promises)
        .then((responses) => {
            return responses.filter((response) => {
                return response.status == 'open';
            });
        })
};

module.exports.STATE_AVAILABLE = STATE_AVAILABLE;
module.exports.STATE_BUSY = STATE_BUSY;
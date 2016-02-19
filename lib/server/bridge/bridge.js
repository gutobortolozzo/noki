const sniffer = require(process.cwd()+'/lib/server/sniffer/slaveSniffer');
const consumer = require(process.cwd()+'/lib/server/consumer/consumer');
const CircularArray = require(process.cwd()+'/lib/server/executors/circularArray');
const assert = require('assert');
const _ = require('underscore');
const ip = require('ip');
/**
 *
 * @param options
 * options = {
 *     port         : 3000,
 *     timeout      : 1500,
 *     ipRange      : '192.168.0' || machine server ip,
 *     scanInterval : 1000
 * }
 *
 * @return Bridge
 */
const Bridge = function(options) {

    const executors = new CircularArray();

    const currentIp = ip.address();
    const bridgeOptions = _.clone(options);

    _.defaults(bridgeOptions, {
        port            : 3000,
        timeout         : 1500,
        ipRange         : currentIp.slice(0, currentIp.lastIndexOf('\.')),
        scanInterval    : 1000
    });

    const scanExecutors = () => {
        sniffer.sniff(bridgeOptions)
            .then((response) => {
                executors.size();
                executors.putExecutors(response);
            });
    };

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

    setInterval(scanExecutors, bridgeOptions.scanInterval);
    scanExecutors();
};

module.exports = Bridge;
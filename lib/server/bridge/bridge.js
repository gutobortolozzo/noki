const sniffer = require(process.cwd()+'/lib/server/sniffer/slaveSniffer');
const consumer = require(process.cwd()+'/lib/server/consumer/consumer');
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

    let executors = [];

    const currentIp = ip.address();
    const bridgeOptions = _.clone(options);

    _.defaults(bridgeOptions, {
        port            : 3000,
        timeout         : 1500,
        ipRange         : currentIp.slice(0, currentIp.lastIndexOf('\.')),
        scanInterval    : 1000
    });

    const reserveFirstExecutorAvailable = () => {
        const filtered = executors.filter((executor) => {
            return executor.state == sniffer.STATE_AVAILABLE;
        });

        if(filtered.length == 0) throw new Error("No executor available");

        const executor = filtered[0];
        executor.state = sniffer.STATE_BUSY;

        return executor;
    };

    const unreserveExecutor = (executor) => {
        executor.state = sniffer.STATE_AVAILABLE
    };

    const scanExecutors = () => {
        sniffer.sniff(bridgeOptions)
            .then((response) => {
                executors = executors.concat(response);
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

        const executor = reserveFirstExecutorAvailable();

        return consumer.execute(command, executor.port, executor.ip)
            .then((response) => {
                unreserveExecutor(executor);
                response.executor = executor;
                return response;
            });
    };

    setInterval(scanExecutors, bridgeOptions.scanInterval);
    scanExecutors();
};

module.exports = Bridge;
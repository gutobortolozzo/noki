"use strict";
const net = require('net');
const should = require('should');
const Bridge = require(process.cwd()+'/lib/server/bridge/bridge');
const executor  = require(process.cwd()+"/lib/client/executor");
const functionsHelper = require(process.cwd()+'/test/integration/utils/functionsForRemoteExecution');

describe("Bridge executor using custom bridge configuration", () => {

    it("Execute remote command on executor pre configured waiting less than default ttl", () => {

        const localBridge = new Bridge({
            port      : 9805,
            executors : [
                { port : 9805, host : '127.0.0.1' }
            ]
        });

        const command = {
            process : (context) => {
                return context.fibonacciPromise(22);
            }
        };

        return localBridge.execute(command)
            .then((response) => response.result.should.be.eql(17711));
    });

    it("Execute remote command on executor pre configured waiting more than default ttl(1500)", () => {

        const localBridge = new Bridge({
            port      : 9805,
            executors : [
                { port : 9805, host : '127.0.0.1' }
            ]
        });

        const command = {
            process : (context) => {
                return context.fibonacciPromise(22);
            }
        };

        return localBridge.execute(command)
            .then((response) => response.result.should.be.eql(17711));
    });

    const port = 9805;

    beforeEach(() => executor.listen(port, functionsHelper));

    afterEach(() => executor.kill());

});
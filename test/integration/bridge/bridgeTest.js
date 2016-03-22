"use strict";
const net = require('net');
const should = require('should');
const Bridge = require(process.cwd()+'/lib/server/bridge/bridge');
const executor  = require(process.cwd()+"/lib/client/executor");
const functionsHelper = require(process.cwd()+'/test/integration/utils/functionsForRemoteExecution');

describe("Bridge executor", () => {

    it("Try execute null command", () => {
        should(() => { bridge.execute(); }).throw("Command cannot be null");
    });

    it("Try execute command without process function", () => {
        should(() => { bridge.execute({}); }).throw("Command must have one function process");
    });

    it("Try execute command without processors", (done) => {

        bridge.execute({ process : () => {} })
            .catch((error) => {
                error.message.should.be.eql("No executor available");
                done();
            });
    });

    it("Execute distributed fibonacci of 10", () => {

        const command = {
            process : (context) => {
                return context.fibonacciPromise(10);
            }
        };

        return delayPromise(1500)
            .then(() => bridge.execute(command))
            .then((response) => response.result.should.be.eql(55));
    });

    it("Try to execute test without executor listening", () => {

        const command = {
            process : (context) => {
                return context.fibonacciPromise(10);
            }
        };

        bridge.stopSniffer();

        const currentServer = new Bridge({
            port : 18281
        });

        return delayPromise(1500)
            .then(() => currentServer.execute(command))
            .catch((error) => error.message.should.containEql("connect ECONNREFUSED"));
    });

    it("Execute remote command and wait for executor stats", (done) => {

        bridge.emitter().once('executor-stats', (stats) => {
            stats.should.have.property("uptime");
            stats.should.have.property("totalMemory");
            stats.should.have.property("totalCpus");
            done();
        });
    });

    const delayPromise = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const port = 9805;
    let bridge;

    beforeEach(() => {

        if(bridge) bridge.stopSniffer();

        bridge = new Bridge({
            port : port
        });

        executor.listen(port, functionsHelper);
    });

    afterEach(() => executor.kill());
});

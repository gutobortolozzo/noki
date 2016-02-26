const should = require('should');
const net = require('net');
const Bridge = require(process.cwd()+'/lib/server/bridge/bridge');
const executor  = require(process.cwd()+"/lib/client/executor/executor");
const functionsHelper = require(process.cwd()+'/test/integration/utils/functionsForRemoteExecution');

describe("Bridge executor", () => {

    const port = 9805;

    var bridge;

    it("Try execute null command", () => {
        should(() => { bridge.execute(); }).throw("Command cannot be null");
    });

    it("Try execute command without process", () => {
        should(() => { bridge.execute({}); }).throw("Command must have one function process");
    });

    it("Try execute command without processors", () => {

        return bridge.execute({ process : () => {} })
            .catch((error) => {
                error.message.should.be.eql("No executor available");
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

        const currentServer = new Bridge({
            port            : 18281,
            timeout         : 500,
            ipRange         : "127.0.0",
            scanInterval    : 5000
        });

        return delayPromise(1500)
            .then(() => currentServer.execute(command))
            .catch((error) => error.message.should.be.eql("No executor available"));
    });

    const delayPromise = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    };

    beforeEach(() => {
        executor.listen(port, functionsHelper);

        bridge = new Bridge({
            port            : port,
            timeout         : 500,
            ipRange         : "127.0.0",
            scanInterval    : 5000
        });
    });

    afterEach(() => {
        executor.kill();
    });
});

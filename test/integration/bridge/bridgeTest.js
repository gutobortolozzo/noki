const should = require('should');
const net = require('net');
const Bridge = require(process.cwd()+'/lib/server/bridge/bridge');
const executor  = require(process.cwd()+"/lib/client/executor/executor");
const functionsHelper = require(process.cwd()+'/test/integration/utils/functionsForRemoteExecution');

describe("Bridge executor", () => {

    const port = 9805;

    let bridge;

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

    it("Execute distributed fibonacci of 10", (done) => {

        const command = {
            process : (context) => {
                return context.fibonacciPromise(10);
            }
        };

        setTimeout(() => {
            bridge.execute(command)
                .then((response) => {
                    response.result.should.be.eql(55);
                })
                .then(done)
        }, 2000);
    });

    it("Execute distributed checking remote executor", (done) => {

        const command = {
            process : (context) => {
                return context.fibonacciPromise(10);
            }
        };

        setTimeout(() => {
            bridge.execute(command)
                .then((response) => {
                    response.executor.state.should.be.eql("AVAILABLE");
                    response.executor.host.should.be.eql("127.0.0.1");
                })
                .then(done)
        }, 2000);
    });

    beforeEach(() => {
        executor.listen(port, functionsHelper);

        bridge = new Bridge({
            port            : port,
            timeout         : 500,
            ipRange         : "127.0.0",
            scanInterval    : 1000
        });
    });

    afterEach(() => {
        executor.kill();
    });
});

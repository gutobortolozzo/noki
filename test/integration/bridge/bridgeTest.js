require('should');
const net = require('net');
const Bridge = require(process.cwd()+'/lib/server/bridge/bridge');
const executor  = require(process.cwd()+"/lib/client/executor/executor");
const functionsHelper = require(process.cwd()+'/test/integration/utils/functionsForRemoteExecution');

describe("Bridge executor", () => {

    const port = 9805;

    const bridge = new Bridge({
        port            : 9805,
        timeout         : 1500,
        ipRange         : "127.0.0",
        scanInterval    : 1000
    });

    it("Execute distributed fibonacci of 10", (done) => {

        const command = {
            process : (context) => {
                const result = context.fibonacciPromise(10);
                return { result : result };
            }
        };

        setTimeout(() => {
            bridge.execute(command)
                .then((response) => {
                    response.result.should.be.eql(89);
                })
                .then(done)
        }, 3000);
    });

    beforeEach(() => {
        executor.listen(port, functionsHelper);
    });

    afterEach(() => {
        executor.kill();
    });
});

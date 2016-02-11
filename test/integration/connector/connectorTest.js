require('should');
const net = require('net');
const executor  = require(process.cwd()+"/lib/client/executor/executor");
const consumer  = require(process.cwd()+"/lib/server/consumer/consumer");
const serializer = require(process.cwd()+'/lib/serializer/objectSerializer');
const functionsHelper = require(process.cwd()+'/test/integration/utils/functionsForRemoteExecution');

describe("Client connector", () => {

    const port = 9905;

    it("Send message to slave and check execution", () => {

        const command = {
            process : function() {
                return { result : '---10---' };
            }
        };

        return consumer.execute(command, port, '127.0.0.1')
            .then((response) => {
                response.result.should.be.eql('---10---');
            });
    });

    it("Send fibonacci of 40 for execution in the remote environment", () => {

        const command = {
            process : (context) => {
                return {
                    result : context.fibonacci(40)
                };
            }
        };

        return consumer.execute(command, port, '127.0.0.1')
            .then((response) => {
                response.result.should.be.eql(102334155);
            });
    });

    it("Send fibonacci of 45 as promise to execute in the remote environment", () => {

        const command = {
            process : (context) => {
                return {
                    result : context.fibonacciPromise(45)
                };
            }
        };

        return consumer.execute(command, port, '127.0.0.1')
            .then((response) => {
                response.result.should.be.eql(1134903170);
            });
    });

    beforeEach(() => {
        executor.listen(port, functionsHelper);
    });

    afterEach(() => {
        executor.kill();
    });
});

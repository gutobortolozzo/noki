require('should');
const net = require('net');
const executor  = require(process.cwd()+"/lib/client/executor/executor");
const consumer  = require(process.cwd()+"/lib/server/consumer/consumer");
const serializer = require(process.cwd()+'/lib/serializer/objectSerializer');

describe("Client connector", () => {

    const port = 9905;

    it("Send message to slave and check execution", (done) => {

        const command = {
            process : function() {
                return { result : '---10---' };
            }
        };

        consumer.execute(command, port)
            .then((response) => {
                response.result.should.be.eql('---10---');
                done();
            });
    });

    beforeEach(() => {
        executor.listen(port);
    });

    afterEach(() => {
        executor.kill();
    });

});

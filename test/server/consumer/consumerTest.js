require('should');
const ip = require('ip');
const net = require('net');
const consumer = require(process.cwd()+"/lib/server/consumer/consumer");

describe("Consumer", () => {

    it("Reject promise when client give error on connect", () => {

        return consumer.execute({}, '127.0.0.1', 68001)
            .catch((error) => {
                error.message.should.be.eql("connect ENOENT 127.0.0.1");
            });
    });
});
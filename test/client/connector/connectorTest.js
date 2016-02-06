require('should');
const net = require('net');
const connector  = require(process.cwd()+"/lib/client/connector/connector");
const serializer = require(process.cwd()+'/lib/serializer/objectSerializer');

describe("Client connector", () => {

    let server;

    it("Send message to slave", (done) => {

        const client = new net.Socket();

        client.connect(9905, '127.0.0.1', () => {

            const command = {
                process : function() {
                    return { result : "---10---" };
                }
            };

            client.write(serializer.serialize(command));
        });

        client.on('data', (data) => {

            data.toString().should.containEql("---10---");
            done();

            client.destroy();
        });
    });

    beforeEach(() => {
        connector.listen(9905);
    });

    afterEach(() => {
        connector.kill();
    });

});

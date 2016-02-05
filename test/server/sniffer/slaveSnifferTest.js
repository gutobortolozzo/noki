require('should');
const net = require('net');
const sniffer  = require(process.cwd()+"/lib/server/sniffer/slaveSniffer");

describe("Sniffer", () => {

    let server;

    it("Find socket running on port 9901", (done) => {

        sniffer.sniff({
           port     : 9901,
           timeout  : 2000
        }).then((ips) => {
            ips.length.should.be.eql(1);
        }).then(done);
    });

    beforeEach(() => {
        server = net.createServer((socket) => {});
        server.listen(9901)
    });

    afterEach(() => {
        server.close();
    });

});
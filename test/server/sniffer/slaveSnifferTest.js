require('should');
const net = require('net');
const sniffer  = require(process.cwd()+"/lib/server/sniffer/slaveSniffer");

describe("Sniffer", () => {

    it("Find socket running on port 9902", (done) => {

        sniffer.sniff({
            port     : 9902,
            timeout  : 500,
            ipRange  : '127.0.0'
        }).then((ips) => {
            ips.length.should.be.eql(1);
        }).then(done);
    });

    beforeEach(() => {
        const server = net.createServer((socket) => {
            server.close();
        });
        server.listen(9902)
    });
});
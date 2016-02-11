require('should');
const ip = require('ip');
const net = require('net');
const sniffer  = require(process.cwd()+"/lib/server/sniffer/slaveSniffer");

describe("Sniffer", () => {

    const currentIp = ip.address();

    it("Find socket running on port 9902", (done) => {

        sniffer.sniff({
            port     : 9902,
            timeout  : 500,
            ipRange  : currentIp.slice(0, currentIp.lastIndexOf('\.'))
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
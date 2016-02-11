require('should');
const net = require('net');
const sniffer  = require(process.cwd()+"/lib/server/sniffer/slaveSniffer");

describe("Sniffer", () => {

    let server;
    const port = parseInt((Math.random()* 64000).toFixed(0));

    it("Find socket running on port 9902", (done) => {

        sniffer.sniff({
           port     : port,
           timeout  : 2000
        }).then((ips) => {
            ips.length.should.be.eql(1);
        }).then(done);
    });

    beforeEach(() => {
        server = net.createServer((socket) => {});
        server.listen(port)
    });

    afterEach(() => {
        server.close();
    });

});
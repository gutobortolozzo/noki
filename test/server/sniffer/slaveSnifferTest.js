"use strict";
require('should');
const ip = require('ip');
const register = require(process.cwd()+'/lib/client/executor/selfRegister');
const sniffer  = require(process.cwd()+"/lib/server/sniffer/slaveSniffer");

describe("Sniffer", () => {

    it("Find socket running on port 9902", (done) => {

        const emitter = sniffer.sniff(9902);

        emitter.on("message", (executor) => {
            ip.isV4Format(executor.host).should.be.ok();
            executor.port.should.be.eql(9902);
            done();
        });
    });

    let selfRegister;

    beforeEach(() => {
        sniffer.kill();
        selfRegister = register.startExecutorBroadcast()
    });

    afterEach(() => selfRegister.close());
});
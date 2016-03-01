"use strict";
require('should');
const ip = require('ip');
const register = require(process.cwd()+'/lib/client/register/register');
const sniffer  = require(process.cwd()+"/lib/server/sniffer/slaveSniffer");

describe("Sniffer", () => {

    let selfRegister;

    it("Find socket running on port 9902", (done) => {

        const emitter = sniffer.sniff({
            port      : 9902,
            dgramPort : 41234
        });

        emitter.on("message", (executor) => {
            ip.isV4Format(executor.host).should.be.ok();
            executor.port.should.be.eql(9902);
            done();
        });
    });

    it("Find socket running on port 9905 and dgram port 30001", (done) => {

        selfRegister = register.startExecutorBroadcast({
            broadcast : "255.255.255.255",
            dgramPort : 30001
        });

        const emitter = sniffer.sniff({
            port      : 9905,
            dgramPort : 30001
        });

        emitter.on("message", (executor) => {
            ip.isV4Format(executor.host).should.be.ok();
            executor.port.should.be.eql(9905);
            done();
        });
    });

    beforeEach(() => {
        sniffer.kill();
        selfRegister = register.startExecutorBroadcast({
            broadcast : "255.255.255.255",
            dgramPort : 41234
        });
    });

    afterEach(() => selfRegister.close());
});
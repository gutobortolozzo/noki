"use strict";
const should = require('should');
const CircularTTLArray = require(process.cwd()+"/lib/server/executors/circularTTLArray");

describe("Circular TTL Array", () => {

    let array;

    it("Add two elements and rotate array", () => {

        array.push({
            host: '127.0.0.2'
        });

        array.push({
            host: '127.0.0.1'
        });

        array.next().host.should.be.eql("127.0.0.2");
        array.next().host.should.be.eql("127.0.0.1");
        array.next().host.should.be.eql("127.0.0.2");
    });

    it("Add two repeated elements to array", () => {

        array.push({
            host: '127.0.0.1'
        });

        array.push({
            host: '127.0.0.1'
        });

        array.size().should.be.eql(2);
        array.next().host.should.be.eql("127.0.0.1");
        array.next().host.should.be.eql("127.0.0.1");
        array.next().host.should.be.eql("127.0.0.1");
    });

    it("Add one element and way to ttl expire", (done) => {

        array.push({
            host: '127.0.0.2'
        });

        setTimeout(() => {
            should(array.next()).be.not.ok();
            done();
        }, 501);
    });

    it("Add one element to array, wait to expire and add it again", (done) => {

        array.push({
            host: '127.0.0.2'
        });

        setTimeout(() => {
            should(array.next()).be.not.ok();

            array.push({
                host: '127.0.0.1'
            });

            array.next().host.should.be.eql('127.0.0.1');

            done();
        }, 501);
    });

    beforeEach(() => array = new CircularTTLArray(500));

});

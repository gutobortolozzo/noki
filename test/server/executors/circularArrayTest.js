"use strict";
const should = require('should');
const CircularArray = require(process.cwd()+"/lib/server/executors/circularArray");

describe("Circular array", () => {

    let array;

    it("Add two elements and rotate array", () => {

        array.push([{
            host : '127.0.0.2'
        },{
            host : '127.0.0.1'
        }]);

        array.next().host.should.be.eql("127.0.0.1");
        array.next().host.should.be.eql("127.0.0.2");
        array.next().host.should.be.eql("127.0.0.1");
    });

    it("Add repeated element and rotate array", () => {

        array.push([{
            host : '127.0.0.1'
        },{
            host : '127.0.0.1'
        }]);

        const endInOne = array.next();
        const endInOneAgain = array.next();

        endInOne.host.should.be.eql("127.0.0.1");
        endInOneAgain.host.should.be.eql("127.0.0.1");
        array.size().should.be.eql(1);
    });

    it("Add intersect element and rotate array", () => {

        array.push([{
            host : '127.0.0.1'
        },{
            host : '127.0.0.2'
        }]);

        array.push([{
            host : '127.0.0.3'
        },{
            host : '127.0.0.2'
        }]);

        array.next().host.should.be.eql("127.0.0.2");
        array.next().host.should.be.eql("127.0.0.3");
        array.next().host.should.be.eql("127.0.0.2");

        array.size().should.be.eql(2);
    });

    it("Add executor -> empty executors -> add executor", () => {

        array.push([{
            host : '127.0.0.1'
        }]);

        array.push([]);

        array.size().should.be.eql(0);

        array.push([{
            host : '127.0.0.2'
        }]);

        const endInOne = array.next();

        endInOne.host.should.be.eql("127.0.0.2");
        array.size().should.be.eql(1);
    });

    it("Empty executors rotation should not produce undefined executor", () => {

        array.push([]);
        array.size().should.be.eql(0);

        should.not.exist(array.next());
        array.size().should.be.eql(0);
    });

    it("Add executor -> empty executors -> add executor -> empty executor", () => {

        array.push([{
            host : '127.0.0.1'
        }]);

        array.next().host.should.be.eql('127.0.0.1');

        array.push([]);

        array.size().should.be.eql(0);

        array.push([{
            host : '127.0.0.2'
        }]);

        array.next().host.should.be.eql("127.0.0.2");

        array.push([]);

        array.size().should.be.eql(0);
    });

    beforeEach(() => array = new CircularArray);
});
require('should');
const CircularArray = require(process.cwd()+"/lib/server/executors/circularArray");

describe("Circular array", () => {

    let array;

    it("Add two elements and rotate array", () => {

        array.putExecutorIfAbsent({
            host : '127.0.0.2'
        });

        array.putExecutorIfAbsent({
            host : '127.0.0.1'
        });

        const endInOne = array.next();
        const endInTwo = array.next();
        const endInOneAgain = array.next();

        endInOne.host.should.be.eql("127.0.0.1");
        endInTwo.host.should.be.eql("127.0.0.2");
        endInOneAgain.host.should.be.eql("127.0.0.1");
    });

    it("Add repeated element and rotate array", () => {

        array.putExecutorIfAbsent({
            host : '127.0.0.1'
        });
        
        array.putExecutorIfAbsent({
            host : '127.0.0.1'
        });

        const endInOne = array.next();
        const endInOneAgain = array.next();

        endInOne.host.should.be.eql("127.0.0.1");
        endInOneAgain.host.should.be.eql("127.0.0.1");
    });

    beforeEach(() => array = new CircularArray);
});
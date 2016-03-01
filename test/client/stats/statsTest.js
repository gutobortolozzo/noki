"use strict";
require('should');
const stats = require(process.cwd()+'/lib/client/stats/stats');

describe("Stats", () => {

    it("Check stats structure", () => {

        const statistics = stats();

        Object.keys(statistics).length.should.be.eql(8);

        statistics.platform.should.be.type('string');
        statistics.totalCpus.should.be.type('number');
        statistics.freeMemory.should.be.type('number');
        statistics.totalMemory.should.be.type('number');
        statistics.load1.should.be.type('number');
        statistics.load5.should.be.type('number');
        statistics.load15.should.be.type('number');
    });
});
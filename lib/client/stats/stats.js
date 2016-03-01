const os = require('os-utils');

const statsNow = () => {
    return {
        platform    : platform(),
        totalCpus   : countCpus(),
        freeMemory  : freeMemory(),
        totalMemory : totalMemory(),
        uptime      : uptime(),
        load1       : loadAvg1(),
        load5       : loadAvg5(),
        load15      : loadAvg15()
    }
};

const platform = () => os.platform();

const countCpus = () => os.cpuCount();

const freeMemory = () => parseInt(os.freemem());

const totalMemory = () => os.totalmem();

const uptime = () => os.processUptime();

const loadAvg1 = () => os.loadavg(1);

const loadAvg5 = () => os.loadavg(5);

const loadAvg15 = () => os.loadavg(15);

module.exports = statsNow;
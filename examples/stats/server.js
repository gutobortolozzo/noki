const Server = require('./../../index').Server;

const server = new Server({
    port : 13340
});

const command = {
    process : (context) => {
        return context.moment();
    }
};

const executeCommand = () => {
    server.execute(command).then((response) => console.log("RESPONSE", response.result));
};

setInterval(executeCommand, 500);

server.emitter().on("executor-stats", (stats) => {
    const usedMemory = stats.totalMemory - stats.freeMemory;
    const percentMemoryUsed = ((usedMemory / stats.totalMemory) * 100).toFixed(0);
    console.log("hostname", stats.hostname, "memory used:",  percentMemoryUsed, "%");
    console.log("load avg last five minutes", stats.load5);
});
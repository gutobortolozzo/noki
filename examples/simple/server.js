const Server = require('./../../index').Server;

const server = new Server({
    port            : 13340,
    timeout         : 500,
    ipRange         : "192.168.100",
    scanInterval    : 1000
});

const command = {
    process : (context) => {
        return context.readFromFile("./examples/simple/testFile.txt")
    }
};

const executeCommand = () => {
    server.execute(command)
        .then((response) => {
            console.log("RESPONSE", response.result, response.executor.host);
        })
        .catch((err) => {
            console.log("ERROR", err.stack);
        });
};

setInterval(executeCommand, 2000);
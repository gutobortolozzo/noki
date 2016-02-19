const Server = require('./../../index').Server;

const server = new Server({
    port            : 13340,
    timeout         : 500,
    ipRange         : "127.0.0",
    scanInterval    : 2000
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
            console.log("ERROR", err.message);
        });
};

setInterval(executeCommand, 1000);
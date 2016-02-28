const Server = require('./../../index').Server;

const server = new Server({
    port : 13340
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
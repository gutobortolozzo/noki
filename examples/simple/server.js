const Server = require('./../../index').Server;

const server = new Server({
    port            : 13340,
    timeout         : 500,
    ipRange         : "127.0.0",
    scanInterval    : 1000
});

const command = {
    process : (context) => {
        return {
            result : context.readFromFile("/Users/Bortolozzo/Documents/Desenvolvimento/workspace/noki/examples/simple/testFile.txt")
        }
    }
};

const executeCommand = () => {
    server.execute(command)
        .then((response) => {
            console.log("RESPONSE", response.result);
        })
        .catch((err) => {
            console.log("ERROR", err);
        });
};

setInterval(executeCommand, 2000);
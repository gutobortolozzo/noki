# NOKI [![Build Status](https://travis-ci.org/gutobortolozzo/noki.svg?branch=master)](https://travis-ci.org/gutobortolozzo/noki)

## Task distributor for node.js

This project is intent to execute javascript code across several machines in the same network.

It acts as a balancer giving the programs the ability to create custom commands as functions
and send these commands to be execute in one machine across the cluster.

It works by default in a multi master mode giving you the ability to run several servers and executors without extra effort.

Machines in the cluster will automatically be detected just giving the network partial IP (192.168.10) as a configuration.

## Install

```npm install noki```

## Example

Client example below show one function to read a file and return a promise, client will listen on port 13340.


```javascript

    const client = require('noki').client;
    const fs = require('fs');

    var counter = 0;

    this.readFromFile = (fileName) => {
        return new Promise((resolve, reject) => {

            fs.readFile(fileName, (err, data) => {

                if(err) return reject(err);

                resolve(data.toString() +" executed: " + ++counter);
            });
        });
    };

    client.listen(13340, this);

```

Master example below lookup for executors on port 13340 on the same network the master is hosted.

Create a command to call the function *readFromFile* previously declared and use context exactly as it is declared in the client.

```javascript
    const Server = require('noki').Server;

    const server = new Server({
        port : 13340,
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

```

Example above is available in the directory examples/simple/

Run this example from the project root using these two commands:
 - node examples/simple/server.js
 - node examples/simple/executor.js

More examples can be found on examples directory.

const client = require('./../../index').client;
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
const client = require('./../../index').client;
const cluster = require('cluster');
const os = require('os');
const fs = require('fs');

this.currentTimeISO = () => {
    return new Date().toISOString()+ " pid "+ process.pid;
};

if(cluster.isMaster) {

    for(let count in os.cpus())
        cluster.fork();

} else if(cluster.isWorker) {
    client.listen(13340, this);
}
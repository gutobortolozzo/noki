const client = require(process.cwd()+'/lib/client/executor/executor');
const Server = require(process.cwd()+'/lib/server/bridge/bridge');

module.exports.client = client;
module.exports.Server = Server;
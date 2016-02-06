const net = require('net');
const serializer = require(process.cwd()+'/lib/serializer/objectSerializer');

const server = net.createServer(function(socket) {

    socket.on('data', (data) => {

        const command = serializer.deserialize(data.toString());

        const result = command.process();

        socket.write(serializer.serialize(result));
    });
});

module.exports.listen = (port) => {
    server.listen(port);
};

module.exports.kill = () => {
    server.close();
};
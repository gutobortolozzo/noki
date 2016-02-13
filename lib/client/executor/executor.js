const net = require('net');
const serializer = require(process.cwd()+'/lib/serializer/objectSerializer');

let self = this;

const server = net.createServer((socket) => {

    socket.on('data', (data) => {

        const command = serializer.deserialize(data.toString());

        const result = command.process(self);

        Promise.resolve(result)
            .then((response) => {
                const serialized = serializer.serialize({
                    result : response
                });

                socket.write(serialized);
            })
            .catch((response) => {
                const serialized = serializer.serialize({
                    result : response
                });

                socket.write(serialized);
            });

    });
});

module.exports.listen = (port, context) => {

    self = context;

    server.listen(port);
};

module.exports.kill = () => {
    server.close();
};
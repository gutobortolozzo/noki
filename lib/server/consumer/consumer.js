const Socket = require('net').Socket;
const serializer = require(process.cwd()+'/lib/serializer/objectSerializer');

module.exports.execute = (command, port) => {

    const client = new Socket();

    return new Promise((resolve, reject) => {

        client.connect(port, '127.0.0.1', () => {
            client.write(serializer.serialize(command));
        });

        client.on('data', (data) => {
            const response = serializer.deserialize(data.toString());
            resolve(response);
            client.destroy();
        });

    });
};
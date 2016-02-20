const Socket = require('net').Socket;
const serializer = require('../../serializer/objectSerializer');

module.exports.execute = (command, port, ip) => {

    const client = new Socket();

    return new Promise((resolve, reject) => {

        client.connect(port, ip, () => {
            client.write(serializer.serialize(command));
        });

        client.on('data', (data) => {
            const response = serializer.deserialize(data.toString());

            if(response.result && response.result.stack && response.result.message){
                reject(response.result);
            } else {
                resolve(response);
            }

            client.destroy();
        });

        client.on('error', (error) => {
            reject(error);
            client.destroy();
        });
    });
};
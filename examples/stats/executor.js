const client = require('./../../index').client;
const fs = require('fs');

this.moment = () => {
    return new Date().getTime();
};

client.listen(13340, this);
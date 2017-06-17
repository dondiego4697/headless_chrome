/**
 * Created by denstep on 16.06.2017.
 */
const express = require('express');
const router = require('../routes/routes');

class Server {
    constructor() {
        this.PORT = process.env.PORT || 3000;
        this.app = express();
    }

    start() {
        this._initRoute();
    }

    _initRoute() {
        this.app.use(router);
        this.app.listen(this.PORT, () => {
            console.log(`LISTEN PORT=${this.PORT}`);
        });
    }
}

module.exports = Server;
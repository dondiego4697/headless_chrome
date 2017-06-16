/**
 * Created by denstep on 16.06.2017.
 */
const express = require('express');
const Router = require('./Router');
const ChromeNavigator = require('../chrome_navigator/ChromeNavigator');

class Server{
    constructor(){
        this.PORT = process.env.PORT || 3000;
        this.chromeNav = new ChromeNavigator();
    }

    start(){
        this.app = express();
        this.initRoute();
    }

    initRoute(){
        this.router = new Router(this.app);
        this.router.start(this.PORT).then(()=>{
            this.chromeNav.launch();
        });
    }
}

module.exports = Server;
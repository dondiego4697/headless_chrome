/**
 * Created by denstep on 16.06.2017.
 */
const express = require('express');
const fs = require('fs');
const ChromeNavigator = require('../chrome_navigator/ChromeNavigator');

let router = express();
let chromeNav = new ChromeNavigator();

const SCREENS_PATH = 'src/screens/';

router.get('/', (req, res) => {
    chromeNav.launchChrome().then(() => {
        console.log('Chrome launched');
        chromeNav.takeSnap('https://github.com/').then((bitmap) => {
            try {
                fs.writeFileSync(`${SCREENS_PATH}name.png`, bitmap);
                sendSuccess(res);
            } catch (e) {
                sendError(res);
                console.log(e);
            }
        }).catch((e) => {
            sendError(res);
            console.log(`Failed to create snap. ${e}`);
        });
    }).catch((e) => {
        sendError(res);
        console.log(`Failed to start Chrome. ${e}`);
    });
});

function sendSuccess(res){
    res
        .set('Content-Type', 'image/png')
        .status(200)
        .send(fs.readFileSync(`${SCREENS_PATH}name.png`));
}

function sendError(res) {
    res
        .set('Content-Type', 'text/html')
        .status(200)
        .send('ops');
}

module.exports = router;
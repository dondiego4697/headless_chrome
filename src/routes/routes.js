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
    getParams(req).then((params) => {
        getSnap(res, params);
    }).catch((e) => {
        console.log(e);
        sendError(res);
    });
});

function getSnap(res, params) {
    let {width, height, sid} = params;

    checkFile(sid).then((file) => {
        sendSuccess(res, null, file);
    }).catch((e)=>{
        chromeNav.launchChrome({width: width, height: height, headless: true}).then(() => {
            console.log('Chrome launched');
            chromeNav.takeSnap('https://github.com/').then((bitmap) => {
                try {
                    fs.writeFileSync(`${SCREENS_PATH}${sid}.png`, bitmap);
                    sendSuccess(res, sid);
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
}

async function checkFile(sid) {
    try {
        return fs.readFileSync(`${SCREENS_PATH}${sid}.png`);
    }
    catch (e) {
        throw e;
    }
}

function sendSuccess(res, sid, file) {
    res
        .set('Content-Type', 'image/png')
        .status(200)
        .send(file ? file : fs.readFileSync(`${SCREENS_PATH}${sid}.png`));
    if (!file)
        chromeNav.killChrome();
}

function sendError(res) {
    res
        .set('Content-Type', 'text/html')
        .status(500)
        .send('ops');
    chromeNav.killChrome();
}

async function getParams(req) {
    let result = {
        sid: req.param('sid'),
        width: req.param('w'),
        height: req.param('h')
    };

    Object.keys(result).forEach(key => {
        if (typeof result[key] === 'undefined')
            throw 'wrong params';
    });
    return result;
}

module.exports = router;
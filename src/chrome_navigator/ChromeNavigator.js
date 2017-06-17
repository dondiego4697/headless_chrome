/**
 * Created by denstep on 16.06.2017.
 */
const chromeLauncher = require('lighthouse/chrome-launcher/chrome-launcher');
const CDP = require('chrome-remote-interface');

class ChromeNavigator {
    constructor() {

    }

    /**
     * Launch headless Chrome
     * @param config
     * @param headless
     * @returns {Promise.<void>}
     */
    async launchChrome(config = {width: 1920, height: 1080, headless: true}) {
        const {width, height, headless} = config;
        try {
            this.chrome = await chromeLauncher.launch({
                // port: 9222,
                chromeFlags: [
                    `--window-size=${width},${height}`,
                    '--disable-gpu',
                    headless ? '--headless' : ''
                ]
            });
        } catch (e){
            throw e;
        }
    }

    /**
     * Stop Chrome
     * @returns {{}}
     */
    async killChrome(){
        try {
            return await this.chrome.kill();
        } catch (e){
            throw e;
        }
    }

    /**
     * Create snapshot by url
     * @param url
     * @returns {Promise.<*>}
     */
    async takeSnap(url){
        try {
            const protocol = await CDP({port: this.chrome.port});
            let {Page, Runtime} = protocol;
            await Promise.all([Page.enable(), Runtime.enable()]);

            Page.navigate({url: url});

            // Wait for window.onload before doing stuff.
            await Page.loadEventFired();

            const snapshot = await Page.captureScreenshot();
            protocol.close();

            return this.getBase64Decode(snapshot.data);
        } catch (e){
            throw e;
        }
    }

    getBase64Decode(base64str) {
        return new Buffer(base64str, 'base64');
    }
}
module.exports = ChromeNavigator;
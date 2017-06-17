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
     * @param headless
     * @returns {Promise.<void>}
     */
    async launchChrome(headless = true) {
        try {
            this.chrome = await chromeLauncher.launch({
                // port: 9222,
                chromeFlags: [
                    '--window-size=412,732',
                    '--disable-gpu',
                    headless ? '--headless' : ''
                ]
            });
        } catch (e){
            console.log(`Exception on launchChrome=${e}`);
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



    /*async navigate(chrome) {
        const protocol = await CDP({port: chrome.port});
        let {Page, Runtime} = protocol;
        await Promise.all([Page.enable(), Runtime.enable()]);

        Page.navigate({url: 'https://www.github.com/'});

        // Wait for window.onload before doing stuff.
        Page.loadEventFired(async () => {
            //const result = await Runtime.evaluate({expression: "document.querySelector('canvas')"});
            const snapshot = await Page.captureScreenshot();
            this.base64Decode(snapshot.data, 'img.png');
            //console.log('Title of page: ' + result.result.value);

            protocol.close();
            chrome.kill(); // Kill Chrome.
        });
    }

    base64Decode(base64str, file) {
        let bitmap = new Buffer(base64str, 'base64');
        fs.writeFileSync(file, bitmap);
    }*/

    getBase64Decode(base64str) {
        return new Buffer(base64str, 'base64');
    }
}
module.exports = ChromeNavigator;
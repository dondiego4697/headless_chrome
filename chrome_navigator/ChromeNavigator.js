/**
 * Created by denstep on 16.06.2017.
 */
const chromeLauncher = require('lighthouse/chrome-launcher/chrome-launcher');
const CDP = require('chrome-remote-interface');
class ChromeNavigator {
    constructor() {

    }

    launch() {
        this.launchChrome().then(chrome => {
            this.navigate(chrome);
        }).catch(e => {
            console.log(`Exception on launchChrome=${e}`);
        });
    }

    async launchChrome(headless = true) {
        return await chromeLauncher.launch({
            // port: 9222,
            chromeFlags: [
                '--window-size=412,732',
                '--disable-gpu',
                headless ? '--headless' : ''
            ]
        });
    }

    async navigate(chrome) {
        const protocol = await CDP({port: chrome.port});
        let {Page, Runtime} = protocol;
        await Promise.all([Page.enable(), Runtime.enable()]);

        Page.navigate({url: 'https://www.github.com/'});

        // Wait for window.onload before doing stuff.
        Page.loadEventFired(async () => {
            const result = await Runtime.evaluate({expression: "document.querySelector('title').textContent"});
            console.log('Title of page: ' + result.result.value);

            protocol.close();
            chrome.kill(); // Kill Chrome.
        });
    }
}
module.exports = ChromeNavigator;
const chromeLauncher = require('lighthouse/chrome-launcher/chrome-launcher');

module.exports = {
	/**
	 * Launches a debugging instance of Chrome.
	 * @param {boolean=} headless True (default) launches Chrome in headless mode.
	 *     False launches a full version of Chrome.
	 * @return {Promise<ChromeLauncher>}
	 */
	launchChrome: (headless) => {
		return new Promise((resolve, reject) => {
			chromeLauncher.launch({
			  port: 9222, // Uncomment to force a specific port of your choice.
			  chromeFlags: [
				'--window-size=412,732',
				'--disable-gpu',
				'--remote-debugging-port=9222',
				'--ignore-certificate-errors',
				headless ? '--headless' : ''
			  ]
		  }).then((chrome) => {
			  this.chrome = chrome;
			  resolve();
		  });
		});
	},
	close: () => {
		this.chrome.kill();
	}
};

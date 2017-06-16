const ChromeLauncher = require('./ChromeLauncher');
const ChromeRemoteInterface = require('chrome-remote-interface');

const onLoadPromise = 'new Promise(function (resolve, reject){ window.onload = function(){ resolve(); } })';

module.exports = {
	/**
	 * Initializes the remote interface and resolves once the start page window.onLoad is triggered.
	 * @param  {Object} options           configuration input
	 * @param  {String} options.startPage full URL of the initial page to load
	 * @param  {Boolean} options.headless optional: flag to start chrome in headless mode
	 * @return {Promise}                  Promise which resolves when startPage is finished loading.
	 */
	init:(options) => {
		var self = this;
		return new Promise((resolve, reject) => {
			ChromeLauncher.launchChrome(options.headless || true).then(() => {
				ChromeRemoteInterface((client) => {
					self.client = client;
				    // setup handlers
				    self.client.Network.requestWillBeSent((params) => {
						self.requestWillBeSentURL = params && params.documentURL;
				    });
				    self.client.Page.loadEventFired((params) => {

				    });
				    // enable events then start!
				    Promise.all([
				        self.client.Network.enable(),
				        self.client.Page.enable(),
						self.client.Runtime.enable(),
						self.client.DOM.enable()

				    ]).then(() => {
						console.log('Initialization complete.');
						console.log(options.startPage);
						self.client.Page.navigate({url: options.startPage}).then((resp) => {
							console.log('navigation returned');
							self.client.Runtime.evaluate({expression: onLoadPromise, awaitPromise: true}).then(() => {
								resolve();
							}).catch((err) => {
								console.log('Warning: onLoad listener failed. Page may of loaded quickly, or there may be a problem.');
								resolve();
							});
						});
					});
				}).on('error', (err) => {
				    // cannot connect to the remote endpoint
				    console.error(err);
					reject();
				});
			}).catch((err) => {
				console.log('Error: Could not launch chrome.');
				console.log(err);
			});
		});
	},
	/**
	 * Closes the remote interface client.
	 * @return {Promise} Promise which resolves after closing.
	 */
	shutdown:() => {
		return new Promise((resolve, reject) => {
			try {
				this.client && this.client.close();
				ChromeLauncher.close();
				resolve();
			} catch(err) {
				reject(err);
			}

		});
	},
	/**
	 * Evaluates any non-promise javascript expression and returns the results
	 * @param  {Object} options            configuration input
	 * @param  {Object} options.expression Javasript expression to be evaluated against the current page.
	 * @return {Promise}                   Promise which resolves with the expression results.
	 */
	evaluateExpression:(options) => {
		return new Promise((resolve, reject) => {
			if(this.client && this.client.Runtime) {
				this.client.Runtime.evaluate({expression: options.expression, returnByValue: true}).then((results) => {
					resolve(results);
				}).catch((err) => {
					console.log('Error: Failed to evaluate expression');
					reject(err);
				});
			}
		});
	},
	/**
	 * Checks whether an element exists on the current page.
	 * @param  {Object} options           configuration input. One of id or className is required.
	 * @param  {Object} options.id        Id attribute of the element
	 * @param  {Object} options.className Class name attribute of the element
	 * @return {Promise}                  Promise which resolves with true or false.
	 */
	doesElementExist:(options) => {
		return new Promise((resolve, reject) => {
			if(this.client && this.client.Runtime && options) {
				let query;
				if(options.id) {
					query = `document.getElementById("${options.id}").id`;
				} else if(options.className) {
					query = `document.getElementsByClassName("${options.className}")[0].className`;
				} else {
					return resolve(false);
				}
				this.client.Runtime.evaluate({expression: query, returnByValue: true}).then((results) => {
					let value = results && results.result && results.result.value;
					if(value) {
						if(options.id && value === options.id) {
							return resolve(true);
						} else if(options.className && value === options.className) {
							return resolve(true);
						} else {
							return resolve(false);
						}
					} else {
						return resolve(false);
					}
				}).catch((err) => {
					console.log('Error: Failed to evaluate');
					reject(err);
				});
			}
		});
	},
	/**
	 * Executes an expression and waits for a page element to exist.
	 * Useful for executing actions that trigger a page load or other UI change.
	 * @param  {Object} options            configuration input.
	 * @param  {Object} options.expression required: expression to executeAndWaitForPageElement
	 * @param  {Object} options.id         required or className: id of the element to wait for
	 * @param  {Object} options.className  required or id: class name of the element to wait for.
	 * @return {Promise}                   Promise which resolves when the element is detected.
	 */
	executeAndWaitForPageElement:(options) => {
		return new Promise((resolve, reject) => {
			let promises = [
				module.exports.evaluateExpression(options),
				module.exports._waitForPageElementToExist(options)
			];
			Promise.all(promises).then(() => {
				console.log('Evaluated first expression & element exists');
				resolve();
			}).catch((err) => {
				reject(err);
			});
		});
	},
	_timeoutUntilElementExists:(options, callback) => {
		module.exports.doesElementExist(options).then((exists) => {
			if(exists) {
				callback();
			} else {
				module.exports._timeoutUntilElementExists(options, callback);
			}
		});
	},
	_waitForPageElementToExist:(options) => {
		return new Promise((resolve, reject) => {
			module.exports._timeoutUntilElementExists(options, () => {
				console.log('waitForPageElementToExist Resolved.');
				resolve();
			});
		});
	},
	_timeoutUntilRequestToBeSent:(url, callback) => {
		let self = this;
		setTimeout(function() {
			if(self.requestWillBeSentURL !== url) {
				module.exports._timeoutUntilRequestToBeSent(url, callback);
			} else {
				callback();
			}
		}, 100);
	},
	_waitForRequestToBeSent:(url) => {
		return new Promise((resolve, reject) => {
			module.exports._timeoutUntilRequestToBeSent(url, () => {
				console.log('timeoutUntilRequestToBeSent Resolved.');
				resolve();
			});
		});
	}
}

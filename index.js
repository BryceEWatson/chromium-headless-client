/**
 * Initializes the chrome remote interface for a url; returns a promise when finished.
 * @param  params.url is the url to load when chromium is initialized.
 * @return {Promise}
 */
module.exports.init = (params) => {
    const CDP = require('chrome-remote-interface');
    return new Promise((resolve, reject) => {
        CDP((client) => {
            // Extract used DevTools domains.
            this.client = client;
            // Enable events on domains we are interested in.
            Promise.all([
                this.client.Page.enable()
            ]).then(() => {
                return this.client.Page.navigate({url: params.url});
            }).catch((err) => {
                console.log(err);
                reject(err);
            });

            // Evaluate outerHTML after page has loaded.
            this.client.Page.loadEventFired(() => {
                resolve();
            });
        }).on('error', (err) => {
            console.log(err);
            reject('Cannot connect to browser:', err);
        });
    });
}

/**
 * [evaluate description]
 * @param  params.expression is the query string to be executed in the browser.
 * @return {Object} result the result of the evaluated expression.
 */
module.exports.evaluate = (params) => {
    return new Promise((resolve, reject) => {
        this.client.Runtime.evaluate({expression: params.expression}).then((result) => {
            resolve(result);
        });
    });
};

module.exports.close = () => {
    this.client.close();
}

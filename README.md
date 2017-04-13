# chromium-headless-client

A simple promise wrapper for the [chromium remote interface](https://github.com/cyrus-and/chrome-remote-interface).

## Testing CHC

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

Note: Modify the [browser.sh](https://github.com/BryceEWatson/chromium-headless-client/blob/master/browser.sh) script for your chrome instance, if needed.

```
git clone git@github.com:bryceewatson/chromium-headless-client
cd chromium-headless-client
npm test
```

## Using CHC

Follow these instructions to use the chromium headless client in your project.

```
npm install chromium-headless-client --save-dev
```

```
const CHC = require('chromium-headless-client');
CHC.init({url: 'https://www.google.com'}).then((res) => {
    CHC.evaluate({expression: 'document.getElementById("main")'}).then((res) => {
        console.log(res);
    }).catch((err) => {
        console.error(err);
    });
}).catch((err) => {
    console.error(err);
});
```

### Prerequisites

This project uses the [Chrome Remote Interface](https://github.com/cyrus-and/chrome-remote-interface#implementations), so please ensure you follow the pre-requisites listed there.

A supported version of Chrome is required, the browser.sh file should be modified to ensure the proper Chrome browser is running and listening on the correct port.

## Authors

* **Bryce Watson**

# chromium-headless-client

A useful utility wrapper for headless testing with Chrome.

## Prerequisites

You need to have Chrome 59+ OR Chrome Canary installed.

## Run the tests

```
git clone git@github.com:bryceewatson/chromium-headless-client
cd chromium-headless-client
npm install
npm test
```

## Using Chromium Headless Client

The tests in this project provide useful examples for how to integrate CHC with your mocha tests.

```
npm install chromium-headless-client --save-dev
```

```
const CHC = require('chromium-headless-client');
CHC.init({startPage: 'https://www.google.com', headless: true}).then((res) => {
	done();
}).catch((err) => {
	console.log(err);
	done(err);
});
```

## Authors

* **Bryce Watson**

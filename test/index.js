const CHC = require('../index');

describe('Chromium Headless Client', () => {
    it('should initialize', (done) => {
        CHC.init({url: 'https://www.google.com'}).then((res) => {
            done();
        }).catch((err) => {
            console.log(err);
            done(err);
        });
    });
    it('should evaluate an expression', (done) => {
        CHC.evaluate({expression: 'document.getElementById("main")'}).then((res) => {
            console.log(res);
            done();
        }).catch((err) => {
            console.log(err);
            done(err);
        })
    })
});

const CHC = require('../index');
const expect = require('chai').expect;

describe('Chromium Headless Client', () => {
	before((done) => {
		CHC.init({startPage: 'https://www.google.com', headless: true}).then((res) => {
            done();
        }).catch((err) => {
            console.log(err);
            done(err);
        });
	});
	after((done) => {
		CHC.shutdown().then(() => {
			done();
		}).catch((err) => {
			done(err);
		});
	});
    it('should evaluate an expression', (done) => {
        CHC.evaluateExpression({expression: 'document.getElementById("main").id'}).then((res) => {
            expect(res.result.value).to.equal('main');
            done();
        }).catch((err) => {
            console.log(err);
            done(err);
        })
    });
	it('should check that an element exists: by id', (done) => {
		CHC.doesElementExist({id: 'main'}).then((exists) => {
			expect(exists).to.be.true;
			done();
		}).catch((err) => {
			done(err);
		});
	});
	it('should check that an element does not exist: by id', (done) => {
		CHC.doesElementExist({id: 'ThisDoesntExistForSure'}).then((exists) => {
			expect(exists).to.be.false;
			done();
		}).catch((err) => {
			done(err);
		});
	});
	it('should check that an element exists: by className', (done) => {
		CHC.doesElementExist({className: 'content'}).then((exists) => {
			expect(exists).to.be.true;
			done();
		}).catch((err) => {
			done(err);
		});
	});
	it('should check that an element does not exist: by className', (done) => {
		CHC.doesElementExist({className: 'ThisDoesntExistForSure'}).then((exists) => {
			expect(exists).to.be.false;
			done();
		}).catch((err) => {
			done(err);
		});
	});
	it('should execute a command and wait for page load', (done) => {
		CHC.executeAndWaitForPageElement({
			//Enter a search and submit the google search.
			expression: 'document.getElementById("lst-ib").value = "headless chrome"; tsf.submit();',
			//Wait until we see the results element
			id: 'resultStats'
		}).then(() => {
			//check for an element to make sure the page is loaded
			CHC.doesElementExist({id: 'rcnt'}).then((exists) => {
				expect(exists).to.be.true;
				done();
			}).catch((err) => {
				done(err);
			});
		}).catch((err) => {
			done(err);
		})
	});
});

let SpecReporter = require('jasmine-spec-reporter').SpecReporter;
exports.config = {
    allScriptsTimeout: 30000,
	directConnection: true,
    nativeEvents: false,
	capabilities: {
		'browserName': 'chrome'
	  },
    specs: ['./*/*e2e.spec.js'],
    onPrepare: function () {
        browser.manage().window().maximize();
	},

	params:{
        wait: function(Locator) {
            browser.wait(
                protractor.ExpectedConditions.visibilityOf(
                    Locator, 30000))
        }
	},
    onPrepare:  () => {
        jasmine.getEnv().addReporter(new SpecReporter({
            spec: {
                displayStacktrace: true
            }
        }));
        browser.driver.manage().window().maximize();
    },

    jasmineNodeOpts: {
        defaultTimeoutInterval: 30000,
        print: function() {}
    }
};
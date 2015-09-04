/**
 * Helper methods for navigating through a site.
 *
 * This file is included automagically by the "test" executable.
 */
var utils = require('utils');
var MAXWAITINGTIME = 60000;
var NORMALWAITINGTIME = 5000;
var SHORTWAITINGTIME = 1000;
var NOWAITINGTIME = 10;

casper.init = function (path) {
	casper.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:36.0) Gecko/20100101 Firefox/36.0');
	casper.options.viewportSize = {width: 1280, height: 720};
	casper.on('page.error', function(msg, trace) {
		this.echo('Error: ' + msg, 'ERROR');
		for(var i=0; i<trace.length; i++) {
			var step = trace[i];
			this.echo('  ' + step.file + ' (line ' + step.line + ')', 'ERROR');
		}
	});
};

/**
 * Wrapper for http://docs.casperjs.org/en/latest/modules/casper.html#open
 *
 * Uses url argument from the command line in order to open a URL path.
 */
casper.openPath = function (path) {
	 var cleanPath = path.replace(/^\//, '');
	 return casper.open(casper.cli.get('url') + '/' + cleanPath);
};

/**
 * Wrapper for http://docs.casperjs.org/en/latest/modules/casper.html#thenopen
 *
 * Uses url argument from the command line in order to open a URL path and
 * define a navigation step.
 */
casper.thenOpenPath = function (path, thenCallback) {
  var cleanPath = path.replace(/^\//, '');
  return casper.thenOpen(casper.cli.get('url') + '/' + cleanPath, thenCallback);
};

// Generalized Operations
/*
 * clickSelector:
 *  	Validate the existance and click the given elector
 */

casper.clickSelector = function (selector) {
	this.waitForSelector(selector,
		function success() {
			console.log ("\tclick action + " + selector);
			this.click (selector);
		},
		function fail() {
			console.error(selector + "can NOT be found.");
		},
		MAXWAITINGTIME
	);
	return this;
}

/*
 * fetchSelectorText:
 *  	Validate the existance and fetch the text of the given selector
*/

casper.fetchSelectorText = function (myselector, idx, callback) {
	this.waitForSelector (myselector,
		function success () {
			var elements = this.getElementsInfo(myselector)
			var rtn_txt = elements[idx].text;
			callback (rtn_txt);
		},
		function fail () {
			console.error(myselector + " can NOT be found.");
			callback ();
		},
		MAXWAITINGTIME
	);
	return this;
}

/*
 * fetchSelectorText:
 *  	Validate the existance and fetch the text of the given selector
*/
casper.inputToSelector = function (myselector, str) {
	this.waitForSelector (myselector,
		function success () {
			console.log ("Input string to selector" + str);
			this.sendKeys(myselector, str);
			this.wait (
				2000);
		},
		function fail () {
			console.error(myselector + " can NOT be found.");
		},
		MAXWAITINGTIME
	);
	return this;
}


casper.inputByFill= function (formselector, value, submitflag) {
	this.waitForSelector (formselector,
		function success () {
			var submit = false || submitflag

			console.log ('\tform found ' + formselector) ;
			this.fill (formselector, value, submit);
		},
		function fail () {
			console.error(formselector + "can NOT be found.");
		},
		MAXWAITINGTIME
	);
	return this;
}

casper.inputByFillSelectors = function (formselector, value, submitflag) {
	this.waitForSelector (formselector,
		function success () {
			var submit = false || submitflag
			console.log ('form found ' + formselector) ;
			this.fillSelectors (formselector, value, submit);
		},
		function fail () {
			console.error(formselector + "can NOT be found.");
		},
		MAXWAITINGTIME
	);
	return this;
}

/* 
	function validateExistanceButton: Validate the existance of a button
	input
		test: 			test handle
		buttonSelector: CSS selector of button
		buttonName:	 	name of the selected button

*/
casper.validateExistanceButton = function validateExistanceButton (test, buttonSelector, buttonName) {
	this.waitForSelector (buttonSelector,
		function success() {
			test.assertExists (buttonSelector, buttonName + " button prensents");
		}, 
		function fail() {
			test.assertExists (buttonSelector, buttonName + " button DOES NOT prensents");
		}
	);
};

/* 
	function validateClickButton: Click the button and validate the given display text after a successful click
	input
		test: 			test handle
		testInfoString: the string about the test is about
		buttonSelector: CSS selector of button
		textSelector:	CSS selector of text to validate a successful click
		expectedText: 	expected text for the textSelector

*/
casper.validateClickButton = function validateClickButton (test, testInfoString, buttonSelector, textSelector, expectedText) {
	// Validate any button
	//console.log (testInfoString); 
	this.clickSelector (buttonSelector);
	this.fetchSelectorText(textSelector, 0, function getText (actualText) {
		actualText = actualText.replace (/^\s+/, '');
		actualText = actualText.replace (/\s+$/, '');
		test.assertEquals (actualText, expectedText,
			testInfoString + " is successful");
	});
};

/* 
	function validateText: Click the button and validate the given display text after a successful click
	input
		test: 			test handle
		testInfoString: the string about the test is about
		textSelector:	CSS selector of text to validate
		expectedText: 	expected text for the textSelector

*/
casper.validateText = function validateClickButton (test, testInfoString, textSelector, expectedText) {
	// Validate any text
	//console.log (testInfoString); 
	this.fetchSelectorText(textSelector, 0, function getText (actualText) {
		actualText = actualText.replace (/^\s+/, '');
		actualText = actualText.replace (/\s+$/, '');
		test.assertEquals (actualText, expectedText,
			testInfoString + " is successful");
	});
};

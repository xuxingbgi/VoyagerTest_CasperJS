/*==============================================================================*/
/* Casper generated Thu May 21 2015 11:12:56 GMT-0700 (PDT) 					*/
/*==============================================================================*/
/* 
	User has the instance privilege can create institution
	
	User with institution management privilege
	- USR00INSTANCE

	Set up
	- log in
	- Admin > Institution

	Validation
	- Create an institute 	
		- Check Create New Institute popup
		- Exception: Missing Name
		- Exception: Missing Bucket

	We verifiy the match of name, type, description for newly created institution.
*/

var x = require('casper').selectXPath;

casper.init();

var inst_nameonly = new institution (randomName (8, 'T_'));
var inst_nameAndType1 = new institution (randomName (8, 'T_'), 'Clinical');
var inst_nameAndType2 = new institution (randomName (8, 'T_'), 'Research');
var inst_nameAndTypeAndDesc = new institution (randomName (8, 'T_'), 'Research', randomName (255));

var institutions = [
	inst_nameonly,
	//inst_nameAndType1,
	//inst_nameAndType2,
	//inst_nameAndTypeAndDesc
			];

institutions.forEach(function checkEachInstitute (inst) {
	casper.test.begin('Create a new institute', function(test) {
		casper.start();

		var usr = USR00INSTANCE;  // using USR00INSTANCE
		var privilege = 'Institutions';

		var typeChoice = '';
		var description = '';

	
		casper.start();
		
		
		casper.then (function setup () {
			// Admin privilege workspace
			casper.admin ('/login.html', usr, privilege);
		});
		
		casper.then (function createInstitute () {	
			console.log ("Verify Create a new institution...")
			casper.then (function checkCreateInstitutePopup () {
				console.log ("Check Create New Institute Popup ..."); 
				
				this.verifyClickDOM (test, "Click New button", S_NEWITEMBUTTON, S_POPUPTITLE, "Create New Institution"); // click add button
				this.verifyExistanceDOM (test, "Verify existance of Save button", S_SAVEBUTTON);
				this.verifyExistanceDOM (test, "Verify existance of Cancel button", S_CANCELBUTTON);
				this.verifyExistanceDOM (test, "Verify existance of X Close button", S_XCLOSEBUTTON);
				this.verifyClosePopup (test, "Validating Cancel Button", S_CANCELBUTTON, S_POPUPTITLE);

				this.wait (SHORTWAITINGTIME);				
				this.verifyClickDOM (test, "Click New button", S_NEWITEMBUTTON, S_POPUPTITLE, "Create New Institution"); // click add button
				this.wait (SHORTWAITINGTIME);
				this.verifyClosePopup (test, "Validating X close Button", S_XCLOSEBUTTON, S_POPUPTITLE);
			});

			// Missing Name

			// Missing Bucket
		});
	
		casper.logout();
		
		casper.then (function () {
			this.wait (NORMALWAITINGTIME);
		});

		casper.run(function() {slimer.clearHttpAuth(); test.done();});

	});
});
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
	- Create an institute by only name
	- Create an institute by name + type1
	- Create an institute by name + type2
	- Create an institute by name + type + description

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
	inst_nameAndType1,
	inst_nameAndType2,
	inst_nameAndTypeAndDesc
			];

console.log (inst_nameonly.name);
console.log (institutions[0].name);

institutions.forEach(function checkEachInstitute (inst) {
	casper.test.begin('Create a new institute', function(test) {
		casper.start();

		var usr = USR00INSTANCE;  // using USR00INSTANCE
		var privilege = 'MANAGE_INSTITUTION';

		var typeChoice = '';
		var description = '';

	
		casper.start();
		
		
		casper.then (function setup () {
			// Admin privilege workspace
			casper.admin ('/login.html', usr, privilege);
		});
		
		casper.then (function createInstitute () {	
			console.log ("Verify Create a new institution...")
 				
			// click new button
			this.verifyClickDOM (test, "Click New button", S_NEWITEMBUTTON, S_POPUPTITLE, "Create New Institution"); // click add button
			// Input institution name
			this.inputByFill (S_INPUTTABLE, {'name':inst.name});
			//Input institution type
			if (inst.type != undefined) {
				this.clickDOM ("a[data-option='" + DATAOPTION_MAP[inst.type] + "']");
			}
			//Input institution description
			if (inst.description != undefined) {
				this.inputByFill (S_INPUTTABLE, {'description':inst.description});
			}

			// click save button
			this.verifyClosePopup (test, "Click Save Button", S_SAVEBUTTON, S_POPUPTITLE);
			// Save the institution info.
			casper.then (function verifyNameTypeDesc() {
				//this.clickDOM (S_SAVEBUTTON);
				this.wait(
					NORMALWAITINGTIME, 
					function then () {
						this.fetchDOMText(S_DETAILTITLE, 0, function getText (detailTitle) {
							test.assertEquals (detailTitle, inst.name,
							'Newly created Institution shows its details');
						});
		
						if (inst.type != undefined) {
							this.fetchDOMText(S_KEYVALUEPAIR, 0, function getText (keyValuePair) {
								keyValuePair = keyValuePair.replace(/\s+/g, "");
								test.assertEquals (keyValuePair, "Type:" + inst.type,
									'Institutions type is '+ inst.type + '.');
							});
						} else {
							this.fetchDOMText(S_KEYVALUEPAIR, 0, function getText (keyValuePair) {
								keyValuePair = keyValuePair.replace(/\s+/g, "");
								test.assertEquals (keyValuePair, 'Type:Individual',
									'Default Institutions type is Individual.');
							});
						}
		
						if (inst.description != '') {
							this.fetchDOMText(S_KEYVALUEPAIR, 1, function getText (keyValuePair) {
								keyValuePair = keyValuePair.replace(/\s+/g, "");
								test.assertEquals (keyValuePair, "Description:" + inst.description,
									'Institutions description matches.');
							});
						}
				});
			});
			
		});
	
		casper.logout();
		
		casper.run(function() {slimer.clearHttpAuth(); test.done();});

	});
});
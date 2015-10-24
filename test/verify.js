var verify = require('../src/verify');

describe('verify', function () {
	this.timeout(5000);

	describe('verify', function () {
		it('should attempt to verify the user', function (done) {
			// WARNING: this ID may not work when you're testing because my user
			// doesn't exist - this is temporary and should be fixed before
			// these changes are merged in
			verify.verifyUserEmail('google:108142328462790393788', done);
		});
	});

	describe.only('confirmToken', function () {
		it('should attempt to confirm the user token', function (done) {
			// WARNING: same as above
			verify.confirmToken('c3def790-7a50-11e5-8235-d5d5f68d35bf', done);
		});
	});
});

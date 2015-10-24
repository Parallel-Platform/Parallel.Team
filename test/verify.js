var verify = require('../src/verify');

describe.only('verify', function () {
	describe('verify', function () {
		this.timeout(5000);

		it('should attempt to verify the user', function (done) {
			// WARNING: this ID may not work when you're testing because my user
			// doesn't exist - this is temporary and should be fixed before
			// these changes are merged in
			verify.verifyUserEmail('google:108142328462790393788', done);
		});
	});
});

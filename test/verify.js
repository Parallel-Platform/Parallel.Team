var assert = require('assert');
var mockery = require('mockery');
var Firebase = require('firebase');
var config = require('../config');

describe('verify', function () {
	var exampleUser = {
		email: 'test@example.com',
		verifytoken: '1234-abcd-4321',
	};
	var testUserRef = new Firebase(config.firebase.url + 'users/test:test');
	var verify;

	this.timeout(10000);

	before(function(done) {
		var uuidMock = {
			v1: function () {
				return exampleUser.verifytoken
			}
		};
		var emailMock = {
			send: function (toEmail, subject, template, params, callback) {
				assert.equal(toEmail, exampleUser.email);
				assert.equal(subject, 'Verify your Parallel Account Email');
				assert.equal(template, 'verifyEmail.html');

				callback(null, {
					info: 'Complete'
				});
			}
		};

		mockery.enable({
			useCleanCache: true,
			warnOnUnregistered: false
		});
		mockery.registerMock('uuid', uuidMock);
		mockery.registerMock('./email', emailMock);

		verify = require('../src/verify');

		testUserRef.set(exampleUser, done);
	});

	after(function() {
		mockery.deregisterAll();
		mockery.disable();
		testUserRef.remove();
	});

	describe('verifyUserEmail', function () {
		it('should attempt to verify the user', function (done) {
			verify.verifyUserEmail('test:test', done);
		});
	});

	describe('confirmToken', function () {
		it('should attempt to confirm the user token', function (done) {
			verify.confirmToken(exampleUser.verifytoken, function (err) {
				testUserRef.child('emailverified').once('value', function (item) {
					assert.equal(item.val(), true);
					done(err);
				});
			});
		});
	});
});

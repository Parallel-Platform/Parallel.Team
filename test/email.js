var assert = require('assert');
var mockery = require('mockery');

describe('email', function() {
	var exampleContent = {
		email: 'test@example.com',
		subject: 'This is a test',
		template: 'templateFile.html',
		html: 'This is a {{test}}'
	};
	var email;

	before(function() {
		var configMock = {
			email: {
				gmail: {
					user: 'sender@example.com',
					password: '1234asdf'
				}
			},
		};
		var sendMailMock = function (options, callback) {
			assert.equal(options.to, exampleContent.email);
			assert.equal(
				options.from,
				'Parallel <' + configMock.email.gmail.user + '>'
			);
			assert.equal(options.subject, exampleContent.subject);
			assert.equal(options.html, exampleContent.html);

			callback();
		};
		var nodemailerMock = {
			createTransport: function () {
				return {
					sendMail: sendMailMock
				};
			}
		};
		var fsMock = {
			readFileSync: function (path) {
				return exampleContent.html;
			}
		};

		mockery.enable({
			useCleanCache: true
		});
		mockery.registerMock('nodemailer', nodemailerMock);
		mockery.registerMock('../config', configMock);
		mockery.registerMock('fs', fsMock);
		mockery.registerAllowable('path');
		mockery.registerAllowable('../src/email');

		email = require('../src/email');
	});

	after(function() {
		mockery.deregisterAll();
		mockery.disable();
	});

	describe('send', function() {
		it('should attempt to send an email', function(done) {
			email.send(
				exampleContent.email,
				exampleContent.subject,
				exampleContent.template,
				{},
				done
			);
		});
	});
});

var assert = require('assert');
var mockery = require('mockery');

describe('email', function() {
	var exampleContent = {
		email: 'test@example.com',
		subject: 'This is a test',
		template: 'templateFile.html',
		html: 'This is a {{test}}',
		finalHtml: 'This is a {{test}}'
	};
	var email;

	before(function() {
		var configMock = {
			appsettings: {
				env: 'dev'
			},
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
			assert.equal(options.html, exampleContent.finalHtml);

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
			useCleanCache: true,
			warnOnUnregistered: false
		});
		mockery.registerMock('nodemailer', nodemailerMock);
		mockery.registerMock('../config', configMock);
		mockery.registerMock('fs', fsMock);

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

		it('should replace the template content with params', function (done) {
			exampleContent.finalHtml = 'This is a better test';

			email.send(
				exampleContent.email,
				exampleContent.subject,
				exampleContent.template,
				{ test: 'better test'},
				done
			);
		});
	});
});

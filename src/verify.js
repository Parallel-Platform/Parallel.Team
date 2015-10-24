var Firebase = require('firebase');
var path = require('path');
var nodemailer = require('nodemailer');
var uuid = require('uuid');
var config = require('../config');
var fs = require('fs');
var _ = require('underscore');

var origin = '';

switch (config.appsettings.env) {
	case 'dev':
		origin = 'http://' + process.env.HOST + ':' + process.env.PORT;
		break;

	case 'test':
		origin = config.appsettings.testDomain;
		break;

	case 'prod':
		origin = config.appsettings.prodDomain;
		break;

	default:
		break;
}

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: config.email.gmail.user,
		pass: config.email.gmail.password
	}
});

var verify = {};

/**
 * Confirm an email verification token.
 *
 * @param {String}	 token	  Token to confirm
 * @param {Function} callback Function to call when the confirmation is complete
 */
verify.confirmToken = function (token, callback) {
	var usersRef = new Firebase(config.firebase.url + 'users');

	usersRef
		.orderByChild('verifytoken')
		.equalTo(token)
		.once('value', function (snapshot) {
			var user = snapshot.val();

			if (user && !user.emailverified) {
				var userKey = _.map(user, function (obj, key) { return key; });

				if (userKey && userKey.length > 0) {
					var firebaseUrl = config.firebase.url + 'users/' + userKey[0] + '/emailverified';
					var userItemRef = new Firebase(firebaseUrl);
					userItemRef.set(true);

					callback(); // A-OK
				}
			} else {
				callback('Unable to confirm token');
			}
		});
};

/**
 * Send verification email to the user.
 *
 * @param {String}   userId   ID of the user
 * @param {Function} callback Function to call with the error (if any)
 */
verify.verifyUserEmail = function (userId, callback) {
	var token = uuid.v1();
	var userEmailRef = new Firebase(config.firebase.url + 'users/' + userId + '/email');
	var email;

	/**
	 * Send the verification e-mail to the user (if no error was encounted).
	 *
	 * @param {Error} error
	 */
	function sendVerificationEmail(error) {
		if (error) {
			//Send message to user/client - probably via faye
			console.log('Synchronization failed');
			return callback(error);
		}

		//Send verification email and success message to user/client
		var htmlTemplate = fs.readFileSync(path.join(__dirname, '../emailTemplates/verifyEmail.html'), 'utf8');
		var verify_url = origin + '/api/confirm/' + token;

		htmlTemplate = htmlTemplate.replace('{{verify_url}}', verify_url);
		htmlTemplate = htmlTemplate.replace('{{unsubscribe_url}}', verify_url);

		// setup e-mail data with unicode symbols
		var mailOptions = {
			from: 'Parallel <' + config.email.gmail.user + '>', // sender address
			to: email, // list of receivers
			subject: 'Verify your Parallel Account Email', // Subject line
			html: htmlTemplate // html body
		};

		// send mail with defined transport object
		transporter.sendMail(mailOptions, notifyUser);
	}

	/**
	 * Notify the user of success/failure.
	 *
	 * @param {Error} error An error (if it occured)
	 * @param {Object} info Response object
	 */
	function notifyUser(error, info) {
		if (error) {
			console.log(error);
			return callback(error);
		}
		console.log('Message sent: ' + info.response);

		//send a faye notification to the client...
		var faye_server = GLOBAL.faye_server;

		if (faye_server !== null && faye_server !== undefined) {
			//Send confirmation to client
			faye_server.getClient().publish('/verificationSent', {
				emailSent: true
			});
		}

		callback(); // we're done here
	}

	userEmailRef.once('value', function (snapshot) {
		email = snapshot.val();

		if (email) {
			userVerifyTokenRef = new Firebase(config.firebase.url + 'users/' + userId + '/verifytoken');
			userVerifyTokenRef.set(token, sendVerificationEmail);
		} else {
			callback('No email for user ' + userId);
		}
	});
};

module.exports = verify;

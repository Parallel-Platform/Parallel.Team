var Firebase = require('firebase');
var uuid = require('uuid');
var _ = require('underscore');
var email = require('./email');
var config = require('../config');

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
					userItemRef.set(true, callback);
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

	userEmailRef.once('value', function (snapshot) {
		var userEmail = snapshot.val();

		if (userEmail) {
			userVerifyTokenRef = new Firebase(config.firebase.url + 'users/' + userId + '/verifytoken');
			userVerifyTokenRef.set(token, function (err) {
				if (err) {
					//Send message to user/client - probably via faye
					console.log('Synchronization failed');
					return callback(err);
				}

				email.sendVerificationEmail(userEmail, token, function (error, info) {
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
				});
			});
		} else {
			callback('No email for user ' + userId);
		}
	});
};

module.exports = verify;

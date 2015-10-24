var nodemailer = require('nodemailer');
var path = require('path');
var fs = require('fs');
var Firebase = require('firebase');
var config = require('../config');

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

var transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: config.email.gmail.user,
		pass: config.email.gmail.password
	}
});

var email = {};

/**
 * Send an e-mail using the default transporter.
 *
 * @param {String}   toEmail       E-mail address to send to
 * @param {String}   subject       Subject of the e-mail
 * @param {String}   template      The template to use
 * @param {Object}   replaceParams Values to replace in the template
 * @param {Function} callback      Function to call on complete
 */
email.send = function (toEmail, subject, template, replaceParams, callback) {
	var templatePath = path.join(__dirname, '..', 'emailTemplates', template);
	var htmlTemplate = fs.readFileSync(templatePath, 'utf8');

	for (var key in replaceParams) {
		htmlTemplate = htmlTemplate.replace(
			'{{' + key + '}}',
			replaceParams[key]
		);
	}

	// setup e-mail data with unicode symbols
	var mailOptions = {
		from: 'Parallel <' + config.email.gmail.user + '>', // sender address
		to: toEmail, // list of receivers
		subject: subject, // Subject line
		html: htmlTemplate // html body
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, callback);
};

/**
 * Send an invite request.
 *
 * @param {String}   requestId ID of the request
 * @param {String}   invitee   Person who requested the invite
 * @param {String}   gameTitle Title of the game in the request
 * @param {String}   system    System in the request
 * @param {Function} callback  Callback
 */
email.sendInviteRequest = function (requestId, invitee, gameTitle, system, callback) {
	var requestRef = new Firebase(config.firebase.url + 'requests/' + requestId);

	// Get the request
	requestRef.once('value', function (requestSnapshot) {
		var request = requestSnapshot.val();

		if (request) {

			//Get the request creator
			var creatorRef = new Firebase(config.firebase.url + 'users/' + request.uid);
			creatorRef.once('value', function (creatorSnapshot) {

				var creator = creatorSnapshot.val();

				//Make sure their email is verified
				if (creator && creator.username && creator.email && creator.emailverified) {
					var requestUrl = origin + '/#/request/' + requestId;
					var params = {
						creator: creator.username,
						inviteRequestor: invitee,
						gametitle: gameTitle,
						system: system,
						requesturl: requestUrl
					};

					email.send(
						creator.email,
						'Response to your gaming request',
						'inviteRequestEmail.html',
						params,
						function (error, info) {
							if (error) {
								return console.log(error);
							}
							console.log('Message sent: ' + info.response);
							callback(error);
					});
				}
			});
		} else {
			callback('Unable to retrieve request for ID: ' + requestId);
		}
	});
};

module.exports = email;

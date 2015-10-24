var nodemailer = require('nodemailer');
var path = require('path');
var fs = require('fs');
var config = require('../config');

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

module.exports = email;

/**
 * Created by Namdascious.
 */
var express = require('express');
var path = require('path');
var giantbomb = require('./giantbomb');
var steam = require('./steam');
var verify = require('./verify');
var email = require('./email');
var config = require('../config');

var app = express();
var router = express.Router();

router.get('/', function (req, res) {
	res.send('respond with a resource');
});

router.get('/email/sendCommentEmail', function (req, res) {
	var requestId = req.query.requestid;
	var commenter = req.query.commenter;
	var creator = req.query.creator;
	var gameTitle = req.query.gametitle;
	var system = req.query.system;

	email.sendCommentEmail(requestId, commenter, creator, gameTitle, system, function (err) {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send('server reached');
		}
	});
});

router.get('/email/sendInviteRequest', function (req, res) {
	var requestId = req.query.requestid;
	var invitee = req.query.invitee;
	var gameTitle = req.query.gametitle;
	var system = req.query.system;

	email.sendInviteRequest(requestId, invitee, gameTitle, system, function (err) {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send('server reached');
		}
	});
});

router.get('/verify', function (req, res) {
	var uid = req.query.uid;

	verify.verifyUserEmail(uid, function (error) {
		 if (error) {
			  res.status(500).send(error);
		 } else {
			  res.status(200).send('server reached');
		 }
	});
});

router.get('/confirm/:token', function (req, res) {
	var token = req.params.token;

	verify.confirmToken(token, function (error) {
		if (error) {
			//send message to client about not being able to confirm
			res.sendFile(path.join(__dirname, '../public', 'index.html'));
		} else {
			//send verification success page
			res.sendFile(path.join(__dirname, '../public', 'confirm.html'));
		}
	});
});

router.get('/steam/authenticate', function (req, res) {
	steam.authenticate(function (err, authUrl) {
		if (err) {
			res.status(401).send(err);
		} else {
			res.status(200).send({ 'url' : authUrl });
		}
	});
});

router.get('/steam/authenticate/verify', function (req, res) {
	console.log('DING: Steam Authenticate Route Hit');
	steam.verifyAuthentication(req, function (err, info) {
		if (err) {
			res.status(401).send(err);
		} else {
			var faye_server = GLOBAL.faye_server;

			if (faye_server) {
				//Send token to the client
				faye_server.getClient().publish('/steamSuccess', {
					pageName: 'sign-in.html',
					steamid: info.steamId,
					steam: info.steamUser,
					token: info.token
				});
			} else {
				res.status(200).send({
					steamid: info.steamId,
					steam: info.steamUser,
					token: info.token
				});
			}
		}
	});
});

router.get('/giantbomb/search', function (req, res) {
	console.log('DING: Giantbomb Search Route Hit');
	giantbomb.getGames(req.query.search, req.query.limit)
		.then(function (data) {
			res.status(200).send(data);
		}, function (err) {
			console.error("%s; %s", err.message);
			res.status(500).send(err);
		});
});

module.exports = router;

/**
 * Created by Namdascious.
 */
var express = require('express');
var http = require('http');
var url = require('url');
var path = require('path');
var openid = require('openid');
var _ = require('underscore');

var Firebase = require('firebase');
var FirebaseTokenGenerator = require("firebase-token-generator");
var giantbomb = require('./giantbomb');
var steam = require('./steam');
var verify = require('./verify');
var email = require('./email');
var config = require('../config');

//Express stuff (routing, server info, etc)
var app = express();
var router = express.Router();
var host = process.env.HOST;
var port = process.env.PORT || 1337;
//var fayePort = process.env.PORT || 8089;
var origin = '';

switch (config.appsettings.env) {
    case 'dev':
        origin = 'http://' + host + ':' + port;
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

var relyingParty = new openid.RelyingParty(
							origin + '/api/steam/authenticate/verify', // Verification URL (yours)
							origin, // Realm (optional, specifies realm for OpenID authentication)
							true, // Use stateless verification
							false, // Strict mode
							[]
); // List of extensions to enable and include

router.get('/', function (req, res) {
	res.send('respond with a resource');
});

router.get('/email/sendCommentEmail', function (req, res) {
    var requestid = req.query.requestid;
    var commenter = req.query.commenter;
    var creator = req.query.creator;
    var gametitle = req.query.gametitle;
    var system = req.query.system;

    var titlemessage = 'Someone commented on your request';
    var grammarfocus = 'your';
    var interestfocus = 'you are interested in'
    var subject = 'Someone commented on your gaming request';

    //Send email to the owner of the request
    var requesturl = origin + '/#/request/' + requestid;

    //Gonna need to do some querying - Get the creator, then for each subscriber, get their user info, and send an email to them if they are subscribed
    var creatorRef = new Firebase(config.firebase.url + 'users');

    creatorRef
    .orderByChild('username')
    .equalTo(creator)
    .once('value', function (creatorSnapshot) {
        var creatorUserObj = creatorSnapshot.val();

        if (creatorUserObj !== null && creatorUserObj !== undefined) {

            var creatorEmail = null;
            var creatorUser = null;

            var creatorUserArray = _.map(creatorUserObj, function (userItem, userKey) {
                return userItem;
            });

            if (creatorUserArray !== null && creatorUserArray !== undefined && creatorUserArray.length > 0) {
                creatorUser = creatorUserArray[0];
                creatorEmail = creatorUserArray[0].email;
            }

            //Send an email to the creator if (a) their email is verified & (b) they are not the commenter
            if (
                creatorEmail !== null &&
                creatorEmail !== undefined &&
                creatorUser !== null &&
                creatorUser !== undefined &&
                creatorUser.emailverified !== null &&
                creatorUser.emailverified !== undefined &&
                creatorUser.emailverified == true &&
                creator.trim() !== commenter.trim()) {

                //send email to creator
                var params = {
	                addressee: creator,
	                titlemessage: titlemessage,
	                grammarfocus: grammarfocus,
	                interestfocus: '',  //interest focus is empty for the creator
	                commenter: commenter,
	                gametitle: gametitle,
	                system: system,
	                requesturl: requesturl
                };

                email.send(creatorUser.email, subject, 'commentRequestEmail.html', params, function (error, info) {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: ' + info.response);
                });
            }

            //Now we are going to make a call for each subscribed user, and send them an email one after the other
            var requestSubscribersRef = new Firebase(config.firebase.url + 'requests/' + requestid + '/subscribers');

            requestSubscribersRef.once('value', function (subsSnapshot) {
                var subscriberIds = subsSnapshot.val();

                if (subscriberIds !== null && subscriberIds !== undefined) {
                    var subscriberIdsArray = _.map(subscriberIds, function (sub, key) {
                        return sub.uid;
                    });

                    if (subscriberIdsArray !== null && subscriberIdsArray !== undefined && subscriberIdsArray.length > 0) {
                        //Get the user for each uid and send them an email - all except the commenter
                        _.each(subscriberIdsArray, function (subId) {

                            var userRef = new Firebase(config.firebase.url + 'users/' + subId);
                            userRef.once('value', function (userSnapshot) {
                                var user = userSnapshot.val();

                                if (
                                    user !== null &&
                                    user !== undefined &&
                                    user.username !== null &&
                                    user.username !== undefined &&
                                    user.email !== null &&
                                    user.email !== undefined &&
                                    user.emailverified !== null &&
                                    user.emailverified !== undefined &&
                                    user.emailverified == true &&
                                    user.username.trim() !== commenter.trim()) {

                                    var params = {
						                addressee: user.username,
						                titlemessage: 'Someone commented on a request you are interested in',
						                grammarfocus: 'a',
						                interestfocus: 'you are interested in',
						                commenter: commenter,
						                gametitle: gametitle,
						                system: system,
						                requesturl: requesturl
					                };

					                email.send(
					                	user.email,
					                	'Someone commented on a gaming request you are interested in',
					                	'commentRequestEmail.html',
					                	params,
					                	function (error, info) {
						                    if (error) {
						                        return console.log(error);
						                    }
						                    console.log('Message sent: ' + info.response);
					                });
                                }
                            });
                        });
                    }
                }
            });
        }
    });

    res.status(200).send('server reached');

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

	var identifier = config.steam.provider;

	relyingParty.authenticate(identifier, false, function (error, authUrl) {
		if (error) {
			res.writeHead(200);
			res.end('Authentication failed: ' + error.message);
		}
		else if (!authUrl) {
			res.writeHead(200);
			res.end('Authentication failed');
		}
		else {
			res.status(200).send({ 'url' : authUrl });
		}
	});
});

router.get('/steam/authenticate/verify', function (req, res) {
    console.log('DING: Steam Authenticate Route Hit');
	relyingParty.verifyAssertion(req, function (error, result) {

		var urlObj = url.parse(result.claimedIdentifier);
		var pathArray = urlObj.pathname.split('/');

		if (pathArray !== null && pathArray !== undefined && pathArray.length > 0) {
            var steamid = pathArray[(pathArray.length - 1)];

            //Get the user profile from steam
            steam.getSteamUser(steamid)
            .then(function (data) {
                var steamData = JSON.parse(data);
                if (
                    steamData !== null && steamData !== undefined && steamData.response !== null && steamData.response !== undefined && steamData.response.players !== null &&
                    steamData.response.players !== undefined && steamData.response.players.length > 0
                    ) {
                    var steamUser = steamData.response.players[0];

                    //Generate a firebase token for our steam auth user info
                    var tokenGenerator = new FirebaseTokenGenerator(config.firebase.secret);
                    var token = tokenGenerator.createToken({ uid: "steam:" + steamid });

                    var faye_server = GLOBAL.faye_server;

                    if (faye_server !== null && faye_server !== undefined) {
                        //Send token to the client
                        faye_server.getClient().publish('/steamSuccess',
			            {
                            pageName: 'sign-in.html',
                            steamid: steamid,
                            steam: steamUser,
                            token: token
                        });
                    }
                }
            }, function (err) {

            });
		}
	});
});

router.get('/giantbomb/search', function (req, res) {
    console.log('DING: Giantbomb Search Route Hit');
	giantbomb.getGames(req.query.search, req.query.limit)
	.then(function (data) {
		res.send(data);
	}, function (err) {
		console.error("%s; %s", err.message, url);
		//console.log("%j", err.res.statusCode);
	});
});

module.exports = router;

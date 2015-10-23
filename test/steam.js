var assert = require('assert'),
	mockery = require('mockery');

describe('steam', function() {
	var steam;

	before(function() {
		var configMock = {
				'steam' : {
					'api_url' : 'http://api.steampowered.com/<interface_name>/<method_name>/<version>/?key=<api_key>&format=<format>',
					'api_key' : 'TEST1234',
					'provider' : 'http://steamcommunity.com/openid'
				}
			}
		    requestPromiseMock = function(url) {
				return url;
			};

		mockery.enable();
		mockery.registerMock('request-promise', requestPromiseMock);
		mockery.registerMock('./config.js', configMock);
		mockery.registerAllowable('../steam');

		steam = require('../steam');
	});

	after(function() {
		mockery.deregisterAll();
		mockery.disable();
	});

	describe('getSteamUser', function() {
		it('should attempt to get the details of a user', function() {
			var expected = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=TEST1234&format=json&steamids=test',
				result = steam.getSteamUser('test', 10);

			assert.equal(expected, result);
		});
	});
});

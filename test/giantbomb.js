var assert = require('assert'),
	mockery = require('mockery');

describe('giantbomb', function() {
	var giantbomb;

	before(function() {
		var configMock = {
				'giant_bomb': {
					'url': 'http://www.giantbomb.com/api/',
					'key': 'f735c8db9f30c3d62ff557e615b4a4e5f572d784',
					'endpoints' : {
			            'search' : 'search'
					},
					'formats': {
						'json' : 'json'
					},
					'resources': {
						'game' : 'game'
					}
				},
			}
		    requestPromiseMock = function(url) {
				return url;
			};

		mockery.enable();
		mockery.registerMock('request-promise', requestPromiseMock);
		mockery.registerMock('./config.js', configMock);
		mockery.registerAllowable('../giantbomb');

		giantbomb = require('../giantbomb');
	});

	after(function() {
		mockery.deregisterAll();
		mockery.disable();
	});

	describe('getGames', function() {
		it('should attempt to search for a list of games', function() {
			var expected = 'http://www.giantbomb.com/api/search/?api_key=f735c8db9f30c3d62ff557e615b4a4e5f572d784&limit=10&format=json&query="test"&resources=game&field_list=id,name,image,original_release_date',
				result = giantbomb.getGames('test', 10);

			assert.equal(expected, result);
		});
	});
});

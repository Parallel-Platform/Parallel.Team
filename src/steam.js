/**
 * Created by Namdascious.
 */
var requestPromise = require('request-promise');
var config = require('../config');

module.exports = {
	getSteamUser : function (userId) {
		var url = config.steam.api_url
			+ 'ISteamUser/GetPlayerSummaries/v0002/?key='
			+ config.steam.api_key
			+ '&format=json&steamids=' + userId;

		return requestPromise(url);
	}
}

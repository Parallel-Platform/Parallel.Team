var env = {
    dev: 'dev',
    test: 'test',
    prod: 'prod'
};

module.exports = {
    "appsettings" : {
        "env" : env.dev
    },
    "email": {
        "gmail": {
            "user" : "",
            "password" : ""
        }
    },
    "giant_bomb": {
        "url" : "http://www.giantbomb.com/api/",
        "key" : "<Your API Key>"
    },
    "facebook" : {
        "appid" : "<Your Facebook App Id>",
        "appsecret" : "<Your Facebook App Secret>"
    },
    "steam" : {
        "api_url" : 'http://api.steampowered.com/',
        "api_key" : '<Your Steam API Key>',
        "provider" : 'http://steamcommunity.com/openid'
    },
    "firebase" : {
        "url" : '<Your Firebase Url>',
        "secret" : '<Your Firebase Key>'
    }
}

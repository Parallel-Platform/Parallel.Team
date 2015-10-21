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
        "key" : "<Your API Key>",
        "endpoints" : {
            "games" : "games",
            "genres" : "genres",
            "platforms" : "platforms",
            "search" : "search"
        },
        "formats": {
            "json" : "json",
            "xml" : "xml"
        },
        "resources" : {
            'game' : 'game',
            'franchise' : 'franchise',
            'character' : 'character',
            'concept' : 'concept', 
            'object' : 'object',
            'location' : 'location',
            'person' : 'person',
            'company' : 'company',
            'video' : 'video'
        },
        "limit" : 4,
        "sample_url" : "http://www.giantbomb.com/api/game/3030-4725/?api_key=[YOUR-KEY]",
        "sample_url_json" : "http://www.giantbomb.com/api/game/3030-4725/?api_key=[YOUR-KEY]&format=json&field_list=genres,name",
        "sample_url_breakdown" : "http://www.giantbomb.com/api/[RESOURCE-TYPE]/[RESOURCE-ID]/?api_key=[YOUR-KEY]&format=[RESPONSE-DATA-FORMAT]&field_list=[COMMA-SEPARATED-LIST-OF-RESOURCE-FIELDS]"
    },
    "facebook" : {
        "appid" : "<Your Facebook App Id>",
        "appsecret" : "<Your Facebook App Secret>"
    },
    "steam" : {
        "api_url" : 'http://api.steampowered.com/<interface_name>/<method_name>/<version>/?key=<api_key>&format=<format>',
        "api_key" : '<Your Steam API Key>',
        "provider" : 'http://steamcommunity.com/openid'
    },
    "firebase" : {
        "url" : '<Your Firebase Url>',
        "secret" : '<Your Firebase Key>'
    }
}

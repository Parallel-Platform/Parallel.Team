// Setup
if (!process.env.PORT) {
    process.env.PORT = 3000;
}

var app = require('./app.js');

app.listen(process.env.PORT, function () {
    console.log('App listening at http://%s:%s', process.env.HOST, process.env.PORT);
});

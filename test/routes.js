var assert = require('assert'),
	express = require('express'),
	supertest = require('supertest');

describe('/api', function() {
	var server;

	before(function() {
		var app = express();
		var apiRoutes = require('../routes/api');

		app.use('/api', apiRoutes);
		server = app.listen(3999);
	});

	after(function() {
		server.close();
	});

	describe('/', function() {
		it('should respond simply', function(done) {
			var expected = 'respond with a resource';

			supertest(server)
				.get('/api/')
				.expect(200)
				.end(function(err, res) {
					assert.equal(res.text, expected);
					done(err);
				});
		});
	});
});

'use strict';

// Initialize server ===========================================================
var express = require('express')
  , http = require('http')
  , app = express()
  , server = http.createServer(app)
  , mongoose = require('mongoose')
  , database = require('./config/database')
  , port = process.env.PORT || 3000;

// Configuration ===============================================================
mongoose.connect(database.url);
app.set('views', __dirname + 'public/views');
app.use('/public', express.static(__dirname + '/public'));
app.use(express.bodyParser());

// Routes ======================================================================
require('./config/routes.js')(app);

// Listen (start app with node server.js) ======================================
server.listen(port, function() {
	console.log("App is now listening on port " + port);
});
const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var router = require('./router');
var db = require('./mongo-db');
var path = require("path");

const server = require('http').Server(app)

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
    next();
});

/*
app.use(express.static(path.join(__dirname, 'public')));

app.use("/css",  express.static(__dirname + '/public/css'));
app.use("/js", express.static(__dirname + '/public/js'));
app.use("/lib",  express.static(__dirname + '/public/lib'));
*/
app.use(router);

server.listen(port, function () {
  console.log('Application listening on : ' + ':' + port);
})

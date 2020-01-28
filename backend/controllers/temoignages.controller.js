var bodyParser = require('body-parser');
var db = require('../mongo-db.js');
var util = require('util');

exports.index = function(req, res) {
	res.send('Hello from temoignages controller');
}

exports.getAll = function(req, res) {
	db.getAllLights(function(response){
		res.send(response);
	});
}

exports.get = function(req, res) {
	db.getAllLights(function(response){
		res.send(response);
	});
}

exports.insert = function(req, res) {
	db.registerLight(req.body, function(response){
		res.send(response);
	});
}

exports.update = function(mac_add, req, res) {
	setLightValue(mac_add, true, res);
}

exports.delete = function(mac_add, req, res) {
	setLightValue(mac_add, false, res);
}

exports.getLightData = function(mac_add, req, res) {
	db.getLightValues(mac_add, function(response){
		res.send(response);
	});
}
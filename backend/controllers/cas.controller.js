var bodyParser = require('body-parser');
var db = require('../mongo-db.js');
var util = require('util');

exports.getAll = function(page, pageSize, req, res) {
	db.getCas(page, pageSize, function(response){
		res.send(response);
	});
}

exports.search = function(page, pageSize, category, zone, startDate, endDate, req, res) {
	console.log('searching in controller')
	db.search(page, pageSize, category, zone, startDate, endDate, function(response){
		res.send(response);
	});
}

exports.get = function(id, req, res) {
	db.getCasById(id, function(response){
		res.send(response);
	});
}

exports.getAllZones = function(req, res) {
	db.getAllZones(function(response){
		res.send(response);
	});
}

exports.getAllCategories = function(req, res) {
	db.getAllCtegoriess(function(response){
		res.send(response);
	});
}

exports.importData = function(req, res) {
	db.importData(function(response){
		res.send(response);
	});
}

var bodyParser = require('body-parser');
var db = require('../mongo-db.js');
var util = require('util');

exports.getAll = function(page, pageSize, req, res) {
	db.getCas(page, pageSize, function(response){
		res.send(response);
	});
}

exports.get = function(id, req, res) {
	console.log(id);
	db.getCasById(id, function(response){
		res.send(response);
	});
}

exports.insert = function(req, res) {
	db.createCas(req.body, function(response){
		res.send(response);
	});
}

exports.update = function(id, req, res) {
	db.updateCas(id, function(response){
		res.send(response);
	});
}

exports.delete = function(id, req, res) {
	db.deleteCas(id, function(response){
		res.send(response);
	});
}
var bodyParser = require('body-parser');
var db = require('../mongo-db.js');
var util = require('util');

exports.getAll = function(page, pageSize, req, res) {
	db.getTemoignages(page, pageSize, function(response){
		res.send(response);
	});
}

exports.getCasTemoignages = function(idCas, page, pageSize, req, res) {
	db.getCasTemoignages(idCas,  page, pageSize, function(response){
		res.send(response);
	});
}

exports.get = function(id, req, res) {
	db.getTemoignageById(id, function(response){
		res.send(response);
	});
}
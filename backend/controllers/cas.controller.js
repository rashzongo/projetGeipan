var db = require('../mongo-db.js');

exports.getAll = function(page, pageSize, searchInput, category, zone, startDate, endDate, req, res) {
	db.getCas(page, pageSize, searchInput, category, zone, startDate, endDate, function(response){
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
	db.getAllCategories(function(response){
		res.send(response);
	});
}

exports.importData = function(req, res) {
	db.importData(function(response){
		res.send(response);
	});
}

var express = require('express');
var router = express.Router();
var casController = require('./controllers/cas.controller');
var temoignagesController = require('./controllers/temoignages.controller');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

//Index
router.get('/', function(req,res){
  res.sendFile(__dirname + '/public/index.html');
});

// Import Data
router.get('/importData', jsonParser, function(req, res, next) {
	casController.importData(req, res);
});

// Cas
router.get('/cas', jsonParser, function(req, res, next) {
	casController.getAll(parseInt(req.query.page) || 0, parseInt(req.query.pageSize) || 20, req, res);
});

router.get('/zones', jsonParser, function(req, res, next) {
	casController.getAllZones(req, res);
});

router.get('/categories', jsonParser, function(req, res, next) {
	casController.getAllCategories(req, res);
});

router.get('/cas/search', jsonParser, function(req, res, next) {
	casController.search(parseInt(req.query.page) || 0, parseInt(req.query.pageSize) || 20, null, null, null,null,  req, res);
	//page, pageSize, category, zone, startDate, endDate,
});

router.get('/cas/:id', jsonParser,  function(req, res, next) {
	casController.get(parseInt(req.params.id), req, res);
});

// Cas && Temoignages
router.get('/cas/:idCas/temoignages', jsonParser,  function(req, res, next) {
	temoignagesController.getCasTemoignages(parseInt(req.params.idCas), parseInt(req.query.page) || 0,
	parseInt(req.query.pageSize) || 20, req, res);
});


// Temoignages
router.get('/temoignages', jsonParser, function(req, res, next) {
	temoignagesController.getAll(parseInt(req.query.page) || 0, parseInt(req.query.pageSize) || 20, req, res);
});

router.get('/temoignage/:id', jsonParser,  function(req, res, next) {
	temoignagesController.get(parseInt(req.params.id), req, res);
});

module.exports = router;
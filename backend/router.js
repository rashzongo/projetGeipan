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

// Temoignages
router.get('/temoignages', jsonParser, temoignagesController.getAll);

router.post('/temoignages', jsonParser, function(req, res, next) {
	temoignagesController.insert(req, res);
});

router.get('/temoignages/:id', jsonParser,  function(req, res, next) {
	temoignagesController.get(id);
});

router.patch('/temoignages/:id', jsonParser,  function(req, res, next) {
	temoignagesController.get(id);
});

router.delete('/temoignages/:id', jsonParser,  function(req, res, next) {
	temoignagesController.get(id);
});


// Cas
router.get('/cas', jsonParser, temoignagesController.getAll);

router.post('/cas', jsonParser, function(req, res, next) {
	temoignagesController.insert(req, res);
});

router.get('/cas/:id', jsonParser,  function(req, res, next) {
	temoignagesController.get(id);
});

router.patch('/cas/:id', jsonParser,  function(req, res, next) {
	temoignagesController.get(id);
});

router.delete('/cas/:id', jsonParser,  function(req, res, next) {
	temoignagesController.get(id);
});

module.exports = router;
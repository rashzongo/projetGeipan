var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
const csvtojson = require("csvtojson");

// Database
const DB_URL = 'mongodb://localhost:27017'; 
const DB_NAME = 'projetGeipan';
const CAS_COLLECTION = 'cas';
const TEMOIGNAGES_COLLECTION = 'temoignages';
const CAS_ZONE_NOM = 'cas_zone_nom';
const CAS_CLASSIFICATION = 'cas_classification';
const CONNECTION_OPTIONS = {
	useNewUrlParser: true,
	useUnifiedTopology: true
};

exports.connexionMongo = function(callback) {
    MongoClient.connect(DB_URL, CONNECTION_OPTIONS, function(err, client) {
        var db = client.db(DB_NAME);
        assert.equal(null, err);
        callback(err, db);
    });
}

exports.countCas = function() {
    MongoClient.connect(DB_URL, CONNECTION_OPTIONS, function(err, client) {
        var db = client.db(DB_NAME);
        if(!err){
            db.collection(CAS_COLLECTION)
                .countDocuments()
                .then(rep => callback(rep));
        }
    });
}

exports.getCas = function(page, pageSize, callback) {
	find(CAS_COLLECTION, null, page, pageSize, callback);
};

exports.getCasById = function(id, callback) {
    findOne(CAS_COLLECTION, {id_cas: id}, callback);
}

exports.countCasTemoignages = function() {
    MongoClient.connect(DB_URL, CONNECTION_OPTIONS,function(err, client) {
        var db = client.db(DB_NAME);
        if(!err){
            db.collection(CAS_COLLECTION)
                .countDocuments()
                .then(rep => callback(rep));
        }
    });
}

exports.getCasTemoignages = function(idCas, page, pageSize, callback) {
	find(TEMOIGNAGES_COLLECTION, {id_cas: idCas}, page, pageSize, callback);
};

exports.getTemoignages = function(page, pageSize, callback) {
	find(TEMOIGNAGES_COLLECTION, null, page, pageSize, callback);
};

exports.getTemoignageById = function(id, callback) {
    findOne(TEMOIGNAGES_COLLECTION, {id_temoignage: id}, callback);
}

function find(collection, query, page, pageSize, callback) {
	MongoClient.connect(
		DB_URL,
		CONNECTION_OPTIONS,
		function(err, client) {
		var db = client.db(DB_NAME);
        if(!err){
			db.collection(collection)
			.find(query)
            .skip(page*pageSize)
            .limit(pageSize)
            .toArray()
            .then(arr => {
				callback(buildMessage(true, arr, null, ""));
			});
        }
        else{
            callback(-1);
        }
    });
}

function findOne(collection, query, callback) {
	MongoClient.connect(DB_URL,
		CONNECTION_OPTIONS,
		function(err, client) {
		var db = client.db(DB_NAME);
        if(!err) {
            db.collection(collection) 
            .findOne(query, function(err, data) {
            	let reponse;
                if(!err){
					reponse = buildMessage(true, data, null, "");
                } else{
					reponse = buildMessage(false, null, err, "Erreur lors du find");
                }
                callback(reponse);
            });
        } else {
			let reponse = buildMessage(false, null, err, "Erreur de connexion à la base");
            callback(reponse);
        }
    });
}

function buildMessage(status, data, message, error) {
	return {
		success: status,
		data: data,
		msg: message,
		err: error
	};
}

function getAllFieldValues(collection, fieldName, callback) {
	MongoClient.connect(
		DB_URL,
		CONNECTION_OPTIONS,
		function(err, client) {
		var db = client.db(DB_NAME);
        if(!err){
			db.collection(collection)
			.distinct(fieldName)
			.then(function(rep){
				callback(rep);
			})
        }
        else{
            callback(-1);
		}
	})
}

exports.getAllZones = function(callback) {
	getAllFieldValues(CAS_COLLECTION, CAS_ZONE_NOM, callback);
}

exports.getAllCtegoriess = function(callback) {
	getAllFieldValues(CAS_COLLECTION, CAS_CLASSIFICATION, callback);
}

exports.search = function(page, pageSize, category, zone, startDate, endDate, callback) {
	console.log('searching...');
	
	MongoClient.connect(
		DB_URL,
		CONNECTION_OPTIONS,
		function(err, client) {
		var db = client.db(DB_NAME);
		const startDate = new Date('10/10/2015');
		const endDate = new Date();
        if(!err){
			db.collection(CAS_COLLECTION)
			.aggregate(
				[
					{
						$addFields:{
							caseDate:{
								$dateFromParts : {
									'year':  "$cas_AAAA" ,
									'month': { $toInt:  "$cas_MM" },
									'day': { $toInt:  "$cas_JJ" },
								}
							}
						}
					}
				]
			)
            .toArray()
            .then(arr => {
				count(CAS_COLLECTION, function (response) {
					callback(buildMessage(true, arr, response, null, ""));
				});
			});
        }
        else{
            callback(-1);
        }
    });
}

exports.importData = async function(callback){
	await csvtojson({
		noheader: false,
		delimiter: ";"
	})
	.fromFile("./data/cas_pub.csv")
	.then(cas => {
		for(let i = 0; i < cas.length; i++) {
			const day = Number(cas[i].cas_JJ);
			const month = Number(cas[i].cas_MM);
			const year = Number(cas[i].cas_AAAA);
			cas[i].cas_date = new Date(`${cas[i].cas_JJ}/${cas[i].cas_MM}/${cas[i].cas_MM}`);
		}
		MongoClient.connect(
		DB_URL,
		CONNECTION_OPTIONS,
		(err, client) => {
			if (err) throw err;

			client
			.db(DB_NAME)
			.collection(CAS_COLLECTION)
			.insertMany(cas, (err, res) => {
				if (err) throw err;
				console.log(`Inserted: ${res.insertedCount} rows on collection cas`);
				client.close();
			});
		}
		);
	});

	await csvtojson({
		noheader: false,
		delimiter: ";"
	})
	.fromFile("./data/temoignages_pub.csv")
	.then(temoignages => {
		MongoClient.connect(
			DB_URL,
			{ useNewUrlParser: true, useUnifiedTopology: true },
			(err, client) => {
				if (err) throw err;

				client
				.db(DB_NAME)
				.collection(TEMOIGNAGES_COLLECTION)
				.insertMany(temoignages, (err, res) => {
					if (err) throw err;
					console.log(`Inserted: ${res.insertedCount} rows on collection temoignages`);
					client.close();
				});
			}
		);
	});

	callback(buildMessage(true, null, null, null));
}

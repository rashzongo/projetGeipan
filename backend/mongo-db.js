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

exports.getCas = function(page, pageSize, searchInput, category, zone, startDate, endDate, callback) {
	const query = {};
	if(searchInput){
		query.cas_nom_dossier = {'$regex' : `.*${searchInput}.*`};
	}
	if(startDate){
		query.cas_date = { $gte : new Date(startDate).toISOString()};
	}
	if(endDate){
		query.cas_date = { $lte : new Date(endDate).toISOString()};
	}
	if(category){
		query.cas_classification = category;
	}
	if(zone){
		query.cas_zone_nom = zone;
	}
	find(CAS_COLLECTION, query, page, pageSize, callback);
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

async function find(collection, query, page, pageSize, callback) {
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
				//Count Documents
				db.collection(collection)
				.find(query).count().then(
					total => {
						callback(buildMessage(true, arr, total, null));
					});
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
					reponse = buildMessage(true, data, data ? 1 : 0, "");
                } else{
					reponse = buildMessage(false, null, null, "Erreur lors du find : " +  err);
                }
                callback(reponse);
            });
        } else {
			let reponse = buildMessage(false, null, null, "Erreur de connexion à la base : " + err);
            callback(reponse);
        }
    });
}

function buildMessage(status, data, total, message) {
	return {
		success: status,
		data: data,
		total: total,
		msg: message
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

exports.getAllCategories = function(callback) {
	getAllFieldValues(CAS_COLLECTION, CAS_CLASSIFICATION, callback);
}

exports.importData = function(callback){
	let message= '';
	csvtojson({
		noheader: false,
		delimiter: ";"
	})
	.fromFile("./data/cas_pub.csv")
	.then(cas => {
		var date = new Date();
		for(let i = 0; i < cas.length; i++) {
			const day = Number(cas[i].cas_JJ) || 01;
			const month = formatNumber(cas[i].cas_MM) - 1 || 00;
			const year = formatNumber(cas[i].cas_AAAA);
			date = new Date(Date.UTC(year, month, day));
			cas[i].cas_date = date.toISOString();
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
				message = message + `Inserted: ${res.insertedCount} rows on collection cas`;
				
				csvtojson({
					noheader: false,
					delimiter: ";"
				})
				.fromFile("./data/temoignages_pub.csv")
				.then(temoignages => {
					client
					.db(DB_NAME)
					.collection(TEMOIGNAGES_COLLECTION)
					.insertMany(temoignages, (err, res) => {
						if (err) throw err;
						message = message + '\n' + `Inserted: ${res.insertedCount} rows on collection temoignages`;
						client.close();
						console.log(message);
						callback(buildMessage(true, null, 0, message));
					});
				});
			}
		);
	});
})
}

function formatNumber(date){
	return Number(date.replace('-', 0));
}

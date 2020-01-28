var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var assert = require('assert');

// Database
const DB_URL = 'mongodb://localhost:27017'; 
const DB_NAME = 'projetGeipan';
const CAS_COLLECTION = 'cas';
const TEMOIGNAGES_COLLECTION = 'temoignages';

exports.connexionMongo = function(callback) {
    MongoClient.connect(DB_URL, function(err, client) {
        var db = client.db(DB_NAME);
        assert.equal(null, err);
        callback(err, db);
    });
}

exports.countCas = function() {
    MongoClient.connect(DB_URL, function(err, client) {
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

exports.createCas = function(formData, callback) {
	MongoClient.connect(DB_URL, function(err, client) {
		var db = client.db(DB_NAME);

	    if(!err) {
	 
			let toInsert = {
				name : formData.nom, 
				cuisine : formData.cuisine
			};
			console.dir(JSON.stringify(toInsert));
		    db.collection(CAS_COLLECTION)
		    .insertOne(toInsert, function(err, result) {
		    	let reponse;

		        if(!err){
		            reponse = {
		                succes : true,
		                result: result,
		                error : null,
		                msg: "Ajout réussi " + result
		            };
		        } else {
		            reponse = {
		                succes : false,
		                error : err,
		                msg: "Problème à l'insertion"
		            };
		        }
		        callback(reponse);
		    });
		} else{
			let reponse = reponse = {
                    	succes: false,
                        error : err,
                        msg:"Problème lors de l'insertion, erreur de connexion."
                    };
            callback(reponse);
		}
	});
}

exports.updateCas = function(id, formData, callback) {

	MongoClient.connect(DB_URL, function(err, client) {
		var db = client.db(DB_NAME);

		if(!err) {
            let myquery = { "id_cas": ObjectId(id)};
	        let newvalues = {
	        	name : formData.nom, 
	        	cuisine : formData.cuisine
	        };


			db.collection(CAS_COLLECTION)
			.replaceOne(myquery, newvalues, function(err, result) {
	         	if(!err){
			    	reponse = {
		                succes : true,
		                result: result,
		                error : null,
		                msg: "Modification réussie " + result
		            };
			   	} else {
		            reponse = {
		                succes : false,
		                error : err,
		                msg: "Problème à la modification"
		            };
			    }
			    callback(reponse);
	        });
		} else{
			let reponse = reponse = {
                    	succes: false,
                        error : err,
                        msg:"Problème lors de la modification, erreur de connexion."
                    };
            callback(reponse);
		}
	});
}

exports.deleteCas = function(id, callback) {
	MongoClient.connect(DB_URL, function(err, client) {
		var db = client.db(DB_NAME);

		if(!err) {
            let myquery = { "id_cas": ObjectId(id)};
	        
			db.collection(CAS_COLLECTION)
			.deleteOne(myquery, function(err, result) {
	         	if(!err){
			    	reponse = {
		                succes : true,
		                result: result,
		                error : null,
		                msg: "Suppression réussie " + result
		            };
			   	} else {
		            reponse = {
		                succes : false,
		                error : err,
		                msg: "Problème à la suppression"
		            };
			    }
			    callback(reponse);
	        });
		} else{
			let reponse = reponse = {
                    	succes: false,
                        error : err,
                        msg:"Problème lors de la suppression, erreur de connexion."
                    };
            callback(reponse);
		}
	});
}

exports.countCasTemoignages = function() {
    MongoClient.connect(DB_URL, function(err, client) {
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
	console.log(page);
	console.log(pageSize);
	MongoClient.connect(
		DB_URL,
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
	MongoClient.connect(DB_URL, function(err, client) {
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

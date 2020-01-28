var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var assert = require('assert');

var tempColl = 'temperature'
var lightColl = 'light'

// Datatbase URL
const dbUrl = 'mongodb://localhost:27017'; 

// Database Name
const dbName = 'capteurs';

exports.connexionMongo = function(callback) {
    MongoClient.connect(url, function(err, client) {
        var db = client.db(dbName);
        assert.equal(null, err);
        callback(err, db);
    });
}

exports.countLights = function(callback) {
    countCapteursInCollection(lightColl, callback);
}

exports.countRadiators = function(callback) {
    countCapteursInCollection(tempColl, callback);
}

exports.getAllLights = function(callback) {
    getAllData(lightColl, callback);
}

exports.getAllTemperatures = function(callback) {
    getAllData(tempColl, callback);
}

exports.setLightValue = function (formData, callback) {
	setPowerValue(lightColl, formData, callback);
}

exports.setRadiatorValue = function (formData, callback) {
	setPowerValue(tempColl, formData, callback);
}

exports.registerLight = function(formData, callback) {
	registerData(lightColl, formData, callback);
}

exports.registerTemperature = function(formData, callback) {
	//console.log("donnee recue" + JSON.stringify(formData));
	registerData(tempColl, formData, callback);
}

exports.getLightValues = function (mac_add, callback) {
    getCapteurValues(lightColl, mac_add, callback);
}

exports.getTemperatureValues = function (mac_add, callback) {
    getCapteurValues(tempColl, mac_add, callback);
}


function countCapteursInCollection(collection, callback) {
    MongoClient.connect(dbUrl, function(err, client) {
        var db = client.db(dbName);
        if(!err){
            db.collection(lightColl)
                    .countDocuments()
                    .then(rep => callback(rep));
        }
    });
}

function registerData(coll, formData, callback) {
    //console.log("*****" + JSON.stringify(formData));
	MongoClient.connect(dbUrl, function(err, client) {
        var db = client.db(dbName);
        if(!err) {
            let myQuery = { "mac_add": formData.mac_add };
            db.collection(coll).findOne(myQuery, function(err, data) {
                if(data != null) {
                    addDataInCollection(coll, formData, callback);
                } 
                else {
    				addNewObjectInCollection(coll, formData, callback);
                }
            });
        } else {
            let reponse = {
                "succes": false,
                "data": null,
                "error": err,
                "msg": "erreur de connexion à la base"
            };
            callback(reponse);
        }
    });
}

function addDataInCollection(coll, formData, callback){
	MongoClient.connect(dbUrl, function(err, client) {
        var db = client.db(dbName);
		if(!err) {
			let power;
			//console.log(formData.powered);
			if(parseFloat(formData.powered) == 0 || formData.powered == 0){
				power = false;
			}
			else {
				power = true;
			}
	        let mac_add = formData.mac_add;
	        let myQuery = { "mac_add": mac_add };
	        let newvalue = { date : new Date(), value : parseFloat(formData.value), powered : power};
	        
	        if(!err) {
	            db.collection(coll)
	            .update(myQuery, { $push: {"data": newvalue}}).then(
	                function (err, updated) {
	                    reponse = {
			                "succes" : true,
			                "data" : updated,
			                "error" : null,
			                "msg": "Ajout réussi"
		            	};
		            	callback(reponse);
	                });
	        } 
	        else {
	            let reponse = {
	                "succes": false,
                	"data": null,
	                "error" : err,
	                "msg":"Problème lors de l'enregistrement, erreur de connexion."
	            };
	            callback(reponse);
	        }
    	}
    	else {
    		let reponse = reponse = {
                "succes": false,
                "data": null,
                "error" : err,
                "msg":"Problème lors de la connexion à la DB"
            };
            callback(reponse);
    	}
    });
}

function addNewObjectInCollection(coll, formData, callback){
	MongoClient.connect(dbUrl, function(err, client) {
		var db = client.db(dbName);
	    if(!err) {
	    	let power;
            if(parseFloat(formData.powered) == 0 || formData.powered == 0){
				power = false;
			}
			else {
				power = true;
			}
			let toInsert = {
				mac_add : formData.mac_add, 
				powered : power,
				data : [
					{ date : new Date(), value : parseFloat(formData.value), powered : power},
				]
			};
			//console.log(JSON.stringify(toInsert));
		    db.collection(coll)
		    .insertOne(toInsert, function(err, inserted) {
		        if(!err){
		            let reponse = {
		                "succes" : true,
		                "data" : inserted,
		                "error" : null,
		                "msg": "Ajout réussi"
		            };
		    		callback(reponse);
		        } 
		        else {
		            let reponse = {
		                "succes" : false,
                		"data": null,
		                "error" : err,
		                "msg" : "Problème à l'insertion"
		            };
		    		callback(reponse);
		        }
		    });
		}
		else {
			let reponse = reponse = {
				"succes": false,
                "data": null,
				"error" : err,
				"msg":"Problème lors de l'insertion, erreur de connexion."
			};
            callback(reponse);
		}
	});
}

function getCapteurValues(coll, mac_add, callback) {
    MongoClient.connect(dbUrl, function(err, client) {
        var db = client.db(dbName);
        if(!err) {
            // La requete mongoDB
            let myQuery = { "mac_add": mac_add };
            db.collection(coll).findOne(myQuery, function(err, data) {
                let reponse;
                if(!err) {
                    reponse = {
                    	"succes": true,
                        "data" : data,
                        "error" : null,
                        "msg":"Données de capteurs envoyées"
                    };
                } 
                else {
                    reponse = {
                    	"succes": false,
                        "data": null,
                        "error": err,
                        "msg": "erreur lors du find"
                    };
                }
                //console.log(reponse);
                callback(reponse);
            });
        } else {
            let reponse = {
                "succes": false,
                "data": null,
                "error": err,
                "msg": "erreur de connexion à la base"
            };
            callback(reponse);
        }
    });
}

function setPowerValue(coll, formData, callback) {
	MongoClient.connect(dbUrl, function(err, client) {
        var db = client.db(dbName);
		if(!err) {
	        let mac_add = formData.mac_add;
	        let myQuery = { "mac_add": mac_add };
	        
	        if(!err) {
	            db.collection(coll)
	            .update(myQuery, { $set: {"powered": formData.powered}}).then(
	                function (err, updated) {
	                    reponse = {
			                "succes" : true,
			                "data" : updated,
			                "error" : null,
			                "msg": "Modification réussie"
		            	};
		            	callback(reponse);
	                });
	        } 
	        else {
	            let reponse = {
	                "succes": false,
                	"data": null,
	                "error" : err,
	                "msg":"Problème lors de la modification"
	            };
	            callback(reponse);
	        }
    	}
    	else {
    		let reponse = reponse = {
                "succes": false,
                "data": null,
                "error" : err,
                "msg":"Problème lors de la connexion à la DB"
            };
            callback(reponse);
    	}
    });
}

function getAllData(coll, callback) {
	MongoClient.connect(dbUrl, function(err, client) {
        var db = client.db(dbName);
        if(!err) {
            // La requete mongoDB
            let myQuery = { };
            db.collection(coll).find({}).toArray(function(err, data) {
                let reponse;
                if(!err) {
                    reponse = {
                    	"succes": true,
                        "data" : data,
                        "error" : null,
                        "msg":"Données de capteurs envoyées"
                    };
                } 
                else {
                    reponse = {
                    	"succes": false,
                        "data": null,
                        "error": err,
                        "msg": "erreur lors du find"
                    };
                }
                callback(reponse);
            });
        } else {
            let reponse = {
                "succes": false,
                "data": null,
                "error": err,
                "msg": "erreur de connexion à la base"
            };
            callback(reponse);
        }
    });
}

const express  = require('express');
const app      = express();
const port     = process.env.PORT || 1234;
const server   = require('http').Server(app);
const mongodb = require("mongodb").MongoClient;
const csvtojson = require("csvtojson");
const url = "mongodb://localhost:27017/";
const bodyParser = require('body-parser');
var multer = require('multer');
var multerData = multer();

// Support Cross domain
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
    next();
});

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

server.listen(port);

// Main client page 
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});


// First off all, we need to recive the csv files "cas" and "temoignages" and parse it to json
// Before insert in in db
console.log("Serveur lancé sur le port : " + port);

const dbName = "projetGeipan";

csvtojson()
  .fromFile("C:/Users/diazg/Desktop/Files/Cours/MIAGE/M2/JS/cas_pub.csv")
  .then(cas => {

    mongodb.connect(
      url,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err, client) => {
        if (err) throw err;

        client
          .db(dbName)
          .collection("cas")
          .insertMany(cas, (err, res) => {
            if (err) throw err;

            console.log(`Inserted: ${res.insertedCount} rows on collection cas`);
            client.close();
          });
      }
    );
  });

csvtojson()
  .fromFile("C:/Users/diazg/Desktop/Files/Cours/MIAGE/M2/JS/temoignages_pub.csv")
  .then(temoignages => {

    mongodb.connect(
      url,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err, client) => {
        if (err) throw err;

        client
          .db(dbName)
          .collection("temoignages")
          .insertMany(temoignages, (err, res) => {
            if (err) throw err;

            console.log(`Inserted: ${res.insertedCount} rows on collection temoignages`);
            client.close();
          });
      }
    );
  });

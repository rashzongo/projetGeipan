const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var router = require('./router');
var db = require('./mongo-db');
var path = require("path");
const port = 1234;
const server   = require('http').Server(app);
const csvtojson = require("csvtojson");
const url = "mongodb://localhost:27017/"; 
var multer = require('multer');
var multerData = multer();
const mongodb = require("mongodb").MongoClient;


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	  res.header("Access-Control-Allow-Methods", "POST, GET, PATCH, OPTIONS, PUT, DELETE");
    next();
});

app.use(router);

server.listen(port, function () {
  console.log('Application listening on localhost' + ':' + port);
});

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
  })
const firebase = require('firebase-admin');
const admin = firebase;
//var serviceAccountFirebase = require("./../firebaseConfig/");
//var serviceAccountSpreadsheets = require("./eminent-card-305915-6ee5bf0aa41d.json");
//const { REPORT_KEYS, insertReportsInSpreadsheet} = require("./SpreadsheetUtil")
// const fsTs = admin.firestore.Timestamp;
//const last24 = fsTs.now()._seconds - (3600 * 240);
const oneDayInSec = 3600 * 24;

let reports = [];
let emptydata = 0;
  

firebase.initializeApp({
    //credential: firebase.credential.cert(serviceAccountFirebase),
    //databaseURL: "https://holy-owly-v3.firebaseio.com"
    //databaseURL: "http://localhost:8080"
});

const db = firebase.firestore();


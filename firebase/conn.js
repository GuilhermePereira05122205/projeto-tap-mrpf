var admin = require("firebase-admin");

var serviceAccount = require("./auth.json");

const DB = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = DB
var conn = require("./conn")
var admin = require("firebase-admin")


const db = admin.firestore(conn)

module.exports = db
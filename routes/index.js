var express = require('express');
var router = express.Router();
var authenticate = require("../auth/authenticate")

/* GET home page. */
router.get('/', authenticate,function(req, res, next) {
  res.view("home")
});

module.exports = router;
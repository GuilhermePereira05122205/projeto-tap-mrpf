var express = require('express');
const db = require('../firebase/firestore');
var router = express.Router();
var validator = require("../validator/validator");
const { body } = require('express-validator');
const bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/login', function (req, res, next) {
  res.view("login/Login");
});

router.post('/login', validator([
  body("email", "email invalido").notEmpty().isEmail(),
  body("password", "senha invalida").notEmpty()
]), function (req, res, next) {
  db.collection("advogados").where("email", "==", req.body.email).limit(1).get()
    .then((user) => {

      if (user.docs.length == 0) {
        res.render("error", {
          message: "Usuario nao encontrado"
        })
        return
      }

      let loginUser = user.docs[0]

      bcrypt.compare(req.body.password, loginUser.data().password).then((value) => {
        if (value) {
          req.session.user = {
            id: loginUser.id,
            email: loginUser.data().email
          }
          res.redirect("/users/" + loginUser.id + "/servicos")
        } else {
          res.redirect("/users/login")
        }
      })

    }).catch((error) => {
      res.render("error", {
        message: error
      })
    })
});

router.get('/register', function (req, res, next) {
  res.view("login/cadastrar_login");
});

router.post('/register', validator([
  body("email", "email invalido").notEmpty().isEmail(),
  body("password", "senha invalida").notEmpty()
]), function (req, res, next) {


  db.collection("advogados")
    .where("email", "==", req.body.email)
    .get().then((data) => {

      if (data.docs.length == 0) {

        bcrypt.hash(req.body.password, 5).then((password) => {
          db.collection("advogados").add({
            email: req.body.email,
            password: password
          }).then((user) => {
            res.redirect("/users/login")
          }).catch((error) => {
            res.render("error", {
              message: error
            })
          })
        })
        
      } else {
        res.render("error", {
          message: "usuario já cadastrado"
        })
      }


    }).catch((error) => {
      res.render("error", {
        message: error
      })
    })


});

module.exports = router;

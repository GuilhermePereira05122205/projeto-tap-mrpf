var express = require('express');
const db = require('../firebase/firestore');
var router = express.Router();
var authenticate = require("../auth/authenticate")
var mapResult = require("../mapper/mapResult");
const { body } = require('express-validator');
var validator = require("../validator/validator")


router.get('/', authenticate, function (req, res, next) {

  db.collection("advogados")
    .doc(req.session.user.id)
    .collection("servicos")
    .get()
    .then((servicos) => {
      res.view("services/listar_service", {
        servicos: mapResult(servicos.docs)
      })
    }).catch((error) => {
      res.render("error", {
        message: error
      })
    })

});

router.get("/cadastrar", authenticate, function (req, res, next) {
  res.view("services/CadastrarServico")
})

router.post('/', authenticate,
  validator([
    body("nome", "Nome invalido").notEmpty(),
    body("email", "email invalido").notEmpty().isEmail(),
    body("cpf", "CPF invalido").notEmpty(),
    body("telefone_movel", "Telefone invalido").notEmpty(),
    body("endereco", "Endereco invalido").notEmpty(),
    body("tipo_servico", "Tipo invalido").notEmpty(),
    body("descricao", "descricao invalido").notEmpty()
  ]), function (req, res, next) {
    db.collection("advogados")
      .doc(req.session.user.id)
      .collection("servicos")
      .add({
        nome: req.body.nome,
        cpf: req.body.cpf,
        telefone_movel: req.body.telefone_movel,
        email: req.body.email,
        endereco: req.body.endereco,
        tipo_servico: req.body.tipo_servico,
        descricao: req.body.descricao,
      }).then((servico) => {
        res.redirect("/users/" + req.session.user.id + "/servicos")
      }).catch((error) => {
        res.render("error", {
          message: error
        })
      })

  });

router.get('/:idServico', authenticate, function (req, res, next) {

  db.collection("advogados")
    .doc(req.session.user.id)
    .collection("servicos")
    .doc(req.params.idServico)
    .get()
    .then((servico) => {
      if (servico.exists) {

        res.view("services/VisualizarEditar", {
          servico: mapResult(servico)
        })

      } else {
        res.render("error", {
          message: "servico não encontrado"
        })
      }

    }).catch((error) => {
      res.render("error", {
        message: error
      })
    })

});

router.post("/:idServico", authenticate,
  validator([
    body("nome", "Nome invalido").notEmpty(),
    body("email", "email invalido").notEmpty().isEmail(),
    body("cpf", "CPF invalido").notEmpty(),
    body("telefone_movel", "Telefone invalido").notEmpty(),
    body("endereco", "Endereco invalido").notEmpty(),
    body("tipo_servico", "Tipo invalido").notEmpty(),
    body("descricao", "descricao invalido").notEmpty()
  ]), function (req, res, next) {
    db.collection("advogados")
      .doc(req.session.user.id)
      .collection("servicos")
      .doc(req.params.idServico)
      .get().then((servico) => {
        if (servico.exists) {

          let serviceUpdate = servico.ref

          serviceUpdate.update({
            nome: req.body.nome,
            cpf: req.body.cpf,
            telefone_movel: req.body.telefone_movel,
            email: req.body.email,
            endereco: req.body.endereco,
            tipo_servico: req.body.tipo_servico,
            descricao: req.body.descricao,
          }).then(() => {
            res.redirect("/users/" + req.session.user.id + "/servicos")
          }).catch((error) => {
            res.render("error", {
              message: error
            })
          })

        } else {
          res.render("error", {
            message: "Servico não encontrado"
          })
        }
      }).catch((error) => {
        res.render("error", {
          message: error
        })
      })
  })

router.get('/delete/:idServico', authenticate, function (req, res, next) {

  db.collection("advogados")
    .doc(req.session.user.id)
    .collection("servicos")
    .doc(req.params.idServico)
    .get()
    .then((servico) => {
      if (servico.exists) {
        let serviceDelete = servico.ref
        serviceDelete.delete().then(() => {
          res.redirect("/users/" + req.session.user.id + "/servicos")
        }).catch((error) => {
          res.render("error", {
            message: error
          })
        })
      } else {
        res.render("error", {
          message: "servico nao encontrado"
        })
      }

    }).catch((error) => {
      res.render("error", {
        message: error
      })
    })

});

module.exports = router;

var express = require("express");
var router = express.Router();
require("../models/connection");

const User = require("../models/user");
const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

// Cette route permet à un utilisateur de s'inscrire sur la plateforme en fournissant l'email et le mot de passe
router.post("/signup", (req, res) => {
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "informations manquantes" });
    return;
  }
  console.log(req.body);
  // Vérifier si l'utilisateur n'a pas déjà été enregistré
  User.findOne({ email: req.body.email }).then((data) => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);
      const newUser = new User({
        email: req.body.email,
        password: hash,
        token: uid2(32),
        nom: null,
        prenom: null,
        tel: null,
      });

      newUser.save().then(() => {
        res.json({ result: true });
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: "l'utilisateur existe déja" });
    }
  });
});

// Cette route permet à un utilisateur de s'inscrire sur la plateforme en fournissant l'email et le mot de passe
router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "informations manquantes" });
    return;
  }
  //Cette route permet à un utilisateur de s'authentifier en vérifiant son adresse e-mail et son mot de passe avec ceux stockés dans la bdd. 
  User.findOne({ email: req.body.email }).then((data) => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token });
    } else {
      res.json({
        result: false,
        error: "l'utilisteur n'existe ou le mot de passe est erroné",
      });
    }
  });
});

// Cette route permet de mettre à jour le profil utilisateur en fonction de l'ID spécifié.
router.post("/:id/profile", (req, res) => {
  User.updateOne(
    {
      _id: req.params.id,
    },
    { $set: req.body }
  ).then((data) => {
    res.json({ result: true, result: data });
  });
});

// supression de compte utilisateur
router.delete("/:id", (req, res) => {
  User.deleteOne({
    _id: req.params.id,
  }).then((deletedDoc) => {
    if (deletedDoc.deletedCount > 0) {
      res.json({ result: true });
    } else {
      res.json({ result: false, error: "User not found" });
    }
  });
});

router.post("/:parentId/enfants", (req, res) => {
  User.updateOne({
    _id: req.params.parentId
  }, { $push: { enfants: req.body } }).then((updatedDoc) => {
    if (updatedDoc.modifiedCount > 0) {
      res.json({ result: true });
    } else {
      res.status(500).json({ result: false, error: "Error adding enfant" });
    }
  });
});

router.delete("/:parentId/enfants/:enfantId", (req, res) => {
  User.updateOne(
    {
      _id: req.params.parentId,
    },
    { $pull: { enfants: { _id: req.params.enfantId } } }
  ).then((deletedDoc) => {
    if (deletedDoc.matchedCount > 0) {
      res.json({ result: true, result: deletedDoc });
    } else {
      res.status(500).json({ result: false, error: "Error deleting enfant" });
    }
  });
});

router.put("/:parentId/enfants/:enfantId", (req, res) => {
  const parent = User.findById(req.params.parentId)
                    .then((data) => {
                      const enfant = data.enfants.id(req.params.enfantId);
                      enfant.prenom = req.body.prenom;
                      enfant.etablissement = req.body.etablissement;

                      enfant.save().then(savedEnfant => res.json({ result: true, result: data }))
                                  .catch(error => res.json({ result: false, result: error }));
                    }).catch(error => {
                      res.status(500).json({ result: false, result: error });
                    });
});

module.exports = router;

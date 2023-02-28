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
router.put("/:parentId", (req, res) => {
  User.updateOne(
    {
      _id: req.params.parentId,
    },
    { $set: req.body }
  ).then((data) => {
    res.json({ result: true, result: data });
  });
});

// supression de compte utilisateur
router.delete("/:parentId", (req, res) => {
  User.deleteOne({
    _id: req.params.parentId,
  }).then((deletedDoc) => {
    if (deletedDoc.deletedCount > 0) {
      res.json({ result: true });
    } else {
      res.json({ result: false, error: "User not found" });
    }
  });
});

// Ajouter un enfant
router.post("/addEnfant/:parentId", (req, res) => {
  User.updateOne(
    {
      _id: req.params.parentId,
    },
    { $push: { enfants: req.body } }
  ).then((updatedDoc) => {
    if (updatedDoc.modifiedCount > 0) {
      res.json({ result: true });
    } else {
      res.status(500).json({ result: false, error: "Error adding enfant" });
    }
  });
});

router.delete("/removeEnfant/:parentId/:enfantId", (req, res) => {
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

// Modifier le prénom de l'enfant d'un parent
router.put("/updatePrenomEnfant/:parentId/:enfantId", (req, res) => {
  User.updateOne(
    { _id: req.params.parentId, "enfants._id": req.params.enfantId },
    { $set: { "enfants.$.prenom": req.body.prenom } }
  )
    .then(() => res.json({ result: true }))
    .catch((error) => {
      res.status(500).json({ result: false, result: error });
    });
});

// Modifier l'établissement de l'enfant d'un parent
router.put("/updateEtablissementEnfant/:parentId/:enfantId", (req, res) => {
  User.updateOne(
    { _id: req.params.parentId, "enfants._id": req.params.enfantId },
    { $set: { "enfants.$.etablissement": req.body.etablissement } }
  )
    .then(() => res.json({ result: true }))
    .catch((error) => {
      res.status(500).json({ result: false, result: error });
    });
});

router.post("/addHistorique/:parentId", (req, res) => {
  User.updateOne(
    {
      _id: req.params.parentId,
    },
    { $push: { historique: req.body } }
  ).then((updatedDoc) => {
    if (updatedDoc.modifiedCount > 0) {
      res.json({ result: true });
    } else {
      res.status(500).json({ result: false, error: "Error adding historique" });
    }
  });
});

router.delete("/removeHistorique/:parentId/:historiqueId", (req, res) => {
  User.updateOne(
    {
      _id: req.params.parentId,
    },
    { $pull: { historique: { _id: req.params.historiqueId } } }
  ).then((deletedDoc) => {
    if (deletedDoc.matchedCount > 0) {
      res.json({ result: true, result: deletedDoc });
    } else {
      res
        .status(500)
        .json({ result: false, error: "Error deleting historique" });
    }
  });
});

module.exports = router;

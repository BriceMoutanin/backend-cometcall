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
        photoURI: null,
        enfants: [],
        historiques: [],
      });

      newUser.save().then(() => {
        res.json({ result: true, newUser: newUser });
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
    if (data) {
      if (bcrypt.compareSync(req.body.password, data.password)) {
        res.json({ result: true, user: data });
      } else {
        res.json({
          result: false,
          error: "le mot de passe ou l'adresse mail ne correspond pas",
          code: 1,
        });
      }
    } else {
      res.json({
        result: false,
        error: "l'utilisteur n'existe pas",
        code: 0,
      });
    }
  });
});

// Cette route permet de mettre à jour le profil utilisateur en fonction de l'ID spécifié.
//Cette route n'est pas utilisée
router.put("/updateParentByID/:parentId", (req, res) => {
  User.updateOne(
    {
      _id: req.params.parentId,
    },
    { $set: req.body }
  ).then((data) => {
    res.json({ result: true, result: data });
  });
});

// Cette route permet de mettre à jour le profil utilisateur en fonction de l'ID spécifié.
router.put("/updateParentByToken/:parentToken", (req, res) => {
  User.updateOne(
    {
      token: req.params.parentToken,
    },
    { $set: req.body }
  ).then((data) => {
    res.json({ result: true, result: data });
  });
});

// Cette route permet de mettre à jour le profil utilisateur en fonction de l'ID spécifié.
router.put("/updatePasswordByToken/:parentToken", (req, res) => {
  const newHash = bcrypt.hashSync(req.body.password, 10);
  User.findOne({ token: req.params.parentToken }).then((data) => {
    if (data) {
      if (bcrypt.compareSync(req.body.currentPassword, data.password)) {
        User.updateOne(
          {
            token: req.params.parentToken,
          },
          { password: newHash }
        ).then((data) => {
          res.json({ result: true });
        });
      } else {
        res.json({
          result: false,
          error: "le mot de passe ou l'adresse mail ne correspond pas",
          code: 1,
        });
      }
    } else {
      res.json({
        result: false,
        error: "l'utilisteur n'existe pas",
        code: 0,
      });
    }
  });
});

// suppression de compte utilisateur
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

// Obtenir les enfants
router.get("/getEnfants/:parentToken", (req, res) => {
  User.findOne({ token: req.params.parentToken }).then((parent) => {
    if (parent) {
      res.json({
        result: true,
        enfants: parent.enfants,
      });
    } else {
      res.status(500).json({ result: false, error: "Parent not found" });
    }
  });
});

// Ajouter un enfant
router.post("/addEnfant/:parentToken", (req, res) => {
  User.updateOne(
    {
      token: req.params.parentToken,
    },
    {
      $push: {
        enfants: {
          prenom: req.body.prenom,
          etablissement: req.body.etablissement,
          photoURI: req.body.photoURI,
        },
      },
    }
  ).then((updatedDoc) => {
    User.findOne({ token: req.params.parentToken }).then((parent) => {
      res.json({
        result: true,
        newEnfant: parent.enfants[parent.enfants.length - 1],
      });
    });
    // User.find({ token: req.params.parentToken }).then((parent) => {
    //   if (updatedDoc.modifiedCount > 0) {
    //     res.json({
    //       result: true,
    //       newEnfant: parent.enfants[parent.enfants.length - 1],
    //     });
    //   } else {
    //     res.status(500).json({ result: false, error: "Error adding enfant" });
    //   }
    // });
  });
});

router.delete("/removeEnfant/:parentToken/:enfantId", (req, res) => {
  User.updateOne(
    {
      token: req.params.parentToken,
    },
    { $pull: { enfants: { _id: req.params.enfantId } } }
  ).then((deletedDoc) => {
    res.json({ result: true });
  });
});

// Modifier le prénom de l'enfant d'un parent
router.put("/updatePrenomEnfant/:parentToken/:enfantId", (req, res) => {
  User.updateOne(
    { token: req.params.parentToken, "enfants._id": req.params.enfantId },
    { $set: { "enfants.$.prenom": req.body.prenom } }
  )
    .then(() => res.json({ result: true }))
    .catch((error) => {
      res.status(500).json({ result: false, result: error });
    });
});

// Modifier l'établissement de l'enfant d'un parent
router.put("/updateEtablissementEnfant/:parentToken/:enfantId", (req, res) => {
  User.updateOne(
    { token: req.params.parentToken, "enfants._id": req.params.enfantId },
    { $set: { "enfants.$.etablissement": req.body.etablissement } }
  )
    .then(() => res.json({ result: true }))
    .catch((error) => {
      res.status(500).json({ result: false, result: error });
    });
});

// Modifier la photo de l'enfant d'un parent
router.put("/updatePhotoEnfant/:parentToken/:enfantId", (req, res) => {
  User.updateOne(
    { token: req.params.parentToken, "enfants._id": req.params.enfantId },
    { $set: { "enfants.$.photoURI": req.body.photoURI } }
  )
    .then(() => res.json({ result: true }))
    .catch((error) => {
      res.status(500).json({ result: false, result: error });
    });
});

// A tester dans le frontend
router.post("/addHistorique/:parentToken", (req, res) => {
  User.updateOne(
    {
      token: req.params.parentToken,
    },
    { $push: { historiques: req.body } }
  ).then((updatedDoc) => {
    if (updatedDoc) {
      User.findOne({
        token: req.params.parentToken,
      }).then((data) => {
        const hist = data.historiques[data.historiques.length - 1];
        res.json({ result: true, historique: hist });
      });
    } else {
      res.status(500).json({ result: false, error: "Error adding historique" });
    }
  });
});

// A tester dans le frontend
router.delete("/removeHistorique/:parentToken/:historiqueId", (req, res) => {
  User.updateOne(
    {
      token: req.params.parentToken,
    },
    { $pull: { historiques: { _id: req.params.historiqueId } } }
  ).then((deletedDoc) => {
    if (deletedDoc) {
      res.json({ result: true, result: deletedDoc });
    } else {
      res
        .status(500)
        .json({ result: false, error: "Error deleting historique" });
    }
  });
});

router.get("/getHistorique/:parentToken", (req, res) => {
  User.findOne({ token: req.params.parentToken }).then((data) => {
    if (data) {
      res.json({ result: true, historiques: data.historiques });
    } else {
      res.json({ result: false, error: "Utilisateur non trouvé" });
    }
  });
});

module.exports = router;

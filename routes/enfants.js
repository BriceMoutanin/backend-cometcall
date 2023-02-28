var express = require("express");
var router = express.Router();
require("../models/connection");


// La route POST permet d'ajouter un enfant à un parent spécifique.

router.post("/:parentId/enfants", (req, res) => {
    User.updateOne({
      _id: req.params.parentId
    }, { $push: { enfants: req.body } }).then((deletedDoc) => {
      if (deletedDoc.deletedCount > 0) {
        res.json({ result: true });
      } else {
        res.json({ result: false, error: "User not found" });
      }
    });
});

// La route DELETE permet de supprimer un enfant d'un parent spécifique.

router.delete("/:parentId/enfants/:enfantId", (req, res) => {
  User.updateOne(
    {
      _id: req.params.parentId,
    },
    { $pull: { enfants: { _id: req.params.enfantId } } }
  ).then((data) => {
    res.json({ result: true, result: data });
  });
});

// La route PUT permet de mettre à jour les informations d'un enfant d'un parent spécifique.

router.put("/:parentId/enfants/:enfantId", (req, res) => {
  const parent = User.findById(req.params.parentId)
                    .then((data) => {
                      const enfant = data.enfants.id(req.params.enfantId);
                      enfant.prenom = req.body.prenom;
                      enfant.etablissement = req.body.etablissement;

                      enfant.save().then(savedEnfant => res.json({ result: true, result: data }))
                                   .catch(error => res.json({ result: false, result: error }));
                    }).catch(error => {
                      res.json({ result: false, result: error });
                    });
});

module.exports = router;
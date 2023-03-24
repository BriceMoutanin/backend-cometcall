var express = require("express");
var router = express.Router();
const Problematique = require("../models/problematique");
const fetch = require("node-fetch");

router.get("/", (req, res) => {
  Problematique.find().then((data) => {
    res.json({ result: true, problematiques: data });
  });
});

router.get("/:problematiqueId", (req, res) => {
  Problematique.findById(req.params.problematiqueId).then((data) => {
    if (data) {
      res.json({ result: true, problematiques: data });
    } else {
      res.json({ result: false, error: "Problematique not found" });
    }
  });
});

// Route à tester dans le frontend
// Route non utilisée pour le moment (pourra servir éventuellement si on veut ajouter une problématique depuis le frontend)
router.post("/", (req, res) => {
  const newProb = new Problematique({
    titre: req.body.titre,
    description: req.body.description,
    typeEtablissement: req.body.typeEtablissement,
    organismes: req.body.organismes,
  });
  newProb.save().then(() => {
    res.json({ result: true });
  });
});

module.exports = router;

var express = require("express");
var router = express.Router();

const fetch = require("node-fetch");
const TypeOrganisme = require("../models/typeOrganisme");

const EDUC_API_KEY = process.env.EDUC_API_KEY;

router.get("/organismes", (req, res) => {
  fetch(
    `https://www.data.gouv.fr/fr/datasets/annuaire-de-leducation=${EDUC_API_KEY}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "ok") {
        res.json({ organismes: data.organismes });
      } else {
        res.json({ organismes: [] });
      }
    });
});

router.get("/", (req, res) => {
  TypeOrganisme.find().then((data) => {
    res.json({ result: true, typesOrganisme: data });
  });
});

router.post("/", (req, res) => {
  const newTypeOrganisme = new TypeOrganisme({
    nom: req.body.nomTypeOrganisme,
  });
  newTypeOrganisme.save().then(() => {
    res.json({ result: true });
  });
});

module.exports = router;

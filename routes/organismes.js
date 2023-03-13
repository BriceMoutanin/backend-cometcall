var express = require("express");
var router = express.Router();

const fetch = require("node-fetch");

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

module.exports = router;

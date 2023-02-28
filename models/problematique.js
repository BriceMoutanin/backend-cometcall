const mongoose = require("mongoose");

const problematiqueSchema = mongoose.Schema({
  titre: String,
  description: String,
  typeEtablissement: String,
  organismes: { type: mongoose.Schema.Types.ObjectId, ref: "TypeOrganisme" },
});

const Problematique = mongoose.model("Problematique", problematiqueSchema);

module.exports = Problematique;

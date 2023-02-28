const mongoose = require("mongoose");

const problematiqueSchema = mongoose.Schema({
  titre: String,
  description: String,
  typeEtablissement: String,
  organismes: { type: mongoose.Schema.Types.ObjectId, ref: "typesOrganisme" },
});

const Problematique = mongoose.model("problematiques", problematiqueSchema);

module.exports = Problematique;

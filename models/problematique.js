const mongoose = require("mongoose");

const problematiqueSchema = mongoose.Schema({
  titre: String,
  description: String,
  typeEtablissement: String,
  organismes: [String],
});

const Problematique = mongoose.model("problematiques", problematiqueSchema);

module.exports = Problematique;

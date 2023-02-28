const mongoose = require("mongoose");

const etablissementSchema = mongoose.Schema({
  type: String,
  nom: String,
});

const enfantSchema = mongoose.Schema({
  prenom: String,
  etablissement: etablissementSchema,
});

const typeOrganismeSchema = mongoose.Schema({
  nom: String,
});

const problematiqueSchema = mongoose.Schema({
  titre: String,
  description: String,
  typeEtablissement: String,
  organismes: typeOrganismeSchema,
});

const historiqueSchema = mongoose.Schema({
  problematique: problematiqueSchema,
  enfant: enfantSchema,
  date: Date,
});

const userSchema = mongoose.Schema({
  nom: String,
  prenom: String,
  password: String,
  token: String,
  email: String,
  tel: String,
  
  enfants: [enfantSchema],
  historiques: [historiqueSchema],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
const mongoose = require("mongoose");

const etablissementSchema = mongoose.Schema({
  type: String,
  nom: String,
  IDAPI: String,
});

const enfantSchema = mongoose.Schema({
  prenom: String,
  photoURI: String,
  etablissement: etablissementSchema,
});

const historiqueSchema = mongoose.Schema({
  problematique: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "problematiques",
  },
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
  photoURI: String,
  enfants: [enfantSchema],
  historiques: [historiqueSchema],
});

const User = mongoose.model("users", userSchema);

module.exports = User;

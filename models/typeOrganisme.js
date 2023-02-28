const mongoose = require("mongoose");

const typeOrganismeSchema = mongoose.Schema({
  nom: String,
});

const TypeOrganisme = mongoose.model("TypeOrganisme", typeOrganismeSchema);

module.exports = TypeOrganisme;

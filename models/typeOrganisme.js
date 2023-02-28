const mongoose = require("mongoose");

const typeOrganismeSchema = mongoose.Schema({
  nom: String,
});

const TypeOrganisme = mongoose.model("typesOrganisme", typeOrganismeSchema);

module.exports = TypeOrganisme;

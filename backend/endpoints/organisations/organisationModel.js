const mongoose = require("mongoose");

const organisationSchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    logo: {
      type: String,
      default: "",
    },
    description: { type: String },
    dateAdded: { type: Date },
    source: { type: String },
    region: { type: String },
    headquarter: { type: String },
    operatingCountries: { type: String },
    sector: { type: String },
    subSector: { type: String },
    active: { type: String },
    fundraising: { type: String },
    amountFundraised: { type: String },
    tier: { type: String },
    website: { type: String },
  },
  {
    timestamps: true,
  }
);

const Organisation = mongoose.model("Organisation", organisationSchema);
module.exports = Organisation;

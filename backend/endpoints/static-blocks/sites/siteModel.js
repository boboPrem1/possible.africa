const mongoose = require("mongoose");

const siteSchema = mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    path: { type: String, unique: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Site = mongoose.model("Site", siteSchema);
module.exports = Site;
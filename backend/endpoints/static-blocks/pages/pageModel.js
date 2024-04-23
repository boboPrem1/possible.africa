const mongoose = require("mongoose");

const pageSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    path: { type: String },
    phpPath: { type: String },
    htmlPath: { type: String },
    neverEditedBefore: { type: Boolean, default: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    site: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
    },
    uniqueCode: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Page = mongoose.model("Page", pageSchema);
module.exports = Page;

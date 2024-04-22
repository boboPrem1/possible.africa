const mongoose = require("mongoose");

const pageSchema = mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    path: { type: String, unique: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    site: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
    },
    code: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Page = mongoose.model("Page", pageSchema);
module.exports = Page;

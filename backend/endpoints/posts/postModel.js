const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    source: {
      type: String,
    },
    organisations: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Organisation",
    },
    categorie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PostCategorie",
    },
    countries: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Country",
    },
    title: { type: String, required: true, unique: true },
    slug: { type: String },
    content: { type: String },
    image: { type: String, default: "" },
    status: {
      type: String,
      enum: ["published", "draft", "trash", "deleted", "archived"],
      default: "draft",
    },
    authors: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
    editors: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Organisation",
    },
    publication_language: {
      type: String,
    },
    labels: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "PostLabel",
    },
    airTags: {
      type: String,
    },
    airMedia: {
      type: String,
    },
    airLink: {
      type: String,
    },
    airLanguage: {
      type: String,
    },
    airLogo: {
      type: String,
    },
    airDateAdded: {
      type: Date,
    },
    airTrans: {
      type: String
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// populate response with user
postSchema.pre(/^find/, function (next) {
  next();
});

// populate country
// postSchema.pre("find", function (next) {
//   this.populate({
//     path: "countries",
//     select: "name idd flag translations",
//   });
//   next();
// });

const Post = mongoose.model("Post", postSchema);
module.exports = Post;

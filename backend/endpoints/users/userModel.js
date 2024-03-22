const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
    },
    avatar: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      select: false,
    },
    confirmPassword: {
      type: String,
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same",
      },
    },
    email: {
      type: String,
      // required: true,
      // unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    description: {
      type: String,
    },
    slug: {
      type: String,
      default: "",
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserRole",
    },
    gender: {
      type: String,
      enum: ["m", "f", "o"],
      default: "o",
    },
    phone: {
      type: {
        indicatif: { type: String },
        number: { type: String },
      },
    },
    status: {
      type: String,
      enum: ["active", "inactive", "deleted"],
      default: "inactive",
    },
    address: {
      type: String,
    },
    facebook_profile: {
      type: String,
    },
    twitter_profile: {
      type: String,
    },
    linkedin_profile: {
      type: String,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    complete_name: {
      type: String,
    },
    categories: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "UserType",
    },
  },
  {
    timestamps: true,
  }
);

// populate response with userRole
userSchema.pre(/^find/, function (next) {
  this.populate({
    path: "role",
    select: "name slug",
  });
  this.populate({
    path: "categories",
    select: "name slug",
  });
  this.populate({
    path: "created_by",
    select: "username",
  });
  next();
});

// Hash password universal function
async function hashPassword(password) {
  return await bcrypt.hash(password, 12);
}

// Hash password and delete confirmPassword before saving
userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash password with cost of 12
  this.password = await hashPassword(this.password);

  // Delete confirmPassword field
  this.confirmPassword = undefined;
  next();
});

// Hash password and delete confirmPassword before updating or create
userSchema.pre("findOneAndUpdate", async function (next) {
  // Only run this function if password was actually modified
  if (!this._update.password) return next();

  // Hash password with cost of 12
  this._update.password = await hashPassword(this._update.password);

  // Delete confirmPassword field
  this._update.confirmPassword = undefined;
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;

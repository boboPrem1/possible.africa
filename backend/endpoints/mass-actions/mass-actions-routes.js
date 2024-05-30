const router = require("express").Router({ mergeParams: true });
const { UpdateSeveralPosts } = require("./index.js");

router.route("/").get(UpdateSeveralPosts);

module.exports = router;

const router = require("express").Router({ mergeParams: true });
const { generateEmail } = require("./aiController");

router.route("/generate-email").post(generateEmail);

module.exports = router;

const router = require("express").Router({ mergeParams: true });
const { generateEmail, generateAny } = require("./aiController");

router.route("/generate-email").post(generateEmail);
router.route("/generate-any").post(generateAny);

module.exports = router;

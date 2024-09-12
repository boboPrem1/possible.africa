const router = require("express").Router({ mergeParams: true });
const multer = require("multer");
const { textToSpeech } = require("./textToSpeechController");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route("/").post(upload.single("audio"), textToSpeech);

module.exports = router;

const router = require("express").Router({ mergeParams: true });
const { getIcpsFromAirtable } = require("./organisationController.js");

router.route("/").get(getIcpsFromAirtable);

module.exports = router;

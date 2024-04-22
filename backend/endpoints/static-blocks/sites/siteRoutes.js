const router = require("express").Router({ mergeParams: true });

const {
  getAllSites,
  getSiteById,
  createSite,
  updateSite,
  deleteSite,
} = require("./siteController.js");

router.route("/").get(getAllSites).post(createSite);

router
  .route("/:id")
  .get(getSiteById)
  .put(updateSite)
  .delete(deleteSite);

module.exports = router;

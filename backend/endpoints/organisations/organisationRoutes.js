const router = require("express").Router({ mergeParams: true });
const {
  getAllOrganisations,
  getOrganisationById,
  createOrganisation,
  updateOrganisation,
  deleteOrganisation,
  getWpImageBuffer,
  getMetaData
} = require("./organisationController");
// const { UploadImage } = require("../uploads/uploadsController.js");

router.route("/getBuff").post(getWpImageBuffer);
router.route("/getMetaDesc").get(getMetaData);

router
  .route("/")
  .get(getAllOrganisations)
  .post(createOrganisation);

router
  .route("/:id")
  .get(getOrganisationById)
  .put(updateOrganisation)
  .delete(deleteOrganisation);

module.exports = router;

const router = require("express").Router({ mergeParams: true });

const {
  getAllPages,
  getPageById,
  createPage,
  updatePage,
  deletePage,
} = require("./pageController.js");

router.route("/").get(getAllPages).post(createPage);

router
  .route("/:id")
  .get(getPageById)
  .put(updatePage)
  .delete(deletePage);

module.exports = router;

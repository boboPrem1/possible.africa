const Page = require("./pageModel.js");
const CustomUtils = require("../../../utils/index.js");

// @Get all Pages
// @route GET /api/v1/Pages
// @access Public

exports.getAllPages = async (req, res) => {
  const user = req.user ? req.user : null;
  if (user && user.role.slug === "user") {
    const { limit, page, sort, fields } = req.query;
    const queryObj = CustomUtils.advancedQuery(req.query);
    try {
      const pages = await Page.find({ ...queryObj, owner: { $eq: user._id } })
        .limit(limit * 1)
        .sort({
          createdAt: -1,
          ...sort,
        })
        .select(fields);
      res.status(200).json(pages);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  } else if (user && user.role.slug === "admin") {
    const { limit, page, sort, fields } = req.query;
    const queryObj = CustomUtils.advancedQuery(req.query);
    try {
      const pages = await Page.find({ ...queryObj })
        .limit(limit * 1)
        .sort({
          createdAt: -1,
          ...sort,
        })
        .select(fields);
      res.status(200).json(pages);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  } else {
    res.status(400).json({ message: CustomUtils.consts.MISSING_DATA });
  }
};

// @Get Page by id
// @route GET /api/v1/Pages/:id
// @access Public

exports.getPageById = async (req, res) => {
  const user = req.user ? req.user : null;
  if (user && user.role.slug === "user") {
    try {
      // get Page by id
      const page = await Page.find({
        $and: [{ _id: { $eq: req.params.id } }, { owner: { $eq: user._id } }],
      });
      if (!page)
        return res.status(404).json({ message: CustomUtils.consts.NOT_FOUND });
      res.status(200).json(page);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else if (user && user.role.slug === "admin") {
    const { limit, page, sort, fields } = req.query;
    const queryObj = CustomUtils.advancedQuery(req.query);
    try {
      // get Page by id
      const page = await Page.findById(req.params.id);
      if (!page)
        return res.status(404).json({ message: CustomUtils.consts.NOT_FOUND });
      res.status(200).json(page);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(400).json({ message: CustomUtils.consts.MISSING_DATA });
  }
};

// @Create Page
// @route POST /api/v1/Pages
// @access Public

exports.createPage = async (req, res) => {
  const user = req.user ? req.user : null;
  const defaultPage = {
    title: "index.html",
    slug: "index"
  };
  if (user && user.role.slug === "user") {
    const CustomBody = { ...req.body };
    const slug = CustomUtils.slugify(CustomBody.title);
    try {
      CustomBody.path = slug;
      if (!CustomBody.pages) CustomBody.pages = [defaultPage];
      const page = await Page.create({ ...CustomBody, owner: user._id });
      res.status(201).json(page);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else if (user && user.role.slug === "admin") {
    const CustomBody = { ...req.body };
    const slug = CustomUtils.slugify(CustomBody.title);
    try {
      CustomBody.path = slug;
      if (!CustomBody.pages) CustomBody.pages = [defaultPage];
      if (!CustomBody.owner) CustomBody.owner = user._id;
      const page = await Page.create({ ...CustomBody });
      res.status(201).json(page);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(400).json({ message: CustomUtils.consts.MISSING_DATA });
  }
};

// @Update Page
// @route PUT /api/v1/Pages/:id
// @access Public

exports.updatePage = async (req, res) => {
  const user = req.user ? req.user : null;
  if (user && user.role.slug === "user") {
    try {
      const page = await Page.findById(req.params.id);
      if (!page) {
        return res.status(404).json({ message: CustomUtils.consts.NOT_FOUND });
      }
      const updated = await Page.findByIdAndUpdate(
        req.params.id,
        { ...req.body, owner: user._id },
        {
          new: true,
        }
      );
      return res.status(200).json(updated);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else if (user && user.role.slug === "admin") {
    try {
      const page = await Page.findById(req.params.id);
      if (!page) {
        return res.status(404).json({ message: CustomUtils.consts.NOT_FOUND });
      }
      const CustomBody = req.body;
      if (!CustomBody.owner) CustomBody.owner = user._id;
      const updated = await Page.findByIdAndUpdate(req.params.id, CustomBody, {
        new: true,
      });
      return res.status(200).json(updated);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(400).json({ message: CustomUtils.consts.MISSING_DATA });
  }
};

// @Delete Page
// @route DELETE /api/v1/Pages/:id
// @access Public

exports.deletePage = async (req, res) => {
  const user = req.user ? req.user : null;
  if (user && user.role.slug === "user") {
    try {
      const page = await Page.find({
        $and: [{ _id: { $eq: req.params.id } }, { owner: { $eq: user._id } }],
      });
      if (!page) {
        return res.status(404).json({ message: CustomUtils.consts.NOT_FOUND });
      }
      await Page.findByIdAndDelete(req.params.id);
      return res.status(200).json({});
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else if (user && user.role.slug === "admin") {
    try {
      const page = await Page.findById(req.params.id);
      if (!page) {
        return res.status(404).json({ message: CustomUtils.consts.NOT_FOUND });
      }
      await Page.findByIdAndDelete(req.params.id);
      return res.status(200).json({});
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(400).json({ message: CustomUtils.consts.MISSING_DATA });
  }
};

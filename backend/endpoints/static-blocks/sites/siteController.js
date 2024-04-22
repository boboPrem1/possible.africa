const Site = require("./siteModel.js");
const CustomUtils = require("../../../utils/index.js");

// @Get all Sites
// @route GET /api/v1/Sites
// @access Public

exports.getAllSites = async (req, res) => {
  const user = req.user ? req.user : null;
  if (user && user.role.slug === "user") {
    const { limit, page, sort, fields } = req.query;
    const queryObj = CustomUtils.advancedQuery(req.query);
    try {
      const sites = await Site.find({ ...queryObj, owner: { $eq: user._id } })
        .limit(limit * 1)
        .sort({
          createdAt: -1,
          ...sort,
        })
        .select(fields);
      res.status(200).json(sites);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  } else if (user && user.role.slug === "admin") {
    const { limit, page, sort, fields } = req.query;
    const queryObj = CustomUtils.advancedQuery(req.query);
    try {
      const sites = await Site.find({ ...queryObj })
        .limit(limit * 1)
        .sort({
          createdAt: -1,
          ...sort,
        })
        .select(fields);
      res.status(200).json(sites);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  } else {
    res.status(400).json({ message: CustomUtils.consts.MISSING_DATA });
  }
};

// @Get Site by id
// @route GET /api/v1/Sites/:id
// @access Public

exports.getSiteById = async (req, res) => {
  const user = req.user ? req.user : null;
  if (user && user.role.slug === "user") {
    try {
      // get Site by id
      const site = await Site.find({
        $and: [{ _id: { $eq: req.params.id } }, { owner: { $eq: user._id } }],
      });
      if (!site)
        return res.status(404).json({ message: CustomUtils.consts.NOT_FOUND });
      res.status(200).json(site);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else if (user && user.role.slug === "admin") {
    const { limit, page, sort, fields } = req.query;
    const queryObj = CustomUtils.advancedQuery(req.query);
    try {
      // get Site by id
      const site = await Site.findById(req.params.id);
      if (!site)
        return res.status(404).json({ message: CustomUtils.consts.NOT_FOUND });
      res.status(200).json(site);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(400).json({ message: CustomUtils.consts.MISSING_DATA });
  }
};

// @Create Site
// @route POST /api/v1/Sites
// @access Public

exports.createSite = async (req, res) => {
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
      const site = await Site.create({ ...CustomBody, owner: user._id });
      res.status(201).json(site);
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
      const site = await Site.create({ ...CustomBody });
      res.status(201).json(site);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(400).json({ message: CustomUtils.consts.MISSING_DATA });
  }
};

// @Update Site
// @route PUT /api/v1/Sites/:id
// @access Public

exports.updateSite = async (req, res) => {
  const user = req.user ? req.user : null;
  if (user && user.role.slug === "user") {
    try {
      const site = await Site.findById(req.params.id);
      if (!site) {
        return res.status(404).json({ message: CustomUtils.consts.NOT_FOUND });
      }
      const updated = await Site.findByIdAndUpdate(
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
      const site = await Site.findById(req.params.id);
      if (!site) {
        return res.status(404).json({ message: CustomUtils.consts.NOT_FOUND });
      }
      const CustomBody = req.body;
      if (!CustomBody.owner) CustomBody.owner = user._id;
      const updated = await Site.findByIdAndUpdate(req.params.id, CustomBody, {
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

// @Delete Site
// @route DELETE /api/v1/Sites/:id
// @access Public

exports.deleteSite = async (req, res) => {
  const user = req.user ? req.user : null;
  if (user && user.role.slug === "user") {
    try {
      const site = await Site.find({
        $and: [{ _id: { $eq: req.params.id } }, { owner: { $eq: user._id } }],
      });
      if (!site) {
        return res.status(404).json({ message: CustomUtils.consts.NOT_FOUND });
      }
      await Site.findByIdAndDelete(req.params.id);
      return res.status(200).json({});
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else if (user && user.role.slug === "admin") {
    try {
      const site = await Site.findById(req.params.id);
      if (!site) {
        return res.status(404).json({ message: CustomUtils.consts.NOT_FOUND });
      }
      await Site.findByIdAndDelete(req.params.id);
      return res.status(200).json({});
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(400).json({ message: CustomUtils.consts.MISSING_DATA });
  }
};

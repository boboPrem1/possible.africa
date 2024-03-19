const CustomUtils = require("../../utils/index.js");
const Organisation = require("../organisations/organisationModel.js");
const Post = require("../posts/postModel.js");
const Job = require("../jobs/jobModel.js");
const Event = require("../events/eventModel.js");
const Opportunity = require("../opportunities/opportunityModel.js");
const User = require("../users/userModel.js");
const moment = require("moment");

const startOfYear = moment().startOf("year").toDate();
const startOfMonth = moment().startOf("month").toDate();
const startOfWeek = moment().startOf("week").toDate();
const startOfDay = moment().startOf("day").toDate();
console.log(startOfMonth);

// Calculer la date actuelle pour marquer la fin de la période de recherche
const now = new Date();
// @Get me
// @route GET /api/v1/users/me
// @access Private
exports.getAllTotaux = async (req, res) => {
  try {
    const lastOrganisations = await Organisation.find()
      .limit(10 * 1)
      .skip(0)
      .sort({ createdAt: -1 });
    let organisations = await Organisation.find().count();
    let lastYearOrganisations = await Organisation.find({
      createdAt: {
        $gte: startOfYear,
        $lte: now,
      },
    }).count();
    let lastMonthOrganisations = await Organisation.find({
      createdAt: {
        $gte: startOfMonth,
        $lte: now,
      },
    }).count();
    let lastWeekOrganisations = await Organisation.find({
      createdAt: {
        $gte: startOfWeek,
        $lte: now,
      },
    }).count();
    let todayOrganisations = await Organisation.find({
      createdAt: {
        $gte: startOfDay,
        $lte: now,
      },
    }).count();

    // Pour les articles
    const posts = await Post.find().count();
    const lastPosts = await Post.find()
      .limit(10 * 1)
      .skip(0)
      .sort({ airDateAdded: -1 });
    let lastYearPosts = await Post.find({
      airDateAdded: {
        $gte: startOfYear,
        $lte: now,
      },
    }).count();
    let lastMonthPosts = await Post.find({
      airDateAdded: {
        $gte: startOfMonth,
        $lte: now,
      },
    }).count();
    let lastWeekPosts = await Post.find({
      airDateAdded: {
        $gte: startOfWeek,
        $lte: now,
      },
    }).count();
    let todayPosts = await Post.find({
      airDateAdded: {
        $gte: startOfDay,
        $lte: now,
      },
    }).count();
    const jobs = await Job.find().count();
    const opportunities = await Opportunity.find().count();
    const events = await Event.find().count();
    const users = await User.find().count();

    // if (!user)
    //   return res
    //     .status(404)
    //     .json({ message: `User not found !` });
    // console.log(users);
    res.status(200).json({
      users,
      organisations: {
        all: organisations,
        last: lastOrganisations,
        year: {
          evolution: Math.ceil((lastYearOrganisations / organisations) * 100),
          length: lastYearOrganisations,
        },
        month: {
          evolution: Math.ceil((lastMonthOrganisations / organisations) * 100),
          length: lastMonthOrganisations,
        },
        week: {
          evolution: Math.ceil((lastWeekOrganisations / organisations) * 100),
          length: lastWeekOrganisations,
        },
        day: {
          evolution: Math.ceil((todayOrganisations / organisations) * 100),
          length: todayOrganisations,
        },
      },
      posts: {
        all: Math.ceil(posts / 2),
        last: lastPosts,
        year: {
          evolution: Math.ceil((lastYearPosts / posts) * 100),
          length: Math.ceil(lastYearPosts / 2),
        },
        month: {
          evolution: Math.ceil((lastMonthPosts / posts) * 100),
          length: Math.ceil(lastMonthPosts / 2),
        },
        week: {
          evolution: Math.ceil((lastWeekPosts / posts) * 100),
          length: Math.ceil(lastWeekPosts / 2),
        },
        day: {
          evolution: Math.ceil((todayPosts / posts) * 100),
          length: Math.ceil(todayPosts / 2),
        },
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

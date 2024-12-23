const CustomUtils = require("../../utils/index.js");
const Organisation = require("../organisations/organisationModel.js");
const Post = require("../posts/postModel.js");
const User = require("../users/userModel.js");
const moment = require("moment");

const startOfYear = moment().startOf("year").toDate();
const startOfMonth = moment().startOf("month").toDate();
const startOfWeek = moment().startOf("week").toDate();
const startOfDay = moment().startOf("day").toDate();
// console.log(startOfMonth);

// Calculer la date actuelle pour marquer la fin de la période de recherche
const now = new Date();

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const DATAPOINTS_BASE_ID = process.env.DATAPOINTS_BASE_ID;
const DATAPOINTS_TABLE_ID = process.env.DATAPOINTS_TABLE_ID;
const SUB_SECTORS_TABLE_ID = process.env.SUB_SECTORS_TABLE_ID;
const INDEX_TIERS_TABLE_ID = process.env.INDEX_TIERS_TABLE_ID;
const ENV = process.env.ENV;
const PORT = process.env.PORT;
var Airtable = require("airtable");

const fetchAllDataPoints = async (apiKey, baseId, tableName) => {
  var base = new Airtable({
    apiKey: AIRTABLE_API_KEY,
  }).base(DATAPOINTS_BASE_ID);

  let allDatapointsRecords = [];
  let allSubSectorsRecords = [];
  let allIndexTiersRecords = [];
  let regionsArray = [];
  let headquartersArray = [];
  let operatingCountriesArray = [];
  let sectorsArray = [];
  let tiersArray = [];
  const subSectors = {
    health: [],
    education: [],
    "mobility ": [],
    "logistic ": [],
    ["telecom "]: [],
    "energy ": [],
    "financial services ": [],
    fmcg: [],
    hospitality: [],
    media: [],
    ["retail "]: [],
    climat: [],
    vc: [],
    hub: [],
    data: [],
    agribusiness: [],
  };
  try {
    const datapointsRecords = await base(DATAPOINTS_TABLE_ID).select().all();
    const subSectorsRecords = await base(SUB_SECTORS_TABLE_ID).select().all();
    const indexTiersRecords = await base(INDEX_TIERS_TABLE_ID).select().all();

    datapointsRecords.forEach((record) => {
      allDatapointsRecords.push({
        region: record.get("Region"),
        headquarter: record.get("Headquarter"),
        operatingCountries: record.get("Operating countries"),
        sector: record.get("Sector"),
      });
    });
    subSectorsRecords.forEach((record) => {
      allSubSectorsRecords.push({
        health: record.get("Health"),
        education: record.get("Education"),
        "mobility ": record.get("Mobility"),
        "logistic ": record.get("Logistic"),
        ["telecom "]: record.get("Telecom"),
        "energy ": record.get("Energy"),
        "financial services ": record.get("Financial services"),
        fmcg: record.get("FMCG"),
        hospitality: record.get("Hospitality"),
        media: record.get("Media"),
        ["retail "]: record.get("Retail"),
        climat: record.get("Climate"),
        vc: record.get("VC"),
        hub: record.get("Hub"),
        data: record.get("Data"),
        agribusiness: record.get("Agribusiness"),
      });
    });
    indexTiersRecords.forEach((record) => {
      allIndexTiersRecords.push({
        notes: record.get("Notes"),
      });
    });

    allDatapointsRecords.map((el) => {
      if (el.region && el.region !== "All") {
        regionsArray.push(el.region);
      }
      if (el.headquarter) {
        if (el.headquarter.length <= 1 && el.headquarter[0] !== "All") {
          headquartersArray.push(el.headquarter[0]);
        } else {
        }
      }
      if (el.operatingCountries) {
        if (
          el.operatingCountries.length <= 1 &&
          el.operatingCountries[0] !== "All"
        ) {
          operatingCountriesArray.push(el.operatingCountries[0]);
        } else {
        }
      }
      if (el.sector && el.sector !== "All" && el.sector !== "Secteur ") {
        sectorsArray.push(el.sector);
      }
    });
    allSubSectorsRecords.map((el) => {
      // if (el.region && el.region[0] !== "All" && !el.region[1]) {
      //   subSectors.region.push(el.region[0]);
      // }
      if (el.health && el.health[0] !== "All" && !el.health[1]) {
        subSectors.health.push(el.health[0]);
      }
      if (el.education && el.education[0] !== "All" && !el.education[1]) {
        subSectors.education.push(el.education[0]);
      }
      if (
        el["mobility "] &&
        el["mobility "][0] !== "All" &&
        !el["mobility "][1]
      ) {
        subSectors["mobility "].push(el["mobility "][0]);
      }
      if (el["logistic "] && el["logistic "][0] !== "All" && !el["logistic "][1]) {
        subSectors["logistic "].push(el["logistic "][0]);
      }
      if (el["telecom "] && el["telecom "][0] !== "All" && !el["telecom "][1]) {
        subSectors["telecom "].push(el["telecom "][0]);
      }
      if (el["energy "] && el["energy "][0] !== "All" && !el["energy "][1]) {
        subSectors["energy "].push(el["energy "][0]);
      }
      if (
        el["financial services "] &&
        el["financial services "][0] !== "All" &&
        !el["financial services "][1]
      ) {
        subSectors["financial services "].push(el["financial services "][0]);
      }
      if (el.fmcg && el.fmcg[0] !== "All" && !el.fmcg[1]) {
        subSectors.fmcg.push(el.fmcg[0]);
      }
      if (el.hospitality && el.hospitality[0] !== "All" && !el.hospitality[1]) {
        subSectors.hospitality.push(el.hospitality[0]);
      }
      if (el.media && el.media[0] !== "All" && !el.media[1]) {
        subSectors.media.push(el.media[0]);
      }
      if (el["retail "] && el["retail "][0] !== "All" && !el["retail "][1]) {
        subSectors["retail "].push(el["retail "][0]);
      }
      if (el.climat && el.climat[0] !== "All" && !el.climat[1]) {
        subSectors.climat.push(el.climat[0]);
      }
      if (el.vc && el.vc[0] !== "All" && !el.vc[1]) {
        subSectors.vc.push(el.vc[0]);
      }
      if (el.hub && el.hub[0] !== "All" && !el.hub[1]) {
        subSectors.hub.push(el.hub[0]);
      }
      if (el.data && el.data[0] !== "All" && !el.data[1]) {
        subSectors.data.push(el.data[0]);
      }
      if (
        el.agribusiness &&
        el.agribusiness[0] !== "All" &&
        !el.agribusiness[1]
      ) {
        subSectors.agribusiness.push(el.agribusiness[0]);
      }
    });
    allIndexTiersRecords.map((el) => {
      tiersArray.push(el.notes);
    });

    // console.log(allRecords);
    return {
      regions: regionsArray,
      headquarters: headquartersArray,
      operatingCountries: operatingCountriesArray,
      sectors: sectorsArray,
      subSectors: subSectors,
      indexTiers: tiersArray,
    };
  } catch (err) {
    console.error(err);
  }
};

// @Get me
// @route GET /api/v1/users/me
// @access Private
exports.getAllTotaux = async (req, res) => {
  try {
    const lastOrganisations = await Organisation.find()
      .limit(10 * 1)
      .skip(0)
      .sort({ dateAdded: -1 });
    let organisations = await Organisation.find().count();
    const OrganisationsBySectors = await Organisation.aggregate([
      { $group: { _id: "$sector", nb: { $sum: 1 } } },
    ]);
    const OrganisationsBySubSectors = await Organisation.aggregate([
      { $group: { _id: "$subSector", nb: { $sum: 1 } } },
    ]);
    let lastYearOrganisations = await Organisation.find({
      dateAdded: {
        $gte: startOfYear,
        $lte: now,
      },
    }).count();
    let lastMonthOrganisations = await Organisation.find({
      dateAdded: {
        $gte: startOfMonth,
        $lte: now,
      },
    }).count();
    let lastWeekOrganisations = await Organisation.find({
      dateAdded: {
        $gte: startOfWeek,
        $lte: now,
      },
    }).count();
    let todayOrganisations = await Organisation.find({
      dateAdded: {
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
    const users = await User.find().count();

    const records = await fetchAllDataPoints();
    // console.log(records);

    
    // Get stats
    const regions = await Organisation.aggregate([
      {
        $project: {
          region: {
            $split: ["$region", ", "], // Sépare les régions s'il s'agit d'une chaîne délimitée par une virgule et un espace
          },
        },
      },
      {
        $unwind: "$region", // Décompose les listes de régions en documents individuels
      },
      {
        $group: {
          _id: "$region", // Regroupe par région unique
          count: { $sum: 1 }, // Compte les occurrences de chaque région
        },
      },
      {
        $sort: { count: -1 }, // Trie par nombre décroissant
      },
    ]);
    const tiers = await Organisation.aggregate([
      {
        $group: {
          _id: "$tier", // Regroupe par région unique
          count: { $sum: 1 }, // Compte les occurrences de chaque région
        },
      },
      {
        $sort: { count: -1 }, // Trie par nombre décroissant
      },
    ]);
    const headquarters = await Organisation.aggregate([
      {
        $group: {
          _id: "$headquarter", // Regroupe par région unique
          count: { $sum: 1 }, // Compte les occurrences de chaque région
        },
      },
      {
        $sort: { count: -1 }, // Trie par nombre décroissant
      },
    ]);

    res.status(200).json({
      users,
      records,
      OrganisationsBySectors,
      OrganisationsBySubSectors,
      organisations: {
        regions: regions.filter((region) => !(region._id.split(", ").length > 1)),
        tiers: tiers,
        headquarters: headquarters,
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

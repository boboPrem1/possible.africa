const Organisation = require("./organisationModel.js");
const download = require("image-downloader");
const CustomUtils = require("../../utils/index.js");
const axios = require("axios");
const { Buffer } = require("buffer");
const fs = require("fs");
const Path = require("path");
const stream = require("stream");
const { promisify } = require("util");
const pipeline = promisify(stream.pipeline);
require("dotenv").config();

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const ORGANISATIONS_BASE_ID = process.env.ORGANISATIONS_BASE_ID;
const ORGANISATION_TABLE_ID = process.env.ORGANISATION_TABLE_ID;
const ICPS_BASE_ID = process.env.ICPS_BASE_ID;
const ICPS_TABLE_ID = process.env.ICPS_TABLE_ID;
const ENV = process.env.ENV;
const PORT = process.env.PORT;
var Airtable = require("airtable");

function extraireDomaine(url) {
  const regex = /^(https?:\/\/)?([\w\d-]+\.)+[\w\d-]+/;
  const match = url.match(regex);
  return match ? match[0] : null;
}

function fileExists(filePath) {
  try {
    fs.access(filePath);
    return true; // Le fichier existe
  } catch (error) {
    return false; // Le fichier n'existe pas
  }
}

async function downloadImage(url, path) {
  if (fileExists(path)) {
    // console.log(`Le fichier existe déjà : ${path}`);
    return false;
  }

  try {
    const response = await fetch(url);

    await pipeline(response.body, fs.createWriteStream(path));
    // console.log(`Image téléchargée et sauvegardée comme ${path}`);
    return path;
  } catch (e) {
    console.log(e);
  }
}

async function downloadMedia(mediaUrl) {
  try {
    const options = {
      url: mediaUrl,
      dest: "../../endpoints/organisations/img",
      extractFilename: true,
    };
    const res = await download.image(options);
    const imageData = fs.readFileSync(res.filename).toString("base64");
    const dataUrl = `data:${`image/${res.filename
      .split(".")
      .pop()}`};base64,${imageData}`;
    fs.unlinkSync(res.filename);
    return dataUrl;
  } catch (error) {
    console.error(error);
    return null;
  }
}
const fetchAllRecords = async (apiKey, baseId, tableName) => {
  var base = new Airtable({
    apiKey: apiKey,
  }).base(baseId);

  let allRecords = [];
  try {
    const records = await base(tableName)
      .select({
        sort: [
          {
            field: "Date Added",
            direction: "desc",
          },
        ],
      })
      .all();

    records.forEach((record) => {
      allRecords.push({
        _id: record.get("Name"),
        name: record.get("Name"),
        logo: record.get("Logo"),
        description: record.get("Description"),
        region: record.get("Region"),
        headquarter: record.get("Headquarter"),
        operatingCountries: record.get("Operating Countries"),
        sector: record.get("Sector"),
        subSector: record.get("Sub-Sector"),
        active: record.get("Active"),
        website: record.get("Website"),
        source: record.get("Source"),
        tier: record.get("Tier"),
        dateAdded: record.get("Date Added"),
        logoUrl: record.get("Logo URL"),
      });
    });

    allRecords.map((el) => {
      return {
        _id: el._id,
        logo: el.logo ? el.logo.join(" ")[0].url : null,
        name: el.name ? el.name : null,
        description: el.description ? el.description : null,
        region: el.region ? el.region : null,
        headquarter: el.headquarter ? el.headquarter : null,
        operatingCountries: el.operatingCountries
          ? el.operatingCountries.join(" ")
          : null,
        sector: el.sector ? el.sector : null,
        subSector: el.subSector ? el.subSector : null,
        active: el.active ? el.active : null,
        website: el.website ? el.website : null,
        source: el.source ? el.source : null,
        tier: el.tier ? el.tier : null,
        dateAdded: el.dateAdded ? el.dateAdded : null,
        logoUrl: el.logoUrl ? el.logoUrl : null,
      };
    });

    // console.log(allRecords);
    return allRecords;
  } catch (err) {
    console.error(err);
  }
};

const fetchIcpsRecords = async (apiKey, baseId, tableName) => {
  var base = new Airtable({
    apiKey: apiKey,
  }).base(baseId);

  let allRecords = [];
  try {
    const records = await base(tableName)
      .select({
        view: "Grid view",
      })
      .all();

    records.forEach((record) => {
      allRecords.push({
        icp: record.get("Name"),
        organisation: record.get("Organisation"),
      });
    });

    return allRecords;
  } catch (err) {
    console.error(err);
  }
};

exports.getOrganisationsFromAirtable = async (req, res) => {
  try {
    const result = await fetchAllRecords(
      AIRTABLE_API_KEY,
      ORGANISATIONS_BASE_ID,
      ORGANISATION_TABLE_ID
    );
    let existing = 0;
    result.map(async (organisation) => {
      const ExistingOrg = await Organisation.find({
        name: { $eq: organisation.name },
      });
      // if (org.length) {
      //   const customBody = {
      //     headquarter: organisation.headquarter
      //       ? organisation.headquarter.join(",")
      //       : "",
      //   };
      //   const newOrg = await Organisation.findByIdAndUpdate(org[0]._id, customBody, {
      //     new: true,
      //   });
      //   console.log(newOrg);
      // }
      // return org;
      // console.log(org);

      if (ExistingOrg.length === 0) {
        try {
          let domain_racine = extraireDomaine(organisation.website);
          // console.log(domain_racine);
          if (domain_racine) {
            domain_racine = domain_racine.slice(8);
            const url = `https://logo.clearbit.com/${domain_racine}`;
            const path = `${Path.resolve(
              __dirname,
              "../../public/storage/logos"
            )}/${domain_racine.split(".").join("")}.jpg`;
            await downloadImage(url, path);
            let urla = `https://api.possible.africa/storage/logos/${domain_racine
              .split(".")
              .join("")}.jpg`;
            const org = await Organisation.create({
              logo: urla,
              name: organisation.name ? organisation.name : "",
              description: organisation.description
                ? organisation.description
                : "",
              region: organisation.region ? organisation.region.join(",") : "",
              operatingCountries: organisation.operatingCountries
                ? organisation.operatingCountries.join(",")
                : "",
              sector: organisation.sector ? organisation.sector.join(",") : "",
              subSector: organisation.subSector
                ? organisation.subSector.join(",")
                : "",
              headquarter: organisation.headquarter
                ? organisation.headquarter.join(",")
                : "",
              active: organisation.active ? organisation.active : "",
              website: organisation.website ? organisation.website : "",
              source: organisation.source ? organisation.source : "",
              tier: organisation.tier ? organisation.tier : "",
              dateAdded: organisation.dateAdded ? organisation.dateAdded : "",
            });
          } else {
            const urla =
              "https://api.possible.africa/storage/logos/placeholder_org.jpeg";
            const org = await Organisation.create({
              logo: urla,
              name: organisation.name ? organisation.name : "",
              description: organisation.description
                ? organisation.description
                : "",
              region: organisation.region ? organisation.region.join(",") : "",
              operatingCountries: organisation.operatingCountries
                ? organisation.operatingCountries.join(",")
                : "",
              sector: organisation.sector ? organisation.sector.join(",") : "",
              subSector: organisation.subSector
                ? organisation.subSector.join(",")
                : "",
              headquarter: organisation.headquarter
                ? organisation.headquarter.join(",")
                : "",
              active: organisation.active ? organisation.active : "",
              website: organisation.website ? organisation.website : "",
              source: organisation.source ? organisation.source : "",
              tier: organisation.tier ? organisation.tier : "",
              dateAdded: organisation.dateAdded ? organisation.dateAdded : "",
            });
          }
        } catch (e) {
          console.log(e);
        }
      } else {
        existing = existing + 1;
      }
    });

    res.status(200).json({ success: true, existing: existing });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.getIcpsFromAirtable = async (req, res) => {
  function searchSubstring(text, searchString) {
    // Crée une expression régulière insensible à la casse pour rechercher la sous-chaîne
    const regex = new RegExp(searchString, "i");
    // Teste la chaîne de caractères pour voir si elle contient la sous-chaîne
    return regex.test(text);
  }
  const { query } = req;
  // console.log(query);
  try {
    const result = await fetchIcpsRecords(
      AIRTABLE_API_KEY,
      ICPS_BASE_ID,
      ICPS_TABLE_ID
    );

    const resultFiltered = [];
    result.map((r) => {
      if (query.organisation) {
        if (searchSubstring(r.organisation, query.organisation)) {
          return resultFiltered.push(r);
        }
        return undefined;
      }
      return undefined;
    });

    res.status(200).json(resultFiltered);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.cronOrganisationsFromAirtable = async () => {
  try {
    const result = await fetchAllRecords(
      AIRTABLE_API_KEY,
      ORGANISATIONS_BASE_ID,
      ORGANISATION_TABLE_ID
    );
    let existing = 0;
    const organisations = await result.map(async (organisation) => {
      const ExistingOrg = await Organisation.find({
        name: { $eq: organisation.name },
      });
      // console.log(ExistingOrg);

      if (ExistingOrg.length === 0) {
        try {
          if (organisation.website) {
            let domain_racine = extraireDomaine(organisation.website);
            if (domain_racine) {
              domain_racine = domain_racine.slice(8);
              const url = `https://logo.clearbit.com/${domain_racine}`;
              const path = `${Path.resolve(
                __dirname,
                "../../public/storage/logos"
              )}/${domain_racine.split(".").join("")}.jpg`;
              await downloadImage(url, path);
              let urla = `https://api.possible.africa/storage/logos/${domain_racine
                .split(".")
                .join("")}.jpg`;
              const org = await Organisation.create({
                logo: urla,
                name: organisation.name ? organisation.name : "Unknow",
                description: organisation.description
                  ? organisation.description
                  : "",
                region: organisation.region
                  ? organisation.region.join(",")
                  : "",
                operatingCountries: organisation.operatingCountries
                  ? organisation.operatingCountries.join(",")
                  : "",
                sector: organisation.sector
                  ? organisation.sector.join(",")
                  : "",
                headquarter: organisation.headquarter
                  ? organisation.headquarter.join(",")
                  : "",
                subSector: organisation.subSector
                  ? organisation.subSector.join(",")
                  : "",
                active: organisation.active ? organisation.active : "",
                website: organisation.website ? organisation.website : "",
                source: organisation.source ? organisation.source : "",
                tier: organisation.tier ? organisation.tier : "",
                dateAdded: organisation.dateAdded ? organisation.dateAdded : "",
              });
            } else {
              const urla =
                "https://api.possible.africa/storage/logos/placeholder_org.jpeg";
              const org = await Organisation.create({
                logo: urla,
                name: organisation.name ? organisation.name : "",
                description: organisation.description
                  ? organisation.description
                  : "",
                region: organisation.region
                  ? organisation.region.join(",")
                  : "",
                operatingCountries: organisation.operatingCountries
                  ? organisation.operatingCountries.join(",")
                  : "",
                sector: organisation.sector
                  ? organisation.sector.join(",")
                  : "",
                headquarter: organisation.headquarter
                  ? organisation.headquarter.join(",")
                  : "",
                subSector: organisation.subSector
                  ? organisation.subSector.join(",")
                  : "",
                active: organisation.active ? organisation.active : "",
                website: organisation.website ? organisation.website : "",
                source: organisation.source ? organisation.source : "",
                tier: organisation.tier ? organisation.tier : "",
                dateAdded: organisation.dateAdded ? organisation.dateAdded : "",
              });
            }
          } else {
            const urla =
              "https://api.possible.africa/storage/logos/placeholder_org.jpeg";
            const org = await Organisation.create({
              logo: urla,
              name: organisation.name ? organisation.name : "",
              description: organisation.description
                ? organisation.description
                : "",
              region: organisation.region ? organisation.region.join(",") : "",
              operatingCountries: organisation.operatingCountries
                ? organisation.operatingCountries.join(",")
                : "",
              sector: organisation.sector ? organisation.sector.join(",") : "",
              subSector: organisation.subSector
                ? organisation.subSector.join(",")
                : "",
              active: organisation.active ? organisation.active : "",
              website: organisation.website ? organisation.website : "",
              source: organisation.source ? organisation.source : "",
              tier: organisation.tier ? organisation.tier : "",
              dateAdded: organisation.dateAdded ? organisation.dateAdded : "",
            });
          }
          // console.log(domain_racine);
        } catch (e) {
          console.log(e);
        }
      } else {
        existing = existing + 1;
      }
    });

    return { success: true, existing: existing };
  } catch (error) {
    return { message: error.message };
  }
};

exports.getMetaData = async (req, res) => {
  try {
    const response = await axios.get(req.query.url);
    // Traitez la réponse selon vos besoins, par exemple, extrayez la méta-description.
    // Vous pouvez ensuite renvoyer ces données au frontend.
    res.json(response.data);
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
    res.status(500).send("Erreur lors de la récupération des données.");
  }
};

exports.getWpImageBuffer = async (req, res) => {
  const dataUrl = await downloadMedia(req.body.url);
  return res.status(200).json({ dataUrl });
};

exports.getAllOrganisationsFromAirtable = async (req, res) => {
  const { limit, page, sort, fields } = req.query;
  const queryObj = CustomUtils.advancedQuery(req.query);
  // console.log(queryObj);
  try {
    const organisations = await Organisation.find(queryObj)
      .limit(limit * 1)
      .sort({ createdAt: -1, ...sort })
      .select(fields);
    res.status(200).json(organisations);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @Get all organisations
// @route GET /api/v1/organisations
// @access Public
exports.getAllOrganisations = async (req, res) => {
  let { limit, page, sort, fields, _start, _end } = req.query;
  const queryObj = CustomUtils.advancedQuery(req.query);
  // console.log(queryObj);
  try {
    if (_end && (_start || _start == 0)) {
      limit = _end - _start;
    }
    const orgs = await Organisation.find(queryObj)
      .limit(limit * 1)
      .skip(_start ? _start : 0)
      .sort({ dateAdded: -1, ...sort })
      .select(fields);
    res.status(200).json(orgs);

    // const orgsToBeModified = await Organisation.find();
    // orgsToBeModified.map(async (org) => {
    //   const oooooo = await Organisation.findByIdAndUpdate(
    //     org._id,
    //     {
    //       name: org.name ? org.name : "",
    //       description: org.description ? org.description : "",
    //       source: org.source ? org.source : "",
    //       region: org.region ? org.region : "",
    //       headquarter: org.headquarter ? org.headquarter : "",
    //       operatingCountries: org.operatingCountries
    //         ? org.operatingCountries
    //         : "",
    //       sector: org.sector ? org.sector : "",
    //       subSector: org.subSector ? org.subSector : "",
    //       active: org.active ? org.active : "",
    //       fundraising: org.fundraising ? org.fundraising : "",
    //       amountFundraised: org.amountFundraised ? org.amountFundraised : "",
    //       tier: org.tier ? org.tier : "",
    //       website: org.website ? org.website : "",
    //     },
    //     { new: true }
    //   );
    //   console.log(oooooo);
    // });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @Get organisation by id
// @route GET /api/v1/organisations/:id
// @access Public
exports.getOrganisationById = async (req, res) => {
  // get organisation by id
  try {
    const organisation = await Organisation.findById(req.params.id);
    if (!organisation)
      return res.status(404).json({
        message: CustomUtils.consts.NOT_EXIST,
      });
    res.status(200).json(organisation);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @Create organisation
// @route POST /api/v1/organisations
// @access Public
exports.createOrganisation = async (req, res) => {
  const CustomBody = { ...req.body };
  const name = CustomBody.name;
  const slug = CustomUtils.slugify(name);
  try {
    if (req.user) CustomBody.contributeur = req.user._id;
    CustomBody.slug = slug;
    const organisation = await Organisation.create(CustomBody);
    res.status(201).json(organisation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Update organisation
// @route PUT /api/v1/organisations/:id
// @access Public
exports.updateOrganisation = async (req, res) => {
  const CustomBody = { ...req.body };
  try {
    const organisation = await Organisation.findById(req.params.id);
    if (!organisation) {
      return res.status(404).json({ message: CustomUtils.consts.NOT_EXIST });
    }

    if (req.user) CustomBody.contributeur = organisation.contributeur;

    const updatedOrganisation = await Organisation.findByIdAndUpdate(
      req.params.id,
      CustomBody,
      { new: true }
    );
    res.json(updatedOrganisation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @Delete organisation
// @route DELETE /api/v1/organisations/:id
// @access Public
exports.deleteOrganisation = async (req, res) => {
  try {
    const organisation = await Organisation.findById(req.params.id);
    if (!organisation) {
      return res.status(404).json({ message: CustomUtils.consts.NOT_EXIST });
    }
    await Organisation.findByIdAndDelete(req.params.id);
    res.json({});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

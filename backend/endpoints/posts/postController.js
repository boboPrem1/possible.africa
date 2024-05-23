const Post = require("./postModel.js");
const CustomUtils = require("../../utils/index.js");
const fetch = require("node-fetch");
const fs = require("fs");
const stream = require("stream");
const { promisify } = require("util");
const pipeline = promisify(stream.pipeline);
const Path = require("path");
// const Airtable = require("airtable");
require("dotenv").config();
const axios = require("axios");

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true; // Le fichier existe
  } catch (error) {
    return false; // Le fichier n'existe pas
  }
}

function extraireDomaine(url) {
  // Utilisation d'une expression régulière pour extraire le domaine
  const regex = /^(https?:\/\/)?([\w\d-]+\.)+[\w\d-]+/;
  const match = url.match(regex);
  return match ? match[0] : null;
}

async function downloadImage(url, path) {
  if (await fileExists(path)) {
    console.log(`Le fichier existe déjà : ${path}`);
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

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const ENGLISH_BASE_ID = process.env.ENGLISH_BASE_ID;
const FRENCH_BASE_ID = process.env.FRENCH_BASE_ID;
const FRENCH_ARTICLE_TABLE_ID = process.env.FRENCH_ARTICLE_TABLE_ID;
const ENGLISH_ARTICLE_TABLE_ID = process.env.ENGLISH_ARTICLE_TABLE_ID;
const ALL_ARTICLE_BASE_ID = process.env.ALL_ARTICLE_BASE_ID;
const ALL_ARTICLE_TABLE_ID = process.env.ALL_ARTICLE_TABLE_ID;
const ENV = process.env.ENV;
const PORT = process.env.PORT;

var Airtable = require("airtable");

const fetchAllRecords = async (apiKey, baseId, tableName) => {
  var base = new Airtable({
    apiKey: apiKey,
  }).base(baseId);

  let allRecords = [];
  try {
    // console.log(eq);

    // Sélectionnez tous les records et attendez leur chargement complet
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

    // Traitez chaque record individuellement
    records.forEach((record) => {
      allRecords.push({
        _id: record.get("Article ID"),
        title: record.get("Article Title"),
        tags: record.get("Tags from Feedly"),
        media: record.get("Name of Media"),
        language: record.get("Language"),
        link: record.get("Link to Article"),
        publication_date: record.get("Date Added"),
        logo: record.get("Logo copy"),
      });
    });

    // console.log(allRecords.slice(0, 5));
    // Retournez ou traitez `allRecords` comme nécessaire
    // const recordsToBeReturned = allRecords.slice(0, limit);
    // const recordsToBeRetured = await Promise.all(
    //   recordsToBeReturned.map(async (e) => {
    //     if (e.logo && e.media) {
    //       let media = e.media.split(" ").join("").toLowerCase();
    //       const regex = /\//g;
    //       const path = `${Path.resolve(
    //         __dirname,
    //         "../../public/storage/logos/airtable"
    //       )}/${media}.jpg`;
    //       const result = downloadImage(e.logo, path);
    //       // console.log(result);

    //       // if (result) {
    //       const regex2 = /storage/;
    //       const publicIndex = path.search(regex2);
    //       const reformedPath = path.slice(publicIndex);
    //       if (ENV === "dev") {
    //         e.logo = `http://localhost:${PORT}/${reformedPath}`;
    //       } else {
    //         e.logo = `https://api.possible.africa/${reformedPath}`;
    //       }
    //       // console.log(e);
    //       return e;
    //       // } else {
    //       //   e.logo = path;
    //       //   return e;
    //       // }
    //     }
    //     return e;
    //   })
    // );

    // console.log(recordsToBeRetured);
    return allRecords;
  } catch (err) {
    console.error(err);
    // Gérez l'erreur comme nécessaire
  }
};

exports.getFrenchPostFromAirtable = async (req, res) => {
  const { limit, page, sort, fields, eq } = req.query;
  const queryObj = CustomUtils.advancedQueryAirtable(req.query);
  // console.log(queryObj);
  try {
    const result = await fetchAllRecords(
      AIRTABLE_API_KEY,
      FRENCH_BASE_ID,
      FRENCH_ARTICLE_TABLE_ID,
      limit * 1,
      queryObj
    );

    const articles = await result.map(async (article) => {
      const existingArticle = await Post.find({
        title: article.title,
      });
      if (existingArticle.length === 0) {
        try {
          await Post.create({
            title: article.title,
            airTags: article.tags,
            airMedia: article.media,
            airLink: article.link,
            airLanguage: article.language,
            airLogo: article.logo,
            airDateAdded: article.publication_date,
            airTrans: "fr",
          });
        } catch (e) {
          console.log(e);
        }
      }
    });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.getAllPostFromAirtable = async (req, res) => {
  try {
    const frResult = await fetchAllRecords(
      AIRTABLE_API_KEY,
      FRENCH_BASE_ID,
      FRENCH_ARTICLE_TABLE_ID
    );

    const frArticles = await frResult.map(async (article) => {
      const existingArticle = await Post.find({
        title: article.title,
      });
      // console.log(existingArticle);
      if (existingArticle.length === 0) {
        try {
          if (article.link) {
            let domain_racine = extraireDomaine(article.link);
            if (domain_racine) {
              domain_racine = domain_racine.slice(8);
              // console.log(domain_racine);
              const img_name = domain_racine.split(".").join("") + ".jpg";
              const path = `${Path.resolve(
                __dirname,
                "../../public/storage/logos"
              )}/${img_name}`;
              await downloadImage(article.logo, path);
              let urla = `https://api.possible.africa/storage/logos/${img_name}`;

              await Post.create({
                title: article.title,
                airTags: article.tags,
                airMedia: article.media,
                airLink: article.link,
                airLanguage: article.language,
                airLogo: urla,
                airDateAdded: new Date(article.publication_date),
                airTrans: "fr",
              });
            } else {
              await Post.create({
                title: article.title,
                airTags: article.tags,
                airMedia: article.media,
                airLink: article.link,
                airLanguage: article.language,
                airLogo:
                  "https://api.possible.africa/storage/logos/placeholder_org.jpeg",
                airDateAdded: new Date(article.publication_date),
                airTrans: "fr",
              });
            }
          } else {
            await Post.create({
              title: article.title,
              airTags: article.tags,
              airMedia: article.media,
              airLink: article.link,
              airLanguage: article.language,
              airLogo:
                "https://api.possible.africa/storage/logos/placeholder_org.jpeg",
              airDateAdded: new Date(article.publication_date),
              airTrans: "fr",
            });
          }
        } catch (e) {
          console.log(e);
        }
      }
    });

    const engResult = await fetchAllRecords(
      AIRTABLE_API_KEY,
      ENGLISH_BASE_ID,
      ENGLISH_ARTICLE_TABLE_ID
    );
    const engArticles = await engResult.map(async (article) => {
      const existingArticle = await Post.find({
        title: article.title,
      });
      // console.log(existingArticle);
      if (existingArticle.length === 0) {
        try {
          if (article.link) {
            let domain_racine = extraireDomaine(article.link);
            if (domain_racine) {
              domain_racine = domain_racine.slice(8);
              // console.log(domain_racine);
              const img_name = domain_racine.split(".").join("") + ".jpg";
              const path = `${Path.resolve(
                __dirname,
                "../../public/storage/logos"
              )}/${img_name}`;
              await downloadImage(article.logo, path);
              let urla = `https://api.possible.africa/storage/logos/${img_name}`;

              await Post.create({
                title: article.title,
                airTags: article.tags,
                airMedia: article.media,
                airLink: article.link,
                airLanguage: article.language,
                airLogo: urla,
                airDateAdded: new Date(article.publication_date),
                airTrans: "eng",
              });
            } else {
              await Post.create({
                title: article.title,
                airTags: article.tags,
                airMedia: article.media,
                airLink: article.link,
                airLanguage: article.language,
                airLogo:
                  "https://api.possible.africa/storage/logos/placeholder_org.jpeg",
                airDateAdded: new Date(article.publication_date),
                airTrans: "eng",
              });
            }
          } else {
            await Post.create({
              title: article.title,
              airTags: article.tags,
              airMedia: article.media,
              airLink: article.link,
              airLanguage: article.language,
              airLogo:
                "https://api.possible.africa/storage/logos/placeholder_org.jpeg",
              airDateAdded: new Date(article.publication_date),
              airTrans: "eng",
            });
          }
        } catch (e) {
          console.log(e);
        }
      }
    });

    // console.log({ fr: frArticles, eng: engArticles });
    res.status(200).json({ success: true });
    return { success: true };
  } catch (error) {
    res.status(404).json({ message: error.message });
    // return { message: error.message }
  }
};

exports.cronAllPostFromAirtable = async (req, res) => {
  try {
    const frResult = await fetchAllRecords(
      AIRTABLE_API_KEY,
      FRENCH_BASE_ID,
      FRENCH_ARTICLE_TABLE_ID
    );

    const frArticles = await frResult.map(async (article) => {
      const existingArticle = await Post.find({
        title: article.title,
      });
      // console.log(existingArticle);
      if (existingArticle.length === 0) {
        try {
          if (article.link) {
            let domain_racine = extraireDomaine(article.link);
            if (domain_racine) {
              domain_racine = domain_racine.slice(8);
              // console.log(domain_racine);
              const img_name = domain_racine.split(".").join("") + ".jpg";
              const path = `${Path.resolve(
                __dirname,
                "../../public/storage/logos"
              )}/${img_name}`;
              await downloadImage(article.logo, path);
              let urla = `https://api.possible.africa/storage/logos/${img_name}`;

              await Post.create({
                title: article.title,
                airTags: article.tags,
                airMedia: article.media,
                airLink: article.link,
                airLanguage: article.language,
                airLogo: urla,
                airDateAdded: new Date(article.publication_date),
                airTrans: "fr",
              });
            } else {
              await Post.create({
                title: article.title,
                airTags: article.tags,
                airMedia: article.media,
                airLink: article.link,
                airLanguage: article.language,
                airLogo:
                  "https://api.possible.africa/storage/logos/placeholder_org.jpeg",
                airDateAdded: new Date(article.publication_date),
                airTrans: "fr",
              });
            }
          } else {
            await Post.create({
              title: article.title,
              airTags: article.tags,
              airMedia: article.media,
              airLink: article.link,
              airLanguage: article.language,
              airLogo:
                "https://api.possible.africa/storage/logos/placeholder_org.jpeg",
              airDateAdded: new Date(article.publication_date),
              airTrans: "fr",
            });
          }
        } catch (e) {
          console.log(e);
        }
      }
    });

    const engResult = await fetchAllRecords(
      AIRTABLE_API_KEY,
      ENGLISH_BASE_ID,
      ENGLISH_ARTICLE_TABLE_ID
    );
    const engArticles = await engResult.map(async (article) => {
      const existingArticle = await Post.find({
        title: article.title,
      });
      // console.log(existingArticle);
      if (existingArticle.length === 0) {
        try {
          if (article.link) {
            let domain_racine = extraireDomaine(article.link);
            if (domain_racine) {
              domain_racine = domain_racine.slice(8);
              // console.log(domain_racine);
              const img_name = domain_racine.split(".").join("") + ".jpg";
              const path = `${Path.resolve(
                __dirname,
                "../../public/storage/logos"
              )}/${img_name}`;
              await downloadImage(article.logo, path);
              let urla = `https://api.possible.africa/storage/logos/${img_name}`;

              await Post.create({
                title: article.title,
                airTags: article.tags,
                airMedia: article.media,
                airLink: article.link,
                airLanguage: article.language,
                airLogo: urla,
                airDateAdded: new Date(article.publication_date),
                airTrans: "eng",
              });
            } else {
              await Post.create({
                title: article.title,
                airTags: article.tags,
                airMedia: article.media,
                airLink: article.link,
                airLanguage: article.language,
                airLogo:
                  "https://api.possible.africa/storage/logos/placeholder_org.jpeg",
                airDateAdded: new Date(article.publication_date),
                airTrans: "eng",
              });
            }
          } else {
            await Post.create({
              title: article.title,
              airTags: article.tags,
              airMedia: article.media,
              airLink: article.link,
              airLanguage: article.language,
              airLogo:
                "https://api.possible.africa/storage/logos/placeholder_org.jpeg",
              airDateAdded: new Date(article.publication_date),
              airTrans: "eng",
            });
          }
        } catch (e) {
          console.log(e);
        }
      }
    });

    // console.log({ fr: frArticles, eng: engArticles });
    // res.status(200).json({ success: true });
    return { success: true };
  } catch (error) {
    // res.status(404).json({ message: error.message });
    return { message: error.message };
  }
};

exports.getEnglishPostFromAirtable = async (req, res) => {
  const { limit, page, sort, fields, eq } = req.query;
  const queryObj = CustomUtils.advancedQueryAirtable(req.query);
  try {
    const result = await fetchAllRecords(
      AIRTABLE_API_KEY,
      ENGLISH_BASE_ID,
      ENGLISH_ARTICLE_TABLE_ID,
      limit * 1,
      queryObj
    );
    const articles = await result.map(async (article) => {
      const existingArticle = await Post.find({
        title: article.title,
      });
      if (existingArticle.length === 0) {
        try {
          await Post.create({
            title: article.title,
            airTags: article.tags,
            airMedia: article.media,
            airLink: article.link,
            airLanguage: article.language,
            airLogo: article.logo,
            airDateAdded: article.publication_date,
            airTrans: "eng",
          });
        } catch (e) {
          console.log(e);
        }
      }
    });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.getAllPosts = async (req, res) => {
  let { limit, page, sort, fields, _start, _end, possible } = req.query;
  const queryObj = CustomUtils.advancedQuery(req.query);
  // console.log(queryObj);
  try {
    if (_end && (_start || _start == 0)) {
      limit = _end - _start;
    }
    if (possible) {
      const postsFrFin = await Post.find({ ...queryObj, airTrans: "fr" })
        .limit(limit * 1)
        .skip(_start ? _start : 0)
        .sort({ airDateAdded: -1, ...sort })
        .select(fields);
      const postsEngFin = await Post.find({ ...queryObj, airTrans: "eng" })
        .limit(limit * 1)
        .skip(_start ? _start : 0)
        .sort({ airDateAdded: -1, ...sort })
        .select(fields);
      
      console.log(postsFrFin);

      return res.status(200).json([...postsFrFin, ...postsEngFin]);
    }
    const posts = await Post.find({ ...queryObj })
      .limit(limit * 1)
      .skip(_start ? _start : 0)
      .sort({ airDateAdded: -1, ...sort })
      .select(fields);
    res.status(200).json(posts);

    // const posts = await Post.find();
    // const allPosts = await posts.map(async (e) => {
    //   console.log(e);
    //   await Post.findByIdAndUpdate(
    //     e._id,
    //     { dateAdded: new Date(e.dateAdded) },
    //     {
    //       new: true,
    //     }
    //   );
    // });
    // res.status(200).json(allPosts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @Get post by id
// @route GET /api/v1/posts/:id
// @access Public

exports.getPostById = async (req, res) => {
  try {
    // get post by id
    const post = await Post.findById(req.params.id);
    if (!post)
      return res.status(404).json({ message: CustomUtils.consts.NOT_EXIST });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Create post
// @route POST /api/v1/posts
// @access Public

exports.createPost = async (req, res) => {
  const CustomBody = { ...req.body };

  const title = CustomBody.title;
  const slug = CustomUtils.slugify(title);

  try {
    if (req.user) CustomBody.user = req.user._id;
    CustomBody.slug = slug;
    if (CustomBody.source) {
      const existantSource = await Post.find({ source: CustomBody.source });
      if (existantSource.length)
        return res
          .status(400)
          .json({ message: CustomUtils.consts.EXISTING_POST_WITH_SOURCE });
    }
    const post = await Post.create(CustomBody);
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Update post
// @route PUT /api/v1/posts/:id
// @access Public

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: CustomUtils.consts.NOT_EXIST });
    }

    if (req.user) req.body.user = post.user;
    const updated = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Delete post
// @route DELETE /api/v1/posts/:id
// @access Public
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: CustomUtils.consts.NOT_EXIST });
    }

    await Post.findByIdAndDelete(req.params.id);
    return res.status(200).json({});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

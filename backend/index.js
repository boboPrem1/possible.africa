const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connection = require("./db");
const http = require("http");
const multer = require("multer");
const cron = require("node-cron");
// const cron = require("node-cron");
// import dotenv
require("dotenv").config();

// Configurer le stockage des fichiers
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, `${__dirname}/uploads/`);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, file.fieldname + "-" + uniqueSuffix);
//   },
// });

// Initialiser l'upload de Multer

const app = express();
const server = http.createServer(app);
// const { Server } = require("socket.io");

const PORT = process.env.SERVER_PORT || 4534;
const API_URL_BASE = process.env.API_URL_BASE ? process.env.API_URL_BASE : "/";
// const DASH_URL =
//   process.env.ENV === "dev"
//     ? process.env.DASH_URL_DEV
//     : process.env.DASH_URL_PROD;
const URL_CONNECT_DEV = process.env.URL_CONNECT;

const userRoutes = require("./endpoints/users/userRoutes");
const permissionRoutes = require("./endpoints/permissions/permissionsRoutes");
const apiKeyRoutes = require("./endpoints/apiKeys/apiKeysRoutes");
const profilRoutes = require("./endpoints/profil/profilRoutes");
const userRolesRoutes = require("./endpoints/userRoles/userRoleRoutes");
const userTypesRoutes = require("./endpoints/userTypes/userTypeRoutes");
const organisationTypeRoutes = require("./endpoints/organisationTypes/organisationTypeRoutes");
const organisationRoutes = require("./endpoints/organisations/organisationRoutes");
const airtableOrganisationRoutes = require("./endpoints/organisations/airtableOrganisationRoutes");
const authRoutes = require("./endpoints/auth/authRouter");
const jobRoutes = require("./endpoints/jobs/jobRoutes");
const opportunityTypeRoutes = require("./endpoints/opportunityTypes/opportunityTypeRoutes");
const opportunityTargetRoutes = require("./endpoints/opportunityTargets/opportunityTargetRoutes");
const opportunityRoutes = require("./endpoints/opportunities/opportunityRoutes");
const eventTypeRoutes = require("./endpoints/eventsTypes/eventTypeRoutes");
const eventRoutes = require("./endpoints/events/eventRoutes");
const postCategorieRoutes = require("./endpoints/postCategories/postCategorieRoutes");
const postLabelRoutes = require("./endpoints/postLabel/postLabelRoutes");
const postRoutes = require("./endpoints/posts/postRouter");
const airtablePostRoutes = require("./endpoints/posts/airtablePostRouter");
const activityAreaRoutes = require("./endpoints/activityAreas/activityAreaRoutes");
const uploadRoutes = require("./endpoints/uploads/uploadRoutes");
const searchRoutes = require("./endpoints/search/searchRoutes");
const countryRoutes = require("./endpoints/countries/countryRoutes");
const dashboardRoutes = require("./endpoints/tableauDeBord/dashboardRoutes");
const newsletterSuscriberRoutes = require("./endpoints/newslettersSuscriber/newsletterSuscriberRoutes");

var whitelist = ["https://possible.africa", "https://app.possible.africa"];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
// Middleware
//
const { protect } = require("./endpoints/auth/authController.js");
const { getAllPostFromAirtable, cronAllPostFromAirtable } = require("./endpoints/posts/postController.js");
const { getOrganisationsFromAirtable, cronOrganisationsFromAirtable } = require("./endpoints/organisations/organisationController.js");
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// allow static files
app.use(express.static("public"));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.json());

//protections
app.use(API_URL_BASE, authRoutes);
app.use(protect);
app.use(API_URL_BASE + "users", userRoutes);
app.use(API_URL_BASE + "permissions", permissionRoutes);
app.use(API_URL_BASE + "api_keys", apiKeyRoutes);
app.use(API_URL_BASE + "user_types", userTypesRoutes);
app.use(API_URL_BASE + "profil", profilRoutes);
app.use(API_URL_BASE + "user_roles", userRolesRoutes);
app.use(API_URL_BASE + "organisation_types", organisationTypeRoutes);
app.use(API_URL_BASE + "organisations", organisationRoutes);
app.use(API_URL_BASE + "airtable_organisations", airtableOrganisationRoutes);
app.use(API_URL_BASE + "jobs", jobRoutes);
app.use(API_URL_BASE + "opportunity_types", opportunityTypeRoutes);
app.use(API_URL_BASE + "opportunity_targets", opportunityTargetRoutes);
app.use(API_URL_BASE + "activity_areas", activityAreaRoutes);
app.use(API_URL_BASE + "opportunities", opportunityRoutes);
app.use(API_URL_BASE + "event_types", eventTypeRoutes);
app.use(API_URL_BASE + "events", eventRoutes);
app.use(API_URL_BASE + "post_labels", postLabelRoutes);
app.use(API_URL_BASE + "post_categories", postCategorieRoutes);
app.use(API_URL_BASE + "posts", postRoutes);
app.use(API_URL_BASE + "airtable_posts", airtablePostRoutes);
app.use(API_URL_BASE + "upload", uploadRoutes);
app.use(API_URL_BASE + "search", searchRoutes);
app.use(API_URL_BASE + "countries", countryRoutes);
app.use(API_URL_BASE + "newsletterSuscribers", newsletterSuscriberRoutes);
app.use(API_URL_BASE + "dashboard", dashboardRoutes);

// Routes
app.get(API_URL_BASE, (req, res) => {
  res.json({
    message: "Bienvenue sur l'API de l'application Possible.Africa",
  });
});

cron.schedule("*/40 * * * *", () => {
  cronAllPostFromAirtable();
});

cron.schedule("*/30 * * * *", () => {
  cronOrganisationsFromAirtable();
});


// const io = new Server(server, {
//   cors: {
//     origin: DASH_URL,
//   },
// });
// io.use

// io.on("connection", (socket) => {
//   // console.log("Connexion temps réel établie !");
//   socket.on("disconnect", () => {
//     // console.log("Utilisateur déconnecté");
//   });
// });

// Start server
server.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
connection(URL_CONNECT_DEV);
// module.exports.io = io;

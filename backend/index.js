const {
  realTimeTextToSpeech,
} = require("./endpoints/realTime/speechToTextController.js");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connection = require("./db");
const http = require("http");
const multer = require("multer");
const cron = require("node-cron");
const fs = require("fs");
const socketIo = require("socket.io");

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

exports.io = socketIo(server, {
  cors: {
    origin: "*", // Permet toutes les origines
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Méthodes autorisées
    allowedHeaders: ["Content-Type"], // Headers autorisés
    credentials: true, // Autorise l'envoi de cookies si nécessaire
  },
});

realTimeTextToSpeech();

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
const organisationRoutes = require("./endpoints/organisations/organisationRoutes");
const airtableOrganisationRoutes = require("./endpoints/organisations/airtableOrganisationRoutes");
const authRoutes = require("./endpoints/auth/authRouter");
const postRoutes = require("./endpoints/posts/postRouter");
const airtablePostRoutes = require("./endpoints/posts/airtablePostRouter");
const uploadRoutes = require("./endpoints/uploads/uploadRoutes");
const searchRoutes = require("./endpoints/search/searchRoutes");
const dashboardRoutes = require("./endpoints/tableauDeBord/dashboardRoutes");

// Mass Actions
const massActionsRoutes = require("./endpoints/mass-actions/mass-actions-routes.js");

// Static Blocks
const staticBlockSitesRoutes = require("./endpoints/static-blocks/sites/siteRoutes.js");
const staticBlockPagesRoutes = require("./endpoints/static-blocks/pages/pageRoutes.js");

// Ai Generator
const aiGeneratorRoutes = require("./endpoints/ai-generator/aiRoutes.js");
const speechToTextRoutes = require("./endpoints/speech-to-text/textToSpeechRoutes.js");

const icpsRoutes = require("./endpoints/organisations/airtableIcpRoutes.js");

// var whitelist = ["https://possible.africa", "https://app.possible.africa"];
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
// };

// const corsOptions = {
//   origin: function (origin, callback) {
// const allowedOrigins = [
//   "http://possible.africa",
//   "https://possible.africa",
//   "http://www.possible.africa",
//   "https://www.possible.africa",
//   "http://www.africaleads.ai",
//   "https://www.africaleads.ai",
//   "http://pages.africaleads.ai",
//   "https://pages.africaleads.ai",
//   "http://app.possible.africa",
//   "https://app.possible.africa",
// ];
//     if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true,
// };
// Middleware
//
app.use(cors());
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", [
//     "http://possible.africa",
//     "https://possible.africa",
//     "http://www.possible.africa",
//     "https://www.possible.africa",
//     "http://www.africaleads.ai",
//     "https://www.africaleads.ai",
//     "http://pages.africaleads.ai",
//     "https://pages.africaleads.ai",
//     "http://app.possible.africa",
//     "https://app.possible.africa",
//   ]); // Remplacez 'http://example.com' par le domaine autorisé
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });
const { protect } = require("./endpoints/auth/authController.js");
const {
  getAllPostFromAirtable,
  cronAllPostFromAirtable,
} = require("./endpoints/posts/postController.js");
const {
  getOrganisationsFromAirtable,
  cronOrganisationsFromAirtable,
} = require("./endpoints/organisations/organisationController.js");
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// allow static files
app.use(express.static("public"));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.json());

//protections
app.use(API_URL_BASE, authRoutes);

// mass_actions
app.use(API_URL_BASE + "mass_actions", massActionsRoutes);

// Static Blocks urls
app.use(API_URL_BASE + "page_builder/sites", staticBlockSitesRoutes);
app.use(API_URL_BASE + "page_builder/pages", staticBlockPagesRoutes);

// AI Generator
app.use(API_URL_BASE + "ai", aiGeneratorRoutes);

// AI Generator
app.use(API_URL_BASE + "icps", icpsRoutes);
app.use(API_URL_BASE + "speech_to_text", speechToTextRoutes);

app.use(protect);
app.use(API_URL_BASE + "users", userRoutes);
app.use(API_URL_BASE + "permissions", permissionRoutes);
app.use(API_URL_BASE + "api_keys", apiKeyRoutes);
app.use(API_URL_BASE + "user_types", userTypesRoutes);
app.use(API_URL_BASE + "profil", profilRoutes);
app.use(API_URL_BASE + "user_roles", userRolesRoutes);
app.use(API_URL_BASE + "organisations", organisationRoutes);
app.use(API_URL_BASE + "airtable_organisations", airtableOrganisationRoutes);
app.use(API_URL_BASE + "posts", postRoutes);
app.use(API_URL_BASE + "airtable_posts", airtablePostRoutes);
app.use(API_URL_BASE + "upload", uploadRoutes);
app.use(API_URL_BASE + "search", searchRoutes);
app.use(API_URL_BASE + "dashboard", dashboardRoutes);

// Static Blocks urls
app.use(API_URL_BASE + "page_builder/sites", staticBlockSitesRoutes);
app.use(API_URL_BASE + "page_builder/pages", staticBlockPagesRoutes);

// AI Generator
app.use(API_URL_BASE + "ai", aiGeneratorRoutes);

// Routes
app.get(API_URL_BASE, (req, res) => {
  res.json({
    message: "Bienvenue sur l'API de l'application Possible.Africa",
  });
});

cron.schedule("0 12 * * *", () => {
  cronAllPostFromAirtable();
  console.log(
    "cronAllPostFromAirtable executed at " + new Date().toISOString()
  );
});

cron.schedule("30 12 * * *", () => {
  cronOrganisationsFromAirtable();
  console.log(
    "cronAllOrganisationFromAirtable executed at " + new Date().toISOString()
  );
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

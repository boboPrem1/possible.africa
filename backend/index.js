const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connection = require("./db");
const http = require("http");
const multer = require("multer");
const cron = require("node-cron");
const fs = require("fs");
const socketIo = require("socket.io");
const path = require("path");
const { SpeechClient } = require("@google-cloud/speech");
// const language = require('@google-cloud/language');
// const client = new language.LanguageServiceClient();
// const openai = require("./open-api.js");

// async function improveText(text) {
//   const transformed = await openai.complete({
//   model: "text-davinci-003",
//   prompt: `Réécris ce texte de manière plus naturelle avec une ponctuation correcte : "${transcription}"`,
//   max_tokens: 150,
// });
//   return transformed;
// }

// Initialiser le client Google Cloud Speech
const speechClient = new SpeechClient();
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

const io = socketIo(server, {
  cors: {
    origin: "*", // Permet toutes les origines
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Méthodes autorisées
    allowedHeaders: ["Content-Type"], // Headers autorisés
    credentials: true, // Autorise l'envoi de cookies si nécessaire
  },
});

// Chemin où seront stockés les fichiers audio
const AUDIO_STORAGE_PATH = path.join(__dirname, "public", "storage", "audios");
const TRANSCRIPTION_STORAGE_PATH = path.join(
  __dirname,
  "public",
  "storage",
  "transcriptions"
);

io.on("connection", (socket) => {
  const clientId = socket.id;
  console.log(`Client connecté avec ID: ${clientId}`);
  let audioStream = null;
  let transcriptionStream = null;
  let recognizeStream = null;

  // Créer un flux audio pour la transcription
  const requestConfig = {
    config: {
      encoding: "WEBM_OPUS", // Codec WebM par défaut
      sampleRateHertz: 48000, // Assurez-vous que cela correspond à l'audio envoyé
      languageCode: "fr-FR", // La langue à utiliser pour la transcription
      enableAutomaticPunctuation: true,
    },
    interimResults: true, // Recevoir des résultats partiels
  };

  socket.on("recordStarted", (filename) => {
    console.log(`Enregistrement démarré pour le fichier: ${filename}`);

    audioStream = fs.createWriteStream(
      path.join(AUDIO_STORAGE_PATH, filename + ".webm"),
      {
        flags: "a", // Ajouter les chunks au fichier
      }
    );

    // socket.emit("audioFileCreated", filename);
    transcriptionStream = fs.createWriteStream(
      path.join(TRANSCRIPTION_STORAGE_PATH, filename + ".txt"),
      {
        flags: "a", // Appendre au fichier
      }
    );

    recognizeStream = speechClient
      .streamingRecognize(requestConfig)
      .on("error", (error) => {
        console.error("Erreur lors de la transcription:", error);
        socket.emit("transcriptionError", "Erreur de transcription.");
      })
      .on("data", (data) => {
        const transcript = data.results
          .map((result) => result.alternatives[0].transcript)
          .join("\n");

        console.log("Transcription:", transcript);

        // Écrire la transcription dans le fichier .txt
        transcriptionStream.write(transcript + "\n");

        // Envoyer la transcription partielle à l'utilisateur
        socket.emit("transcriptionChunk", transcript);
      });

    // Vérifier si le stream est bien créé
    audioStream.on("open", () => {
      console.log("Flux audio créé et prêt pour l'écriture.");
      socket.emit("audioStreamCreated", "Flux audio créé");
    });

    audioStream.on("error", (error) => {
      console.error("Erreur lors de la création du flux:", error);
      socket.emit("error", "Erreur lors de la création du flux audio");
    });
  });

  // socket.on("audioFileCreated", (filename) => {

  // });

  socket.on("audioChunk", (chunk) => {
    try {
      console.log("Chunk d'audio reçu, en cours d'écriture...");
      // Écrire les chunks dans le fichier
      audioStream.write(chunk, (err) => {
        if (err) {
          console.error("Erreur lors de l'écriture du chunk:", err);
          socket.emit("error", "Erreur lors de l'écriture du chunk");
        } else {
          socket.emit("chunkWritten", "Chunk écrit avec succès");
        }
      });

      console.log("Chunk de transcription, en cours d'écriture...");
      recognizeStream.write(chunk);
    } catch (err) {
      console.error("Erreur lors de la réception du chunk:", err);
      socket.emit("error", "Erreur lors de la réception du chunk");
    }
  });

  socket.on("recordEnd", () => {
    console.log("Enregistrement terminé.");
    if (audioStream) {
      audioStream.end(() => {
        console.log("Flux audio fermé proprement.");
        socket.emit(
          "recordingCompleted",
          "Enregistrement terminé et fichier fermé"
        );
        fs.unlinkSync(path.join(audioStream.path));
      });
    }
    if (recognizeStream && transcriptionStream) {
      recognizeStream.end(); // Terminer le flux si le client se déconnecte
      transcriptionStream.end(() => {
        console.log("Flux de transcription fermé proprement.");

        socket.emit(
          "transcriptionCompleted",
          "Transcription terminée et fichier fermé"
        );
        
        fs.unlinkSync(path.join(transcriptionStream.path));
      });
    }
  });

  socket.on("disconnect", () => {
    console.log(`Client déconnecté: ${socket.id}`);
    if (audioStream) {
      audioStream.end(() => {
        console.log("Flux audio fermé suite à la déconnexion.");
        fs.unlinkSync(path.join(audioStream.path));
      });
    }
    if (recognizeStream && transcriptionStream) {
      recognizeStream.end(); // Terminer le flux si le client se déconnecte
      transcriptionStream.end(() => {
        console.log("Flux de transcription fermé suite à la déconnexion.");
        fs.unlinkSync(path.join(transcriptionStream.path));
      });
    }
  });
});
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

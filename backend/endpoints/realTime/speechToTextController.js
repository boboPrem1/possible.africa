const { io } = require("../..");
const path = require("path");

exports.realTimeTextToSpeech = async () => {
  // Chemin où seront stockés les fichiers audio
  const AUDIO_STORAGE_PATH = path.join(
    __dirname,
    "public",
    "storage",
    "audios"
  );

  io.on("connection", (socket) => {
    const clientId = socket.id;
    console.log(`Client connecté avec ID: ${clientId}`);
    let audioStream = null;

    socket.on("recordStarted", (filename) => {
      console.log(`Enregistrement démarré pour le fichier: ${filename}.webm`);

      audioStream = fs.createWriteStream(
        path.join(AUDIO_STORAGE_PATH, filename + ".webm"),
        {
          flags: "a", // Ajouter les chunks au fichier
        }
      );

      socket.emit("audioFileCreated", filename);

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

    socket.on("audioFileCreated", (filename) => {
        transcriptionFile = fs.createWriteStream(
          `/public/storage/transcriptions/${filename}.txt`,
          {
            flags: "a", // Appendre au fichier
          }
        );
    });

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
        });
      }
    });

    socket.on("disconnect", () => {
      console.log(`Client déconnecté: ${socket.id}`);
      if (audioStream) {
        audioStream.end(() => {
          console.log("Flux audio fermé suite à la déconnexion.");
        });
      }
    });
  });
};

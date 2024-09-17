// // const Permission = require("./emails/emailsModel.js");
// const { SpeechClient } = require("@google-cloud/speech");

// const speechClient = new SpeechClient();

// // @Get all generate any
// // @Route: /api/v1/generate_any
// // @Access: Public
// exports.textToSpeech = async (req, res, next) => {
//   // Configurer Google Speech Client
//   const audioBuffer = req.file.buffer;

//   // Paramètres de configuration de la reconnaissance vocale Google Cloud
//   const audioBytes = audioBuffer.toString("base64");
//   const audio = {
//     content: audioBytes,
//   };
//   const config = {
//     encoding: "LINEAR16", // Si vous envoyez du wav, utilisez LINEAR16
//     sampleRateHertz: 16000, // Assurez-vous d'envoyer le bon taux d'échantillonnage
//     languageCode: "fr-FR", // Changez la langue si nécessaire
//   };
//   const request = {
//     audio: audio,
//     config: config,
//   };

//   try {
//     // Appel à Google Speech-to-Text
//     const [response] = await speechClient.recognize(request);
//     const transcription = response.results
//       .map((result) => result.alternatives[0].transcript)
//       .join("\n");

//     console.log(`Transcription : ${transcription}`);
//     return res.json({ transcription });
//   } catch (err) {
//     console.error("Erreur lors de la transcription", err);
//     res.status(500).json({ error: "Erreur lors de la transcription" });
//   }
// };

const { SpeechClient } = require("@google-cloud/speech");

// Initialiser le client Google Cloud Speech
const speechClient = new SpeechClient();

// @Description: Transcription de l'audio en texte (Speech-to-Text)
// @Route: POST /api/v1/text_to_speech
// @Access: Public
exports.textToSpeech = async (req, res, next) => {
  // Vérifier si un fichier a été envoyé
  // if (!req.file || !req.file.buffer) {
  //   return res.status(400).json({ error: "Aucun fichier audio trouvé" });
  // }

  // try {
  //   // Convertir le buffer audio en base64
  //   const audioBytes = req.file.buffer.toString("base64");

  //   // Paramétrer l'audio et la configuration pour Google Speech-to-Text
  //   const audio = {
  //     content: audioBytes,
  //   };

  //   const config = {
  //     encoding: "WEBM_OPUS", // Utilisé pour les fichiers WAV
  //     sampleRateHertz: 48000, // Assurez-vous d'envoyer le bon taux d'échantillonnage
  //     languageCode: "fr-FR", // Changez la langue selon vos besoins
  //   };

  //   const request = {
  //     audio: audio,
  //     config: config,
  //   };

  //   // Appel à l'API Google Cloud Speech-to-Text pour la reconnaissance vocale
  //   const [response] = await speechClient.recognize(request);

  //   // Extraire la transcription à partir de la réponse
  //   const transcription = response.results
  //     .map((result) => result.alternatives[0].transcript)
  //     .join("\n");

  //   // Retourner la transcription en JSON
  //   return res.json({ transcription });
  if (!req.file || !req.file.buffer) {
    return res.status(400).json({ error: "Aucun fichier audio trouvé" });
  }

  try {
    // Convertir le buffer audio en base64
    const audioBytes = req.file.buffer.toString("base64");

    // Paramétrer l'audio et la configuration pour Google Speech-to-Text
    const audio = {
      content: audioBytes,
    };

    const config = {
      encoding: "WEBM_OPUS", // Utilisé pour les fichiers en format Opus
      sampleRateHertz: 48000, // Assurez-vous d'envoyer le bon taux d'échantillonnage
      languageCode: "fr-FR", // Changez la langue selon vos besoins
    };

    const request = {
      audio: audio,
      config: config,
    };

    // Vérifier si la longueur de l'audio dépasse 1 minute
    const audioDurationSeconds = req.file.size / (48000 * 2); // Taille du fichier en secondes

    if (audioDurationSeconds > 60) {
      // Pour un fichier audio long, utiliser longRunningRecognize
      const [operation] = await speechClient.longRunningRecognize(request);
      const [response] = await operation.promise();

      // Extraire la transcription à partir de la réponse
      const transcription = response.results
        .map((result) => result.alternatives[0].transcript)
        .join("\n");

      // Retourner la transcription en JSON
      return res.json({ transcription });
    } else {
      // Si l'audio est court, utiliser recognize pour une réponse rapide
      const [response] = await speechClient.recognize(request);

      // Extraire la transcription à partir de la réponse
      const transcription = response.results
        .map((result) => result.alternatives[0].transcript)
        .join("\n");

      // Retourner la transcription en JSON
      return res.json({ transcription });
    }
  } catch (err) {
    // Gérer les erreurs de transcription
    console.error("Erreur lors de la transcription:", err);
    return res.status(500).json({ error: "Erreur lors de la transcription" });
  }

  // } catch (err) {
  //   // Gérer les erreurs de transcription
  //   console.error("Erreur lors de la transcription:", err);
  //   return res.status(500).json({ error: "Erreur lors de la transcription" });
  // }
};

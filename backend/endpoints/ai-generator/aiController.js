// const Permission = require("./emails/emailsModel.js");
const openai = require("../../open-api.js");
const CustomUtils = require("../../utils/index.js");
// const OpenAI = require("openai");

// const openai = new OpenAI();

// @Get all generate email
// @Route: /api/v1/generate_email
// @Access: Public
exports.generateEmail = async (req, res, next) => {
  try {
    const prompt = req.body.prompt;
    // const completion = await openai.chat.completions.create({
    //   messages: [{ role: "user", content: prompt }],
    //   model: "gpt-3.5-turbo",
    // });
    // // res.json({ email: response.data.choices[0].text.trim() });
    // res.json({ email: completion.choices[0].message.content });
    let completion;
    try {
      // Essayer d'utiliser GPT-4
      completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-4",
      });
    } catch (error) {
      console.error(
        "GPT-4 non disponible, utilisation de GPT-3.5-turbo à la place.",
        error
      );

      // Fallback vers GPT-3.5-turbo si GPT-4 échoue
      completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
      });
    }
    res.json({ email: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @Get all generate any
// @Route: /api/v1/generate_any
// @Access: Public
exports.generateAny = async (req, res, next) => {
  try {
    const prompt = req.body.prompt;
    // const completion = await openai.chat.completions.create({
    //   messages: [{ role: "user", content: prompt }],
    //   model: "gpt-3.5-turbo",
    // });
    let completion;
    try {
      // Essayer d'utiliser GPT-4
      completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-4",
      });
    } catch (error) {
      console.error(
        "GPT-4 non disponible, utilisation de GPT-3.5-turbo à la place.",
        error
      );

      // Fallback vers GPT-3.5-turbo si GPT-4 échoue
      completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
      });
    }
    // res.json({ email: response.data.choices[0].text.trim() });
    res.json({ completion: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.ORG_ID,
  project: process.env.PROJECT_ID,
});

module.exports = openai;

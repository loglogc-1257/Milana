const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { sendMessage } = require('../handles/sendMessage');

// Lire le token de la page depuis le fichier 'token.txt'
const tokenPath = './token.txt';
const pageAccessToken = fs.readFileSync(tokenPath, 'utf8').trim();

module.exports = {
  config: {
    name: "de",
    aliases: [],
    version: "1.0",
    author: "vex_Kshitiz",
    countDown: 5,
    role: 0,
    shortDescription: "Dalle- E",
    longDescription: "Dall - E",
    category: "image",
    guide: {
      en: "{p}meina [prompt]"
    }
  },

  onStart: async function ({ senderId, args }) {
    try {
      const baseUrl = "https://kshitiz-t2i-x6te.onrender.com/sdxl";
      let prompt = '';
      const model_id = 33;

      if (args.length > 0) {
        prompt = args.join(" ").trim();
      } else {
        await sendMessage(senderId, "❌ | Please provide a prompt.", pageAccessToken);
        return;
      }

      const apiResponse = await axios.get(baseUrl, {
        params: {
          prompt: prompt,
          model_id: model_id
        }
      });

      if (apiResponse.data.imageUrl) {
        const imageUrl = apiResponse.data.imageUrl;
        const imagePath = path.join(__dirname, "cache", `de.png`);
        const imageResponse = await axios.get(imageUrl, { responseType: "stream" });
        const imageStream = imageResponse.data.pipe(fs.createWriteStream(imagePath));

        imageStream.on("finish", async () => {
          const stream = fs.createReadStream(imagePath);
          await sendMessage(senderId, {
            body: "",
            attachment: stream
          }, pageAccessToken);
        });
      } else {
        throw new Error("Image URL not found in response");
      }
    } catch (error) {
      console.error("Error:", error);
      await sendMessage(senderId, "❌ | An error occurred. Please try again later.", pageAccessToken);
    }
  }
};

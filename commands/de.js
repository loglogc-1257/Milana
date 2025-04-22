const axios = require("axios");
const path = require("path");
const fs = require("fs");

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

  onStart: async function ({ api, event, args }) {
    // Vérifie si `commande.nom` existe et si la méthode `toLowerCase` est valide
    const commandName = (commande.nom && typeof commande.nom.toLowerCase === 'function') 
      ? commande.nom.toLowerCase()
      : null;

    if (!commandName) {
      console.error("Nom de commande non défini ou mal défini:", commande.nom);
      return;
    }

    api.setMessageReaction("🕐", event.messageID, (err) => {}, true);
    try {
      const baseUrl = "https://kshitiz-t2i-x6te.onrender.com/sdxl";
      let prompt = '';
      const model_id = 33; 

      if (args.length > 0) {
        prompt = args.join(" ").trim();
      } else {
        return api.sendMessage("❌ | Please provide a prompt.", event.threadID, event.messageID);
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
        
        imageStream.on("finish", () => {
          const stream = fs.createReadStream(imagePath);
          api.sendMessage({
            body: "✅ | Here's your generated image 😘",
            attachment: stream
          }, event.threadID, event.messageID);
        });
      } else {
        throw new Error("Image URL not found in response");
      }
    } catch (error) {
      console.error("Error:", error);
      api.sendMessage("❌ | An error occurred. Please try again later.", event.threadID, event.messageID);
    }
  }
};

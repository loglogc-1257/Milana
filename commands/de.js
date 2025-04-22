const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'de',
  description: "Génère une image avec DALL·E via SDXL",
  usage: 'de [prompt]',
  author: 'vex_Kshitiz',

  async execute(senderId, args, pageAccessToken) {
    if (!args || args.length === 0) {
      await sendMessage(senderId, {
        text: '❌ Veuillez fournir une description.\n\n𝗘𝘅𝗮𝗺𝗽𝗹𝗲: de un château sous la pluie.'
      }, pageAccessToken);
      return;
    }

    const prompt = args.join(" ").trim();
    const baseUrl = "https://kshitiz-t2i-x6te.onrender.com/sdxl";
    const model_id = 33;

    await sendMessage(senderId, { text: '♻️ Génération en cours...' }, pageAccessToken);

    try {
      const apiResponse = await axios.get(baseUrl, {
        params: {
          prompt,
          model_id
        }
      });

      if (!apiResponse.data.imageUrl) {
        throw new Error("Image URL not found in response");
      }

      const imageUrl = apiResponse.data.imageUrl;

      await sendMessage(senderId, {
        attachment: {
          type: 'image',
          payload: {
            url: imageUrl,
            is_reusable: true
          }
        }
      }, pageAccessToken);

    } catch (error) {
      console.error("Erreur lors de la génération de l’image:", error);
      await sendMessage(senderId, { text: "❌ Erreur lors de la génération de l’image." }, pageAccessToken);
    }
  }
};

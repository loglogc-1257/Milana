// createai
const axios = require("axios");
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: "createai",
  description: "Créer une image avec AI",
  role: 1,
  author: "YourName",

  async execute(api, event, args) {
    if (!args || args.length === 0) {
      await sendMessage(api, { text: "Veuillez fournir un texte pour générer une image." }, event.threadID);
      return;
    }

    const query = args.join(" ");
    const imageUrl = "https://image.pollinations.ai/prompt/" + encodeURIComponent(query);

    try {
      await sendMessage(api, {
        attachment: {
          type: "image",
          payload: { url: imageUrl }
        }
      }, event.threadID);
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'image :", error);
      await sendMessage(api, { text: "Une erreur est survenue lors de la génération de l'image." }, event.threadID);
    }
  }
};

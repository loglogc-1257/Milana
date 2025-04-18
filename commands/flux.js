const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'qwen',
  description: "Crée une image à partir d'une description",
  usage: 'qwen [description]',
  author: 'Stanley',

  async execute(senderId, args, pageAccessToken) {
    if (!args || args.length === 0) {
      await sendMessage(senderId, {
        text: '❌ Tu dois fournir une description pour générer une image.\n\n𝗘𝘅𝗲𝗺𝗽𝗹𝗲: qwen un paysage futuriste.'
      }, pageAccessToken);
      return;
    }

    const prompt = args.join(" ");
    const apiUrl = `https://api.zetsu.xyz/api/dalle-3?prompt=${encodeURIComponent(prompt)}&apikey=33b3f9c359186f7ef15aeb39c422f88d`;

    await sendMessage(senderId, { text: '⏳ Création de l’image, un instant...' }, pageAccessToken);

    try {
      await sendMessage(senderId, {
        attachment: { type: 'image', payload: { url: apiUrl } }
      }, pageAccessToken);
    } catch (error) {
      console.error('Erreur API DALL·E:', error);
      await sendMessage(senderId, { text: "❌ Une erreur est survenue lors de la génération." }, pageAccessToken);
    }
  }
};

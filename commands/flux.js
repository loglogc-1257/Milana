const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'qwen',
  description: "Génère un lien vers une image avec Flux",
  usage: 'qwen [description]',
  author: 'Stanley',

  async execute(senderId, args, pageAccessToken) {
    if (!args || args.length === 0) {
      await sendMessage(senderId, {
        text: '❌ Veuillez fournir une description.\n\n𝗘𝘅𝗮𝗺𝗽𝗹𝗲 : qwen un dragon rouge.'
      }, pageAccessToken);
      return;
    }

    const prompt = args.join(" ");
    const apiUrl = `https://api.zetsu.xyz/api/qwen?prompt=${encodeURIComponent(prompt)}`;

    await sendMessage(senderId, { text: '⏳ Patiente pendant la génération du lien (jusqu’à 30-60 secondes)...' }, pageAccessToken);

    try {
      const response = await axios.get(apiUrl, {
        responseType: 'text',
        timeout: 60000 // Attend jusqu’à 60 secondes
      });

      const resultUrl = response.data;

      await sendMessage(senderId, {
        text: `✅ Lien généré :\n${resultUrl}`
      }, pageAccessToken);

    } catch (error) {
      console.error('Erreur lors de la génération du lien :', error.message);
      await sendMessage(senderId, {
        text: '❌ Une erreur est survenue pendant la génération. Essaie à nouveau un peu plus tard.'
      }, pageAccessToken);
    }
  }
};

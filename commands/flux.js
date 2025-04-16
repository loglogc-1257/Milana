const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'qwen',
  description: "Génère un lien d'image via l'API Flux",
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

    await sendMessage(senderId, { text: '⏳ Génération du lien en cours...' }, pageAccessToken);

    try {
      const response = await axios.get(apiUrl, { responseType: 'text' }); // texte brut

      const imageUrl = response.data;

      await sendMessage(senderId, {
        text: `✅ Voici ton image :\n${imageUrl}`
      }, pageAccessToken);

    } catch (error) {
      console.error('Erreur lors de la génération du lien :', error.message);
      await sendMessage(senderId, {
        text: '❌ Une erreur est survenue. Veuillez réessayer plus tard.'
      }, pageAccessToken);
    }
  }
};

const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'flux',
  description: "Répond avec l'API Qwen de Zetsu",
  usage: 'flux [prompt]',
  author: 'Stanley',

  async execute(senderId, args, pageAccessToken) {
    if (!args || args.length === 0) {
      await sendMessage(senderId, {
        text: '❌ Veuillez fournir une description.\n\n𝗘𝘅𝗮𝗺𝗽𝗹𝗲: flux explique la gravité.'
      }, pageAccessToken);
      return;
    }

    const prompt = args.join(" ");
    const apiUrl = `https://api.zetsu.xyz/api/qwen?prompt=${encodeURIComponent(prompt)}`;

    await sendMessage(senderId, { text: '♻️ Réflexion en cours...' }, pageAccessToken);

    try {
      const response = await axios.get(apiUrl);
      const reply = response.data?.reply || "❌ Aucune réponse obtenue.";

      await sendMessage(senderId, { text: reply }, pageAccessToken);
    } catch (error) {
      console.error('Erreur API Qwen:', error);
      await sendMessage(senderId, { text: "❌ Erreur lors de la récupération de la réponse." }, pageAccessToken);
    }
  }
};

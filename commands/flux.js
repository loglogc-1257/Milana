const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'qwen',
  description: "Génère une image avec Flux",
  usage: 'qwen [prompt]',
  author: 'Stanley',

  async execute(senderId, args, pageAccessToken) {
    if (!args || args.length === 0) {
      await sendMessage(senderId, {
        text: '❌ Veuillez fournir une description.\n\n𝗘𝘅𝗮𝗺𝗽𝗹𝗲: flux un dragon rouge.'
      }, pageAccessToken);
      return;
    }

    const prompt = args.join(" ");
    const apiUrl = `https://api.zetsu.xyz/api/qwen?prompt=${encodeURIComponent(prompt)}`;

    await sendMessage(senderId, { text: '🎃🚬 Génération en cours...' }, pageAccessToken);

    try {
      const response = await axios.get(apiUrl);
      const imageUrl = response.data?.url;

      if (!imageUrl) {
        throw new Error("URL d'image non trouvée.");
      }

      await sendMessage(senderId, {
        attachment: { type: 'image', payload: { url: imageUrl } }
      }, pageAccessToken);
    } catch (error) {
      console.error('Erreur API Flux:', error);
      await sendMessage(senderId, { text: "❌ Erreur lors de la génération de l’image." }, pageAccessToken);
    }
  }
};

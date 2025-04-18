const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'qwen',
  description: "Génère une image avec l'intelligence artificielle DALL·E 3",
  usage: 'qwen [description]',
  author: 'Stanley',

  async execute(senderId, args, pageAccessToken) {
    if (!args || args.length === 0) {
      await sendMessage(senderId, {
        text: '❌ Tu dois fournir une description pour générer une image.\n\n𝗘𝘅𝗲𝗺𝗽𝗹𝗲: qwen un dragon rouge dans une forêt enchantée.'
      }, pageAccessToken);
      return;
    }

    const prompt = args.join(" ");
    const apiUrl = `https://api.zetsu.xyz/api/dalle-3?prompt=${encodeURIComponent(prompt)}&apikey=33b3f9c359186f7ef15aeb39c422f88d`;

    await sendMessage(senderId, { text: '⏳ Génération de l’image en cours, patiente un peu...' }, pageAccessToken);

    try {
      const response = await axios.get(apiUrl);

      // Vérifie que l’URL de l’image est bien présente dans la réponse
      const imageUrl = response.data?.url || response.data?.image || response.data?.data;
      if (!imageUrl || typeof imageUrl !== 'string') {
        throw new Error("URL de l'image non trouvée ou invalide.");
      }

      await sendMessage(senderId, {
        attachment: {
          type: 'image',
          payload: { url: imageUrl }
        }
      }, pageAccessToken);
    } catch (error) {
      console.error('Erreur API DALL·E:', error);
      await sendMessage(senderId, {
        text: "❌ Une erreur est survenue pendant la génération de l’image. Réessaie avec une autre description ou plus tard."
      }, pageAccessToken);
    }
  }
};

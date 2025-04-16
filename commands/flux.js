const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'qwen',
  description: "Test de l'API de génération d'image en envoyant plusieurs prompts",
  usage: 'qwen [prompt1] [prompt2] ...',
  author: 'Stanley',

  async execute(senderId, args, pageAccessToken) {
    if (!args || args.length === 0) {
      await sendMessage(senderId, {
        text: '❌ Veuillez fournir au moins un prompt pour tester l\'API.'
      }, pageAccessToken);
      return;
    }

    const prompts = args.join(", ");
    const apiUrl = `https://api.zetsu.xyz/api/qwen?prompt=${encodeURIComponent(prompts)}`;

    // Message de chargement
    await sendMessage(senderId, { text: '⏳ Test en cours... Veuillez patienter jusqu’à 60 secondes.' }, pageAccessToken);

    try {
      const response = await axios.get(apiUrl, {
        responseType: 'text',
        timeout: 60000 // Jusqu’à 60 secondes d'attente
      });

      const resultUrl = response.data;

      await sendMessage(senderId, {
        text: `✅ Voici le lien généré :\n${resultUrl}`
      }, pageAccessToken);

    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        // Timeout après 60 secondes
        console.error('Erreur de timeout API :', error.message);
        await sendMessage(senderId, {
          text: '❌ Le délai d\'attente de 60 secondes a été dépassé. Veuillez réessayer plus tard.'
        }, pageAccessToken);
      } else {
        // Autres erreurs
        console.error('Erreur lors de la requête API :', error.message);
        await sendMessage(senderId, {
          text: '❌ Une erreur est survenue lors de la génération. Veuillez réessayer plus tard.'
        }, pageAccessToken);
      }
    }
  }
};

const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'ai',
  description: 'Génère du code ou répond à des questions comme GitHub Copilot',
  usage: 'ai [votre message]',
  author: 'coffee',

  async execute(senderId, args, pageAccessToken) {
    const prompt = args.join(' ');
    if (!prompt) {
      return sendMessage(senderId, {
        text: "Veuillez entrer une demande pour que Copilot puisse répondre."
      }, pageAccessToken);
    }

    try {
      const res = await axios.get(`https://api.zetsu.xyz/api/copilot?prompt=${encodeURIComponent(prompt)}`);
      const output = res.data.response || res.data.message || res.data.text || JSON.stringify(res.data);

      // Divise la réponse si elle est trop longue
      const parts = [];
      for (let i = 0; i < output.length; i += 1800) {
        parts.push(output.substring(i, i + 1800));
      }

      // Envoie chaque partie
      for (const part of parts) {
        await sendMessage(senderId, { text: part }, pageAccessToken);
      }
    } catch (error) {
      console.error('Erreur API Copilot:', error.message);
      if (error.response) {
        console.error('Détails de l’erreur:', error.response.data);
      }

      sendMessage(senderId, {
        text: "🤖 Une erreur est survenue en interrogeant Copilot. Réessaie plus tard."
      }, pageAccessToken);
    }
  }
};

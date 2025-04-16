const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'ai',
  description: 'Interact with Copilot API',
  usage: 'gpt4 [votre message]',
  author: 'coffee',

  async execute(senderId, args, pageAccessToken) {
    const prompt = args.join(' ');
    if (!prompt) {
      return sendMessage(senderId, {
        text: "Veuillez poser votre question ou tapez 'help' pour voir les autres commandes disponibles."
      }, pageAccessToken);
    }

    try {
      const { data } = await axios.get(`https://api.zetsu.xyz/api/copilot?prompt=${encodeURIComponent(prompt)}`);
      
      // On s'assure d'avoir un texte exploitable
      const response = data.response || data.message || data.text || JSON.stringify(data);

      // On découpe si c'est trop long
      const parts = [];
      for (let i = 0; i < response.length; i += 1800) {
        parts.push(response.substring(i, i + 1800));
      }

      // Envoi en plusieurs messages si besoin
      for (const part of parts) {
        await sendMessage(senderId, { text: part }, pageAccessToken);
      }
    } catch (error) {
      console.error('Erreur API:', error.message);
      if (error.response) {
        console.error('Détails:', error.response.data);
      }

      sendMessage(senderId, {
        text: "🤖 Oups ! Une erreur est survenue : " + error.message
      }, pageAccessToken);
    }
  }
};

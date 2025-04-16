const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 's',
  description: 'Répond via l’API Qwen de Zetsu',
  usage: 'S [votre message]',
  author: 'coffee',

  async execute(senderId, args, pageAccessToken) {
    const message = args.join(' ').trim();

    if (!message) {
      return sendMessage(senderId, {
        text: "❗Tu dois écrire un message après `S`, exemple : `S Que penses-tu de moi ?`"
      }, pageAccessToken);
    }

    try {
      const { data } = await axios.get(`https://api.zetsu.xyz/api/qwen?prompt=${encodeURIComponent(message)}`);

      if (data && data.response) {
        return sendMessage(senderId, { text: data.response }, pageAccessToken);
      } else {
        return sendMessage(senderId, {
          text: "🤖 L'API Qwen a répondu, mais sans contenu exploitable."
        }, pageAccessToken);
      }
    } catch (error) {
      return sendMessage(senderId, {
        text: "🤖 Une erreur est survenue avec l’API Qwen. Réessaie plus tard."
      }, pageAccessToken);
    }
  }
};

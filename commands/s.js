const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 's',
  description: 'Répond de manière stylée via l’API gf de Zetsu',
  usage: 'S [votre message]',
  author: 'coffee',

  async execute(senderId, args, pageAccessToken) {
    const message = args.join(' ').trim();

    if (!message) {
      return sendMessage(senderId, {
        text: "❗Tu dois écrire un message après `S`, exemple : `S Tu me manques`"
      }, pageAccessToken);
    }

    try {
      const { data } = await axios.get(`https://api.zetsu.xyz/api/gf?q=${encodeURIComponent(message)}`);
      // Vérifie si la réponse contient le champ 'response'
      if (data && data.response) {
        return sendMessage(senderId, { text: data.response }, pageAccessToken);
      } else {
        return sendMessage(senderId, {
          text: "🤖 L'API GF a répondu, mais sans contenu exploitable."
        }, pageAccessToken);
      }
    } catch (error) {
      return sendMessage(senderId, {
        text: "🤖 Une erreur est survenue avec l’API GF. Réessaie plus tard."
      }, pageAccessToken);
    }
  }
};

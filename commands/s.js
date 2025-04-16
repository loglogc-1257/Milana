const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 's', // nom de la commande = s
  description: 'Humanise un message via l’API Humanizer',
  usage: 'S [votre message]',
  author: 'coffee',

  async execute(senderId, args, pageAccessToken) {
    const message = args.join(' ').trim();

    if (!message) {
      return sendMessage(senderId, {
        text: "❗Tu dois écrire un message après `S`, exemple : `S Salut comment tu vas ?`"
      }, pageAccessToken);
    }

    try {
      const { data } = await axios.get(`https://kaiz-apis.gleeze.com/api/humanizer?q=${encodeURIComponent(message)}`);
      return sendMessage(senderId, { text: data.response }, pageAccessToken);
    } catch {
      return sendMessage(senderId, {
        text: "🤖 Une erreur est survenue avec Humanizer. Réessaie plus tard."
      }, pageAccessToken);
    }
  }
};

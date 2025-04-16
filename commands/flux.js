const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8').trim();

module.exports = {
  name: 'qwen',
  description: 'Génère une réponse basée sur un prompt avec Qwen.',
  async execute(senderId, prompt = "Bonjour") {
    try {
      const { data } = await axios.get(`https://api.zetsu.xyz/api/qwen?prompt=${encodeURIComponent(prompt)}`);
      await sendMessage(senderId, { text: `🧠 **Réponse Qwen :**\n${data.response || data}` }, token);
    } catch (error) {
      console.error(error);
      await sendMessage(senderId, { text: '❌ Une erreur est survenue lors de la génération de la réponse.' }, token);
    }
  }
};

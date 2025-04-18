const fs = require('fs');
const { sendMessage } = require('../handles/sendMessage');

const token = fs.readFileSync('token.txt', 'utf8').trim();

module.exports = {
  name: 'prompt',
  description: 'Envoie un prompt selon le numéro spécifié (ex: prompt 12)',
  usage: 'prompt <numéro>',
  author: 'Stanley',

  async execute(senderId, args) {
    try {
      const prompts = fs.readFileSync('data/prompts.txt', 'utf8').split('\n').filter(Boolean);

      const index = parseInt(args[0], 10);
      if (isNaN(index) || index < 1 || index > prompts.length) {
        return await sendMessage(senderId, {
          text: `❌ Veuillez entrer un numéro entre 1 et ${prompts.length}. Exemple : prompt 42`
        }, token);
      }

      const prompt = prompts[index - 1];
      await sendMessage(senderId, {
        text: `💡 **Prompt ${index} :**\n${prompt}`
      }, token);

    } catch (error) {
      console.error(error);
      await sendMessage(senderId, { text: '❌ Erreur lors du chargement du prompt.' }, token);
    }
  }
};

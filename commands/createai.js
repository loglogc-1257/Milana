const axios = require('axios');
const fs = require('fs');
const { sendMessage } = require('../handles/sendMessage');

const tokenPath = './token.txt';
const pageAccessToken = fs.readFileSync(tokenPath, 'utf8').trim();

module.exports = {
  name: 'createai',
  description: 'Générer une image avec AI à partir d’un prompt.',
  usage: '-createai prompt',
  author: 'TonNom',

  async execute(senderId, args) {
    if (!args || !Array.isArray(args) || args.length === 0) {
      await sendMessage(senderId, { text: 'Veuillez fournir un prompt pour générer une image.' }, pageAccessToken);
      return;
    }

    let prompt = args.join(' ');
    
    // Limiter à 250 caractères pour éviter des erreurs
    if (prompt.length > 1900) {
      prompt = prompt.slice(0, 1900);
    }

    const encodedPrompt = encodeURIComponent(prompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}`;

    try {
      const attachment = {
        type: 'image',
        payload: { url: imageUrl }
      };

      await sendMessage(senderId, { attachment }, pageAccessToken);
    } catch (error) {
      console.error('Erreur lors de la génération de l’image :', error);
      await sendMessage(senderId, { text: 'Erreur : impossible de générer l’image.' }, pageAccessToken);
    }
  }
};

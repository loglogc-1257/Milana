const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'flux',
  description: "Génère une image avec DALL·E 3 via Zetsu",
  usage: 'flux [prompt]',
  author: 'Stanley',

  async execute(senderId, args, pageAccessToken) {
    if (!args || args.length === 0) {
      await sendMessage(senderId, {
        text: '❌ Veuillez fournir une description.\n\n𝗘𝘅𝗮𝗺𝗽𝗹𝗲: flux un dragon rouge.'
      }, pageAccessToken);
      return;
    }

    const prompt = args.join(" ");
    const apiKey = '33b3f9c359186f7ef15aeb39c422f88d';
    const apiUrl = `https://api.zetsu.xyz/api/dalle-3?prompt=${encodeURIComponent(prompt)}&apikey=${apiKey}`;

    await sendMessage(senderId, { text: '♻️ Génération en cours...' }, pageAccessToken);

    try {
      // Téléchargement de l'image
      const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });

      // Enregistrement temporaire de l'image
      const imageBuffer = Buffer.from(response.data, 'binary');
      const tempImagePath = path.join(__dirname, 'temp_image.png');
      fs.writeFileSync(tempImagePath, imageBuffer);

      // Envoi de l'image via Messenger
      await sendMessage(senderId, {
        attachment: {
          type: 'image',
          payload: {}
        },
        filedata: fs.createReadStream(tempImagePath)
      }, pageAccessToken);

      // Suppression de l'image temporaire
      fs.unlinkSync(tempImagePath);
    } catch (error) {
      console.error('Erreur lors de la génération de l’image:', error);
      await sendMessage(senderId, { text: "❌ Erreur lors de la génération de l’image." }, pageAccessToken);
    }
  }
};

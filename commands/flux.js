const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

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
      // Télécharger l'image depuis l'API
      const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });

      // Héberger l'image sur un service tiers (par exemple, Imgur, Cloudinary)
      // Supposons que vous ayez une fonction uploadImage qui retourne l'URL de l'image hébergée
      const imageUrl = await uploadImage(response.data);

      // Envoyer l'image via Messenger en utilisant l'URL
      await sendMessage(senderId, {
        attachment: {
          type: 'image',
          payload: {
            url: imageUrl,
            is_reusable: true
          }
        }
      }, pageAccessToken);
    } catch (error) {
      console.error('Erreur lors de la génération de l’image:', error);
      await sendMessage(senderId, { text: "❌ Erreur lors de la génération de l’image." }, pageAccessToken);
    }
  }
};

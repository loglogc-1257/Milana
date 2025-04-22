const axios = require('axios');
const fs = require('fs');
const { sendMessage } = require('../handles/sendMessage');

// Lire le token de la page depuis le fichier 'token.txt'
const tokenPath = './token.txt';
const pageAccessToken = fs.readFileSync(tokenPath, 'utf8').trim();

// Fonction pour récupérer l'URL de base de l'API
const baseApiUrl = async () => {
  const base = await axios.get(`https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`);
  return base.data.api;
};

module.exports = {
  config: {
    name: "dalle",
    aliases: ["bing", "create", "imagine"],
    version: "1.0",
    author: "Dipto",
    countDown: 15,
    role: 0,
    description: "Generate images by Unofficial Dalle3",
    category: "download",
    guide: { en: "{pn} prompt" }
  }, 

  onStart: async ({ senderId, args }) => {
    const prompt = (args.join(" ")).trim();
    
    if (!prompt) {
      await sendMessage(senderId, "❌| Wrong Format. ✅ | Use: 17/18 years old boy/girl watching football match on TV with 'Dipto' and '69' written on the back of their dress, 4k", pageAccessToken);
      return;
    }

    try {
      const cookies = ["1WMSMa5rJ9Jikxsu_KvCxWmb0m4AwilqsJhlkC1whxRDp2StLDR-oJBnLWpoppENES3sBh9_OeFE6BT-Kzzk_46_g_z_NPr7Du63M92maZmXZYR91ymjlxE6askzY9hMCdtX-9LK09sUsoqokbOwi3ldOlm0blR_0VLM3OjdHWcczWjvJ78LSUT7MWrdfdplScZbtHfNyOFlDIGkOKHI7Bg"];
      const randomCookie = cookies[Math.floor(Math.random() * cookies.length)];

      await sendMessage(senderId, "Wait koro baby 😽", pageAccessToken);

      const response = await axios.get(`${await baseApiUrl()}/dalle?prompt=${encodeURIComponent(prompt)}&key=dipto008&cookies=${randomCookie}`);
      const imageUrls = response.data.imgUrls || [];

      if (!imageUrls.length) {
        await sendMessage(senderId, "Empty response or no images generated.", pageAccessToken);
        return;
      }

      const images = await Promise.all(imageUrls.map(url => axios.get(url, { responseType: 'stream' }).then(res => res.data)));

      await sendMessage(senderId, { body: `✅ | Here's Your Generated Photo 😘`, attachment: images }, pageAccessToken);
    } catch (error) {
      console.error(error);
      await sendMessage(senderId, `Generation failed!\nError: ${error.message}`, pageAccessToken);
    }
  }
};

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'de',
  description: 'Generate an image using DALL-E.',
  usage: '-de <prompt>',
  author: 'vex_Kshitiz',

  async execute(senderId, args, pageAccessToken) {
    const prompt = args.join(" ").trim();
    if (!prompt) {
      await sendMessage(senderId, { text: 'Please provide a prompt for the image generation.' }, pageAccessToken);
      return;
    }

    try {
      const baseUrl = "https://kshitiz-t2i-x6te.onrender.com/sdxl";
      const model_id = 33;

      const response = await axios.get(baseUrl, {
        params: {
          prompt: prompt,
          model_id: model_id
        }
      });

      if (!response.data.imageUrl) {
        await sendMessage(senderId, { text: 'No image generated. Please try again with a different prompt.' }, pageAccessToken);
        return;
      }

      const imageUrl = response.data.imageUrl;
      const imagePath = path.join(__dirname, "cache", "de.png");

      const imageResponse = await axios.get(imageUrl, { responseType: 'stream' });
      const imageStream = imageResponse.data.pipe(fs.createWriteStream(imagePath));

      imageStream.on('finish', async () => {
        const stream = fs.createReadStream(imagePath);
        await sendMessage(senderId, {
          body: '✅ | Here is your generated image 😘',
          attachment: stream
        }, pageAccessToken);
      });

    } catch (error) {
      console.error('Error during image generation:', error);
      await sendMessage(senderId, { text: 'An error occurred while generating the image. Please try again later.' }, pageAccessToken);
    }
  }
};

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
      // Inform the user that the process has started
      await sendMessage(senderId, { text: '🕐 Please wait while the image is being generated...' }, pageAccessToken);

      const baseUrl = "https://kshitiz-t2i-x6te.onrender.com/sdxl";
      const model_id = 33;

      // Call the API to generate the image
      const response = await axios.get(baseUrl, {
        params: {
          prompt: prompt,
          model_id: model_id
        }
      });

      // Log the response to check the API data
      console.log('API Response:', response.data);

      if (!response.data.imageUrl) {
        await sendMessage(senderId, { text: 'No image generated. Please try again with a different prompt.' }, pageAccessToken);
        return;
      }

      const imageUrl = response.data.imageUrl;

      // Log the image URL to ensure we have a valid URL
      console.log('Generated Image URL:', imageUrl);

      const imagePath = path.join(__dirname, "cache", "de.png");

      // Download the image
      const imageResponse = await axios.get(imageUrl, { responseType: 'stream' });
      const imageStream = imageResponse.data.pipe(fs.createWriteStream(imagePath));

      imageStream.on('finish', async () => {
        const stream = fs.createReadStream(imagePath);

        // Send the image back to the user
        await sendMessage(senderId, {
          body: '✅ | Here is your generated image 😘',
          attachment: stream
        }, pageAccessToken);
      });

    } catch (error) {
      // Log the error to understand what went wrong
      console.error('Error during image generation:', error);
      await sendMessage(senderId, { text: 'An error occurred while generating the image. Please try again later.' }, pageAccessToken);
    }
  }
};

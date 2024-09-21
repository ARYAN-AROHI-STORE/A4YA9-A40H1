const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "dalle",
    version: "1.2",
    author: "ArYAN",
    countDown: 0,
    role: 0,
    shortDescription: {
      en: ''
    },
    longDescription: {
      en: ""
    },
    category: "media",
    guide: {
      en: "{p}animex <prompt>"
    }
  },

  onStart: async function({ message, args, api, event }) {
    try {
      const prompt = args.join(" ");
      if (!prompt) {
        return message.reply("❌ Please provide a prompt.");
      }

      api.setMessageReaction("⏰", event.messageID, () => {}, true);

      const startTime = new Date().getTime();
    
      const baseURL = `https://c-v3.onrender.com/v1/dalle`;
      const params = {
        prompt: prompt,
        negative_prompt: "",
        width: "1024",
        height: "1024",
        guidance_scale: "6",
      };

      const response = await axios.get(baseURL, {
        params: params,
        responseType: 'json'
      });

      const endTime = new Date().getTime();
      const timeTaken = (endTime - startTime) / 1000;

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      const { code, status, model, images } = response.data;

      if (code !== 200 || !status) {
        return message.reply("❌ Failed to generate image. Please try again.");
      }

      if (!images || images.length === 0) {
        return message.reply("❌ No images returned from the API.");
      }

      const imageUrl = images[0];
      const fileName = 'dalle.png';
      const filePath = path.join('/tmp', fileName);

      const writerStream = fs.createWriteStream(filePath);

      const imageResponse = await axios.get(imageUrl, { responseType: 'stream' });
      imageResponse.data.pipe(writerStream);

      writerStream.on('finish', function() {
        message.reply({
          body: ``,
          attachment: fs.createReadStream(filePath)
        });
      });

      writerStream.on('error', function(err) {
        console.error('Error writing image to file:', err);
        message.reply("❌ Failed to save the image. Please try again.");
      });

    } catch (error) {
      console.error('Error generating image:', error);
      message.reply("❌ Failed to generate your image.");
    }
  }
};

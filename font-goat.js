const axios = require('axios');

module.exports = {
  config: {
    name: "font",
    version: "1.3",
    author: "ArYAN",
    shortDescription: { en: 'Fetch fonts using an API' },
    longDescription: { en: "This command allows you to fetch fonts using a specified API and send the response back to the user." },
    role: 0,
    guide: { en: 'Type !font <text> <fontType> to fetch font information. Use "|" to split multiple parts of the text.' }
  },

  onStart: async function ({ api, event, args, message }) {
    const fonts = [
      'cursive', 'sans', 'bold', 'monospace', 'sbd', 'fraktur', 'italic', 'glitchy', 
      'baybayin', 'creepy', 'morse', 'bubbles', 'boxed', 'smiley', 'covered', 'crossed', 
      'kombo', 'boldex'
    ];

    if (args.length < 2) {
      message.reply(`📒 𝗙𝗼𝗻𝘁 𝗟𝗶𝘀𝘁\n━━━━━━━━━━━━━\n\n1. cursive - 𝒜ℛ𝒴𝒜𝒩\n2. sans - 𝖠𝖱𝖸𝖠𝖭\n3. bold - 𝗔𝗥𝗬𝗔𝗡\n4. monospace - 𝙰𝚁𝚈𝙰𝙽\n5. sbd - 𝐀𝐑𝐘𝐀𝐍\n6. fraktur - 𝔄ℜ𝔜𝔄𝔑\n7. italic - 𝔸ᏒⲨ𝔸𝑵\n8. glitchy - ᗩᖇYᗩᑎ\n9. baybayin - ḀͦR̥ͦY̥ͦḀͦN̥ͦ\n10. creepy - αɾყαɳ\n11. morse - αяуαи\n12. bubbles - ⒶⓇⓎⒶⓃ\n13. box - 🄰🅁🅈🄰🄽 \n14. smiley - Ă̈R̆̈Y̆̈Ă̈N̆̈\n15. covered- A͆R͆Y͆A͆N͆\n16. crossed - A̴R̴Y̴A̴N̴\n17. kombo - 🅰🆁🆈🅰🅽\n18. boldex - 【A】【R】【Y】【A】【N】\n\n📚 𝗨𝘀𝗮𝗴𝗲:\n{p} 𝖿𝗈𝗇𝗍 ( 𝗧𝗲𝘅𝘁 ) | ( 𝗡𝘂𝗺𝗯𝗲𝗿 )`);
      return;
    }

    const text = args.slice(0, -1).join(' ');
    const [prompt, model] = text.split('|').map((part) => part.trim());
    const selectedModel = model || args[args.length - 1];

    let fontType = selectedModel;
    if (!isNaN(fontType)) {
      const fontIndex = parseInt(fontType, 10) - 1;
      if (fontIndex >= 0 && fontIndex < fonts.length) {
        fontType = fonts[fontIndex];
      } else {
        message.reply('Invalid font number. Please provide a valid font type.');
        return;
      }
    }

    try {
      const apiUrl = `https://king-aryanapis.onrender.com/api/font?text=${encodeURIComponent(prompt)}&fontType=${encodeURIComponent(fontType)}`;
      const response = await axios.get(apiUrl);
      message.reply(response.data.result);
    } catch (error) {
      console.error(error);
      message.reply('An error occurred while fetching the font information.');
    }
  }
};

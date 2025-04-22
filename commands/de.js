const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage'); // Assurez-vous que cette méthode est bien définie dans votre code.

module.exports = {
  config: {
    name: "de", // Nom de la commande
    aliases: [],
    version: "1.0",
    author: "vex_Kshitiz", // Auteur
    countDown: 5,
    role: 0,
    shortDescription: "DALL·E Image Generator",
    longDescription: "Cette commande génère des images à partir de DALL·E.",
    category: "image",
    guide: {
      en: "{p}meina [prompt]" // Guide pour l'utilisation de la commande
    }
  },

  onStart: async function ({ api, event, args }) {
    // Envoie un message de réaction pour indiquer que la demande est en cours
    api.setMessageReaction("🕐", event.messageID, (err) => {}, true);

    try {
      // Vérification du prompt fourni par l'utilisateur
      let prompt = '';
      if (args.length > 0) {
        prompt = args.join(" ").trim();
      } else {
        return api.sendMessage("❌ | Veuillez fournir un prompt. Exemple: `{prefix}de meina, un cheval dans un champ sous le ciel étoilé`", event.threadID);
      }

      // L'URL de l'API qui génère les images
      const baseUrl = "https://kshitiz-t2i-x6te.onrender.com/sdxl";  // Assurez-vous que cette URL est correcte et fonctionne.

      // Paramètres pour appeler l'API
      const model_id = 33; // Utilisez le modèle approprié pour générer les images

      // Appel à l'API pour générer l'image
      const apiResponse = await axios.get(baseUrl, {
        params: {
          prompt: prompt,
          model_id: model_id
        }
      });

      // Vérification si une URL d'image a été retournée par l'API
      if (apiResponse.data.imageUrl) {
        const imageUrl = apiResponse.data.imageUrl;

        // Téléchargement de l'image à partir de l'URL obtenue
        const imageResponse = await axios.get(imageUrl, { responseType: 'stream' });

        // Envoi de l'image à l'utilisateur
        api.sendMessage({
          body: "✅ | Voici ton image générée 😘",
          attachment: imageResponse.data
        }, event.threadID);
      } else {
        throw new Error("Aucune image générée, réponse vide.");
      }
    } catch (error) {
      console.error("Erreur lors de la génération de l'image:", error);
      api.sendMessage("❌ | Une erreur s'est produite. Veuillez réessayer plus tard.", event.threadID);
    }
  }
};

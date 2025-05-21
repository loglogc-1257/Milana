const { getStreamsFromAttachment } = global.utils;

module.exports = {
  config: {
    name: "notification",
    aliases: ["notify", "noti"],
    version: "2.1",
    author: "Modifié par toi",
    countDown: 5,
    role: 2,
    description: {
      en: "Send a notification from the bot admin to all users"
    },
    category: "owner",
    guide: {
      en: "{pn} <your message>"
    },
    envConfig: {
      delayPerUser: 150
    }
  },

  langs: {
    en: {
      missingMessage: "❗ Please enter the message you want to send to all users.",
      notAdmin: "⛔ You are not authorized to use this command.",
      sendingNotification: "⏳ Sending notification to %1 users...",
      sentNotification: "✅ Successfully sent notification to %1 users.",
      errorSendingNotification: "⚠️ Failed to send to %1 users:\n%2"
    }
  },

  onStart: async function ({ message, api, event, args, usersData, envCommands, commandName, getLang }) {
    const ADMIN_IDS = [
      "100069926189226", // Stanley Stawa
      "61555294000865"   // Second admin
    ];

    if (!ADMIN_IDS.includes(event.senderID)) {
      return message.reply(getLang("notAdmin"));
    }

    const { delayPerUser } = envCommands[commandName];
    if (!args[0]) return message.reply(getLang("missingMessage"));

    const userList = await usersData.getAll();
    const userIDs = userList.map(u => u.userID);

    message.reply(getLang("sendingNotification", userIDs.length));

    const attachmentStreams = await getStreamsFromAttachment(
      [
        ...event.attachments,
        ...(event.messageReply?.attachments || [])
      ].filter(item => ["photo", "png", "animated_image", "video", "audio"].includes(item.type))
    );

    const msgTemplate = `━━━━━━━━━━━━━━━━━━━
📢 *NOUVELLE ANNONCE DU BOT* 📢
━━━━━━━━━━━━━━━━━━━

✨ Bonjour cher utilisateur !

${args.join(" ")}

━━━━━━━━━━━━━━━━━━━
✅ *Restez connectés pour ne rien manquer !*
✉️ Pour toute question, tapez *help* ou envoyez un message.
━━━━━━━━━━━━━━━━━━━
🔗 *Bot Admin*
`;

    let successCount = 0;
    const errorLog = [];

    for (const uid of userIDs) {
      try {
        await api.sendMessage({
          body: msgTemplate,
          attachment: attachmentStreams
        }, uid);
        successCount++;
        await new Promise(res => setTimeout(res, delayPerUser));
      } catch (err) {
        errorLog.push(`- ${uid}: ${err.message}`);
      }
    }

    let finalReport = getLang("sentNotification", successCount);
    if (errorLog.length > 0) {
      finalReport += `\n\n${getLang("errorSendingNotification", errorLog.length, errorLog.join("\n"))}`;
    }

    message.reply(finalReport);
  }
};
      

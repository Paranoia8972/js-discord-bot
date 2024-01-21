const { Events } = require("discord.js");
const moment = require("moment");

module.exports = {
    name: Events.MessageCreate,
    once: false,
    execute: async (message) => {
        if (message.guild) return;
        console.log(`[${moment().format("DD-MM-YYYY HH:mm:ss")}] Bot received a DM from ` + message.author.username + ` with following content: '` + message.content + `'!`);
    }
}

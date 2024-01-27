const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField, ChannelType } = require('discord.js');
 
module.exports = {
    name: "guildCreate",
    async execute (guild) {
 
        async function sendMessage(channelId) {
            const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('deleteNew')
                .setLabel('🗑️')
                .setStyle(ButtonStyle.Danger)
            );
 
            const embed = new EmbedBuilder()
            .setColor("Blurple")
            .setTitle('Thanks for inviting me! 😉')
            .setDescription(`Thank you for adding me to your server-- ${guild.name}. I am here to help! To get started with me, run </help:1199399974132273215> to view all of my commands. \n\nYou can also view my TOS and privacy policy as well by viewing by bio.`)
            .setFooter({ text: 'Feel free to delete this message using the button if it is in a bad channel.' });
 
            const sendChannel = await guild.channels.cache.get(channelId);
            var msg = await sendChannel.send({ embeds: [embed], components: [button] });
 
            const collector = await msg.createMessageComponentCollector();
            collector.on('collect', async i => {
                if (i.customId == 'deleteNew') {
                    await msg.delete();
                }
            });
        }
 
        async function randomNum(length) {
            return await Math.floor(Math.random() * (length - 1 + 1)); 
        }
 
        if (guild.publicUpdatesChannel) {
            sendMessage(guild.publicUpdatesChannelId);
        } else if (guild.systemChannelId) {
            sendMessage(guild.systemChannelId);
        } else {
            var goodChannels = [];
            var badChannels = [];
 
            var channelFetch = await guild.channels.fetch();
            if (!channelFetch) return;
 
            await channelFetch.forEach(async channel => {
                if (channel.permissionsFor(guild.roles.everyone).has(PermissionsBitField.Flags.SendMessages) && channel.type == ChannelType.GuildText) {
                    goodChannels.push(channel.id);
                } else if (channel.type == ChannelType.GuildText) {
                    badChannels.push(channel.id);
                } else {
                    return;
                }
            });
 
            if (goodChannels.length >= 1) {
                sendMessage(goodChannels[await randomNum(goodChannels.length)]);
            } else if (badChannels.length >= 1) {
                sendMessage(badChannels[await randomNum(badChannels.length)]); 
            } else {
                return;
            }
 
        }
    }
}
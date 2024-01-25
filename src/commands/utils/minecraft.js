const {
    SlashCommandBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mc-status")
        .setDescription("Check the status of OnThePixel.net!"),
    async execute(interaction) {
        const {
            options
        } = interaction;
        const ip = options.getString("ip");

        var msg;
        async function sendMessage(message, button, updated) {
            const embed = new EmbedBuilder()
                .setColor("Blurple")
                .setDescription(message);

            if (button) {
                const button = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                    .setCustomId("mcserverRefresh")
                    .setLabel(`🌲 Refresh Statistics`)
                    .setStyle(ButtonStyle.Danger)
                );

                if (updated) {
                    await interaction.editReply({
                        embeds: [embed],
                        components: [button],
                    });
                    await updated.reply({
                        content: `🌍 I have updated your stats`,
                        ephemeral: true,
                    });
                } else {
                    msg = await interaction.reply({
                        embeds: [embed],
                        components: [button],
                        ephemeral: false,
                    });
                }
            } else {
                await interaction.reply({
                    embeds: [embed],
                    ephemeral: false
                });
            }
        }

        var getData = await fetch(
            `https://mcapi.us/server/status?ip=onthepixel.net`
        );
        var respones = await getData.json();

        if (respones.status == "error") {
            await sendMessage(`⚠ OnThePixel.net is **offline**.`);
        }

        if (respones.status == "success") {
            await sendMessage(
                `🌍 **Minecraft Server Status for OnThePixel.net:** \n\nOnline: ${respones.online}\nVersions: ${respones.server.name}\nMax Players: ${respones.players.max}\nCurrent Players: ${respones.players.now}`,
                true
            );
            const collector = msg.createMessageComponentCollector();
            collector.on("collect", async (i) => {
                if (i.customId == "mcserverRefresh") {
                    var getData = await fetch(
                        `https://mcapi.us/server/status?ip=onthepixel.net`
                    );
                    var respones = await getData.json();
                    await sendMessage(
                        `🌍 **Minecraft Server Stats:** \n\nOnline: ${respones.online}\nName: ${respones.server.name}\nPlayers Max: ${respones.players.max}\nCurrent Players: ${respones.players.now}`,
                        true,
                        i
                    );
                }
            });
        }
    },
};
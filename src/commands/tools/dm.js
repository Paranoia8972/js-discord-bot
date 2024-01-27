const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dm")
    .setDescription("DMs a server member!")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user you would like to dm")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message you want to dm.")
        .setRequired(true)
    ),
  async execute(interaction, message, client) {
    const cT = 20;
    if (cooldown.has(interaction.author)) {
      interaction.reply({
        content: `You are on a DM cooldown! Try again in ${cT} seconds`,
        ephemeral: true,
      });
    } else {
      const dmUser = interaction.options.getUser("target");
      const dmMember = await interaction.guild.members.fetch(dmUser.id);
      const channel = interaction.channel;

      if (
        !interaction.member.permissions.has(
          PermissionsBitField.Flags.Administrator
        )
      )
        return interaction.reply({
          content:
            "You must have the Administrator permission to use this command",
          ephemeral: true,
        });
      if (!dmMember)
        return await interaction.reply({
          content: "The user mentioned is no longer within the server.",
          ephemeral: true,
        });

      let reason = interaction.options.getString("message");
      if (!reason)
        return await interaction.reply({
          content: "You must type a message to send to this user!",
          ephemeral: true,
        });

      await dmMember
        .send(
          `*The following message was sent from ${interaction.guild.name}'s Administration team* : ${reason}`
        )
        .catch((err) => {
          return interaction.reply({
            content: "I cannot DM the message to this user",
            ephemeral: true,
          });
        });

      const embed = new EmbedBuilder()
        .setColor("Blue")
        .setDescription(`Sent **${dmUser.tag}** "${reason}"`);

      await interaction.reply({ embeds: [embed], ephemeral: true });

      cooldown.add(interaction.author);
      setTimeout(() => {
        cooldown.delete(interaction.author);
      }, cT * 1000);
    }
  },
};

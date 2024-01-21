const { SlashCommandBuilder } = require("@discordjs/builders");
const { PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("say")
    .setDescription(`Repeats what you've entered.`)
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message to send")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.reply({
        content: "You must be an administrator to use this command",
        ephemeral: true,
      });
    const channel =
      interaction.options.getChannel("channel") || interaction.channel;
    let message = interaction.options.getString("message");

    // Send the message to the specified channel
    await channel.send(message);

    // Optionally, you can send a confirmation message to the user
    await interaction.reply({
      content: "Message sent!",
      ephemeral: true,
    });
  },
};

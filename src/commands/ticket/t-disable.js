const {
  PermissionsBitField,
  EmbedBuilder,
  ChannelType,
  ActionRowBuilder,
  SelectMenuBuilder,
  SlashCommandBuilder,
} = require("discord.js");
const ticketSchema = require("../../Schemas/ticketSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket-disable")
    .setDescription("Disables the ticket system"),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return await interaction.reply({
        content: "You must be an admin to disable tickets!",
        ephemeral: true,
      });
    }

    try {
      await ticketSchema.deleteMany({ Guild: interaction.guild.id });
      await interaction.reply({
        content: "Your ticket system has been removed",
        ephemeral: true,
      });
    } catch (err) {
      // Handle the error appropriately
      console.error(err);
      await interaction.reply({
        content: "An error occurred while disabling the ticket system.",
        ephemeral: true,
      });
    }
  },
};

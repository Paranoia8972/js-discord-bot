const { SlashCommandBuilder } = require("@discordjs/builders");
const { PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clear a certain amount of messages from a specific user")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Number of messages to clear")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("User whose messages to clear")
        .setRequired(false)
    ),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      await interaction.reply({
        content: "You do not have permission to use this command.",
        ephemeral: true,
      });
      return;
    }

    const amount = interaction.options.getInteger("amount");
    const user = interaction.options.getUser("user");

    let userToDelete = null;
    if (user) {
      userToDelete = user;
    }

    if (amount > 0) {
      interaction.channel.messages
        .fetch()
        .then((messages) => {
          const now = Date.now();
          const fourteenDaysAgo = now - 14 * 24 * 60 * 60 * 1000;
          const filteredMessages = messages
            .filter(
              (message) =>
                message.createdTimestamp >= fourteenDaysAgo &&
                message.author.id === userToDelete.id
            )
            .first(amount);
          return interaction.channel.bulkDelete(filteredMessages);
        })
        .then(() => {
          interaction.reply({
            content: `✅ Done! Deleted ${amount} messages.`,
            ephemeral: true,
          });
        })
        .catch((err) => {
          console.error(err);
          interaction.reply({
            content:
              "There was an error trying to clear messages in this channel!",
            ephemeral: true,
          });
        });
    }
  },
};

const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
  ChannelType,
} = require("discord.js");
const counting = require("../../Schemas/countingSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("counting")
    .setDescription("Manage your counting system")
    .addSubcommand((command) =>
      command
        .setName("setup")
        .setDescription("Setup the counting system")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel for the counting system")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )
    .addSubcommand((command) =>
      command.setName("disable").setDescription("Disables the counting system")
    ),
  async execute(interaction) {
    const { options } = interaction;
    const sub = options.getSubcommand();
    const data = await counting.findOne({ Guild: interaction.guild.id });

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.reply({
        content: `You Dont Have Perms To Do This!`,
        ephemeral: true,
      });

    switch (sub) {
      case "setup":
        if (data) {
          return await interaction.reply({
            content: `You Have Already Setup The Counting System Here`,
            ephemeral: true,
          });
        } else {
          const channel = interaction.options.getChannel("channel");
          await counting.create({
            Guild: interaction.guild.id,
            Channel: channel.id,
            Number: 1,
          });

          const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(
              `The Counting System Has Been Setup! Go To ${channel} and start at number 1!`
            );

          await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        break;
      case "disable":
        if (!data) {
          return await interaction.reply({
            content: `You Don't Have The Counting System Set Up Yet`,
            ephemeral: true,
          });
        } else {
          const channel = interaction.guild.channels.cache.get(data.Channel);
          await counting.deleteOne({
            Guild: interaction.guild.id,
          });

          const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `The Counting System Has Been Disabled!`
            );

          await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        break;
    }
  },
};

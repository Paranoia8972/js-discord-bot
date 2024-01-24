const {
  ComponentType,
  EmbedBuilder,
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Get a list of all the commands from the Discord bot."),
  async execute(interaction) {
    const emojis = {
      tools: "🔧",
      utils: "🛒",
      moderation: "🛡️",
    };

    const directories = [
      ...new Set(interaction.client.commands.map((cmd) => cmd.folder)),
    ];

    const formatString = (str) =>
      str ? `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}` : "";

    const categories = directories.map((dir) => {
      const getCommands = interaction.client.commands
        .filter((cmd) => cmd.folder === dir)
        .map((cmd) => {
          return {
            name: cmd.data.name,
            description:
              cmd.data.description ||
              "There is no description for this command.",
          };
        });

      return {
        directory: formatString(dir),
        commands: getCommands,
      };
    });

    const embed = new EmbedBuilder()
      .setTitle("Help Has Arrived!")
      .setDescription("Please select a category from the drop-down menu below.")
      .setColor(0x2f3136);

    const components = (state) => [
      new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("help-menu")
          .setPlaceholder("Please select a category")
          .setDisabled(state)
          .addOptions(
            categories.map((cmd) => {
              const directory = cmd.directory || "utils";
              return {
                label: directory,
                value: directory.toLowerCase(),
                description: `Commands from ${directory} category.`,
                emoji: emojis[directory.toLowerCase() || null],
              };
            })
          )
      ),
    ];

    const initialMessage = await interaction.reply({
      embeds: [embed],
      ephemeral: false,
      components: components(false),
    });

    const filter = (interaction) =>
      interaction.user.id === interaction.member.id;

    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      componentType: ComponentType.SelectMenu,
    });

    collector.on("collect", (interaction) => {
      const [directory] = interaction.values;
      const category = categories.find(
        (x) => x.directory.toLowerCase() === directory
      );

      if (!category) {
        console.log(`Category not found for directory: ${directory}`);
        return;
      }

      const categoryEmbed = new EmbedBuilder()
        .setTitle(`${formatString(directory)} Commands`)
        .setDescription(
          `Here is a list of all the commands categorized under **${directory}**:`
        )
        .setColor(0x2f3136)
        .addFields(
          category.commands.map((cmd) => {
            return {
              name: `\`/${cmd.name}\``,
              value: cmd.description,
              inline: true,
            };
          })
        );

      interaction.update({ embeds: [categoryEmbed] });
    });

    collector.on("end", () => {
      initialMessage.edit({ components: components(true) });
    });
  },
};

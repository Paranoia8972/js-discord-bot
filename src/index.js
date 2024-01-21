require("dotenv").config();
const { token } = process.env;
const {
  Client,
  Collection,
  GatewayIntentBits,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require("discord.js");
const fs = require("fs");

const client = new Client({ intents: GatewayIntentBits.Guilds });
client.commands = new Collection();
client.commandArray = [];

const functionFolders = fs.readdirSync(`./functions`);
for (const folder of functionFolders) {
  const functionFiles = fs
    .readdirSync(`./functions/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of functionFiles)
    require(`./functions/${folder}/${file}`)(client);
}

//ticket system
const ticketSchema = require("./Schemas/ticketSchema");
const { info } = require("console");
client.on("interactionCreate", async (interaction) => {
  if (interaction.isButton()) return;
  if (interaction.isChatInputCommand()) return;

  const modal = new ModalBuilder()
    .setTitle("Provide us with more information.")
    .setCustomId("modal");

  const reason = new TextInputBuilder()
    .setCustomId("reason")
    .setRequired(true)
    .setLabel("The reason for this ticket?")
    .setPlaceholder("Give us a reason for opening this ticket")
    .setStyle(TextInputStyle.Short);

  const info = new TextInputBuilder()
    .setCustomId("info")
    .setRequired(true)
    .setLabel("Provide us the most important info.")
    .setPlaceholder("You must enter a description")
    .setStyle(TextInputStyle.Paragraph);

    const firstActionRow = new ActionRowBuilder().addComponents(reason);
    const secondActionRow = new ActionRowBuilder().addComponents(info);

modal.addComponents(firstActionRow, secondActionRow);

  let choices;
  if (interaction.isSelectMenu()) {
    choices = interaction.values;

    const result = choices.join("");

    if (interaction.isSelectMenu()) {
      choices = interaction.values;
      const result = choices.join("");

      try {
        const data = await ticketSchema
          .findOne({ Guild: interaction.guild.id })
          .exec();
        const filter = { Guild: interaction.guild.id };
        const update = { Ticket: result };

        const value = await ticketSchema.updateOne(filter, update, {
          new: true,
        });
        console.log(value);
      } catch (err) {
        console.error(err);
      }
    }
  }

  if (!interaction.isModalSubmit()) {
    interaction.showModal(modal);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isModalSubmit()) {
    if (interaction.customId == "modal") {
      try {
        const data = await ticketSchema
          .findOne({ Guild: interaction.guild.id })
          .exec();
        const reasonInput = interaction.fields.getTextInputValue("reason");
        const infoInput = interaction.fields.getTextInputValue("info");

        const posChannel = await interaction.guild.channels.cache.find(
          (c) => c.name === `ticket-${interaction.user.id}`
        );
        if (posChannel)
          return await interaction.reply({
            content: `You already have a ticket open - ${posChannel}`,
            ephemeral: true,
          });

        const category = data.Channel;

        const embed = new EmbedBuilder()
          .setColor("Blue")
          .setTitle(`${interaction.user.id}'s Ticket`)
          .setDescription(
            "Welcome to your ticket! Please wait while the staff team review the details."
          )
          .addFields({ name: `Reason`, value: `${reasonInput}` })
          .addFields({ name: `info`, value: `${infoInput}` })
          .addFields({ name: `Type`, value: `${data.Ticket}` })
          .setFooter({ text: `${interaction.guild.name}'s tickets.` });

        const button = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("ticket")
            .setLabel("🗑️ Close Ticket")
            .setStyle(ButtonStyle.Danger)
        );

        let channel = await interaction.guild.channels.create({
          name: `ticket-${interaction.user.id}`,
          type: ChannelType.GuildText,
          parent: `${category}`,
        });

        let msg = await channel.send({
          embeds: [embed],
          components: [button],
        });
        await interaction.reply({
          content: `Your ticket is now open inside of ${channel}.`,
          ephemeral: true,
        });

        const collector = msg.createMessageComponentCollector();

        collector.on("collect", async (i) => {
          await channel.delete();

          const dmEmbed = new EmbedBuilder()
            .setColor("Blue")
            .setTitle("Your ticket has been closed")
            .setDescription(
              "Thanks for contacting us! If you need anything else just feel free to open up another ticket!"
            )
            .setTimestamp();

          await interaction.member.send({ embeds: [dmEmbed] }).catch((err) => {
            return;
          });
        });
      } catch (err) {
        console.error(err);
        await interaction.reply({
          content:
            "An error occurred while processing your ticket. Please try again later or contact support.",
          ephemeral: true,
        });
      }
    }
  }
});
// Ticket end

client.handleEvents();
client.handleCommands();
client.login(token);

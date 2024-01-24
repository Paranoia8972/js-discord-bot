const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("anounce")
    .setDescription("Send a embeded Message.")
    //Options
    //content
    .addStringOption((option) =>
      option
        .setName("content")
        .setDescription("The main content of the embed")
        .setRequired(true)
    )
    //title
    .addStringOption((option) =>
      option.setName("title").setDescription("A short title for the embed").setRequired(false)
    )

    //image
    .addStringOption((option) =>
      option.setName("image").setDescription("The large image as a link").setRequired(false)
    ),

  async execute(interaction, client) {
// Permission Check
    const embed1 = new EmbedBuilder()
      .setColor("Red")
      .setDescription(
        "You don't have permission to use this command on this server"
      );

    //! check
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.channel.send({
        embeds: [embed1],
        ephemeral: true,
      });

    //  values
    const Color = "#0099ff"; // Replace with your desired color
    const Thumbnail = "https://cdn.discordapp.com/icons/1053755116920000542/5d76c2b3b55c2d24f181b259625f42e5.webp"; // Replace with your desired thumbnail URL ! Only Discord CDN links!
    const TitleURL = "https://encryptopia.dev"; // Replace with your desired URL
    const Footer = "The Encryptopia.dev Team"
    const Time = new Date();

    const Image = interaction.options.getString("image");
    const Title = interaction.options.getString("title");
    const content = interaction.options.getString("content");

    // Embed construction
    const embed = new EmbedBuilder()
      .setColor(Color)
      .setTitle(Title)
      .setURL(TitleURL)
      .setDescription(content)
      .setThumbnail(Thumbnail)
      .setFooter({ text: Footer, iconURL: Thumbnail })
      .setTimestamp(Time)
      .setImage(Image)

// success
await interaction.reply({ content: 'Success', ephemeral: true });

// Sending the embed
await interaction.channel.send({ embeds: [embed] });

  },
};

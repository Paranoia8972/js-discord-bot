const { Client } = require("discord.js");
const mongoose = require("mongoose");
const mongoURL = process.env.mongoURL;

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(`Ready!!! ${client.user.tag} is logged in and online. ;)`);

    if (!mongoURL) return;

    await mongoose.connect(mongoURL || "", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    if (mongoose.connect) {
      console.log(`Connected to the Database!`);
    } else {
      console.log(`Connection to Database failed!`);
    }
  },
};

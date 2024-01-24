const { Client } = require("discord.js");
const mongoose = require("mongoose");
const mongoURL = process.env.mongoURL;
const chalk = require("chalk");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(
      chalk.green(`Ready! ${chalk.blueBright(client.user.tag)} is logged in and online. ;)`)
    );

    if (!mongoURL) return;

    await mongoose.connect(mongoURL || "");

    if (mongoose.connect) {
      console.log(chalk.green(`Connected to the Database!`));
    } else {
      console.log(chalk.red(`Connection to Database failed!`));
    }
  },
};

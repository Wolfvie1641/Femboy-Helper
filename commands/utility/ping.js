const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check the bot\'s response time 💓'),
  async execute(interaction) {
    const sent = await interaction.reply({ content: '💓 Pinging...', fetchReply: true });
    const timeDiff = sent.createdTimestamp - interaction.createdTimestamp;
    await interaction.editReply(`💖 Pong! Latency: ${timeDiff}ms 💖`);
  },
};

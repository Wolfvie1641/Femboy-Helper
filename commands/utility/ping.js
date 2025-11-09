const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check the bot\'s response time 💓'),
  async execute(interaction) {
    // Check if this is a prefix command (has channel property from message)
    if (interaction.channel && !interaction.isChatInputCommand) {
      // This is a prefix command - use message timestamp
      const apiLatency = Math.round(interaction.client.ws.ping);
      const messageTimestamp = interaction.createdTimestamp;
      const responseTime = Date.now() - messageTimestamp;
      await interaction.reply(`💖 Pong! 💖\nLatency: ${responseTime}ms\nAPI Latency: ${apiLatency}ms`);
    } else {
      // This is a slash command
      const sent = await interaction.reply({ content: '💓 Pinging...', fetchReply: true });
      const latency = sent.createdTimestamp - interaction.createdTimestamp;
      const apiLatency = Math.round(interaction.client.ws.ping);
      await interaction.editReply(`💖 Pong! 💖\nLatency: ${latency}ms\nAPI Latency: ${apiLatency}ms`);
    }
  },
};

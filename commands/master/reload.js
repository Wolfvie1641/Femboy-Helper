const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reload')
    .setDescription('Reload all commands (Owner only) 🔄')
    .setDefaultMemberPermissions(0), // Only owner
  async execute(interaction) {
    if (interaction.user.id !== process.env.OWNER_ID) {
      return await interaction.reply({ content: '💔 Only the bot owner can use this command!', ephemeral: true });
    }

    // Note: In a real implementation, you'd reload commands here
    await interaction.reply('🔄 Commands reloaded! 💖');
  },
};

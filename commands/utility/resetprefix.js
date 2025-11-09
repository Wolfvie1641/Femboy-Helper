const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const prefixesPath = path.join(__dirname, '../../prefixes.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resetprefix')
    .setDescription('Reset the bot prefix to default (!) for this server (Admin only)'),

  async execute(interaction) {
    // Check if user has admin permissions
    if (!interaction.member.permissions.has('Administrator')) {
      return await interaction.reply({
        content: '💔 Only administrators can reset the bot prefix! 💔',
        ephemeral: true,
      });
    }

    try {
      // Read current prefixes
      let prefixes = JSON.parse(fs.readFileSync(prefixesPath, 'utf8'));

      // Remove custom prefix for this guild (will use default)
      delete prefixes.guilds[interaction.guild.id];

      // Write back to file
      fs.writeFileSync(prefixesPath, JSON.stringify(prefixes, null, 2));

      await interaction.reply({
        content: `💖 Prefix reset to default (\`!\`) for this server! 💖\nExample: \`!ping\``,
      });
    } catch (error) {
      console.error('Error resetting prefix:', error);
      await interaction.reply({
        content: '💔 Oopsie, something went wrong while resetting the prefix! 💔',
        ephemeral: true,
      });
    }
  },
};

const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const prefixesPath = path.join(__dirname, '../../prefixes.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setprefix')
    .setDescription('Change the bot prefix for this server (Admin only)')
    .addStringOption(option =>
      option.setName('newprefix')
        .setDescription('The new prefix to use')
        .setRequired(true)
        .setMaxLength(5)
    ),

  async execute(interaction) {
    // Check if user has admin permissions
    if (!interaction.member.permissions.has('Administrator')) {
      return await interaction.reply({
        content: '💔 Only administrators can change the bot prefix! 💔',
        ephemeral: true,
      });
    }

    const newPrefix = interaction.options.getString('newprefix');

    // Validate prefix
    if (newPrefix.includes(' ')) {
      return await interaction.reply({
        content: '💔 Prefix cannot contain spaces! 💔',
        ephemeral: true,
      });
    }

    try {
      // Read current prefixes
      let prefixes = JSON.parse(fs.readFileSync(prefixesPath, 'utf8'));

      // Update prefix for this guild
      prefixes.guilds[interaction.guild.id] = newPrefix;

      // Write back to file
      fs.writeFileSync(prefixesPath, JSON.stringify(prefixes, null, 2));

      await interaction.reply({
        content: `💖 Prefix changed to \`${newPrefix}\` for this server! 💖\nExample: \`${newPrefix}ping\``,
      });
    } catch (error) {
      console.error('Error updating prefix:', error);
      await interaction.reply({
        content: '💔 Oopsie, something went wrong while changing the prefix! 💔',
        ephemeral: true,
      });
    }
  },
};

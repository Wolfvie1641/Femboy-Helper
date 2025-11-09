const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const versionPath = path.join(__dirname, '../../version.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('version')
    .setDescription('Check the current bot version and update information 📋'),

  async execute(interaction) {
    // Read version information
    let versionData = { version: 'Beta-0.0.1', type: 'beta', lastUpdated: '2024-01-01' };
    try {
      versionData = JSON.parse(fs.readFileSync(versionPath, 'utf8'));
    } catch (error) {
      console.log('Creating default version.json file...');
      fs.writeFileSync(versionPath, JSON.stringify(versionData, null, 2));
    }

    const embed = new EmbedBuilder()
      .setTitle('📋 Femboy Helper Version Info 📋')
      .setDescription('Current version and update information!')
      .addFields(
        { name: 'Current Version', value: versionData.version, inline: true },
        { name: 'Version Type', value: versionData.type === 'beta' ? '🧪 Beta' : '✅ Release', inline: true },
        { name: 'Last Updated', value: versionData.lastUpdated, inline: true },
        { name: 'Bot Status', value: '💖 Online and uwu ready!', inline: false }
      )
      .setColor(0xff69b4)
      .setFooter({ text: 'Femboy Helper - Made with love! 💕' });

    await interaction.reply({ embeds: [embed] });
  },

  aliases: ['ver', 'v'],
};

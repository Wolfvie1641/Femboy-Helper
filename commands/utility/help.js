const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Get help with commands 💡'),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('💖 Femboy Helper Commands 💖')
      .setDescription('Here are all the cute commands I can do for you!')
      .setColor(0xff69b4)
      .addFields(
        { name: '🎉 Fun Commands', value: '`/hug` - Give someone a hug!\n`/kiss` - Give someone a kiss!', inline: true },
        { name: '🛡️ Moderation Commands', value: '`/kick` - Kick a user\n`/ban` - Ban a user', inline: true },
        { name: '👑 Master Commands', value: '`/shutdown` - Shut down the bot\n`/reload` - Reload commands', inline: true },
        { name: '🔧 Utility Commands', value: '`/ping` - Check latency\n`/help` - Show this help', inline: true }
      )
      .setFooter({ text: 'UwU, hope this helps!' });

    await interaction.reply({ embeds: [embed] });
  },
};

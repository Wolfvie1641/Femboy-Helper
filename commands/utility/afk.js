const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// In-memory storage for AFK users (in production, use a database)
const afkUsers = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('afk')
    .setDescription('Set yourself as AFK (Away From Keyboard)')
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Why are you AFK? (optional)')
        .setRequired(false)),
  afkUsers, // Export for use in index.js
  async execute(interaction) {
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const userId = interaction.user.id;

    // Check if user is already AFK
    if (afkUsers.has(userId)) {
      // Remove AFK status
      afkUsers.delete(userId);

      const embed = new EmbedBuilder()
        .setTitle('💫 Welcome Back! 💫')
        .setDescription(`You're no longer AFK! Welcome back!`)
        .setColor(0x00ff00)
        .setFooter({ text: 'You can set yourself AFK again anytime!' });

      await interaction.reply({ embeds: [embed] });
      return;
    }

    // Set AFK status
    afkUsers.set(userId, {
      reason: reason,
      timestamp: Date.now(),
      username: interaction.user.username
    });

    const embed = new EmbedBuilder()
      .setTitle('💤 AFK Status Set 💤')
      .setDescription(`You're now AFK! Others will be notified when they mention you.`)
      .addFields(
        { name: 'Reason', value: reason, inline: true },
        { name: 'Set at', value: `<t:${Math.floor(Date.now() / 1000)}:f>`, inline: true }
      )
      .setColor(0xffa500)
      .setFooter({ text: 'Use /afk again to remove your AFK status!' });

    await interaction.reply({ embeds: [embed] });
  },
};

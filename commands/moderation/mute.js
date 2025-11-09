const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Shush a noisy user with a timeout 💋')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to timeout')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('duration')
        .setDescription('Duration in minutes (max 40320 minutes = 28 days)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(40320))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the timeout')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const duration = interaction.options.getInteger('duration');
    const reason = interaction.options.getString('reason') || 'No reason provided uwu~';
    const member = interaction.guild.members.cache.get(user.id);

    if (!member) {
      return await interaction.reply({ content: '💔 That user is not in this server, darling!', ephemeral: true });
    }

    if (!member.moderatable) {
      return await interaction.reply({ content: '💔 I cannot timeout this user, sweetie!', ephemeral: true });
    }

    // Check if user is trying to mute themselves
    if (member.id === interaction.user.id) {
      return await interaction.reply({ content: '💔 You cannot timeout yourself, silly~ 💔', ephemeral: true });
    }

    // Check if target is the bot
    if (member.id === interaction.guild.members.me.id) {
      return await interaction.reply({ content: '💔 You cannot timeout me, master~ 💔', ephemeral: true });
    }

    try {
      const timeoutDuration = duration * 60 * 1000; // Convert minutes to milliseconds
      await member.timeout(timeoutDuration, reason);

      const responses = [
        `💋 ${user.username} has been silenced for ${duration} minutes! Reason: ${reason} 💋`,
        `😘 Shushed ${user.username} for ${duration} minutes~ They need to be quiet now! Reason: ${reason} 😘`,
        `💕 ${user.username} is taking a timeout break for ${duration} minutes! Reason: ${reason} 💕`,
        `🌸 ${user.username} has been muted for ${duration} minutes, darling~ Reason: ${reason} 🌸`,
        `💖 Time to be quiet, ${user.username}! ${duration} minutes of silence. Reason: ${reason} 💖`
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      await interaction.reply(randomResponse);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: '💔 Failed to timeout the user, uwu!', ephemeral: true });
    }
  },
};

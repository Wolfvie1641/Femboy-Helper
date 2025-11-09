const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user from the server 🚫')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to ban uwu~')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for banning, darling~')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided uwu~';
    const member = interaction.guild.members.cache.get(user.id);

    if (!member) {
      return await interaction.reply({ content: '💔 That user is not in this server, sweetie!', ephemeral: true });
    }

    if (!member.bannable) {
      return await interaction.reply({ content: '💔 I cannot ban this user, darling!', ephemeral: true });
    }

    // Check if user is trying to ban themselves
    if (member.id === interaction.user.id) {
      return await interaction.reply({ content: '💔 You cannot ban yourself, silly~ 💔', ephemeral: true });
    }

    // Check if target is the bot
    if (member.id === interaction.guild.members.me.id) {
      return await interaction.reply({ content: '💔 You cannot ban me, master~ 💔', ephemeral: true });
    }

    try {
      await member.ban({ reason });
      const responses = [
        `🚫 ${user.username} has been banned! Reason: ${reason} 🚫`,
        `😤 ${user.username} got permanently removed! Reason: ${reason} 😤`,
        `💔 Goodbye forever, ${user.username}! Reason: ${reason} 💔`,
        `🚷 ${user.username} is now banned from the server! Reason: ${reason} 🚷`,
        `😢 ${user.username} won't be coming back... Reason: ${reason} 😢`
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      await interaction.reply(randomResponse);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: '💔 Failed to ban the user, uwu!', ephemeral: true });
    }
  },
};

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a naughty user from the server 💥')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to kick uwu~')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for kicking, darling~')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided uwu~';
    const member = interaction.guild.members.cache.get(user.id);

    if (!member) {
      return await interaction.reply({ content: '💔 That user is not in this server, sweetie!', ephemeral: true });
    }

    if (!member.kickable) {
      return await interaction.reply({ content: '💔 I cannot kick this user, darling!', ephemeral: true });
    }

    // Check if user is trying to kick themselves
    if (member.id === interaction.user.id) {
      return await interaction.reply({ content: '💔 You cannot kick yourself, silly~ 💔', ephemeral: true });
    }

    // Check if target is the bot
    if (member.id === interaction.guild.members.me.id) {
      return await interaction.reply({ content: '💔 You cannot kick me, master~ 💔', ephemeral: true });
    }

    try {
      await member.kick(reason);
      const responses = [
        `💥 ${user.username} has been kicked! Reason: ${reason} 💥`,
        `😤 ${user.username} got the boot! Reason: ${reason} 😤`,
        `💔 Bye-bye ${user.username}! Reason: ${reason} 💔`,
        `🚫 ${user.username} has been removed from the server! Reason: ${reason} 🚫`,
        `😢 ${user.username} had to go... Reason: ${reason} 😢`
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      await interaction.reply(randomResponse);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: '💔 Failed to kick the user, uwu!', ephemeral: true });
    }
  },
};

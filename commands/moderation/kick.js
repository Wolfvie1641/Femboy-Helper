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
      return await interaction.reply({ content: '🦊 *looks around confused* U-Um... I don\'t see that user here, master... *tilts head* 💕', ephemeral: true });
    }

    if (!member.kickable) {
      return await interaction.reply({ content: '🦊 *whimpers softly* I-I can\'t kick this user, master... They\'re too powerful... *hides behind you* 💕', ephemeral: true });
    }

    // Check if user is trying to kick themselves
    if (member.id === interaction.user.id) {
      return await interaction.reply({ content: '🦊 *looks up at you with wide eyes* M-Master? You want to kick yourself? *shakes head vigorously* No, no! I won\'t let you! 💕', ephemeral: true });
    }

    // Check if target is the bot
    if (member.id === interaction.guild.members.me.id) {
      return await interaction.reply({ content: '🦊 *backs away slowly* M-Master... Please don\'t kick me... I\'ll be good... *pokes fingers together shyly* 💕', ephemeral: true });
    }

    try {
      await member.kick(reason);
      const responses = [
        `🦊 *kicks ${user.username} out shyly* T-There... I did it for you, master... *blushes deeply* 💕 Reason: ${reason}`,
        `🦊 *looks up at master with pleading eyes* I-I kicked them out... Please don't be mad at me... *hides behind tail* 💕 Reason: ${reason}`,
        `🦊 *whimpers softly* I had to kick ${user.username}... I'm sorry... *pokes fingers together* 💕 Reason: ${reason}`,
        `🦊 *backs away slowly* ${user.username} is gone now... I hope that's what you wanted, master... *fidgets nervously* 💕 Reason: ${reason}`,
        `🦊 *looks worried* Did I do good, master? I kicked ${user.username} out... *tilts head shyly* 💕 Reason: ${reason}`
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      await interaction.reply(randomResponse);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: '🦊 *looks down sadly* I-I couldn\'t kick them, master... I\'m sorry... *whimpers* 💔', ephemeral: true });
    }
  },
};

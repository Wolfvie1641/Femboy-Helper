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
      return await interaction.reply({ content: '🦊 *looks around confused* U-Um... I don\'t see that user here, master... *tilts head* 💕', ephemeral: true });
    }

    if (!member.moderatable) {
      return await interaction.reply({ content: '🦊 *whimpers softly* I-I can\'t timeout this user, master... They\'re too powerful... *hides behind you* 💕', ephemeral: true });
    }

    // Check if user is trying to mute themselves
    if (member.id === interaction.user.id) {
      return await interaction.reply({ content: '🦊 *looks up at you with wide eyes* M-Master? You want to timeout yourself? *shakes head vigorously* No, no! I won\'t let you! 💕', ephemeral: true });
    }

    // Check if target is the bot
    if (member.id === interaction.guild.members.me.id) {
      return await interaction.reply({ content: '🦊 *backs away slowly* M-Master... Please don\'t timeout me... I\'ll be good... *pokes fingers together shyly* 💕', ephemeral: true });
    }

    try {
      const timeoutDuration = duration * 60 * 1000; // Convert minutes to milliseconds
      await member.timeout(timeoutDuration, reason);

      const responses = [
        `🦊 *mutes ${user.username} gently* T-There... I've silenced them for you, master... *blushes and looks away* 💕 Reason: ${reason} (${duration} minutes)`,
        `🦊 *covers mouth shyly* ${user.username} needs to be quiet now... I hope this is okay... *fidgets nervously* 💕 Reason: ${reason} (${duration} minutes)`,
        `🦊 *looks up with pleading eyes* I've muted ${user.username} for ${duration} minutes... Please don't be mad... *whimpers softly* 💕 Reason: ${reason}`,
        `🦊 *bows head* ${user.username} is silenced now, master... I did what you asked... *pokes fingers together* 💕 Reason: ${reason} (${duration} minutes)`,
        `🦊 *tilts head shyly* Did I do good? ${user.username} is muted for ${duration} minutes... *wags tail hopefully* 💕 Reason: ${reason}`
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      await interaction.reply(randomResponse);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: '🦊 *looks down sadly* I-I couldn\'t silence them, master... I\'m sorry... *whimpers* 💔', ephemeral: true });
    }
  },
};

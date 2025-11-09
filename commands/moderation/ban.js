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
      return await interaction.reply({ content: '🦊 *looks around confused* U-Um... I don\'t see that user here, master... *tilts head* 💕', ephemeral: true });
    }

    if (!member.bannable) {
      return await interaction.reply({ content: '🦊 *whimpers softly* I-I can\'t ban this user, master... They\'re too powerful... *hides behind you* 💕', ephemeral: true });
    }

    // Check if user is trying to ban themselves
    if (member.id === interaction.user.id) {
      return await interaction.reply({ content: '🦊 *looks up at you with wide eyes* M-Master? You want to ban yourself? *shakes head vigorously* No, no! I won\'t let you! 💕', ephemeral: true });
    }

    // Check if target is the bot
    if (member.id === interaction.guild.members.me.id) {
      return await interaction.reply({ content: '🦊 *backs away slowly* M-Master... Please don\'t ban me... I\'ll be good... *pokes fingers together shyly* 💕', ephemeral: true });
    }

    try {
      await member.ban({ reason });
      const responses = [
        `🦊 *bans ${user.username} with a heavy heart* I-I had to do it, master... Please forgive me... *tears up* 💕 Reason: ${reason}`,
        `🦊 *looks away sadly* ${user.username} is banned now... I hope this is what you wanted... *whimpers softly* 💕 Reason: ${reason}`,
        `🦊 *covers eyes with paws* I can't watch... ${user.username} has been banned... *sniffs* 💕 Reason: ${reason}`,
        `🦊 *bows head in shame* I've banned ${user.username} for you, master... I'm so sorry... *fidgets nervously* 💕 Reason: ${reason}`,
        `🦊 *looks up with pleading eyes* Did I have to ban ${user.username}? I feel so bad... *pokes fingers together shyly* 💕 Reason: ${reason}`
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      await interaction.reply(randomResponse);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: '🦊 *looks down sadly* I-I couldn\'t ban them, master... I\'m sorry... *whimpers* 💔', ephemeral: true });
    }
  },
};

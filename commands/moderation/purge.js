const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Delete messages from the channel (Admin only)')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Number of messages to delete (1-100)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100))
    .addStringOption(option =>
      option.setName('filter')
        .setDescription('Filter messages to delete')
        .setRequired(false)
        .addChoices(
          { name: 'All messages', value: 'all' },
          { name: 'Bot messages only', value: 'bots' },
          { name: 'Human messages only', value: 'humans' }
        ))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');
    const filter = interaction.options.getString('filter') || 'all';

    // Check if user has manage messages permission
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return await interaction.reply({
        content: '🦊 *looks at master with pleading eyes* P-Please... I can\'t let you do that without permission... *blushes and hides behind tail* 💕',
        ephemeral: true
      });
    }

    // Check if bot has manage messages permission
    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return await interaction.reply({
        content: '🦊 *whimpers softly* I-I can\'t delete messages, master... I don\'t have permission... *hides behind you* 💕',
        ephemeral: true
      });
    }

    try {
      // Defer reply to hide the command
      await interaction.deferReply({ ephemeral: true });

      let messagesToDelete;

      // Fetch messages based on filter
      if (filter === 'all') {
        messagesToDelete = await interaction.channel.messages.fetch({ limit: amount });
      } else if (filter === 'bots') {
        const allMessages = await interaction.channel.messages.fetch({ limit: 100 });
        messagesToDelete = allMessages.filter(msg => msg.author.bot).first(amount);
      } else if (filter === 'humans') {
        const allMessages = await interaction.channel.messages.fetch({ limit: 100 });
        messagesToDelete = allMessages.filter(msg => !msg.author.bot).first(amount);
      }

      // Convert to collection if it's an array (for filtered results)
      if (!messagesToDelete instanceof Map) {
        const collection = new Map();
        messagesToDelete.forEach((msg, index) => collection.set(msg.id, msg));
        messagesToDelete = collection;
      }

      // Bulk delete the messages
      const deletedMessages = await interaction.channel.bulkDelete(messagesToDelete, true);

      // Send confirmation
      const responses = [
        `🦊 *cleans up the channel shyly* T-There... I've deleted ${deletedMessages.size} messages for you, master... *blushes deeply* 💕`,
        `🦊 *looks up with sparkling eyes* All clean now! I removed ${deletedMessages.size} messages... Did I do good? *wags tail* 💕`,
        `🦊 *bows respectfully* I've cleaned up ${deletedMessages.size} messages, master... I hope this makes you happy... *smiles shyly* 💕`,
        `🦊 *fidgets nervously* I-I deleted ${deletedMessages.size} messages... Please don't be mad at me... *pokes fingers together* 💕`,
        `🦊 *tilts head curiously* The channel is clean now! ${deletedMessages.size} messages gone... *looks hopeful* 💕`
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      await interaction.editReply(randomResponse);

    } catch (error) {
      console.error('Purge error:', error);

      // Handle specific errors
      if (error.code === 50013) {
        await interaction.editReply('🦊 *looks down sadly* I-I don\'t have permission to delete messages here, master... I\'m sorry... *whimpers* 💔');
      } else if (error.code === 50034) {
        await interaction.editReply('🦊 *tilts head confused* I can\'t delete messages that are too old, master... They\'re older than 2 weeks... *fidgets nervously* 💔');
      } else {
        await interaction.editReply('🦊 *looks worried* Something went wrong while cleaning up... Please try again, master... *pokes fingers together* 💔');
      }
    }
  },
};

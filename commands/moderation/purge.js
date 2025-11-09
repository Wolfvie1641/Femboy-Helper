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
        content: '💔 You need Manage Messages permission to use this command! 💔',
        ephemeral: true
      });
    }

    // Check if bot has manage messages permission
    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return await interaction.reply({
        content: '💔 I need Manage Messages permission to delete messages! 💔',
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
        `🧹 Successfully deleted ${deletedMessages.size} messages! 🧹`,
        `💨 Poof! ${deletedMessages.size} messages have been cleaned up! 💨`,
        `🗑️ Deleted ${deletedMessages.size} messages from the channel! 🗑️`,
        `✨ Channel cleaned! Removed ${deletedMessages.size} messages. ✨`,
        `🧽 Scrubbed ${deletedMessages.size} messages away! 🧽`
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      await interaction.editReply(randomResponse);

    } catch (error) {
      console.error('Purge error:', error);

      // Handle specific errors
      if (error.code === 50013) {
        await interaction.editReply('💔 I don\'t have permission to delete messages in this channel! 💔');
      } else if (error.code === 50034) {
        await interaction.editReply('💔 Cannot delete messages older than 2 weeks! 💔');
      } else {
        await interaction.editReply('💔 Failed to delete messages! Please try again. 💔');
      }
    }
  },
};

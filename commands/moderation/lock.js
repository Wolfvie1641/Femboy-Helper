const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

const lockedChannelsPath = path.join(__dirname, '../../locked_channels.json');

// Initialize locked channels file if it doesn't exist
if (!fs.existsSync(lockedChannelsPath)) {
  fs.writeFileSync(lockedChannelsPath, JSON.stringify({ channels: {} }, null, 2));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Lock a channel to prevent users from sending messages (Moderation)')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('The channel to lock (defaults to current channel)')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for locking the channel')
        .setRequired(false)),

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel') || interaction.channel;
    const reason = interaction.options.getString('reason') || 'No reason provided';

    // Check if user has permission to manage the target channel
    if (!interaction.member.permissionsIn(channel).has(PermissionFlagsBits.ManageChannels)) {
      return await interaction.reply({
        content: '🦊 *tilts head shyly* M-Master... I\'m sorry, but you need special permission for that... *fidgets with paws* 💕',
        ephemeral: true
      });
    }

    // Read current locked channels
    let lockedData = JSON.parse(fs.readFileSync(lockedChannelsPath, 'utf8'));

    // Check if channel is already locked
    if (lockedData.channels[channel.id]) {
      const embed = new EmbedBuilder()
        .setTitle('🔒 Channel Already Locked')
        .setDescription(`🦊 *looks confused* Master, this channel is already locked... *tilts head* 💕`)
        .addFields(
          { name: 'Channel', value: `<#${channel.id}>`, inline: true },
          { name: 'Locked By', value: `<@${lockedData.channels[channel.id].lockedBy}>`, inline: true },
          { name: 'Reason', value: lockedData.channels[channel.id].reason, inline: true },
          { name: 'Locked At', value: `<t:${Math.floor(lockedData.channels[channel.id].timestamp / 1000)}:R>`, inline: true }
        )
        .setColor(0xffa500)
        .setFooter({ text: 'Use /unlock to unlock this channel!' });

      return await interaction.reply({ embeds: [embed] });
    }

    // Lock the channel by updating permissions
    try {
      await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
        SendMessages: false,
        AddReactions: false
      });

      // Save lock information
      lockedData.channels[channel.id] = {
        lockedBy: interaction.user.id,
        reason: reason,
        timestamp: Date.now()
      };

      fs.writeFileSync(lockedChannelsPath, JSON.stringify(lockedData, null, 2));

      const embed = new EmbedBuilder()
        .setTitle('🔒 Channel Locked Successfully!')
        .setDescription(`🦊 *pokes the channel shyly* T-There... I've locked it for you, master... *blushes deeply* 💕`)
        .addFields(
          { name: 'Channel', value: `<#${channel.id}>`, inline: true },
          { name: 'Locked By', value: `<@${interaction.user.id}>`, inline: true },
          { name: 'Reason', value: reason, inline: true }
        )
        .setColor(0xff0000)
        .setFooter({ text: 'Use /unlock to unlock this channel!' });

      await interaction.reply({ embeds: [embed] });

      // Send a message in the locked channel
      const lockMessage = new EmbedBuilder()
        .setTitle('🔒 Channel Locked 🔒')
        .setDescription('🦊 *looks at master with pleading eyes* This channel has been locked... Please wait for master to unlock it... *hides behind tail* 💕')
        .addFields(
          { name: 'Reason', value: reason, inline: true },
          { name: 'Locked By', value: `<@${interaction.user.id}>`, inline: true }
        )
        .setColor(0xff0000)
        .setFooter({ text: 'Please wait for master to unlock this channel!' });

      await channel.send({ embeds: [lockMessage] });

    } catch (error) {
      console.error('Error locking channel:', error);
      await interaction.reply({
        content: '🦊 *looks worried* Oh no, master... I couldn\'t lock the channel... *paws at the ground nervously* 💔',
        ephemeral: true
      });
    }
  },

  aliases: ['lockchannel', 'channellock'],
};

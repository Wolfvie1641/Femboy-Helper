const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

const lockedChannelsPath = path.join(__dirname, '../../locked_channels.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('Unlock a channel to allow users to send messages again (Moderation)')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('The channel to unlock (defaults to current channel)')
        .setRequired(false)),

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel') || interaction.channel;

    // Check if user has permission to manage the target channel
    if (!interaction.member.permissionsIn(channel).has(PermissionFlagsBits.ManageChannels)) {
      return await interaction.reply({
        content: '🦊 *tilts head shyly* M-Master... I\'m sorry, but you need special permission for that... *fidgets with paws* 💕',
        ephemeral: true
      });
    }

    // Read current locked channels
    let lockedData = JSON.parse(fs.readFileSync(lockedChannelsPath, 'utf8'));

    // Check if channel is locked
    if (!lockedData.channels[channel.id]) {
      const embed = new EmbedBuilder()
        .setTitle('🔓 Channel Not Locked')
        .setDescription(`🦊 *looks confused* Master, this channel isn't locked... *tilts head* 💕`)
        .addFields(
          { name: 'Channel', value: `<#${channel.id}>`, inline: true }
        )
        .setColor(0x00ff00)
        .setFooter({ text: 'The channel is already unlocked!' });

      return await interaction.reply({ embeds: [embed] });
    }

    // Unlock the channel by updating permissions
    try {
      await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
        SendMessages: null, // Reset to default
        AddReactions: null  // Reset to default
      });

      // Remove from locked channels
      delete lockedData.channels[channel.id];
      fs.writeFileSync(lockedChannelsPath, JSON.stringify(lockedData, null, 2));

      const embed = new EmbedBuilder()
        .setTitle('🔓 Channel Unlocked Successfully!')
        .setDescription(`🦊 *looks up at master with sparkling eyes* T-Thank you for letting me unlock it... I hope you're happy now... *blushes and wags tail* 💕`)
        .addFields(
          { name: 'Channel', value: `<#${channel.id}>`, inline: true },
          { name: 'Unlocked By', value: `<@${interaction.user.id}>`, inline: true }
        )
        .setColor(0x00ff00)
        .setFooter({ text: 'Users can now chat in this channel!' });

      await interaction.reply({ embeds: [embed] });

      // Send a message in the unlocked channel
      const unlockMessage = new EmbedBuilder()
        .setTitle('🔓 Channel Unlocked 🔓')
        .setDescription('🦊 *bows respectfully to master* Master has unlocked this channel... You may speak freely now... *smiles shyly* 💕')
        .addFields(
          { name: 'Unlocked By', value: `<@${interaction.user.id}>`, inline: true }
        )
        .setColor(0x00ff00)
        .setFooter({ text: 'Happy chatting with master! 💕' });

      await channel.send({ embeds: [unlockMessage] });

    } catch (error) {
      console.error('Error unlocking channel:', error);
      await interaction.reply({
        content: '🦊 *looks worried* Oh no, master... I couldn\'t unlock the channel... *paws at the ground nervously* 💔',
        ephemeral: true
      });
    }
  },

  aliases: ['unlockchannel', 'channelunlock'],
};

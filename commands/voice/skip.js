const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip the current song 🎵'),

  async execute(interaction) {
    // Check if user is in a voice channel
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      const embed = new EmbedBuilder()
        .setTitle('🦊 Oopsie! 🦊')
        .setDescription('You need to be in a voice channel to skip songs, cutie! 💕')
        .setColor(0xff69b4);
      return await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    // Check if bot is in the same voice channel
    const botVoiceChannel = interaction.guild.members.me.voice.channel;
    if (!botVoiceChannel || botVoiceChannel.id !== voiceChannel.id) {
      const embed = new EmbedBuilder()
        .setTitle('🦊 Not in Voice Channel 🦊')
        .setDescription('I\'m not playing music in your voice channel! 💔')
        .setColor(0xff69b4);
      return await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    // In a real implementation, this would skip the current track in the queue
    const embed = new EmbedBuilder()
      .setTitle('⏭️ Song Skipped ⏭️')
      .setDescription('Skipped the current song! 🎵')
      .addFields(
        { name: 'Skipped by', value: interaction.user.username, inline: true }
      )
      .setColor(0xff69b4)
      .setFooter({ text: 'Femboy Helper Music Player 💖' });

    await interaction.reply({ embeds: [embed] });
  },

  aliases: ['next', 's'],
};

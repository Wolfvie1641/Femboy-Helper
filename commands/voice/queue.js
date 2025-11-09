const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Show the current music queue 🎵'),

  async execute(interaction) {
    // Check if user is in a voice channel
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      const embed = new EmbedBuilder()
        .setTitle('🦊 Oopsie! 🦊')
        .setDescription('You need to be in a voice channel to view the queue, cutie! 💕')
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

    // In a real implementation, this would show the actual queue
    const embed = new EmbedBuilder()
      .setTitle('🎵 Music Queue 🎵')
      .setDescription('**Now Playing:**\n🎶 Sample Song - Artist\n\n**Up Next:**\n1. Another Song - Another Artist\n2. Yet Another Song - Yet Another Artist')
      .addFields(
        { name: 'Total Songs', value: '3', inline: true },
        { name: 'Total Duration', value: '12:34', inline: true },
        { name: 'Requested by', value: interaction.user.username, inline: true }
      )
      .setColor(0xff69b4)
      .setFooter({ text: 'Femboy Helper Music Player 💖' });

    await interaction.reply({ embeds: [embed] });
  },

  aliases: ['q', 'list'],
};

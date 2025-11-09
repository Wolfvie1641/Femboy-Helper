const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play music from a URL or search query 🎵')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('YouTube URL or search term')
        .setRequired(true)),

  async execute(interaction) {
    const query = interaction.options.getString('query');

    // Check if user is in a voice channel
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      const embed = new EmbedBuilder()
        .setTitle('🦊 Oopsie! 🦊')
        .setDescription('You need to be in a voice channel to play music, cutie! 💕')
        .setColor(0xff69b4);
      return await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    // Check bot permissions
    const permissions = voiceChannel.permissionsFor(interaction.guild.members.me);
    if (!permissions.has('Connect') || !permissions.has('Speak')) {
      const embed = new EmbedBuilder()
        .setTitle('🦊 Permission Denied 🦊')
        .setDescription('I don\'t have permission to join or speak in that voice channel! 💔')
        .setColor(0xff69b4);
      return await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    await interaction.deferReply();

    try {
      // Join voice channel
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });

      // Create audio player
      const player = createAudioPlayer();

      // For now, we'll simulate playing (you'll need to implement actual audio streaming)
      const embed = new EmbedBuilder()
        .setTitle('🎵 Now Playing 🎵')
        .setDescription(`Playing: ${query}`)
        .addFields(
          { name: 'Requested by', value: interaction.user.username, inline: true },
          { name: 'Channel', value: voiceChannel.name, inline: true }
        )
        .setColor(0xff69b4)
        .setFooter({ text: 'Femboy Helper Music Player 💖' });

      await interaction.editReply({ embeds: [embed] });

      // Store player and connection for later use (skip, stop, etc.)
      // This would be stored in a queue system in a real implementation

    } catch (error) {
      console.error('Music play error:', error);
      const embed = new EmbedBuilder()
        .setTitle('🦊 Error Playing Music 🦊')
        .setDescription('Something went wrong while trying to play that song! 💔')
        .setColor(0xff69b4);
      await interaction.editReply({ embeds: [embed] });
    }
  },

  aliases: ['p'],
};

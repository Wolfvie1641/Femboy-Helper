const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stop playing music and clear the queue 🎵'),

  async execute(interaction) {
    // Check if user is in a voice channel
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      const embed = new EmbedBuilder()
        .setTitle('🦊 *looks around confused* Oopsie! 🦊')
        .setDescription('You need to be in a voice channel to stop music, master... *fidgets shyly* 💕')
        .setColor(0xff69b4);
      return await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    // Check if bot is in the same voice channel
    const botVoiceChannel = interaction.guild.members.me.voice.channel;
    if (!botVoiceChannel || botVoiceChannel.id !== voiceChannel.id) {
      const embed = new EmbedBuilder()
        .setTitle('🦊 *tilts head sadly* Not in Voice Channel 🦊')
        .setDescription('I\'m not playing music in your voice channel, master... *whimpers* 💔')
        .setColor(0xff69b4);
      return await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    // In a real implementation, this would stop playback and clear the queue
    const embed = new EmbedBuilder()
      .setTitle('🦊 *stops sadly* Music Stopped ⏹️')
      .setDescription('Stopped playing music and cleared the queue as you commanded, master... *looks down sadly* 🎵')
      .addFields(
        { name: 'Stopped by', value: `${interaction.user.username} *my master*`, inline: true }
      )
      .setColor(0xff69b4)
      .setFooter({ text: 'Femboy Helper Music Player 💖' });

    await interaction.reply({ embeds: [embed] });
  },

  aliases: ['leave', 'disconnect'],
};

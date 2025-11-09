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
        .setTitle('🦊 *looks around confused* Oopsie! 🦊')
        .setDescription('You need to be in a voice channel to skip songs, master... *fidgets shyly* 💕')
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

    // In a real implementation, this would skip the current track in the queue
    const embed = new EmbedBuilder()
      .setTitle('🦊 *skips happily* Song Skipped! ⏭️')
      .setDescription('Skipped the current song as you wished, master! *wags tail* 🎵')
      .addFields(
        { name: 'Skipped by', value: `${interaction.user.username} *my beloved master*`, inline: true }
      )
      .setColor(0xff69b4)
      .setFooter({ text: 'Femboy Helper Music Player 💖' });

    await interaction.reply({ embeds: [embed] });
  },

  aliases: ['next', 's'],
};

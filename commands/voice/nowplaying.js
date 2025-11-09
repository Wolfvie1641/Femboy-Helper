const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('Show information about the currently playing song 🎵'),

  async execute(interaction) {
    // Check if user is in a voice channel
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      const embed = new EmbedBuilder()
        .setTitle('🦊 *looks around confused* Oopsie! 🦊')
        .setDescription('You need to be in a voice channel to see what\'s playing, master... *fidgets shyly* 💕')
        .setColor(0xff69b4);
      return await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    // Check if bot is in the same voice channel
    const botVoiceChannel = interaction.guild.members.me.voice.channel;
    if (!botVoiceChannel || botVoiceChannel.id !== voiceChannel.id) {
      const embed = new EmbedBuilder()
        .setTitle('🦊 *tilts head sadly* Not Playing Music 🦊')
        .setDescription('I\'m not playing any music right now, master... *whimpers* 💔')
        .setColor(0xff69b4);
      return await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    // In a real implementation, this would show actual current song info
    const embed = new EmbedBuilder()
      .setTitle('🦊 *dances cutely* Now Playing! 🎵')
      .setDescription('**Sample Song**\nby Sample Artist *I hope you like this one, master!*')
      .addFields(
        { name: 'Duration', value: '3:45 / 4:20', inline: true },
        { name: 'Requested by', value: 'SampleUser *my master*', inline: true },
        { name: 'Volume', value: '50%', inline: true },
        { name: 'Loop', value: 'Off', inline: true },
        { name: 'Shuffle', value: 'Off', inline: true }
      )
      .setColor(0xff69b4)
      .setFooter({ text: 'Femboy Helper Music Player 💖' });

    await interaction.reply({ embeds: [embed] });
  },

  aliases: ['np', 'current'],
};

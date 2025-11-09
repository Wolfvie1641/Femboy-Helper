const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kiss')
    .setDescription('Give someone a sweet femboy kiss! 😘')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to kiss uwu~')
        .setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser('user');

    // Check if user is kissing themselves
    if (user.id === interaction.user.id) {
      const selfKissResponses = [
        `💋 ${interaction.user.username} gives themselves a gentle self-kiss! 💋`,
        `😘 ${interaction.user.username} blows themselves a kiss uwu~ 😘`,
        `💖 ${interaction.user.username} kisses their own reflection! 💖`,
        `🌸 ${interaction.user.username} gives the most tender self-kiss! 🌸`,
        `😚 ${interaction.user.username} pecks themselves softly! 😚`
      ];
      const randomResponse = selfKissResponses[Math.floor(Math.random() * selfKissResponses.length)];
      return await interaction.reply(randomResponse);
    }

    const responses = [
      `😘 *kisses ${user.username} softly* Mwah! 💋`,
      `💋 *plants a kiss on ${user.username}'s cheek* You're adorable! 💖`,
      `😚 *gives ${user.username} a peck* Sweet as candy! 🍬`,
      `💋 ${interaction.user.username} gives ${user.username} a sweet femboy kiss! 💋`,
      `😘 ${interaction.user.username} plants a gentle kiss on ${user.username}'s lips uwu~ 😘`,
      `💖 ${interaction.user.username} kisses ${user.username} so tenderly! 💖`,
      `🌸 ${interaction.user.username} gives ${user.username} a cute, feminine kiss! 🌸`,
      `😚 ${interaction.user.username} pecks ${user.username} softly on the cheek! 😚`,
      `💕 ${interaction.user.username} blows ${user.username} a loving kiss! 💕`,
      `🌺 ${interaction.user.username} gives ${user.username} a delicate femboy kiss! 🌺`,
      `💓 ${interaction.user.username} kisses ${user.username} with soft, gentle lips! 💓`
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    await interaction.reply(randomResponse);
  },
};

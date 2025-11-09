const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hug')
    .setDescription('Give someone a warm femboy hug! 💕')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to hug uwu~')
        .setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser('user');

    // Check if user is hugging themselves
    if (user.id === interaction.user.id) {
      const selfHugResponses = [
        `💕 ${interaction.user.username} gives themselves a comforting self-hug! 💕`,
        `🤗 ${interaction.user.username} wraps their arms around themselves uwu~ 🤗`,
        `💖 ${interaction.user.username} needs a hug from themselves! 💖`,
        `🌸 ${interaction.user.username} gives the most gentle self-hug! 🌸`,
        `😘 ${interaction.user.username} hugs themselves so tenderly! 😘`
      ];
      const randomResponse = selfHugResponses[Math.floor(Math.random() * selfHugResponses.length)];
      return await interaction.reply(randomResponse);
    }

    const responses = [
      `💖 *hugs ${user.username} tightly* UwU, you're so cuddly! 💖`,
      `🤗 *wraps arms around ${user.username}* Big squishy hug for you! 💕`,
      `🫂 *gives ${user.username} a gentle hug* Feel the love! 💞`,
      `💕 ${interaction.user.username} gives ${user.username} a big warm femboy hug! 💕`,
      `🤗 ${interaction.user.username} squeezes ${user.username} tightly uwu~ 🤗`,
      `💖 ${interaction.user.username} wraps ${user.username} in a loving femboy embrace! 💖`,
      `🌸 ${interaction.user.username} hugs ${user.username} so gently and cutely! 🌸`,
      `😘 ${interaction.user.username} gives ${user.username} the most adorable femboy hug! 😘`,
      `💋 ${interaction.user.username} cuddles ${user.username} like a soft pillow! 💋`,
      `🌺 ${interaction.user.username} gives ${user.username} a sweet, feminine hug! 🌺`,
      `💓 ${interaction.user.username} holds ${user.username} close with delicate arms! 💓`
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    await interaction.reply(randomResponse);
  },
};

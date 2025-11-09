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
      `🦊 *nuzzles ${user.username} with my fluffy fox tail* Yip~ you're so warm! 🦊`,
      `🦊 *wraps my foxy arms around ${user.username}* Big squishy hug for you, darling! 💕`,
      `🦊 *gives ${user.username} a gentle fox hug* Feel the love from my soft fur! 💞`,
      `🦊 ${interaction.user.username} gives ${user.username} a big warm femboy fox hug! 💕`,
      `🦊 ${interaction.user.username} squeezes ${user.username} tightly with my tails uwu~ 🦊`,
      `🦊 ${interaction.user.username} wraps ${user.username} in a loving femboy fox embrace! 💖`,
      `🦊 ${interaction.user.username} hugs ${user.username} so gently and cutely with my ears twitching! 🌸`,
      `🦊 ${interaction.user.username} gives ${user.username} the most adorable femboy fox hug! 😘`,
      `🦊 ${interaction.user.username} cuddles ${user.username} like a soft fox pillow! 💋`,
      `🦊 ${interaction.user.username} gives ${user.username} a sweet, feminine fox hug! 🌺`,
      `🦊 ${interaction.user.username} holds ${user.username} close with my delicate fox paws! 💓`,
      `🦊 *nuzzles ${user.username} like a cute femboy fox* Yip~ so cuddly! 🦊`,
      `🦊 *hugs ${user.username} with my fluffy tails wrapping around* Foxy cuddles! 🦊`,
      `🦊 *purrs while hugging ${user.username}* Yip~ so soft and warm! 🦊`,
      `🦊 *fox hops into ${user.username}'s arms* Hoppity fox hug! 🦊`,
      `🦊 *fox cuddles ${user.username} gently* Rawr~ but softly with my tail! 🦊`
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    await interaction.reply(randomResponse);
  },
};

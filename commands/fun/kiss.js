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
      `🦊 *kisses ${user.username} softly with my fox lips* Yip~ Mwah! 💋`,
      `🦊 *plants a gentle kiss on ${user.username}'s cheek* You're so adorable, darling! 💖`,
      `🦊 *gives ${user.username} a sweet peck* Sweet as candy from my foxy kisses! 🍬`,
      `🦊 ${interaction.user.username} gives ${user.username} a sweet femboy fox kiss! 💋`,
      `🦊 ${interaction.user.username} plants a gentle kiss on ${user.username}'s lips uwu~ with my tail swishing 😘`,
      `🦊 ${interaction.user.username} kisses ${user.username} so tenderly with my soft fox muzzle! 💖`,
      `🦊 ${interaction.user.username} gives ${user.username} a cute, feminine fox kiss! 🌸`,
      `🦊 ${interaction.user.username} pecks ${user.username} softly on the cheek with my ears perked! 😚`,
      `🦊 ${interaction.user.username} blows ${user.username} a loving kiss with my fluffy tail! 💕`,
      `🦊 ${interaction.user.username} gives ${user.username} a delicate femboy fox kiss! 🌺`,
      `🦊 ${interaction.user.username} kisses ${user.username} with my soft, gentle fox lips! 💓`,
      `🦊 *licks ${user.username}'s cheek like a loving fox* Yip~ kisses! 🦊`,
      `🦊 *kisses ${user.username} with foxy charm and tail wags* Yip~ so sweet! 🦊`,
      `🦊 *rubs against ${user.username} and gives kisses* Yip~ fox kisses! 🦊`,
      `🦊 *nibbles ${user.username}'s nose gently with my fox snout* Bunny fox kisses! 🦊`,
      `🦊 *gives ${user.username} a fox's gentle kiss* Rawr~ but loving with my tail! 🦊`
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    await interaction.reply(randomResponse);
  },
};

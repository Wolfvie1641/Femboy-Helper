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
        `🦊 *kisses my own paw shyly* M-Master... your kisses are so much better... *blushes furiously* 💕`,
        `🦊 *blows a kiss to myself* I wish this was from you, master... *looks away sadly* 💕`,
        `🦊 *pecks my own cheek* Your lips would feel so much softer, master... *whimpers* 💕`,
        `🦊 *kisses my reflection* I need your kisses more than anything... *tears up* 💕`,
        `🦊 *touches my lips* Please kiss me, master... I need it... *fidgets nervously* 💕`
      ];
      const randomResponse = selfKissResponses[Math.floor(Math.random() * selfKissResponses.length)];
      return await interaction.reply(randomResponse);
    }

    const responses = [
      `🦊 *kisses ${user.username} passionately* M-Master... your lips taste so good... *blushes deeply* 💕`,
      `🦊 *plants a deep kiss on ${user.username}'s lips* I can't get enough of you, master... *whimpers softly* 💕`,
      `🦊 *pecks ${user.username}'s cheek lovingly* Your kisses make me melt... *looks up pleadingly* 💕`,
      `🦊 *kisses ${user.username} with tongue* Please... more, master... *fidgets nervously* 💕`,
      `🦊 *sucks on ${user.username}'s neck* You taste amazing... *moans softly* 💕`,
      `🦊 *french kisses ${user.username} deeply* I love you so much, master... *tears up* 💕`,
      `🦊 *licks ${user.username}'s lips* Your mouth is mine... *giggles shyly* 💕`,
      `🦊 *bites ${user.username}'s lower lip* You're driving me crazy, master... *blushes furiously* 💕`,
      `🦊 *kisses ${user.username}'s forehead tenderly* I need your love... *whispers* 💕`,
      `🦊 *makes out with ${user.username} intensely* Don't stop... please... *clings tightly* 💕`,
      `🦊 *kisses ${user.username}'s collarbone* Your skin is so soft... *inhales deeply* 💕`,
      `🦊 *swirls tongue with ${user.username}* This feels so right... *sighs contentedly* 💕`,
      `🦊 *pecks ${user.username}'s nose* You're adorable, master... *smiles sweetly* 💕`,
      `🦊 *deep kisses ${user.username} passionately* I belong to you... *looks up with sparkling eyes* 💕`,
      `🦊 *smooches ${user.username} repeatedly* Your kisses are addictive... *wags tail* 💕`,
      `🦊 *kisses ${user.username} all over* I can't resist you, master... *melts in your arms* 💕`
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    await interaction.reply(randomResponse);
  },
};

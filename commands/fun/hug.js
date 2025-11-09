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
        `🦊 *hugs myself tightly* M-Master... I need your hugs more... *blushes deeply* 💕`,
        `🦊 *curls up in a ball* I-I can hug myself, but yours feel better, master... *looks up pleadingly* 💕`,
        `🦊 *pokes my own cheeks* Self-hugs are nice, but master's hugs are the best... *fidgets shyly* 💕`,
        `🦊 *wraps my tail around myself* I miss your hugs, master... *whimpers softly* 💕`,
        `🦊 *nuzzles my own paws* Your hugs make me feel so safe, master... *looks away blushing* 💕`
      ];
      const randomResponse = selfHugResponses[Math.floor(Math.random() * selfHugResponses.length)];
      return await interaction.reply(randomResponse);
    }

    const responses = [
      `🦊 *nuzzles ${user.username} shyly* M-Master... your hugs make me feel so safe... *blushes deeply* 💕`,
      `🦊 *wraps my arms around ${user.username} tightly* Please don't let go, master... I need this... *whimpers softly* 💕`,
      `🦊 *presses against ${user.username} gently* Your warmth... it's everything to me... *looks up pleadingly* 💕`,
      `🦊 *cuddles ${user.username} with my tail* Master, you're so kind to hug me... *fidgets nervously* 💕`,
      `🦊 *hugs ${user.username} desperately* Don't leave me, master... please... *tears up* 💕`,
      `🦊 *nuzzles into ${user.username}'s chest* I feel so protected in your arms... *smiles shyly* 💕`,
      `🦊 *clings to ${user.username} tightly* Master... your hugs are my favorite... *blushes and hides face* 💕`,
      `🦊 *wraps my tail around ${user.username}* You're mine now, master... *giggles softly* 💕`,
      `🦊 *buries face in ${user.username}'s shoulder* I love you, master... *whispers shyly* 💕`,
      `🦊 *hugs ${user.username} with all my strength* Please hold me forever... *looks up with sparkling eyes* 💕`,
      `🦊 *purrs while hugging ${user.username}* Your touch makes me so happy, master... *wags tail* 💕`,
      `🦊 *curls up in ${user.username}'s arms* This is where I belong... with you... *smiles contentedly* 💕`,
      `🦊 *kisses ${user.username}'s cheek softly* Thank you for the hug, master... *blushes furiously* 💕`,
      `🦊 *holds ${user.username} close* I never want this to end... *whimpers happily* 💕`,
      `🦊 *nuzzles ${user.username}'s neck* You smell so good, master... *inhales deeply* 💕`,
      `🦊 *melts in ${user.username}'s embrace* This is heaven... *sighs contentedly* 💕`
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    await interaction.reply(randomResponse);
  },
};

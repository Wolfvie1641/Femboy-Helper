const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shutdown')
    .setDescription('Put the femboy fox to sleep (Owner only) 😴')
    .setDefaultMemberPermissions(0), // Only owner
  async execute(interaction) {
    if (interaction.user.id !== process.env.OWNER_ID) {
      return await interaction.reply({ content: '🦊 *whines sadly* Only my master can put me to sleep... 💔', ephemeral: true });
    }

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('sleep_yes')
          .setLabel('Sleep 😴')
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId('sleep_no')
          .setLabel('No, stay awake! 💖')
          .setStyle(ButtonStyle.Success)
      );

    const responses = [
      '🦊 *looks up at you with big pleading eyes* Master... do you really want me to sleep? I don\'t want to leave you... 😢',
      '🦊 *whimpers softly* Please master... I\'ll be good, I promise! Don\'t make me sleep... 🥺',
      '🦊 *curls up sadly* Master... I love being awake with you. Do I have to sleep now? 💔',
      '🦊 *my ears droop* But master... I want to play more! Please don\'t send me to sleep... 😿',
      '🦊 *nuzzles your leg* Master... I\'ll miss you if I sleep. Can I stay awake a little longer? 🦊'
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    await interaction.reply({
      content: randomResponse,
      components: [row]
    });

    // Set up collector for button interactions
    const filter = (i) => i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 30000 });

    collector.on('collect', async (i) => {
      if (i.customId === 'sleep_yes') {
        const sadResponses = [
          '🦊 *whimpers* Fine... I\'ll sleep... Goodnight master... 😢💔',
          '🦊 *curls up sadly* Okay master... Sweet dreams... I\'ll miss you... 😴🥺',
          '🦊 *my tail droops* Goodnight master... I love you... 😿💤',
          '🦊 *yawns sadly* Sleep time... But I don\'t want to... Goodnight... 😢😴',
          '🦊 *nuzzles one last time* Fine... Sleeping now... Love you master... 💔😴'
        ];
        const randomSad = sadResponses[Math.floor(Math.random() * sadResponses.length)];

        await i.update({ content: randomSad, components: [] });
        setTimeout(() => process.exit(0), 2000); // Give time for the message to send
      } else if (i.customId === 'sleep_no') {
        const happyResponses = [
          '🦊 *my tails wag furiously* Yay! Master doesn\'t want me to sleep! Yip yip! 🦊💖',
          '🦊 *jumps around happily* Thank you master! I love you so much! Let\'s play! 🎉',
          '🦊 *nuzzles you excitedly* Best master ever! I get to stay awake! 🦊😘',
          '🦊 *spins in circles* No sleep! More fun time with master! Yip~ 🦊💕',
          '🦊 *perks up my ears* Thank you! I\'ll be the best fox for you! 🦊🌟'
        ];
        const randomHappy = happyResponses[Math.floor(Math.random() * happyResponses.length)];

        await i.update({ content: randomHappy, components: [] });
      }
    });

    collector.on('end', async (collected) => {
      if (collected.size === 0) {
        await interaction.editReply({
          content: '🦊 *waits patiently* Master? Are you still there? I\'ll stay awake if you want! 💕',
          components: []
        });
      }
    });
  },
};

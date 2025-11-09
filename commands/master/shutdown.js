const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shutdown')
    .setDescription('Shut down the bot (Owner only) 😴')
    .setDefaultMemberPermissions(0), // Only owner
  async execute(interaction) {
    if (interaction.user.id !== process.env.OWNER_ID) {
      return await interaction.reply({ content: '💔 Only the bot owner can use this command!', ephemeral: true });
    }

    await interaction.reply('😴 Shutting down... Goodnight! 💤');
    process.exit(0);
  },
};

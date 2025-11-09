const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Get help with commands 💡'),
  async execute(interaction) {
    const categories = {
        fun: {
          name: '🎉 Fun Commands',
          description: 'Cute and playful commands to interact with others!',
          commands: [
            '`/hug @user` - Give someone a warm femboy hug!',
            '`/kiss @user` - Give someone a sweet femboy kiss!',
            '`/ai message` - Chat with the femboy AI!'
          ],
          prefix: '`!hug @user`, `!kiss @user`, `!ai message`'
        },
      moderation: {
        name: '🛡️ Moderation Commands',
        description: 'Keep your server safe and organized!',
        commands: [
          '`/kick @user reason` - Kick a naughty user',
          '`/ban @user reason` - Ban a user from the server',
          '`/mute @user duration reason` - Timeout a user (1-40320 minutes)',
          '`/purge amount filter` - Delete messages from channel'
        ],
        prefix: '`!kick @user reason`, `!ban @user reason`, `!mute @user duration reason`, `!purge amount filter`'
      },
      utility: {
        name: '🔧 Utility Commands',
        description: 'Helpful tools and information!',
        commands: [
          '`/ping` - Check bot latency',
          '`/help` - Show this help menu',
          '`/afk reason` - Set yourself as AFK',
          '`/setprefix newprefix` - Change server prefix (Admin)',
          '`/resetprefix` - Reset prefix to ! (Admin)'
        ],
        prefix: '`!ping`, `!help`, `!afk reason`, `!setprefix newprefix`, `!resetprefix`'
      },
        master: {
          name: '👑 Master Commands',
          description: 'Bot owner controls (Owner only)!',
          commands: [
            '`/shutdown` - Shut down the bot gracefully',
            '`/reload` - Reload all commands (Aliases: update, upd)',
            '`/diagnose` - Check bot health and scan for errors',
            '`/maintenance` - Toggle maintenance mode'
          ],
          prefix: '`!shutdown`, `!reload` (!update, !upd), `!diagnose`, `!maintenance`'
        }
    };

    // Create select menu for categories
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('help_category_select')
      .setPlaceholder('Choose a category to view commands!')
      .addOptions(
        { label: '🎉 Fun Commands', value: 'fun', description: 'Cute interaction commands' },
        { label: '🛡️ Moderation Commands', value: 'moderation', description: 'Server management tools' },
        { label: '🔧 Utility Commands', value: 'utility', description: 'Helpful utilities' },
        { label: '👑 Master Commands', value: 'master', description: 'Bot owner controls' }
      );

    // Create like button
    const likeButton = new ButtonBuilder()
      .setCustomId('help_like')
      .setLabel('👍 Like')
      .setStyle(ButtonStyle.Success);

    const row1 = new ActionRowBuilder().addComponents(selectMenu);
    const row2 = new ActionRowBuilder().addComponents(likeButton);

    const embed = new EmbedBuilder()
      .setTitle('💖 Femboy Helper Commands 💖')
      .setDescription('Choose a category below to see detailed commands!\n\n**💡 Tip:** Both slash (`/`) and prefix (`!`) commands work!')
      .setColor(0xff69b4)
      .setFooter({ text: 'Select a category from the menu below! 🦊' });

    await interaction.reply({ embeds: [embed], components: [row1, row2] });
  },
};

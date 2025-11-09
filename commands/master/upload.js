const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');

const versionPath = path.join(__dirname, '../../version.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('upload')
    .setDescription('Upload a new version of the bot (Owner only) 📤')
    .setDefaultMemberPermissions(0), // Only owner

  async execute(interaction) {
    if (interaction.user.id !== process.env.OWNER_ID) {
      return await interaction.reply({ content: '🦊 *whines sadly* Only my master can upload updates... 💔', ephemeral: true });
    }

    // Read current version
    let versionData = { version: 'Beta-0.0.1', type: 'beta', lastUpdated: new Date().toISOString().split('T')[0] };
    try {
      versionData = JSON.parse(fs.readFileSync(versionPath, 'utf8'));
    } catch (error) {
      fs.writeFileSync(versionPath, JSON.stringify(versionData, null, 2));
    }

    const embed = new EmbedBuilder()
      .setTitle('📤 Upload New Version 📤')
      .setDescription('Choose the type of update you want to upload!')
      .addFields(
        { name: 'Current Version', value: versionData.version, inline: true },
        { name: 'Current Type', value: versionData.type === 'beta' ? '🧪 Beta' : '✅ Release', inline: true }
      )
      .setColor(0xff69b4)
      .setFooter({ text: 'Select the update type below!' });

    // Create buttons for version type selection
    const betaButton = new ButtonBuilder()
      .setCustomId('upload_beta')
      .setLabel('Beta Update')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('🧪');

    const releaseButton = new ButtonBuilder()
      .setCustomId('upload_release')
      .setLabel('Release Update')
      .setStyle(ButtonStyle.Success)
      .setEmoji('✅');

    const row = new ActionRowBuilder().addComponents(betaButton, releaseButton);

    await interaction.reply({ embeds: [embed], components: [row] });
  },

  // Handle button interactions
  async handleButton(interaction) {
    if (interaction.user.id !== process.env.OWNER_ID) {
      return await interaction.reply({ content: '🦊 *whines sadly* Only my master can upload updates... 💔', ephemeral: true });
    }

    const updateType = interaction.customId === 'upload_beta' ? 'beta' : 'release';

    // Show modal for version input
    const modal = new ModalBuilder()
      .setCustomId(`upload_${updateType}_modal`)
      .setTitle(`📤 Upload ${updateType.charAt(0).toUpperCase() + updateType.slice(1)} Version`);

    const versionInput = new TextInputBuilder()
      .setCustomId('new_version')
      .setLabel(`New ${updateType.charAt(0).toUpperCase() + updateType.slice(1)} Version`)
      .setStyle(TextInputStyle.Short)
      .setPlaceholder(updateType === 'beta' ? 'e.g., 0.0.2' : 'e.g., 1.0.0')
      .setRequired(true)
      .setMaxLength(20);

    const firstActionRow = new ActionRowBuilder().addComponents(versionInput);
    modal.addComponents(firstActionRow);

    await interaction.showModal(modal);
  },

  // Handle modal submissions
  async handleModal(interaction) {
    if (interaction.user.id !== process.env.OWNER_ID) {
      return await interaction.reply({ content: '🦊 *whines sadly* Only my master can upload updates... 💔', ephemeral: true });
    }

    const newVersionNumber = interaction.fields.getTextInputValue('new_version');
    const updateType = interaction.customId.includes('beta') ? 'beta' : 'release';

    // Read current version data
    let versionData = JSON.parse(fs.readFileSync(versionPath, 'utf8'));

    // Format version string
    const formattedVersion = updateType === 'beta' ? `Beta-${newVersionNumber}` : newVersionNumber;

    // Update version data
    versionData.version = formattedVersion;
    versionData.type = updateType;
    versionData.lastUpdated = new Date().toISOString().split('T')[0];

    // Save updated version
    fs.writeFileSync(versionPath, JSON.stringify(versionData, null, 2));

    const embed = new EmbedBuilder()
      .setTitle('✅ Version Updated Successfully! ✅')
      .setDescription('The bot has been updated to a new version!')
      .addFields(
        { name: 'New Version', value: formattedVersion, inline: true },
        { name: 'Version Type', value: updateType === 'beta' ? '🧪 Beta' : '✅ Release', inline: true },
        { name: 'Updated On', value: versionData.lastUpdated, inline: true },
        { name: 'Updated By', value: interaction.user.username, inline: false }
      )
      .setColor(0x00ff00)
      .setFooter({ text: 'Users can check the new version with /version!' });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },

  aliases: ['update_version', 'new_version'],
};

const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');

const maintenancePath = path.join(__dirname, '../../maintenance.json');

// Initialize maintenance file if it doesn't exist
if (!fs.existsSync(maintenancePath)) {
  fs.writeFileSync(maintenancePath, JSON.stringify({ enabled: false, reason: '' }, null, 2));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('maintenance')
    .setDescription('Toggle maintenance mode (Owner only) 🔧')
    .setDefaultMemberPermissions(0) // Only owner
    .addBooleanOption(option =>
      option.setName('enable')
        .setDescription('Enable or disable maintenance mode')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for maintenance (shown in bot status)')
        .setRequired(false)),

  async execute(interaction) {
    if (interaction.user.id !== process.env.OWNER_ID) {
      return await interaction.reply({ content: '🦊 *whines sadly* Only my master can put me in maintenance... 💔', ephemeral: true });
    }

    const enable = interaction.options.getBoolean('enable');
    const reason = interaction.options.getString('reason') || 'Scheduled maintenance';

    // Read current maintenance state
    let maintenance = JSON.parse(fs.readFileSync(maintenancePath, 'utf8'));

    if (enable) {
      // Enable maintenance
      maintenance.enabled = true;
      maintenance.reason = reason;

      // Set bot presence to maintenance mode
      await interaction.client.user.setPresence({
        activities: [{
          name: `🔧 Maintenance: ${reason}`,
          type: 0, // Playing
        }],
        status: 'dnd' // Do Not Disturb
      });

      const embed = new EmbedBuilder()
        .setTitle('🔧 Maintenance Mode Enabled 🔧')
        .setDescription('I\'m now in maintenance mode! Only my master can use commands.')
        .addFields(
          { name: 'Reason', value: reason, inline: true },
          { name: 'Status', value: '🛠️ Under Maintenance', inline: true }
        )
        .setColor(0xffa500)
        .setFooter({ text: 'Use /maintenance enable:false to disable maintenance mode' });

      await interaction.reply({ embeds: [embed] });
    } else {
      // Disable maintenance
      maintenance.enabled = false;
      maintenance.reason = '';

      // Reset bot presence to normal
      await interaction.client.user.setPresence({
        activities: [{
          name: '💖 Ready to uwu! 💖',
          type: 0,
        }],
        status: 'online'
      });

      const embed = new EmbedBuilder()
        .setTitle('✅ Maintenance Mode Disabled ✅')
        .setDescription('Maintenance mode has been disabled! All commands are now available.')
        .setColor(0x00ff00)
        .setFooter({ text: 'I\'m back and ready to serve everyone!' });

      await interaction.reply({ embeds: [embed] });
    }

    // Save maintenance state
    fs.writeFileSync(maintenancePath, JSON.stringify(maintenance, null, 2));
  },

  // Prefix command handler
  async executePrefix(message, args) {
    if (message.author.id !== process.env.OWNER_ID) {
      const embed = new EmbedBuilder()
        .setTitle('🚫 Access Denied 🚫')
        .setDescription('🦊 *whines sadly* Only my master can control maintenance mode... 💔')
        .setColor(0xff0000)
        .setFooter({ text: 'You need to be the bot owner to use this command!' });
      return await message.reply({ embeds: [embed] });
    }

    // Read current maintenance state
    let maintenance = JSON.parse(fs.readFileSync(maintenancePath, 'utf8'));

    // Create maintenance control panel
    const embed = new EmbedBuilder()
      .setTitle('🔧 Maintenance Control Panel 🔧')
      .setDescription('Use the buttons below to control maintenance mode!')
      .addFields(
        { name: 'Current Status', value: maintenance.enabled ? '🛠️ **Under Maintenance**' : '✅ **Normal Operation**', inline: true },
        { name: 'Current Reason', value: maintenance.reason || 'None', inline: true }
      )
      .setColor(maintenance.enabled ? 0xffa500 : 0x00ff00)
      .setFooter({ text: 'Only you can see and control this panel!' });

    // Create buttons
    const enableButton = new ButtonBuilder()
      .setCustomId('maintenance_enable')
      .setLabel('Enable Maintenance')
      .setStyle(ButtonStyle.Danger)
      .setEmoji('🔧');

    const disableButton = new ButtonBuilder()
      .setCustomId('maintenance_disable')
      .setLabel('Disable Maintenance')
      .setStyle(ButtonStyle.Success)
      .setEmoji('✅');

    const setReasonButton = new ButtonBuilder()
      .setCustomId('maintenance_set_reason')
      .setLabel('Set Reason')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('📝');

    const row = new ActionRowBuilder().addComponents(enableButton, disableButton, setReasonButton);

    await message.reply({ embeds: [embed], components: [row] });
  },

  // Handle button interactions
  async handleButton(interaction) {
    if (interaction.user.id !== process.env.OWNER_ID) {
      return await interaction.reply({ content: '🦊 *whines sadly* Only my master can control maintenance mode... 💔', ephemeral: true });
    }

    // Read current maintenance state
    let maintenance = JSON.parse(fs.readFileSync(maintenancePath, 'utf8'));

    if (interaction.customId === 'maintenance_enable') {
      // Show modal for reason input
      const modal = new ModalBuilder()
        .setCustomId('maintenance_enable_modal')
        .setTitle('🔧 Enable Maintenance Mode');

      const reasonInput = new TextInputBuilder()
        .setCustomId('maintenance_reason')
        .setLabel('Maintenance Reason')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('Enter the reason for maintenance...')
        .setRequired(true)
        .setMaxLength(100);

      const firstActionRow = new ActionRowBuilder().addComponents(reasonInput);
      modal.addComponents(firstActionRow);

      await interaction.showModal(modal);

    } else if (interaction.customId === 'maintenance_disable') {
      // Disable maintenance
      maintenance.enabled = false;
      maintenance.reason = '';

      // Set bot presence to normal
      await interaction.client.user.setPresence({
        activities: [{
          name: '💖 Ready to uwu! 💖',
          type: 0,
        }],
        status: 'online'
      });

      // Save maintenance state
      fs.writeFileSync(maintenancePath, JSON.stringify(maintenance, null, 2));

      const embed = new EmbedBuilder()
        .setTitle('✅ Maintenance Mode Disabled ✅')
        .setDescription('Maintenance mode has been disabled! All commands are now available.')
        .setColor(0x00ff00)
        .setFooter({ text: 'I\'m back and ready to serve everyone!' });

      await interaction.update({ embeds: [embed], components: [] });

    } else if (interaction.customId === 'maintenance_set_reason') {
      // Show modal for setting reason
      const modal = new ModalBuilder()
        .setCustomId('maintenance_set_reason_modal')
        .setTitle('📝 Set Maintenance Reason');

      const reasonInput = new TextInputBuilder()
        .setCustomId('maintenance_reason')
        .setLabel('New Maintenance Reason')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('Enter the new maintenance reason...')
        .setRequired(true)
        .setMaxLength(100)
        .setValue(maintenance.reason || '');

      const firstActionRow = new ActionRowBuilder().addComponents(reasonInput);
      modal.addComponents(firstActionRow);

      await interaction.showModal(modal);
    }
  },

  // Handle modal submissions
  async handleModal(interaction) {
    if (interaction.user.id !== process.env.OWNER_ID) {
      return await interaction.reply({ content: '🦊 *whines sadly* Only my master can control maintenance mode... 💔', ephemeral: true });
    }

    const reason = interaction.fields.getTextInputValue('maintenance_reason');

    // Read current maintenance state
    let maintenance = JSON.parse(fs.readFileSync(maintenancePath, 'utf8'));

    if (interaction.customId === 'maintenance_enable_modal') {
      // Enable maintenance
      maintenance.enabled = true;
      maintenance.reason = reason;

      // Set bot presence to maintenance mode
      await interaction.client.user.setPresence({
        activities: [{
          name: `🔧 Maintenance: ${reason}`,
          type: 0, // Playing
        }],
        status: 'dnd' // Do Not Disturb
      });

      // Save maintenance state
      fs.writeFileSync(maintenancePath, JSON.stringify(maintenance, null, 2));

      const embed = new EmbedBuilder()
        .setTitle('🔧 Maintenance Mode Enabled 🔧')
        .setDescription('I\'m now in maintenance mode! Only my master can use commands.')
        .addFields(
          { name: 'Reason', value: reason, inline: true },
          { name: 'Status', value: '🛠️ Under Maintenance', inline: true }
        )
        .setColor(0xffa500)
        .setFooter({ text: 'Use the control panel to disable maintenance mode' });

      await interaction.reply({ embeds: [embed], ephemeral: true });

    } else if (interaction.customId === 'maintenance_set_reason_modal') {
      // Update reason
      maintenance.reason = reason;

      // Update bot presence if maintenance is enabled
      if (maintenance.enabled) {
        await interaction.client.user.setPresence({
          activities: [{
            name: `🔧 Maintenance: ${reason}`,
            type: 0,
          }],
          status: 'dnd'
        });
      }

      // Save maintenance state
      fs.writeFileSync(maintenancePath, JSON.stringify(maintenance, null, 2));

      const embed = new EmbedBuilder()
        .setTitle('📝 Maintenance Reason Updated 📝')
        .setDescription('The maintenance reason has been updated successfully!')
        .addFields(
          { name: 'New Reason', value: reason, inline: true },
          { name: 'Status', value: maintenance.enabled ? '🛠️ Under Maintenance' : '✅ Normal Operation', inline: true }
        )
        .setColor(0x00aaff)
        .setFooter({ text: 'The bot status has been updated accordingly!' });

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  }
};

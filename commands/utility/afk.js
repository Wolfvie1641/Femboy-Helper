const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// File-based storage for AFK users
const afkUsersPath = path.join(__dirname, '../../afk_users.json');
const afkIgnoredChannelsPath = path.join(__dirname, '../../afk_ignored_channels.json');
const afkIgnoreChannelsPath = path.join(__dirname, '../../afk_ignore_channels.json');

// Load AFK users from file
function loadAfkUsers() {
  try {
    const data = fs.readFileSync(afkUsersPath, 'utf8');
    return new Map(Object.entries(JSON.parse(data)));
  } catch (error) {
    console.log('Creating new afk_users.json file...');
    fs.writeFileSync(afkUsersPath, JSON.stringify({}, null, 2));
    return new Map();
  }
}

// Save AFK users to file
function saveAfkUsers(afkUsers) {
  try {
    const data = Object.fromEntries(afkUsers);
    fs.writeFileSync(afkUsersPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving AFK users:', error);
  }
}

// Load ignored channels (where AFK auto-remove is disabled)
function loadAfkIgnoredChannels() {
  try {
    const data = fs.readFileSync(afkIgnoredChannelsPath, 'utf8');
    return new Set(JSON.parse(data));
  } catch (error) {
    console.log('Creating new afk_ignored_channels.json file...');
    fs.writeFileSync(afkIgnoredChannelsPath, JSON.stringify([], null, 2));
    return new Set();
  }
}

// Save ignored channels
function saveAfkIgnoredChannels(channels) {
  try {
    const data = Array.from(channels);
    fs.writeFileSync(afkIgnoredChannelsPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving AFK ignored channels:', error);
  }
}

// Load ignore channels (where AFK command is disabled)
function loadAfkIgnoreChannels() {
  try {
    const data = fs.readFileSync(afkIgnoreChannelsPath, 'utf8');
    return new Set(JSON.parse(data));
  } catch (error) {
    console.log('Creating new afk_ignore_channels.json file...');
    fs.writeFileSync(afkIgnoreChannelsPath, JSON.stringify([], null, 2));
    return new Set();
  }
}

// Save ignore channels
function saveAfkIgnoreChannels(channels) {
  try {
    const data = Array.from(channels);
    fs.writeFileSync(afkIgnoreChannelsPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving AFK ignore channels:', error);
  }
}

// Initialize data from files
const afkUsers = loadAfkUsers();
const afkIgnoredChannels = loadAfkIgnoredChannels();
const afkIgnoreChannels = loadAfkIgnoreChannels();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('afk')
    .setDescription('AFK Management System')
    .addSubcommand(subcommand =>
      subcommand
        .setName('set')
        .setDescription('Set yourself as AFK')
        .addStringOption(option =>
          option.setName('reason')
            .setDescription('Why are you AFK? (optional)')
            .setRequired(false)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Remove your AFK status'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('list')
        .setDescription('List all AFK users (Admin/Owner only)'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('mod')
        .setDescription('AFK moderation commands (Admin/Owner only)')
        .addStringOption(option =>
          option.setName('action')
            .setDescription('Action to perform')
            .setRequired(true)
            .addChoices(
              { name: 'remove', value: 'remove' },
              { name: 'ignore', value: 'ignore' },
              { name: 'ignored', value: 'ignored' }
            ))
        .addUserOption(option =>
          option.setName('user')
            .setDescription('User to remove AFK from (for remove action)')
            .setRequired(false))
        .addChannelOption(option =>
          option.setName('channel')
            .setDescription('Channel to ignore/ignored (for ignore/ignored actions)')
            .setRequired(false))),
  afkUsers, // Export for use in index.js
  afkIgnoredChannels, // Export for use in index.js
  afkIgnoreChannels, // Export for use in index.js
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    // Check if channel is ignored for AFK commands
    if (afkIgnoreChannels.has(interaction.channelId)) {
      const embed = new EmbedBuilder()
        .setTitle('🚫 AFK Command Disabled')
        .setDescription('🦊 *looks down sadly* AFK commands are disabled in this channel by master... *whimpers softly* 💕')
        .setColor(0xff0000)
        .setFooter({ text: 'Please use AFK commands in other channels!' });

      await interaction.reply({ embeds: [embed] });
      return;
    }

    if (subcommand === 'set') {
      const reason = interaction.options.getString('reason') || 'No reason provided';
      const userId = interaction.user.id;

      // Check if user is already AFK
      if (afkUsers.has(userId)) {
        const embed = new EmbedBuilder()
          .setTitle('🦊 *tilts head confused* Already AFK!')
          .setDescription(`You're already AFK, master! Use \`/afk remove\` to remove your status. *wags tail uncertainly*`)
          .setColor(0xffa500)
          .setFooter({ text: 'You can remove your AFK status anytime!' });

        await interaction.reply({ embeds: [embed] });
        return;
      }

      // Set AFK status
      afkUsers.set(userId, {
        reason: reason,
        timestamp: Date.now(),
        username: interaction.user.username
      });
      saveAfkUsers(afkUsers);

      const embed = new EmbedBuilder()
        .setTitle('🦊 *curls up sleepily* AFK Status Set 💤')
        .setDescription(`You're now AFK, master... I'll let others know when they mention you. *yawns cutely*`)
        .addFields(
          { name: 'Reason', value: reason, inline: true },
          { name: 'Set at', value: `<t:${Math.floor(Date.now() / 1000)}:f>`, inline: true }
        )
        .setColor(0xffa500)
        .setFooter({ text: 'Use /afk remove to remove your AFK status, master!' });

      await interaction.reply({ embeds: [embed] });

    } else if (subcommand === 'remove') {
      const userId = interaction.user.id;

      if (!afkUsers.has(userId)) {
        const embed = new EmbedBuilder()
          .setTitle('🦊 *looks around confused* Not AFK!')
          .setDescription(`You're not currently AFK, master! Use \`/afk set\` to set your status. *tilts head curiously*`)
          .setColor(0xffa500)
          .setFooter({ text: 'You can set yourself AFK anytime!' });

        await interaction.reply({ embeds: [embed] });
        return;
      }

      // Remove AFK status
      afkUsers.delete(userId);
      saveAfkUsers(afkUsers);

      const embed = new EmbedBuilder()
        .setTitle('🦊 *wakes up excitedly* Welcome Back! 💫')
        .setDescription(`You're no longer AFK, master! I missed you so much... *wags tail happily*`)
        .setColor(0x00ff00)
        .setFooter({ text: 'You can set yourself AFK again anytime, master!' });

      await interaction.reply({ embeds: [embed] });

    } else if (subcommand === 'list') {
      // Check if user is admin or owner
      if (!interaction.member.permissions.has('Administrator') && interaction.user.id !== process.env.OWNER_ID) {
        const embed = new EmbedBuilder()
          .setTitle('🚫 Access Denied')
          .setDescription('🦊 *hides behind tail shyly* Only admins and master can view the AFK list... *peeks out nervously* 💕')
          .setColor(0xff0000)
          .setFooter({ text: 'This command requires administrator permissions!' });

        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }

      if (afkUsers.size === 0) {
        const embed = new EmbedBuilder()
          .setTitle('📋 AFK Users List')
          .setDescription('🦊 *looks around the empty room* No users are currently AFK, master... *sits down patiently* 💤')
          .setColor(0x00ff00)
          .setFooter({ text: 'All users are active!' });

        await interaction.reply({ embeds: [embed] });
        return;
      }

      let description = '';
      let count = 1;

      for (const [userId, afkData] of afkUsers) {
        const duration = Math.floor((Date.now() - afkData.timestamp) / 1000);
        description += `${count}. <@${userId}> - "${afkData.reason}" (${Math.floor(duration / 3600)}h ${Math.floor((duration % 3600) / 60)}m ago)\n`;
        count++;
      }

      const embed = new EmbedBuilder()
        .setTitle('📋 AFK Users List')
        .setDescription(description)
        .setColor(0xffa500)
        .setFooter({ text: `Total AFK users: ${afkUsers.size}` });

      await interaction.reply({ embeds: [embed] });

    } else if (subcommand === 'mod') {
      // Check if user is admin or owner
      if (!interaction.member.permissions.has('Administrator') && interaction.user.id !== process.env.OWNER_ID) {
        const embed = new EmbedBuilder()
          .setTitle('🚫 Access Denied')
          .setDescription('🦊 *hides behind tail shyly* Only admins and master can use AFK moderation commands... *peeks out nervously* 💕')
          .setColor(0xff0000)
          .setFooter({ text: 'This command requires administrator permissions!' });

        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }

      const action = interaction.options.getString('action');

      if (action === 'remove') {
        const user = interaction.options.getUser('user');
        if (!user) {
          const embed = new EmbedBuilder()
            .setTitle('❌ Missing User')
            .setDescription('🦊 *looks around confused* Please specify a user to remove AFK from, master... *tilts head*')
            .setColor(0xff0000)
            .setFooter({ text: 'Use: /afk mod remove user:@user' });

          await interaction.reply({ embeds: [embed] });
          return;
        }

        if (!afkUsers.has(user.id)) {
          const embed = new EmbedBuilder()
            .setTitle('❌ User Not AFK')
            .setDescription(`🦊 *shakes head* ${user.username} is not currently AFK, master... *looks concerned*`)
            .setColor(0xffa500)
            .setFooter({ text: 'Check the AFK list with /afk list' });

          await interaction.reply({ embeds: [embed] });
          return;
        }

        afkUsers.delete(user.id);
        saveAfkUsers(afkUsers);

        const embed = new EmbedBuilder()
          .setTitle('✅ AFK Removed')
          .setDescription(`🦊 *nods obediently* Removed ${user.username}'s AFK status as requested, master... *wags tail*`)
          .setColor(0x00ff00)
          .setFooter({ text: 'AFK status has been removed!' });

        await interaction.reply({ embeds: [embed] });

      } else if (action === 'ignore') {
        const channel = interaction.options.getChannel('channel');
        if (!channel) {
          const embed = new EmbedBuilder()
            .setTitle('❌ Missing Channel')
            .setDescription('🦊 *looks around confused* Please specify a channel to ignore for AFK auto-remove, master... *tilts head*')
            .setColor(0xff0000)
            .setFooter({ text: 'Use: /afk mod ignore channel:#channel' });

          await interaction.reply({ embeds: [embed] });
          return;
        }

        if (afkIgnoredChannels.has(channel.id)) {
          afkIgnoredChannels.delete(channel.id);
          saveAfkIgnoredChannels(afkIgnoredChannels);

          const embed = new EmbedBuilder()
            .setTitle('✅ Channel Unignored')
            .setDescription(`🦊 *nods happily* AFK auto-remove is now enabled in ${channel} again, master... *wags tail*`)
            .setColor(0x00ff00)
            .setFooter({ text: 'Users will now have their AFK status removed when they speak in this channel!' });

          await interaction.reply({ embeds: [embed] });
        } else {
          afkIgnoredChannels.add(channel.id);
          saveAfkIgnoredChannels(afkIgnoredChannels);

          const embed = new EmbedBuilder()
            .setTitle('✅ Channel Ignored')
            .setDescription(`🦊 *nods obediently* AFK auto-remove is now disabled in ${channel}, master... *curls up*`)
            .setColor(0xffa500)
            .setFooter({ text: 'Users will keep their AFK status even when they speak in this channel!' });

          await interaction.reply({ embeds: [embed] });
        }

      } else if (action === 'ignored') {
        const channel = interaction.options.getChannel('channel');
        if (!channel) {
          const embed = new EmbedBuilder()
            .setTitle('❌ Missing Channel')
            .setDescription('🦊 *looks around confused* Please specify a channel to disable/enable AFK commands in, master... *tilts head*')
            .setColor(0xff0000)
            .setFooter({ text: 'Use: /afk mod ignored channel:#channel' });

          await interaction.reply({ embeds: [embed] });
          return;
        }

        if (afkIgnoreChannels.has(channel.id)) {
          afkIgnoreChannels.delete(channel.id);
          saveAfkIgnoreChannels(afkIgnoreChannels);

          const embed = new EmbedBuilder()
            .setTitle('✅ AFK Commands Enabled')
            .setDescription(`🦊 *wags tail happily* AFK commands are now enabled in ${channel} again, master... *jumps excitedly*`)
            .setColor(0x00ff00)
            .setFooter({ text: 'Users can now use AFK commands in this channel!' });

          await interaction.reply({ embeds: [embed] });
        } else {
          afkIgnoreChannels.add(channel.id);
          saveAfkIgnoreChannels(afkIgnoreChannels);

          const embed = new EmbedBuilder()
            .setTitle('✅ AFK Commands Disabled')
            .setDescription(`🦊 *nods sadly* AFK commands are now disabled in ${channel}, master... *looks down*`)
            .setColor(0xff0000)
            .setFooter({ text: 'Users cannot use AFK commands in this channel!' });

          await interaction.reply({ embeds: [embed] });
        }
      }
    }
  },
};

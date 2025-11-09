const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Prefix system
const prefixesPath = path.join(__dirname, 'prefixes.json');
let prefixes = { default: '!', guilds: {} };

// Load prefixes
try {
  prefixes = JSON.parse(fs.readFileSync(prefixesPath, 'utf8'));
} catch (error) {
  console.log('Creating new prefixes.json file...');
  fs.writeFileSync(prefixesPath, JSON.stringify(prefixes, null, 2));
}

// Maintenance system
const maintenancePath = path.join(__dirname, 'maintenance.json');
let maintenance = { enabled: false, reason: '' };

// Load maintenance state
try {
  maintenance = JSON.parse(fs.readFileSync(maintenancePath, 'utf8'));
} catch (error) {
  console.log('Creating new maintenance.json file...');
  fs.writeFileSync(maintenancePath, JSON.stringify(maintenance, null, 2));
}

// Function to get prefix for a guild
function getPrefix(guildId) {
  return prefixes.guilds[guildId] || prefixes.default;
}

// Function to check if maintenance mode is enabled
function isMaintenanceMode() {
  // Reload maintenance state from file to ensure it's current
  try {
    const currentMaintenance = JSON.parse(fs.readFileSync(maintenancePath, 'utf8'));
    return currentMaintenance.enabled;
  } catch (error) {
    return false;
  }
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath);
const commands = [];

for (const folder of commandFolders) {
  const folderPath = path.join(commandsPath, folder);
  const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(folderPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
      commands.push(command.data.toJSON());
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

client.once('ready', async () => {
  console.log(`💖 Femboy Helper is online and ready to uwu! 💖`);
  console.log(`🐺 Awoo~ Femboy furry bot loaded with ${client.commands.size} commands! 🐺`);
  console.log(`Bot User: ${client.user.tag}`);
  console.log(`Client ID: ${process.env.CLIENT_ID}`);

  // Set initial presence based on maintenance mode
  if (isMaintenanceMode()) {
    const currentMaintenance = JSON.parse(fs.readFileSync(maintenancePath, 'utf8'));
    await client.user.setPresence({
      activities: [{
        name: `🔧 Maintenance: ${currentMaintenance.reason}`,
        type: 0,
      }],
      status: 'dnd'
    });
    console.log(`🔧 Maintenance mode active: ${currentMaintenance.reason}`);
  } else {
    await client.user.setPresence({
      activities: [{
        name: '💖 Ready to uwu! 💖',
        type: 0,
      }],
      status: 'online'
    });
  }

  try {
    console.log('Started refreshing application (/) commands.');

    // Try global commands first
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands },
    );

    console.log('Successfully reloaded global application (/) commands.');
  } catch (error) {
    console.error('Error registering global commands:', error);

    // If global fails, try guild-specific commands
    if (process.env.GUILD_ID) {
      try {
        console.log('Attempting guild-specific command registration...');

        await rest.put(
          Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
          { body: commands },
        );

        console.log('Successfully reloaded guild application (/) commands.');
      } catch (guildError) {
        console.error('Error registering guild commands:', guildError);
        console.log('💡 Tip: Make sure GUILD_ID is set in your .env file and the bot has been invited to that server');
      }
    } else {
      console.log('⚠️ No GUILD_ID found in environment variables. Slash commands will not be registered.');
      console.log('💡 To fix this, add GUILD_ID=your_server_id to your .env file');
    }
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand() && !interaction.isButton() && !interaction.isStringSelectMenu()) return;

  if (interaction.isButton()) {
    // Handle button interactions (shutdown and reload commands)
    if (interaction.customId === 'sleep_yes' || interaction.customId === 'sleep_no' ||
        interaction.customId === 'reload_commands' || interaction.customId === 'reload_terminal' || interaction.customId === 'reload_cancel') {
      // This is handled in the respective command files
      return;
    }

    // Handle maintenance control buttons
    if (interaction.customId.startsWith('maintenance_')) {
      const maintenanceCommand = client.commands.get('maintenance');
      if (maintenanceCommand && maintenanceCommand.handleButton) {
        return await maintenanceCommand.handleButton(interaction);
      }
    }
  }

  if (interaction.isModalSubmit()) {
    // Handle maintenance modal submissions
    if (interaction.customId.startsWith('maintenance_')) {
      const maintenanceCommand = client.commands.get('maintenance');
      if (maintenanceCommand && maintenanceCommand.handleModal) {
        return await maintenanceCommand.handleModal(interaction);
      }
    }

    // Handle upload modal submissions
    if (interaction.customId.startsWith('upload_')) {
      const uploadCommand = client.commands.get('upload');
      if (uploadCommand && uploadCommand.handleModal) {
        return await uploadCommand.handleModal(interaction);
      }
    }

    // Handle upload button interactions
    if (interaction.customId.startsWith('upload_')) {
      const uploadCommand = client.commands.get('upload');
      if (uploadCommand && uploadCommand.handleButton) {
        return await uploadCommand.handleButton(interaction);
      }
    }
  }

  if (interaction.isStringSelectMenu()) {
    // Handle help menu selection
    if (interaction.customId === 'help_category_select') {
      const categories = {
        fun: {
          name: '🎉 Fun Commands',
          description: 'Cute and playful commands to interact with others!',
          commands: [
            '`/hug @user` - Give someone a warm femboy hug!',
            '`/kiss @user` - Give someone a sweet femboy kiss!'
          ],
          prefix: '`!hug @user`, `!kiss @user`'
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
            '`/reload` - Reload all commands',
            '`/diagnose` - Check bot health and scan for errors'
          ],
          prefix: '`!shutdown`, `!reload`, `!diagnose`'
        }
      };

      const selectedCategory = categories[interaction.values[0]];
      if (!selectedCategory) return;

      const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

      const embed = new EmbedBuilder()
        .setTitle(selectedCategory.name)
        .setDescription(selectedCategory.description)
        .setColor(0xff69b4)
        .addFields(
          { name: 'Commands', value: selectedCategory.commands.join('\n'), inline: false },
          { name: 'Prefix Commands', value: selectedCategory.prefix, inline: false }
        )
        .setFooter({ text: 'Use /help to go back to the main menu! 💕' });

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

      await interaction.update({ embeds: [embed], components: [row1, row2] });
      return;
    }
  }

  if (interaction.isButton()) {
    // Handle like button
    if (interaction.customId === 'help_like') {
      await interaction.reply({ content: '💖 Thank you for liking Femboy Helper! 💖', ephemeral: true });
      return;
    }
  }

  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    // Check maintenance mode for non-owner users
    if (isMaintenanceMode() && interaction.user.id !== process.env.OWNER_ID) {
      const currentMaintenance = JSON.parse(fs.readFileSync(maintenancePath, 'utf8'));
      const { EmbedBuilder } = require('discord.js');
      const embed = new EmbedBuilder()
        .setTitle('🔧 Bot Under Maintenance 🔧')
        .setDescription('The bot is currently under maintenance. Only the bot owner can use commands right now.')
        .addFields(
          { name: 'Reason', value: currentMaintenance.reason || 'Scheduled maintenance', inline: true },
          { name: 'Status', value: '🛠️ Under Maintenance', inline: true }
        )
        .setColor(0xffa500)
        .setFooter({ text: 'Please try again later! 💕' });

      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: '🦊 *blushes deeply and hides behind tail* O-Oh no... I made a mistake... *pokes fingers together shyly* 💕', ephemeral: true });
    }
  }
});

// Message event for prefix commands and locked channels
client.on('messageCreate', async message => {
  // Ignore bot messages and DMs
  if (message.author.bot || !message.guild) return;

  // Check if channel is locked
  const lockedChannelsPath = path.join(__dirname, 'locked_channels.json');
  try {
    const lockedData = JSON.parse(fs.readFileSync(lockedChannelsPath, 'utf8'));
    if (lockedData.channels[message.channel.id]) {
      // Channel is locked, check if user has manage channels permission
      if (!message.member.permissionsIn(message.channel).has('ManageChannels')) {
        const { EmbedBuilder } = require('discord.js');
        const embed = new EmbedBuilder()
          .setTitle('🔒 Channel Locked 🔒')
          .setDescription('🦊 *looks at you with pleading eyes* This channel is locked by master... Please don\'t try to speak... *hides behind tail shyly* 💕')
          .addFields(
            { name: 'Reason', value: lockedData.channels[message.channel.id].reason, inline: true },
            { name: 'Locked By', value: `<@${lockedData.channels[message.channel.id].lockedBy}>`, inline: true }
          )
          .setColor(0xff0000)
          .setFooter({ text: 'Please wait for master to unlock this channel!' });

        await message.reply({ embeds: [embed] }).catch(() => {
          // If reply fails, try sending a regular message
          message.channel.send({ content: `${message.author}, this channel is locked! 🔒`, embeds: [embed] }).catch(() => {});
        });
        return;
      }
    }
  } catch (error) {
    console.log('Error checking locked channels:', error);
  }

  // Get prefix for this guild
  const prefix = getPrefix(message.guild.id);

  // Check if message starts with prefix (and not with slash to avoid conflicts)
  if (!message.content.startsWith(prefix) || message.content.startsWith('/')) return;

  // Remove prefix and split into command and args
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  // Get command
  const command = client.commands.get(commandName);

  if (!command) {
    // Check for aliases
    const commandWithAlias = Array.from(client.commands.values()).find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (commandWithAlias) {
      command = commandWithAlias;
    } else {
      return;
    }
  }

  // Special handling for maintenance command
  if (commandName === 'maintenance') {
    if (command.executePrefix) {
      return await command.executePrefix(message, args);
    }
  }

  // Check maintenance mode for non-owner users
  if (isMaintenanceMode() && message.author.id !== process.env.OWNER_ID) {
    const currentMaintenance = JSON.parse(fs.readFileSync(maintenancePath, 'utf8'));
    const { EmbedBuilder } = require('discord.js');
    const embed = new EmbedBuilder()
      .setTitle('🔧 Bot Under Maintenance 🔧')
      .setDescription('The bot is currently under maintenance. Only the bot owner can use commands right now.')
      .addFields(
        { name: 'Reason', value: currentMaintenance.reason || 'Scheduled maintenance', inline: true },
        { name: 'Status', value: '🛠️ Under Maintenance', inline: true }
      )
      .setColor(0xffa500)
      .setFooter({ text: 'Please try again later! 💕' });

    await message.reply({ embeds: [embed] });
    return;
  }

  try {
    // Create a mock interaction object for prefix commands
    const mockInteraction = {
      ...message,
      client: message.client, // Explicitly add client to ensure ws property is available
      guildId: message.guild.id,
      channelId: message.channel.id,
      isChatInputCommand: false,
      options: {
        getString: (name) => {
          // Handle different command types
          if (commandName === 'ping') return null;
          if (commandName === 'setprefix') return args[0] || null;
          if (commandName === 'resetprefix') return null;
          if (commandName === 'afk') return args.join(' ') || 'No reason provided';
          if (commandName === 'hug' || commandName === 'kiss') return null; // User from mentions
          if (commandName === 'kick' || commandName === 'ban' || commandName === 'mute') {
            return args.slice(1).join(' ') || 'No reason provided';
          }
          if (commandName === 'purge') {
            // For purge, the filter is the second argument
            return args[1] || 'all';
          }
          return args.join(' ') || null;
        },
        getUser: (name) => {
          if (commandName === 'hug' || commandName === 'kiss' || commandName === 'kick' || commandName === 'ban' || commandName === 'mute') {
            return message.mentions.users.first() || null;
          }
          return null;
        },
        getInteger: (name) => {
          if (commandName === 'mute') {
            // Parse duration (e.g., "10m", "1h", "30s")
            const durationStr = args[1];
            if (!durationStr) return 600000; // 10 minutes default

            const match = durationStr.match(/^(\d+)([smhd])$/);
            if (!match) return 600000;

            const value = parseInt(match[1]);
            const unit = match[2];

            switch (unit) {
              case 's': return value * 1000;
              case 'm': return value * 60000;
              case 'h': return value * 3600000;
              case 'd': return value * 86400000;
              default: return 600000;
            }
          }
          if (commandName === 'purge') {
            // For purge, the amount is the first argument
            return parseInt(args[0]) || 1;
          }
          return null;
        },
      },
      reply: async (content) => {
        if (typeof content === 'string') {
          return message.reply(content);
        }
        return message.reply(content.content || content);
      },
      followUp: async (content) => {
        return message.reply(typeof content === 'string' ? content : content.content);
      },
      deferReply: async () => {}, // No-op for prefix commands
      editReply: async (content) => {
        return message.reply(typeof content === 'string' ? content : content.content);
      },
      member: message.member,
      guild: message.guild,
      user: message.author,
      channel: message.channel,
    };

    // Execute command and catch any errors to prevent multiple replies
    await command.execute(mockInteraction);
  } catch (error) {
    console.error('Prefix command error:', error);
    // Only reply if we haven't already replied in the command execution
    try {
      await message.reply('🦊 *blushes deeply and hides behind tail* O-Oh no... I made a mistake... *pokes fingers together shyly* 💕');
    } catch (replyError) {
      // If reply fails, it might be because the command already replied
      console.error('Failed to send error reply:', replyError);
    }
  }
});

// AFK mention handler and auto-remove
client.on('messageCreate', async message => {
  // Ignore bot messages and DMs
  if (message.author.bot || !message.guild) return;

  const userId = message.author.id;

  // Auto-remove AFK status when user sends a message (only if channel is not ignored)
  const afkCommand = client.commands.get('afk');
  if (afkCommand && afkCommand.afkUsers && afkCommand.afkUsers.has(userId) && !afkCommand.afkIgnoredChannels.has(message.channel.id)) {
    const afkData = afkCommand.afkUsers.get(userId);
    afkCommand.afkUsers.delete(userId);

    // Save the updated AFK users to file
    const fs = require('fs');
    const path = require('path');
    const afkUsersPath = path.join(__dirname, 'afk_users.json');
    try {
      const data = Object.fromEntries(afkCommand.afkUsers);
      fs.writeFileSync(afkUsersPath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error saving AFK users:', error);
    }

    const { EmbedBuilder } = require('discord.js');
    const embed = new EmbedBuilder()
      .setTitle('🦊 *wakes up excitedly* Welcome Back! 💫')
      .setDescription(`Welcome back, ${message.author.username}! Your AFK status has been automatically removed, master... *wags tail happily*`)
      .addFields(
        { name: 'Previous Reason', value: afkData.reason, inline: true },
        { name: 'AFK Duration', value: `<t:${Math.floor(afkData.timestamp / 1000)}:R>`, inline: true }
      )
      .setColor(0x00ff00)
      .setFooter({ text: 'You can set yourself AFK again anytime, master!' });

    await message.reply({ embeds: [embed] });
    return; // Don't check for mentions if user was AFK
  }

  // Check for mentions
  const mentionedUsers = message.mentions.users;

  for (const [mentionedUserId, user] of mentionedUsers) {
    // Get afkUsers from the afk command module
    if (afkCommand && afkCommand.afkUsers && afkCommand.afkUsers.has(mentionedUserId)) {
      const afkData = afkCommand.afkUsers.get(mentionedUserId);

      const { EmbedBuilder } = require('discord.js');
      const embed = new EmbedBuilder()
        .setTitle('🦊 *tilts head sleepily* User is AFK 💤')
        .setDescription(`${user.username} is currently away from keyboard, master... *yawns cutely*`)
        .addFields(
          { name: 'Reason', value: afkData.reason, inline: true }
        )
        .setColor(0xffa500)
        .setFooter({ text: 'They will see your message when they return, master!' });

      await message.reply({ embeds: [embed] });
      break; // Only show for first AFK user mentioned
    }
  }
});

// Only login if token is provided
if (process.env.DISCORD_TOKEN) {
  client.login(process.env.DISCORD_TOKEN);
} else {
  console.log('💔 No Discord token provided. Please set DISCORD_TOKEN in your .env file.');
  console.log('💖 Commands loaded successfully! Ready for testing without connecting to Discord.');
}

const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reload')
    .setDescription('Reload all commands (Owner only) 🔄')
    .setDefaultMemberPermissions(0), // Only owner

  // Aliases for prefix commands
  aliases: ['update', 'upd'],
  async execute(interaction) {
    if (interaction.user.id !== process.env.OWNER_ID) {
      return await interaction.reply({ content: '🦊 *whines sadly* Only my master can reload me... 💔', ephemeral: true });
    }

    // Check if this is a prefix command (no isChatInputCommand property or it's false)
    const isPrefixCommand = !interaction.isChatInputCommand;
    const args = isPrefixCommand ? interaction.options?.getString?.('reload')?.split(' ') || [] : [];

    // If prefix command with arguments, handle directly
    if (isPrefixCommand && args.length > 0) {
      const subCommand = args[0].toLowerCase();

      if (subCommand === 'commands') {
        try {
          // Clear the require cache for all command files
          const commandsPath = path.join(__dirname, '..');
          const commandFolders = fs.readdirSync(commandsPath);

          for (const folder of commandFolders) {
            const folderPath = path.join(commandsPath, folder);
            if (!fs.statSync(folderPath).isDirectory()) continue;

            const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

            for (const file of commandFiles) {
              const filePath = path.join(folderPath, file);
              delete require.cache[require.resolve(filePath)];
            }
          }

          // Reload the main bot file cache too
          delete require.cache[require.resolve('../../index.js')];

          const successResponses = [
            '🦊 *reloads with a happy yip* All commands reloaded, master! Yip~ 💖',
            '🦊 *my tails wag excitedly* Commands refreshed! Ready to serve you better! 🦊',
            '🦊 *perks up my ears* Reload complete! I feel so refreshed now! 🌟',
            '🦊 *spins around happily* All systems reloaded, master! Yip yip! 🎉',
            '🦊 *nuzzles your hand* Commands reloaded successfully! Thank you, master! 💕'
          ];

          const randomSuccess = successResponses[Math.floor(Math.random() * successResponses.length)];
          return await interaction.reply(randomSuccess);
        } catch (error) {
          console.error('Reload error:', error);
          return await interaction.reply('🦊 *whimpers* Something went wrong while reloading commands... 💔');
        }
      } else if (subCommand === 'terminal') {
        const restartResponses = [
          '🦊 *yawns cutely* Okay master, restarting the terminal... Sweet dreams for now! 😴💤',
          '🦊 *curls up* Terminal restart initiated! I\'ll be back soon, master! 🦊😴',
          '🦊 *my eyes get droopy* Restarting... See you in a moment, master! 💤',
          '🦊 *nuzzles you one last time* Terminal restart... I\'ll miss you! 😴💕',
          '🦊 *spins around sleepily* Restarting now! Back soon, master! 🎯😴'
        ];

        const randomRestart = restartResponses[Math.floor(Math.random() * restartResponses.length)];
        await interaction.reply(randomRestart);

        // Restart the process after a short delay
        setTimeout(() => {
          // Use spawn to restart the process
          const child = spawn('npm', ['start'], {
            stdio: 'inherit',
            detached: true,
            cwd: process.cwd()
          });

          child.unref();
          process.exit(0);
        }, 2000);
        return;
      }
    }

    // For slash commands or prefix commands without args, show interactive menu
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('reload_commands')
          .setLabel('Reload Commands 🔄')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('reload_terminal')
          .setLabel('Reload Terminal 💻')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('reload_cancel')
          .setLabel('Cancel ❌')
          .setStyle(ButtonStyle.Danger)
      );

    const responses = [
      '🦊 *tilts my head curiously* Master wants to reload me? What should I do? 🤔',
      '🦊 *my ears perk up* Reload time, master? I\'m ready for whatever you need! 🦊',
      '🦊 *wags my tail* Should I reload my commands or restart the terminal? 💭',
      '🦊 *looks up at you expectantly* Master, how would you like me to reload? 🔄',
      '🦊 *spins around* Ready for reload, master! Commands or terminal? 🎯'
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
      // Stop the collector immediately to prevent multiple interactions
      collector.stop();

      if (i.customId === 'reload_commands') {
        try {
          // Gather diagnostic information before reload
          const commandsPath = path.join(__dirname, '..');
          const commandFolders = fs.readdirSync(commandsPath);
          let totalCommands = 0;
          let loadedCommands = 0;
          let issues = [];
          let warnings = [];

          // Count current commands and check for issues
          for (const folder of commandFolders) {
            const folderPath = path.join(commandsPath, folder);
            if (!fs.statSync(folderPath).isDirectory()) continue;

            const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

            for (const file of commandFiles) {
              const filePath = path.join(folderPath, file);
              totalCommands++;

              try {
                const command = require(filePath);
                if (!command.data || !command.execute) {
                  issues.push(`${folder}/${file} - Missing required properties`);
                } else {
                  loadedCommands++;
                }
              } catch (error) {
                issues.push(`${folder}/${file} - Syntax error: ${error.message}`);
              }
            }
          }

          // Check slash command registration status
          const client = i.client;
          const registeredCommands = client.application?.commands;
          let slashCommandsRegistered = 0;

          if (registeredCommands && registeredCommands.cache) {
            slashCommandsRegistered = registeredCommands.cache.size;
          } else {
            warnings.push('Unable to verify slash command registration status');
          }

          // Clear the require cache for all command files
          for (const folder of commandFolders) {
            const folderPath = path.join(commandsPath, folder);
            if (!fs.statSync(folderPath).isDirectory()) continue;

            const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

            for (const file of commandFiles) {
              const filePath = path.join(folderPath, file);
              delete require.cache[require.resolve(filePath)];
            }
          }

          // Reload the main bot file cache too
          delete require.cache[require.resolve('../../index.js')];

          // Create detailed success message
          let successMessage = '🦊 **Commands Reloaded Successfully!** 🦊\n\n';
          successMessage += `📊 **Command Statistics:**\n`;
          successMessage += `• Total Commands: ${totalCommands}\n`;
          successMessage += `• Loaded Commands: ${loadedCommands}/${totalCommands}\n`;
          successMessage += `• Slash Commands Registered: ${slashCommandsRegistered}\n\n`;

          if (issues.length > 0) {
            successMessage += `⚠️ **Issues Found:** ${issues.length}\n`;
            issues.slice(0, 3).forEach(issue => {
              successMessage += `• ${issue}\n`;
            });
            if (issues.length > 3) {
              successMessage += `• ...and ${issues.length - 3} more\n`;
            }
            successMessage += '\n';
          }

          if (warnings.length > 0) {
            successMessage += `🚨 **Warnings:** ${warnings.length}\n`;
            warnings.forEach(warning => {
              successMessage += `• ${warning}\n`;
            });
            successMessage += '\n';
          }

          const successResponses = [
            '🦊 *reloads with a happy yip* All systems refreshed! Yip~ 💖',
            '🦊 *my tails wag excitedly* Commands reloaded and ready! 🦊',
            '🦊 *perks up my ears* Reload complete with full diagnostics! 🌟',
            '🦊 *spins around happily* All commands reloaded successfully! 🎉',
            '🦊 *nuzzles your hand* Commands refreshed with status report! 💕'
          ];

          const randomSuccess = successResponses[Math.floor(Math.random() * successResponses.length)];
          successMessage += randomSuccess;

          await i.update({ content: successMessage, components: [] });
        } catch (error) {
          console.error('Reload error:', error);
          await i.update({ content: '🦊 *whimpers* Something went wrong while reloading commands... 💔', components: [] });
        }
      } else if (i.customId === 'reload_terminal') {
        // First, run diagnosis to check bot health
        await i.deferUpdate();

        const diagnosis = {
          issues: [],
          warnings: [],
          stats: {
            totalCommands: 0,
            loadedCommands: 0,
            failedCommands: 0,
            syntaxErrors: 0
          }
        };

        try {
          // Quick diagnosis check
          const commandsPath = path.join(__dirname, '..');
          const commandFolders = fs.readdirSync(commandsPath);

          for (const folder of commandFolders) {
            const folderPath = path.join(commandsPath, folder);
            if (!fs.statSync(folderPath).isDirectory()) continue;

            const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

            for (const file of commandFiles) {
              const filePath = path.join(folderPath, file);
              diagnosis.stats.totalCommands++;

              try {
                delete require.cache[require.resolve(filePath)];
                const command = require(filePath);

                if (!command.data || !command.execute) {
                  diagnosis.issues.push(`${folder}/${file}`);
                  diagnosis.stats.failedCommands++;
                  continue;
                }

                diagnosis.stats.loadedCommands++;
              } catch (error) {
                diagnosis.issues.push(`${folder}/${file}`);
                diagnosis.stats.failedCommands++;
                diagnosis.stats.syntaxErrors++;
              }
            }
          }

          // Check bot health
          const client = i.client;
          const ping = client.ws.ping;
          if (ping > 1000) {
            diagnosis.warnings.push(`High latency (${ping}ms)`);
          }

          const memUsage = process.memoryUsage();
          const memMB = Math.round(memUsage.heapUsed / 1024 / 1024);
          if (memMB > 500) {
            diagnosis.warnings.push(`High memory usage (${memMB}MB)`);
          }

        } catch (error) {
          diagnosis.issues.push('Diagnosis failed');
        }

        // Check slash command registration status for terminal restart
        const client = i.client;
        const registeredCommands = client.application?.commands;
        let slashCommandsRegistered = 0;

        if (registeredCommands) {
          slashCommandsRegistered = registeredCommands.cache?.size || 0;
        } else {
          diagnosis.warnings.push('Unable to verify slash command registration status');
        }

        // Show diagnosis results
        let diagnosisReport = '🦊 **Pre-Restart Diagnosis Complete!** 🦊\n\n';
        diagnosisReport += `📊 **Quick Stats:**\n`;
        diagnosisReport += `• Commands: ${diagnosis.stats.loadedCommands}/${diagnosis.stats.totalCommands} loaded\n`;
        diagnosisReport += `• Slash Commands Registered: ${slashCommandsRegistered}\n`;
        diagnosisReport += `• Issues: ${diagnosis.issues.length}\n`;
        diagnosisReport += `• Warnings: ${diagnosis.warnings.length}\n\n`;

        if (diagnosis.issues.length > 0) {
          diagnosisReport += `⚠️ **Issues detected - proceeding with restart anyway**\n\n`;
        }

        const restartResponses = [
          '🦊 *yawns cutely* Diagnosis complete! Restarting the terminal... Sweet dreams for now! 😴💤',
          '🦊 *curls up* Health check done! Terminal restart initiated! I\'ll be back soon, master! 🦊😴',
          '🦊 *my eyes get droopy* All systems checked! Restarting... See you in a moment, master! 💤',
          '🦊 *nuzzles you one last time* Diagnosis finished! Terminal restart... I\'ll miss you! 😴💕',
          '🦊 *spins around sleepily* Health scan complete! Restarting now! Back soon, master! 🎯😴'
        ];

        const randomRestart = restartResponses[Math.floor(Math.random() * restartResponses.length)];
        diagnosisReport += randomRestart;

        await i.editReply({ content: diagnosisReport, components: [] });

        // Restart the process after a short delay
        setTimeout(() => {
          // Use spawn to restart the process
          const child = spawn('npm', ['start'], {
            stdio: 'inherit',
            detached: true,
            cwd: process.cwd()
          });

          child.unref();
          process.exit(0);
        }, 3000);
      } else if (i.customId === 'reload_cancel') {
        const cancelResponses = [
          '🦊 *my ears droop sadly* Okay master, no reload for now... I\'m still here! 💔',
          '🦊 *tilts my head* Cancelled! I\'m staying as I am, master! 🦊',
          '🦊 *wags my tail slowly* No reload? That\'s fine, master! I\'m happy! 💕',
          '🦊 *nuzzles your leg* Cancelled! I\'ll keep serving you just like this! 🦊',
          '🦊 *perks up* No reload needed! I\'m perfect as I am, master! 🌟'
        ];

        const randomCancel = cancelResponses[Math.floor(Math.random() * cancelResponses.length)];
        await i.update({ content: randomCancel, components: [] });
      }
    });

    collector.on('end', async (collected) => {
      if (collected.size === 0) {
        await interaction.editReply({
          content: '🦊 *waits patiently* Master? Did you change your mind about reloading? I\'m still here! 💕',
          components: []
        });
      }
    });
  },
};

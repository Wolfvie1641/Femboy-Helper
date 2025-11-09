const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('diagnose')
    .setDescription('Diagnose bot health and scan for command errors (Owner only) 🔍')
    .setDefaultMemberPermissions(0), // Only owner
  async execute(interaction) {
    if (interaction.user.id !== process.env.OWNER_ID) {
      return await interaction.reply({ content: '🦊 *whines sadly* Only my master can diagnose me... 💔', ephemeral: true });
    }

    await interaction.deferReply();

    const diagnosis = {
      timestamp: new Date().toISOString(),
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
      // Check command files
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
            // Clear require cache to test fresh load
            delete require.cache[require.resolve(filePath)];

            // Try to require the command
            const command = require(filePath);

            // Check if command has required properties
            if (!command.data || !command.execute) {
              diagnosis.issues.push(`❌ **${folder}/${file}**: Missing required 'data' or 'execute' property`);
              diagnosis.stats.failedCommands++;
              continue;
            }

            // Check if data is valid
            if (!command.data.name) {
              diagnosis.issues.push(`❌ **${folder}/${file}**: Command data missing 'name' property`);
              diagnosis.stats.failedCommands++;
              continue;
            }

            diagnosis.stats.loadedCommands++;

          } catch (error) {
            diagnosis.issues.push(`❌ **${folder}/${file}**: ${error.message}`);
            diagnosis.stats.failedCommands++;
            diagnosis.stats.syntaxErrors++;
          }
        }
      }

      // Check bot health
      const client = interaction.client;

      // Check connection status
      if (!client.ws || client.ws.status !== 0) {
        diagnosis.warnings.push(`⚠️ **Connection**: WebSocket status is ${client.ws?.status || 'unknown'}`);
      }

      // Check guild count
      const guildCount = client.guilds.cache.size;
      diagnosis.stats.guildCount = guildCount;

      // Check latency
      const ping = client.ws.ping;
      if (ping > 1000) {
        diagnosis.warnings.push(`⚠️ **Latency**: High ping detected (${ping}ms)`);
      } else if (ping > 500) {
        diagnosis.warnings.push(`⚠️ **Latency**: Moderate ping (${ping}ms)`);
      }

      // Check memory usage
      const memUsage = process.memoryUsage();
      const memMB = Math.round(memUsage.heapUsed / 1024 / 1024);
      if (memMB > 500) {
        diagnosis.warnings.push(`⚠️ **Memory**: High memory usage (${memMB}MB)`);
      }

      // Generate report
      let report = '🦊 **Diagnosis Complete, Master!** 🦊\n\n';

      // Stats
      report += '📊 **Statistics:**\n';
      report += `• Total Commands: ${diagnosis.stats.totalCommands}\n`;
      report += `• Successfully Loaded: ${diagnosis.stats.loadedCommands}\n`;
      report += `• Failed to Load: ${diagnosis.stats.failedCommands}\n`;
      report += `• Syntax Errors: ${diagnosis.stats.syntaxErrors}\n`;
      report += `• Connected Guilds: ${diagnosis.stats.guildCount}\n`;
      report += `• Bot Latency: ${ping}ms\n\n`;

      // Issues
      if (diagnosis.issues.length > 0) {
        report += '❌ **Issues Found:**\n';
        diagnosis.issues.forEach(issue => {
          report += `• ${issue}\n`;
        });
        report += '\n';
      } else {
        report += '✅ **No Issues Found!**\n\n';
      }

      // Warnings
      if (diagnosis.warnings.length > 0) {
        report += '⚠️ **Warnings:**\n';
        diagnosis.warnings.forEach(warning => {
          report += `• ${warning}\n`;
        });
        report += '\n';
      }

      // Recommendations
      if (diagnosis.issues.length > 0) {
        report += '💡 **Recommendations:**\n';
        report += '• Check command files for syntax errors\n';
        report += '• Ensure all required properties are present\n';
        report += '• Use `/reload` to refresh commands after fixes\n';
        report += '• Check bot logs for additional error details\n';
      } else {
        report += '🎉 **Everything looks healthy!** Keep up the good work, master! 💕';
      }

      // Split long messages if needed
      if (report.length > 2000) {
        const chunks = report.match(/(.|[\n]){1,2000}/g);
        await interaction.editReply(chunks[0]);
        for (let i = 1; i < chunks.length; i++) {
          await interaction.followUp({ content: chunks[i], ephemeral: true });
        }
      } else {
        await interaction.editReply(report);
      }

    } catch (error) {
      console.error('Diagnosis error:', error);
      await interaction.editReply({
        content: `🦊 *whimpers* Diagnosis failed: ${error.message} 💔`
      });
    }
  },
};

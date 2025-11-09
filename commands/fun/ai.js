const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Load AI responses from JSON file
const responsesPath = path.join(__dirname, '../../ai_responses.json');
let responses = {};

try {
  responses = JSON.parse(fs.readFileSync(responsesPath, 'utf8'));
} catch (error) {
  console.log('Creating default ai_responses.json file...');
  responses = {
    greetings: ["Hewwo! 💖 *waves paw*"],
    questions: ["Hmm... that's an interesting question! 🤔"],
    compliments: ["Aww, thank you! You're so sweet! 💕"],
    sad: ["Aww, don't be sad! *comforts you* 💕"],
    love: ["Love is such a beautiful thing! 💕"],
    default: ["That's interesting! Tell me more! 🤔"]
  };
  fs.writeFileSync(responsesPath, JSON.stringify(responses, null, 2));
}

// Simple pattern matching
function analyzeMessage(message) {
  const lowerMessage = message.toLowerCase();

  // Check for greetings
  if (/\b(hello|hi|hey|good morning|good evening|good night|sup|yo)\b/.test(lowerMessage)) {
    return 'greetings';
  }

  // Check for questions
  if (/\b(what|how|when|where|why|who|which|can you|do you|are you|is it)\b.*\?/.test(lowerMessage)) {
    return 'questions';
  }

  // Check for compliments
  if (/\b(cute|beautiful|pretty|adorable|sweet|nice|awesome|amazing|great|love you|like you)\b/.test(lowerMessage)) {
    return 'compliments';
  }

  // Check for sad emotions
  if (/\b(sad|upset|cry|crying|depressed|lonely|hurt|pain|bad day|terrible|awful)\b/.test(lowerMessage)) {
    return 'sad';
  }

  // Check for love topics
  if (/\b(love|heart|romance|crush|dating|relationship|boyfriend|girlfriend|partner)\b/.test(lowerMessage)) {
    return 'love';
  }

  return 'default';
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ai')
    .setDescription('Chat with the femboy AI! 💬')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('What do you want to say to the AI?')
        .setRequired(true)),

  async execute(interaction) {
    const userMessage = interaction.options.getString('message');

    // Analyze the message and get appropriate response category
    const category = analyzeMessage(userMessage);
    const possibleResponses = responses[category];
    const response = possibleResponses[Math.floor(Math.random() * possibleResponses.length)];

    // Create personality based on message analysis
    let personality = "🤖 Femboy AI";
    let color = 0xff69b4; // Default pink

    switch (category) {
      case 'greetings':
        personality = "🐺 Friendly Fox";
        color = 0xffa500;
        break;
      case 'questions':
        personality = "🤔 Curious Cat";
        color = 0x9370db;
        break;
      case 'compliments':
        personality = "🥰 Flustered Femboy";
        color = 0xff1493;
        break;
      case 'sad':
        personality = "💕 Caring Companion";
        color = 0x00ced1;
        break;
      case 'love':
        personality = "💖 Romantic Rabbit";
        color = 0xff69b4;
        break;
      default:
        personality = "🎭 Playful Panda";
        color = 0x32cd32;
    }

    const embed = new EmbedBuilder()
      .setTitle(`${personality} Says:`)
      .setDescription(response)
      .addFields(
        { name: 'You said:', value: userMessage.length > 1000 ? userMessage.substring(0, 997) + "..." : userMessage, inline: false }
      )
      .setColor(color)
      .setFooter({ text: 'I\'m learning to be a better AI! 💕' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },

  // Prefix command handler
  async executePrefix(message, args) {
    if (!args.length) {
      const embed = new EmbedBuilder()
        .setTitle('🤖 Femboy AI Chat')
        .setDescription('Say something to me! Use `!ai <message>`')
        .setColor(0xff69b4)
        .setFooter({ text: 'Example: !ai hello there!' });
      return await message.reply({ embeds: [embed] });
    }

    const userMessage = args.join(' ');

    // Analyze the message and get appropriate response category
    const category = analyzeMessage(userMessage);
    const possibleResponses = responses[category];
    const response = possibleResponses[Math.floor(Math.random() * possibleResponses.length)];

    // Create personality based on message analysis
    let personality = "🤖 Femboy AI";
    let color = 0xff69b4;

    switch (category) {
      case 'greetings':
        personality = "🐺 Friendly Fox";
        color = 0xffa500;
        break;
      case 'questions':
        personality = "🤔 Curious Cat";
        color = 0x9370db;
        break;
      case 'compliments':
        personality = "🥰 Flustered Femboy";
        color = 0xff1493;
        break;
      case 'sad':
        personality = "💕 Caring Companion";
        color = 0x00ced1;
        break;
      case 'love':
        personality = "💖 Romantic Rabbit";
        color = 0xff69b4;
        break;
      default:
        personality = "🎭 Playful Panda";
        color = 0x32cd32;
    }

    const embed = new EmbedBuilder()
      .setTitle(`${personality} Says:`)
      .setDescription(response)
      .addFields(
        { name: `${message.author.username} said:`, value: userMessage.length > 1000 ? userMessage.substring(0, 997) + "..." : userMessage, inline: false }
      )
      .setColor(color)
      .setFooter({ text: 'I\'m learning to be a better AI! 💕' })
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};

# 🐺 Femboy Helper JS 💖

A cute and furry Discord bot built with JavaScript and discord.js, featuring femboy-themed responses and organized command categories! Awoo~!

## Features

- 🎉 **Fun Commands**: Hug, kiss, and more cute interactions
- 🛡️ **Moderation Commands**: Kick, ban, mute users
- 👑 **Master Commands**: Bot management (owner only)
- 🔧 **Utility Commands**: Ping, help, and useful tools

## Setup Instructions

### 1. Create a Discord Bot
1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name (e.g., "Femboy Helper")
3. Go to the "Bot" section in the left sidebar
4. Click "Add Bot" to create your bot
5. Under "Token", click "Copy" to get your bot token (keep this secret!)

### 2. Get Your Bot Client ID and User ID
1. In Discord, go to User Settings → Advanced
2. Enable "Developer Mode"
3. Right-click your username in any server and select "Copy User ID" (this is your OWNER_ID)
4. In the Developer Portal, go to your bot's "General Information" section
5. Copy the "Application ID" (this is your CLIENT_ID)

### 3. Invite the Bot to Your Server
1. In the Developer Portal, go to "OAuth2" → "URL Generator"
2. Select scopes: `bot` and `applications.commands`
3. Select permissions:
   - Send Messages
   - Use Slash Commands
   - Kick Members
   - Ban Members
   - Moderate Members (for timeout/mute)
   - Read Message History
4. Copy the generated URL and paste it in your browser to invite the bot

### 4. Configure the Bot
1. Copy `.env.example` to `.env`
2. Replace `your_bot_token_here` with your bot token
3. Replace `your_discord_user_id_here` with your Discord user ID

### 5. Install and Run
```bash
npm install
npm start
```

## Commands

Use `/help` to see all available commands in Discord!

### Fun Commands
- `/hug <user>` - Give someone a warm femboy hug!
- `/kiss <user>` - Give someone a sweet femboy kiss!

### Moderation Commands
- `/kick <user> [reason]` - Kick a naughty user
- `/ban <user> [reason]` - Ban a user from the server
- `/mute <user> <duration> [reason]` - Timeout a user (1-40320 minutes)

### Master Commands (Owner Only)
- `/shutdown` - Shut down the bot
- `/reload` - Reload all commands

### Utility Commands
- `/ping` - Check bot latency
- `/help` - Show all available commands

## Femboy Style

All responses are styled with cute emojis, uwu language, and a feminine touch! 💕

## Hosting Your Bot 24/7

To keep your bot online 24/7, you need to host it on a server. Here are some popular options:

### Free Hosting Options

#### 1. **Railway** (Recommended - Free tier available)
1. Go to [Railway.app](https://railway.app) and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Connect your GitHub repo (or upload files)
4. Add environment variables: `DISCORD_TOKEN` and `OWNER_ID`
5. Deploy! Your bot will be online 24/7

#### 2. **Render**
1. Sign up at [Render.com](https://render.com)
2. Create a new "Web Service"
3. Connect your GitHub repo
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables
7. Deploy

#### 3. **Replit**
1. Create a Replit account
2. Import your project
3. Add your `.env` file with tokens
4. Run the bot
5. Use "Always On" feature (paid) or keep the tab open

### Paid Hosting Options

#### **DigitalOcean Droplet** (~$5/month)
1. Create a Droplet with Ubuntu
2. SSH into the server
3. Install Node.js: `curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs`
4. Upload your bot files
5. Install PM2: `npm install -g pm2`
6. Run: `pm2 start index.js --name "femboy-bot"`
7. Use `pm2 startup` and `pm2 save` to auto-restart on boot

#### **Heroku** (~$7/month)
1. Create a Heroku app
2. Connect your GitHub repo
3. Set environment variables in Heroku dashboard
4. Deploy

### Keeping Your Bot Running

- Use **PM2** for process management: `pm2 start index.js && pm2 save && pm2 startup`
- Enable auto-restart on crashes
- Monitor with `pm2 monit` or `pm2 logs`

### Environment Variables

Make sure to set these in your hosting platform:
```
DISCORD_TOKEN=your_bot_token
OWNER_ID=your_discord_user_id
```

## Troubleshooting

- **Bot not responding?** Make sure the bot has the required permissions in your server
- **Commands not showing up?** The bot needs `applications.commands` scope when invited
- **Still not working?** Check that your `.env` file has the correct token and ID
- **Bot going offline?** Check your hosting provider's logs and ensure proper error handling

## Contributing

Feel free to add more commands or improve the femboy theme!

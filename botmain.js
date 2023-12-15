const { Client, GatewayIntentBits, Partials, Collection, Events} = require('discord.js');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
dotenv.config();
require('date-utils');
global.client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.GuildMessageReactions
    ],
    partials: [Partials.Channel],
});

//configファイル読み込み
const config = require('./config.json');
const system = require('./functions/logsystem.js')

//スラッシュコマンド登録
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
client.commands = new Collection();
module.exports = client.commands;
client.once("ready", async() => {
    for(const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        for(let i = 0; i < command.length; i++) {
            client.commands.set(command[i].data.name, command[i]);
        }
    }
    await system.log("Ready!");
});

client.on('messageCreate', async message => {
    const twitter = new RegExp("//twitter.com/");
    const xcom = new RegExp("//x.com/");
    const vxtwitter = new RegExp("//vxtwitter.com/");

    if(twitter.test(message.content) || xcom.test(message.content)){
        let content = message.content;
        while(vxtwitter.test(content)){
            content = content.replace("//vxtwitter.com/","//hoge.hoge/");
        }
        while(twitter.test(content) || xcom.test(content)){
            content = content.replace("//twitter.com","//vxtwitter.com/");
            content = content.replace("//x.com/","//vxtwitter.com/");
        }
        if(vxtwitter.test(content)){
            await message.channel.send(content);
        }
    }
});


client.login(config.token);

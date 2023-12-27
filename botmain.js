const { Client, GatewayIntentBits, Partials, Collection, Events} = require('discord.js');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
dotenv.config();
require('date-utils');
global.client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel],
});

//configファイル読み込み
const config = require('./config.json');
const system = require('./functions/logsystem.js');
const help = require("./functions/help.js");

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
/*command処理*/
client.on("interactionCreate", async(interaction) => {
    if (!interaction.isCommand()) {
        return;
    }
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) return;
    let guild,channel;
    if(!interaction.guildId) {
        guild = {name:"ダイレクトメッセージ",id:"---"};
        channel = {name:"---",id:"---"};
    }
    else{
        guild = client.guilds.cache.get(interaction.guildId) ?? await client.guilds.fetch(interaction.guildId);
        channel = client.channels.cache.get(interaction.channelId) ?? await client.channels.fetch(interaction.channelId);
    }
    await system.log(`コマンド名:${command.data.name}\`\`\`\nギルド　　：${guild.name}\n(ID:${guild.id})\n\nチャンネル：${channel.name}\n(ID:${channel.id})\n\nユーザ　　：${interaction.user.username}${(interaction.user.discriminator==="0"?"":`#${interaction.user.discriminator}`)}\n(ID:${interaction.user.id})\`\`\``, "SlashCommand");
    try {
        await command.execute(interaction);
    }
    catch(error) {
        await system.error(`スラッシュコマンド実行時エラー : ${command.data.name}\n\`\`\`\nギルド　　：${guild.name}\n(ID:${guild.id})\n\nチャンネル：${channel.name}\n(ID:${channel.id})\n\nユーザ　　：${interaction.user.username}${(interaction.user.discriminator==="0"?``:`#${interaction.user.discriminator}`)}\n(ID:${interaction.user.id})\`\`\``, error);
        try {
            await interaction.reply({content: 'おっと、想定外の事態が起きちゃった。[Issue](https://github.com/starkoka/embedTwitter/issues)に連絡してくれ。', ephemeral: true});
        }
        catch {
            try{
                await interaction.editReply({
                    content: 'おっと、想定外の事態が起きちゃった。[Issue](https://github.com/starkoka/embedTwitter/issues)に連絡してくれ。',
                    ephemeral: true
                });
            }
            catch{} //edit先が消えてる可能性を考えてtryに入れる
        }
    }
});

//StringSelectMenu受け取り
client.on(Events.InteractionCreate, async interaction => {
    if(interaction.isStringSelectMenu()) {
        if (interaction.customId === "adminHelp"){
            await help.adminHelpDisplay(interaction);
        }
        else if (interaction.customId === "help"){
            await help.helpDisplay(interaction);
        }
    }
});



client.on('messageCreate', async message => {
    const nl = new RegExp("\n");
    const twitter = new RegExp("https?://twitter.com/");
    const xcom = new RegExp("https?://x.com/");
    const vxtwitter = new RegExp("https?://vxtwitter.com/");
    const embedLink = new RegExp("[-_.!~*'a-zA-Z0-9;?:&=+$,%#]");
    const specialChar = new RegExp("[^-_.!~*'a-zA-Z0-9;?:&=+$,%#/]");


    if(twitter.test(message.content) || xcom.test(message.content)){
        let content = message.content;
        while(specialChar.test(content)){
            content = content.replace(specialChar,"");
        }
        while(nl.test(content)){
            content = content.replace(nl,"");
        }
        while(vxtwitter.test(content)){
            content = content.replace(twitter,"xxxxxxxxxxxxvxtwitterx");
        }
        while(twitter.test(content) || xcom.test(content)){
            content = content.replace(twitter,"https://vxtwitter.com/");
            content = content.replace(xcom,"https://vxtwitter.com/");
        }

        const lines = content.split(/\r\n|\r|\n/);
        let url = [];
        for(let l of lines){
            url = url.concat(l.split(vxtwitter));
        }

        let msg = "";
        let num=1;
        for(let i=1;i<url.length;i++){
            if(embedLink.test(url[i])){
                msg += `[URL${num}](https://vxtwitter.com/${url[i]})\n`;
                num++;
            }
        }

        if(msg!==""){
            try{
                const embed = await message.channel.send(msg);
                await embed.react('❌');
            }
            catch(err){
               if(err.code!==50013){
                   try{
                       let guild,channel;
                       if(!message.guildId) {
                           guild = {name:"ダイレクトメッセージ",id:"---"};
                           channel = {name:"---",id:"---"};
                       }
                       else{
                           guild = client.guilds.cache.get(message.guildId) ?? await client.guilds.fetch(message.guildId);
                           channel = client.channels.cache.get(message.channelId) ?? await client.channels.fetch(message.channelId);
                       }
                       await system.error(`権限不足等の要因でメッセージを送信できませんでした\`\`\`\nギルド　　：${guild.name}\n(ID:${guild.id})\n\nチャンネル：${channel.name}\n(ID:${channel.id})\n\nID　　　　：${message.id}\n\nユーザ　　：${message.author.globalName}${(message.author.discriminator==="0")?"":`#${message.author.discriminator}`}\n(ID:${message.author.id})\`\`\``,err,"メッセージ送信失敗");
                   }
                   catch{
                       await system.error(`権限不足等の要因でメッセージを送信できませんでした`,err,"メッセージ送信失敗");
                   }
               }
            }

        }
    }
});

client.on('messageReactionAdd', async reaction => {
    if (reaction.message.author.id === config.client && reaction.users._cache.get(config.client) && reaction.users._cache.size > 1 && reaction._emoji.name === '❌') {
        try {
            await reaction.message.delete();
        } catch (err) {
            await system.error(`メッセージの削除に失敗しました`, err, "メッセージ削除失敗");
        }
    }
})


client.login(config.token);

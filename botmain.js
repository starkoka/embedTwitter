const { Client, GatewayIntentBits, Partials, Collection, Events, PermissionsBitField} = require('discord.js');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');
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
const makeTxt = require("./functions/makeTxt.js");

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
    client.user.setPresence({
        activities: [{
            name: `導入数：${client.guilds.cache.size}サーバー`
        }],
    });
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
    const msg = makeTxt.make(message,message.author.id);
    if(msg!==""){
        try{
            const embed = await message.channel.send(msg);
            await embed.react('🗑️');
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
});

client.on('messageReactionAdd', async reaction => {
    const reactions = Array.from(reaction.users._cache.keys());
    const reactionUser = reactions[reactions.length-1];
    if (reaction.message.author.id === config.client && reaction.users._cache.get(config.client) && reaction.users._cache.size > 1 && reaction._emoji.name === '🗑️') {
        try {
            const msg = reaction.message.content;
            const msgId = msg.substr(msg.indexOf('あ')+1,msg.indexOf('い')-msg.indexOf('あ')-1);
            const channelId = msg.substr(msg.indexOf('い')+1,msg.indexOf('う')-msg.indexOf('い')-1);
            const guildId = msg.substr(msg.indexOf('う')+1,msg.indexOf('え')-msg.indexOf('う')-1);
            const makeUserId = msg.substr(msg.indexOf('え')+1,msg.indexOf('お')-msg.indexOf('え')-1);
            const userMsg = await reaction.message.channel.messages.fetch(msgId);


            const guild = client.guilds.cache.get(guildId) ?? await client.guilds.fetch.get(guildId);
            const member = guild.members.cache.get(reactionUser) ?? await guild.members.fetch(reactionUser);

            if(!member.permissions.has(PermissionsBitField.Flags.ManageMessages) && !reaction.users._cache.get(makeUserId)){
                return;
            }
            await reaction.message.delete();
            await userMsg.react('🔄');
        } catch (err) {
            await system.error(`メッセージの削除に失敗しました`, err, "メッセージ削除失敗");
        }
    }
    else if(reaction._emoji.name === '🔄' && !(reaction.users._cache.get(config.client) && reaction.users._cache.size === 1)){
        const msg = makeTxt.make(reaction.message,reactionUser);
        if(msg!==""){
            try{
                const embed = await reaction.message.reply({
                    content:msg,
                    allowedMentions:{parse:[]}
                });
                await embed.react('🗑️');
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
})

/*ステータス更新*/
cron.schedule('* * * * *', async () => {
    client.user.setPresence({
        activities: [{
            name: `導入数：${client.guilds.cache.size}サーバー`
        }],
    });
});


client.login(config.token);

const {StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder, ActionRowBuilder} = require("discord.js");
const system = require('./logsystem.js');

//helpTextの生成
const helpText = require("./helpText.json");
const adminTable = [];
for(let i=0;i < helpText.admin.length;i++){
    adminTable.push(
        new StringSelectMenuOptionBuilder()
            .setLabel(helpText.admin[i].value.title)
            .setDescription(helpText.admin[i].shortDescription)
            .setValue(String(i))
    )
}
const helpTable = [];
for(let i=0;i < helpText.help.length;i++){
    helpTable.push(
        new StringSelectMenuOptionBuilder()
            .setLabel(helpText.help[i].value.title)
            .setDescription(helpText.help[i].shortDescription)
            .setValue(String(i))
    )
}

exports.adminHelpSend = async function func(user) {
    const embed = new EmbedBuilder()
        .setColor(0x00A0EA)
        .setTitle(`管理者向けヘルプ`)
        .setAuthor({
            name: "embedTwitter",
            iconURL: 'https://avatars.githubusercontent.com/u/103174676',
            url: 'https://github.com/starkoka/embedTwitter'
        })
        .setDescription("embedTwitterをご利用いただきありがとうございます。\n管理者向けのヘルプでは、主に以下に記載した管理者向けのBOTの情報や機能についての説明があります。\n\n下のセレクトメニューから内容を選ぶことで、ヘルプを読めます。\n")
        .setTimestamp()
        .setFooter({ text: 'Developed by kokastar' });

    const select = new StringSelectMenuBuilder()
        .setCustomId('adminHelp')
        .setPlaceholder('読みたいページを選択')
        .addOptions(adminTable);
    const row = new ActionRowBuilder()
        .addComponents(select);

    try{
        await user.send({embeds: [embed],components: [row]});
    }
    catch (error){
        await system.error("DMを送れませんでした。ブロックされている等ユーザー側が原因の場合もあります。",error,"DirectMessageエラー")
    }
}

exports.adminHelpDisplay = async function func(interaction) {
    const page = parseFloat(interaction.values[0]);
    const newEmbed = new EmbedBuilder()
        .setColor(0x00A0EA)
        .setTitle(`管理者向けヘルプ - ${helpText.admin[page].value.title}`)
        .setAuthor({
            name: "embedTwitter",
            iconURL: 'https://avatars.githubusercontent.com/u/103174676',
            url: 'https://github.com/starkoka/embedTwitter'
        })
        .setDescription(helpText.admin[page].value.description)
        .addFields(helpText.admin[page].value.field)
        .setTimestamp()
        .setFooter({ text: 'Developed by kokastar' });
    try{
        await interaction.update({embeds: [newEmbed]});
    }
    catch (error){
        await system.error("DMを編集できませんでした。ブロックされている等ユーザー側が原因の場合もあります。",error,"DirectMessageエラー")
    }
}

exports.helpSend = async function func(interaction) {
    const embed = new EmbedBuilder()
        .setColor(0x00A0EA)
        .setTitle(`ヘルプ`)
        .setAuthor({
            name: "embedTwitter",
            iconURL: 'https://avatars.githubusercontent.com/u/103174676',
            url: 'https://github.com/starkoka/embedTwitter'
        })
        .setDescription("embedTwitterをご利用いただきありがとうございます。\nヘルプでは、このBOTの機能の使い方等を確認できます。\n\n下のセレクトメニューから内容を選ぶことで、内容を確認することができます。。\n")
        .setTimestamp()
        .setFooter({ text: 'Developed by kokastar' });

    const select = new StringSelectMenuBuilder()
        .setCustomId('help')
        .setPlaceholder('読みたいページを選択')
        .addOptions(helpTable);
    const row = new ActionRowBuilder()
        .addComponents(select);

    await interaction.reply({embeds: [embed],components: [row]});
}

exports.helpDisplay = async function func(interaction) {
    const page = parseFloat(interaction.values[0]);
    const newEmbed = new EmbedBuilder()
        .setColor(0x00A0EA)
        .setTitle(`ヘルプ - ${helpText.help[page].value.title}`)
        .setAuthor({
            name: "embedTwitter",
            iconURL: 'https://avatars.githubusercontent.com/u/103174676',
            url: 'https://github.com/starkoka/embedTwitter'
        })
        .setDescription(helpText.help[page].value.description)
        .addFields(helpText.help[page].value.field)
        .setTimestamp()
        .setFooter({ text: 'Developed by kokastar' });
    await interaction.update({embeds: [newEmbed]});
}
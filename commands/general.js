const { SlashCommandBuilder, EmbedBuilder , version} = require('discord.js');
const packageVer = require('../package.json');
require('date-utils');
const help = require("../functions/help.js");


module.exports =
    [
        {
            data: new SlashCommandBuilder()
                .setName('ping')
                .setDescription('このBOTのpingを測定します'),
            async execute(interaction) {
                await interaction.reply( `Ping : ${interaction.client.ws.ping}ms` );
            },
        },
        {
            data: new SlashCommandBuilder()
                .setName('about')
                .setDescription('このBOTの概要を表示します'),
            async execute(interaction) {
                const embed = new EmbedBuilder()
                    .setColor(0x00A0EA)
                    .setTitle('embedTwitter概要')
                    .setAuthor({
                        name: "embedTwitter",
                        iconURL: 'https://cdn.discordapp.com/avatars/1184735822331785268/18239fc70cc5164a68c1672f4b469745.webp?size=160',
                        url: 'https://github.com/starkoka/embedTwitter'
                    })
                    .setDescription('このbotの概要を紹介します')
                    .addFields(
                        [
                            {
                                name: 'バージョン情報',
                                value: 'v' + packageVer.version,
                            },
                            {
                                name: '開発者',
                                value: '[kokastar](https://github.com/starkoka)',
                            },
                            {
                                name:"ソースコード",
                                    value:"このBOTは、オープンソースとなっています。[GitHub](https://github.com/starkoka/embedTwitter)にて公開されています。\n"
                            },
                            {
                                name:"バグの報告先",
                                value:"[Issue](https://github.com/starkoka/embedTwitter/issues)までお願いします。\nサポート等の詳細は/helpを実行してください。\n"
                            },
                            {
                                name: '実行環境',
                                value: 'node.js v' + process.versions.node + `\n discord.js v` + version + ``,

                            },
                        ]
                    )
                    .setTimestamp()
                    .setFooter({ text: 'Developed by kokastar' });
                await interaction.reply({ embeds: [embed] });
            },
        },
        {
            data: new SlashCommandBuilder()
                .setName('help')
                .setDescription('このBOTのヘルプを表示します'),
            async execute(interaction) {
                await help.helpSend(interaction);
            },
        },/*
        {
            data: new SlashCommandBuilder()
                .setName('admin-help')
                .setDescription('管理者向けメニューをDMで表示します。')
                .setDefaultMemberPermissions(1<<3)
                .setDMPermission(false),
            async execute(interaction) {
                await interaction.reply({ content: "DMに管理者向けメニューを送信しました。受信できていない場合、以下に該当していないかどうかご確認ください。\n・このサーバー上の他のメンバーからのDMをOFFにしている\n・フレンドからのDMのみを許可している\n・このBOTをブロックしている", ephemeral: true });
                await help.adminHelpSend(interaction.user);
            },
        },
        */
]
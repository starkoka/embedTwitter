const { SlashCommandBuilder, EmbedBuilder , version} = require('discord.js');
const packageVer = require('../package.json');
const {setTimeout} = require ("node:timers/promises");
require('date-utils');
const system = require('../functions/logsystem.js');


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
                        name: "embedTwitterOnDiscord",
                        iconURL: 'https://avatars.githubusercontent.com/u/103174676',
                        url: 'https://github.com/starkoka/embedTwitterOnDiscord'
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
                                    value:"このBOTは、オープンソースとなっています。[GitHub](https://github.com/starkoka/embedTwitterOnDiscord)にて公開されています。\n"
                            },
                            {
                                name:"バグの報告先",
                                value:"[Issue](https://github.com/starkoka/embedTwitterOnDiscord/issues)までお願いします。\nサポート等の詳細は/helpを実行してください。\n"
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
]
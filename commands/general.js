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
        }
]
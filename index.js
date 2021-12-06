const { Client, Intents, MessageEmbed } = require('discord.js');
const axios = require('axios');

const client = new Client({
    partials: ["CHANNEL"],
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGES,
    ]
});


const config = require("./config.js");



client.on('ready', () => {

    console.log(`${client.user.tag} Ready ${client.guilds.cache.size} servers !`);

});

const prefix = config.prefix;


client.on('messageCreate', async (message) => {

    if (message.author.bot) return;
    if (!message.content) return;

    if (!message.content.startsWith(prefix)) return;

    let content = message.content.slice(prefix.length);

    let args = content.trim().split(' ');

    let command = args.shift();

    if (message.channel.type === "DM") {

        if (command === "email") {


            const data = await axios.get(`https://leaked.space/api/api.php?value=${args[0]}&type=auto&key=VZME-KWPD-TVZI-OQGW`).then(r => r.data)

            console.log(data)

            if (data.success) {

                let desc = '';
                data.result.map(x => desc += `**-** \`${x.line}\`\n`);

                const embed = new MessageEmbed()
                    .setColor('#947cea')
                    .setTitle(`Data found with email ${args[0]}`)
                    .setDescription(desc)

                return message.reply({ embeds: [embed] });

            } else {

                const embed = new MessageEmbed()
                    .setColor('RED')
                    .setDescription(`Reason: \`${data.error}\``)

                return message.reply({ embeds: [embed] });

            }


        }

        return
    }






})


client.login(config.token);

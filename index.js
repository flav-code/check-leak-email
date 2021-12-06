const { Client, Intents, MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
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


            const data = await axios.get(`https://leaked.space/api/api.php?value=${args[0]}&type=auto&key=${config.api.key}`).then(r => r.data)

            console.log(data)

            if (data.success) {

                let desc = '';

                const length = 10;

                let i0 = 0;
                let i1 = length;
                let page = 0;


                data.result.slice(0, length).map(x => desc += `**-** \`${x.line}\`\n`);

                const embed = new MessageEmbed()
                    .setColor('#947cea')
                    .setTitle(`Data found with email ${args[0]}`)
                    .setDescription(desc)
                    .setFooter(`Page: ${page}/${Math.floor(data.found / 10)}`)

                const button1 = new MessageButton()
                    .setStyle(1)
                    .setCustomId("previous")
                    .setLabel("◁")

                const button2 = new MessageButton()
                    .setStyle(1)
                    .setCustomId("following")
                    .setLabel("▷")


                const row = new MessageActionRow()
                    .addComponents([button1, button2]);

                message.reply({ embeds: [embed], components: [row] }).then(m => {



                    const filter = (interaction) => [button1.customId, button2.customId].includes(interaction.customId) && interaction.user.id === message.author.id;
                    const collector = m.createMessageComponentCollector(filter, { time: 60 * 1000 });
                    collector.on('collect', i => {

                        i.deferUpdate();

                        // console.log(i)

                        if (i.customId === 'previous') {


                            desc = "";

                            // Updates variables
                            i0 -= length;
                            i1 -= length;
                            page += 1;

                            // if there is no guild to display, delete the message
                            if (i0 < 0) {
                                i0 += length;
                                i1 += length;
                                page += 1;
                            }

                            data.result.slice(i0, i1).map(x => desc += `**-** \`${x.line}\`\n`);

                            const queue_previous = new MessageEmbed()
                                .setColor('#947cea')
                                .setTitle(`Data found with email ${args[0]}`)
                                .setDescription(desc)
                                .setFooter(`Page: ${page}/${Math.floor(data.found / 10)}`)

                            const button1 = new MessageButton()
                                .setStyle(1)
                                .setCustomId("previous")
                                .setLabel("◁")

                            const button2 = new MessageButton()
                                .setStyle(1)
                                .setCustomId("following")
                                .setLabel("▷")


                            const row = new MessageActionRow()
                                .addComponents([button1, button2]);

                            m.edit({ embeds: [queue_previous], components: [row] })
                        }

                        else if (i.customId === 'following') {

                            desc = "";


                            // Updates variables
                            i0 += length;
                            i1 += length;
                            page += 1;

                            // if there is no guild to display, delete the message
                            if (i1 >= data.found + length) {
                                i0 -= length;
                                i1 -= length;
                                page -= 1;
                            }

                            data.result.slice(i0, i1).map(x => desc += `**-** \`${x.line}\`\n`);

                            const queue_previous = new MessageEmbed()
                                .setColor('#947cea')
                                .setTitle(`Data found with email ${args[0]}`)
                                .setDescription(desc)
                                .setFooter(`Page: ${page}/${Math.floor(data.found / 10)}`)

                            const button1 = new MessageButton()
                                .setStyle(1)
                                .setCustomId("previous")
                                .setLabel("◁")

                            const button2 = new MessageButton()
                                .setStyle(1)
                                .setCustomId("following")
                                .setLabel("▷")


                            const row = new MessageActionRow()
                                .addComponents([button1, button2]);

                            m.edit({ embeds: [queue_previous], components: [row] })

                        }


                    })





                })

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

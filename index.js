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


            if (!args[0]) {
                const embed = new MessageEmbed()
                .setColor('RED')
                .setDescription(`Missing argument\n\`${prefix}email <Email>\``)

            return message.reply({ embeds: [embed] });
            }

            const data = await axios.get(`https://leaked.space/api/api.php?value=${args[0]}&type=auto&key=${config.api.key}`).then(r => r.data)

            console.log(data)

            if (data.success) {

                let desc = '';

                const length = 10;

                let i0 = 0;
                let i1 = length;
                let page = 1;



                function description() {

                    desc = "";
                    data.result.slice(i0, i1).map(x => {

                        const mail = x.line.split(':')[0];
                        const password = x.line.split(':')[1];
                        desc += `**-** \`${mail}\` **|** \`${password.slice(0, (Math.floor(password.length / 3)) * 2)}${"*".repeat(Math.floor(password.length / 3) + 1)}\` \n`

                    });
                    return desc;
                }


                const embed = new MessageEmbed()
                    .setColor('#947cea')
                    .setTitle(`${data.found} Data found for ${args[0]}`)
                    .setDescription(description())
                    .addField('Text Zone', `To see the full password, buy the premium !`)
                    .setFooter(`Page: ${page}/${Math.floor(data.found / length) + 1}`);

                const button1 = new MessageButton()
                    .setStyle(1)
                    .setCustomId("previous")
                    .setLabel("◁");

                const button2 = new MessageButton()
                    .setStyle(1)
                    .setCustomId("following")
                    .setLabel("▷");


                const row = new MessageActionRow()
                    .addComponents([button1, button2]);

                message.reply({ embeds: [embed], components: [row] }).then(m => {



                    const filter = (interaction) => [button1.customId, button2.customId].includes(interaction.customId) && interaction.user.id === message.author.id;
                    const collector = m.createMessageComponentCollector(filter, { time: 60 * 1000 });
                    collector.on('collect', i => {

                        i.deferUpdate();

                        if (i.customId === 'previous') {


                            // Updates variables
                            i0 -= length;
                            i1 -= length;

                            page -= 1;

                            // if there is no guild to display, delete the message
                            if (i0 < 0) {
                                i0 += length;
                                i1 += length;
                                page += 1;
                            }


                        }

                        else if (i.customId === 'following') {

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



                        }

                        const edited_embed = new MessageEmbed()
                            .setColor('#947cea')
                            .setTitle(`${data.found} Data found for ${args[0]}`)
                            .setDescription(description())
                            .addField('Text Zone', `To see the full password, buy the premium !`)
                            .setFooter(`Page: ${page}/${Math.floor(data.found / length) + 1}`);


                        m.edit({ embeds: [edited_embed], components: [row] });


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

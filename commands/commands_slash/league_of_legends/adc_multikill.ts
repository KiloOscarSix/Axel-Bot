import Discord from "discord.js";
import axios from "axios";
import {Marie} from "../../../client";

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("adc_multikill")
        .setDescription("Run for when alive"),

    async execute(interaction: Discord.ChatInputCommandInteraction) {
        const client = interaction.client as Marie
        client.vibrationLevel += 3

        await axios.post(`https://api.lovense-api.com/api/lan/v2/command`, {
            token: process.env.LOVENSE_TOKEN,
            uid: "393046490966130688",
            command: "Function",
            action: `Vibrate:${client.vibrationLevel}`,
            timeSec: 0,
            apiVer: 1
        });

        interaction.reply("Sent Successfully").then()
    }
}

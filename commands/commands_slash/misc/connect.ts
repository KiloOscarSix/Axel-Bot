import Discord from "discord.js";
import axios from "axios";

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("connect")
        .setDescription("Sends a DM with connection QR code"),

    async execute(interaction: Discord.ChatInputCommandInteraction) {
        const result = await axios.post("https://api.lovense.com/api/lan/getQrCode",
            {
                token: process.env.LOVENSE_TOKEN,
                uid: interaction.user.id,
                uname: interaction.user.username,
                utoken: interaction.user.id
            }
        )

        const embed = new Discord.EmbedBuilder()
            .setTitle("Connection QR Code")
            .setDescription("Scan the below image with the Lovense Mobile App")
            .setImage(result.data.message)

        Promise.all([
            interaction.user.send({embeds: [embed]}),
            interaction.reply({content: "Sent connection", ephemeral: true})
        ]).then()
    }
}

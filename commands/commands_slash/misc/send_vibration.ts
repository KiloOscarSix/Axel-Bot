import Discord from "discord.js";
import axios from "axios";

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("send_vibration")
        .setDescription("Sends 20 second vibration"),

    async execute(interaction: Discord.ChatInputCommandInteraction) {
        // const client = interaction.client as Axel
        // const connectedUser = client.connectedUsers.get(interaction.user.id)
        //
        // if (!connectedUser) {
        //     return interaction.reply({content: "Connection not found, please run /connect first", ephemeral: true})
        // }

        // Testing
        const domain = "192.168.0.143"
        const httpPort = "34567"

        await axios.post(`http://${domain}:${httpPort}/command`, {
            command: "Function",
            action: "Vibrate:5",
            timeSec: 20,
            apiVer: 1
        })

        interaction.reply({content: "Sent command", ephemeral: true}).then()
    }
}

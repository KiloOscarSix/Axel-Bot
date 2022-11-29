import Discord from "discord.js";
import axios from "axios";

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("send_vibration")
        .setDescription("Sends 20 second vibration")
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator)
        .addUserOption(option =>
            option.setName("user")
                .setDescription("User to send test vibration to")
                .setRequired(true)),

    async execute(interaction: Discord.ChatInputCommandInteraction) {
        const user = interaction.options.getUser("user", true)

        await axios.post(`https://api.lovense-api.com/api/lan/v2/command`, {
            token: process.env.LOVENSE_TOKEN,
            uid: user.id,
            command: "Function",
            action: "Vibrate:20",
            timeSec: 5,
            apiVer: 1
        });

        interaction.reply({content: "Sent command", ephemeral: true}).then()
    }
}

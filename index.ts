import Discord from "discord.js";
import dotenv from "dotenv";
import {loadSlashCommands} from "./commands/load_commands";
import {createServer} from "./servers";
import {Axel} from "./client";
import deployCommands from "./deploy_commands"
import mongoose from "mongoose";
import axios from "axios";
import fs from "fs";
import {ILovenseConnection} from "./models/lovense";

switch (process.env.NODE_ENV) {
    case "development":
        dotenv.config({path: "./.env.local"})
        break;
    default:
        dotenv.config()
        break;
}

const dbURI = process.env.MONGO_ATLAS_URI || ""
mongoose.connect(dbURI)
    .then(() => console.log("Connected to DB"))
    .catch(console.error)

export const client = new Axel({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildMessageReactions,
        Discord.GatewayIntentBits.GuildVoiceStates,
        Discord.GatewayIntentBits.MessageContent,
    ],
    partials: [
        Discord.Partials.Message,
        Discord.Partials.Channel,
        Discord.Partials.Reaction,
    ]
})


// Init
client.on(Discord.Events.ClientReady, async () => {
    const botConfig = require("./configs/bot_config.json");
    console.log(`Marie is Running, version: ${botConfig.version}`);

    if (client.user) {
        client.user.setPresence({activities: [{name: "with everyone"}], status: "online"})
    }

    // Initialize Servers
    await require("./servers").init(client)

    loadSlashCommands(client)

    if (process.env.NODE_ENV == "development") {
        deployCommands(client).then()
    }
});


client.on(Discord.Events.GuildCreate, guild => {
    createServer(guild.id)
})

client.on(Discord.Events.MessageCreate, async () => {
    const response = await axios.get("http://80.5.11.93:8443/api/v1/lovense/users")
    const connectUsers: ILovenseConnection[] = response.data

    const userIds = connectUsers.map(v => v.uid)

    await axios.post(`https://api.lovense-api.com/api/lan/v2/command`, {
        token: process.env.LOVENSE_TOKEN,
        uid: userIds.join(','),
        command: "Function",
        action: "Vibrate:5",
        timeSec: 2,
        apiVer: 1
    });
})


client.on(Discord.Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const client = interaction.client as Axel
    const command = client.slashCommands?.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction)
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true
        })
    }

})

client.on(Discord.Events.Error, error => {
    console.log(`Error Encountered ${error.message}`);
})

client.login(process.env.TOKEN).then()

if (process.env.NODE_ENV != "development") {
    process.on("uncaughtException", (error) => {
        fs.writeFileSync("crash.txt", `Uncaught Exception: ${error.message}`);
        console.error(error)
        process.exit(1);
    })

    process.on("unhandledRejection", (reason: Error, promise) => {
        fs.writeFileSync("crash.txt", `Unhandled rejection at ${promise}, reason: ${reason.message}`);
        console.error(reason)
        process.exit(1);
    })
}

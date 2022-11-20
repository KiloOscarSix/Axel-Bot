import Discord from "discord.js";
import {ISlashCommand} from "./commands/commands_slash/command";
import {ILovenseConnection} from "./models/lovense";

export class Axel extends Discord.Client {
    slashCommands: Discord.Collection<string, ISlashCommand> = new Discord.Collection()
    connectedUsers: Discord.Collection<string, ILovenseConnection> = new Discord.Collection()
}

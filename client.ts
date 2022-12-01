import Discord from "discord.js";
import {ISlashCommand} from "./commands/commands_slash/command";

export class Marie extends Discord.Client {
    slashCommands: Discord.Collection<string, ISlashCommand> = new Discord.Collection()
    vibrationLevel: number = 5
}

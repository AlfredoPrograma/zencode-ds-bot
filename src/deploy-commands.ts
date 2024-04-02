import { REST, Routes } from "discord.js";
import { commands } from "./commands";

const commandsData = Object.values(commands).map(command => command.data)

const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN as string)

type DeployCommandsProps = {
  guildId: string
}

export async function deployCommands({ guildId }: DeployCommandsProps) {
  try {
    console.log("Deploying commands")

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.APPLICATION_ID as string, guildId
      ),
      {
        body: commandsData
      }
    )

    console.log("Commands deployed successfully")
  } catch(err) {
    console.error(err)
  }
}
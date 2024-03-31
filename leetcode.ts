import { CommandInteraction, SlashCommandBuilder } from "discord.js"

export const data = new SlashCommandBuilder().setName("leetcode").setDescription("Get daily leetcode challange")

export async function execute(interaction: CommandInteraction) {
  return interaction.reply("Working?")
}

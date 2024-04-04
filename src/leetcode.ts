import { CommandInteraction, SlashCommandBuilder } from "discord.js"
import { capitalizeFirstWord } from "./utils"

// This file will be some kind of persisting storage for the index state for problems
// It will be the "source of truth" for the daily problem
const PROBLEMS_INDEX_FILE_PATH = `${process.env.DATA_FOLDER}/${process.env.INDEX_FILE}`
const PROBLEMS_FILE_PATH = `${process.env.DATA_FOLDER}/${process.env.PROBLEMS_FILE}` 

/**
 * Tries to read from index storage file and returns the current problem index
 */
async function computeProblemIndex() {
  try {
    const file = Bun.file(PROBLEMS_INDEX_FILE_PATH)
    const content = await file.text()

    const [rawIndex] = content.split("\n") 
    const index = Number(rawIndex)

    return index
  } catch(err) {
    console.error
  }
}

/**
 * Extracts current problem's name based in the problem's url
 * 
 * TODO: Ideally `problems.json` file should contain metadata about each problem so
 * this kind of utilities could not be needed  
 */
function extractProblemName(problemUrl: string) {
  const url = new URL(problemUrl)

  // All url pathnames has the following structure
  // /problems/<name>/description/... -- split by "/" --> [" ", "problems", "name", "description", ...]
  // So we take the name name splitting by "/" and accessing directly to index 2  

  const name = url.pathname.split("/")[2] ?? "No name for this problem"
  const normalizedName = capitalizeFirstWord(name.split("-").join(" "))

  return normalizedName
}

/**
 *  Tries to get the problem by current stored index 
 */
export async function getProblemByIndex(problems: string[]) {
  try {
    const index = await computeProblemIndex()

    if (!index) {
      throw new Error("Invalid index computed")
    }

    const url = problems[index]
    const name = extractProblemName(url)

    return {
      url,
      name,
      index
    } 
  } catch(err) {
    console.error(err)
  }
}

/**
 * Tries to update the current stored index by 1
 */
export async function updateProblemIndex() {
  try {
    const index = await computeProblemIndex()

    if (!index) {
      throw new Error("Invalid index computed")
    }

    await Bun.write(PROBLEMS_INDEX_FILE_PATH, `${index + 1}`)

    console.log("Problem index updated successfully")
  } catch(err) {
    console.error(err)
  }
}



type ProblemsJson = {
  problems: string[]
}

export const data = new SlashCommandBuilder().setName("leetcode").setDescription("Get daily leetcode challange")

export async function execute(interaction: CommandInteraction) {
  try {
    const file = Bun.file(PROBLEMS_FILE_PATH)
    const json: Awaited<Promise<ProblemsJson>> = await file.json()

    const problem = await getProblemByIndex(json.problems) 

    if (!problem) {
      throw new Error("Something went wrong. Cannot get problem by given index")
    }

    const formattedMsg = `Today's Leetcode challenge is: [#${problem.index} - ${problem.name}](${problem.url})`

    return interaction.reply(formattedMsg)
  } catch(err) {
    console.error(err)
  }

}

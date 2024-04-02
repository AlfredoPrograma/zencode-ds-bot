import { updateProblemIndex } from "./leetcode";

try {
  await updateProblemIndex()
} catch(err) {
  console.error(err)
}
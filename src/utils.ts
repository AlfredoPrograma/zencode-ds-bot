/**
 * Takes a string and just capitalizes the first word in it 
 */
export function capitalizeFirstWord(input: string) {
  return `${input.charAt(0).toUpperCase()}${input.slice(1)}`
}
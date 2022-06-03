import { createInterface } from "readline";

/**
 * Prompt user for input
 *
 * @param {string} message
 * @returns {Promise<string>}
 */
export async function prompt(
  message = "",
  options = ["y", "n"],
  defaultAnswer = "y",
) {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const toOption = (x) => (x === defaultAnswer ? x.toUpperCase() : x);

  const question = `${message}\n[${options.map(toOption).join("/")}]: `;

  const rawAnswer = await new Promise((r) => rl.question(question, r));
  const answer = rawAnswer.toLowerCase();

  return options.includes(answer) ? answer : defaultAnswer;
}

import argDep from "arg";
import { createInterface } from "readline";

export function arg(
  argObj,
  usageMsg = `This command has no usage message set`,
) {
  const args = argDep({ "--help": Boolean, ...argObj });
  if (args["--help"]) {
    console.log(usageMsg);
    process.exit(0);
  }

  return args;
}

/**
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

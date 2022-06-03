#!/usr/bin/env zx

import { Command } from "commander";
import "zx/globals";
import path from "path";

import { prompt } from "./lib.mjs";

const program = new Command();

program
  .name("codegen")
  .description("CLI to scaffold mew UI components")
  .version("0.8.0");

program
  .command("component")
  .description(
    "Scaffold a new component under src/components with a stories file",
  )
  .argument("<componentName>", "component name")
  .action(codegenComponent);

async function codegenComponent(componentName = "") {
  let component = componentName;

  if (!component) {
    component = await prompt("Component name: ");
  }

  const targetDir = path.resolve(`src/components/${component}`);

  const message = `
This will scaffold a new component under ${targetDir}. 

The following files will be created:

- ${targetDir}/index.js
- ${targetDir}/${component}.stories.js
- ${targetDir}/${component}.stories.mdx

Do you want to continue?
  `.trim();

  const answer = await prompt(message, ["y", "n"], "y");

  const replaceName = (content) =>
    content.replace(/ReactComponent/gi, component);

  if (answer === "y") {
    $.verbose = false;
    // await $`mkdir ${targetDir}`;
    const { stdout: indexContent } =
      await $`cat scripts/templates/ReactComponent/index.ts`;
    const { stdout: componentContent } =
      await $`cat scripts/templates/ReactComponent/ReactComponent.tsx`;
    const { stdout: storiesContnet } =
      await $`cat scripts/templates/ReactComponent/ReactComponent.stories.tsx`;

    await $`mkdir ${targetDir}`;
    if (indexContent && componentContent && storiesContnet) {
      await $`echo ${replaceName(indexContent)} > ${targetDir}/index.ts`;
      await $`echo ${replaceName(
        componentContent,
      )} > ${targetDir}/${component}.tsx`;
      await $`echo ${replaceName(
        storiesContnet,
      )} > ${targetDir}/${component}.stories.tsx`;

      console.log("Creating component...");
      process.exit(0);
    }
  } else {
    console.log("Aborted");
    process.exit(1);
  }
}

program.parse();

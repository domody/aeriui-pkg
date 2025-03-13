#!/usr/bin/env node

import inquirer from "inquirer"
// const inquirer = require("inquirer");
// const fs = require("fs");
// const path = require("path");

// CLI Questions
const questions = [
  {
    type: "confirm",
    name: "addTailwindConfig",
    message:
      "Would you like to extend your Tailwind config with AeriUI styles?",
    default: true,
  },
  {
    type: "confirm",
    name: "addAlias",
    message: "Would you like to add a path alias for AeriUI components?",
    default: true,
  },
  {
    type: "input",
    name: "aliasPath",
    message: "What should the alias path be? (default: @/components/ui)",
    default: "@/components/ui",
    when: (answers) => answers.addAlias,
  },
];

async function runInit() {
  const answers = await inquirer.prompt(questions);
  console.log("\n✨ Setting up AeriUI...\n");

//   if (answers.addTailwindConfig) {
//     const tailwindConfigPath = path.resolve("tailwind.config.js");
//     if (fs.existsSync(tailwindConfigPath)) {
//       fs.appendFileSync(tailwindConfigPath, `\n// AeriUI styles\n`);
//       console.log("✅ Tailwind config updated!");
//     } else {
//       console.log("⚠️ No tailwind.config.js found. Skipping...");
//     }
//   }

//   if (answers.addAlias) {
//     console.log(`✅ Alias set: ${answers.aliasPath}`);
//   }

  console.log("\n🚀 AeriUI setup complete!");
}

export default runInit;

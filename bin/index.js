#!/usr/bin/env node

const inquirer = require("inquirer");

const args = process.argv.slice(2);
const command = args[0];

if (command === "init") {
  console.log("Initializing aeriui...\n");

  const prompt = inquirer.createPromptModule();
  prompt([
    {
      type: "confirm",
      name: "installCSS",
      message: "Do you want to install the required CSS variables?",
      default: true,
    },
    {
      type: "confirm",
      name: "setupAlias",
      message: "Do you want to set up alias paths for components?",
      default: true,
    },
  ]).then((answers) => {
    if (answers.installCSS) {
      console.log("✅ Installing CSS variables...");
      // Add logic to install CSS variables here
    }

    if (answers.setupAlias) {
      console.log("✅ Setting up alias paths...");
      // Add logic to modify tsconfig.json / webpack / vite alias paths here
    }

    console.log("\n🎉 AeriUI has been initialized successfully!");
  });
} else if (command === "add" && args[1]) {
  const component = args[1];
  console.log(`Adding ${component}...`);
} else {
  console.log(`Usage:
    npx aeriui init  -> Setup the necessary files
    npx aeriui add <component> -> Add a specific component`);
}

#!/usr/bin/env node

const AERIUI_CSS = `
@import "tailwindcss";

/* AeriUI CSS Vars */
@layer base {
  :root {
    --background: 95.64% 0.0067 286.27;
    --foreground: 13.54% 0.0047 285.76;

    --primary: 92.64% 0.0067 286.27;
    --primary-foreground: 5% 0.01 250;

    --secondary: 23.76% 0.0114 285.5;
    --secondary-foreground: 90.79% 0.0054 286.29;

    --destructive: 61.22% 0.2082 22.24;
    --destructive-foreground: var(--background);

    --success: 78.49% 0.2002 153.29;
    --success-foreground: var(--foreground);

    --warning: 70% 0.22 60;
    --warning-foreground: var(--foreground);

    --accent: 89.5% 0.0127 279.14;
    --accent-foreground: var(--foreground);

    --muted: 89.5% 0.0127 279.14;
    --muted-foreground: 71.18% 0.0129 286.07;

    --border: 87.36% 0.0137 280.05;
    --input: 41.6% 0.0183 281.45;
    --ring: 56.73% 0.0456 274.26;
  }

  .dark {
    --background: 13.54% 0.0047 285.76;
    --foreground: 82.64% 0.0067 286.27;

    --primary: 92.64% 0.0067 286.27;
    --primary-foreground: 5% 0.01 250;

    --secondary: 23.76% 0.0114 285.5;
    --secondary-foreground: 90.79% 0.0054 286.29;

    --destructive: 61.22% 0.2082 22.24;
    --destructive-foreground: var(--foreground);

    --success: 78.49% 0.2002 153.29;
    --success-foreground: var(--foreground);

    --warning: 70% 0.22 60;
    --warning-foreground: var(--foreground);

    --accent: 29.5% 0.0127 279.14;
    --accent-foreground: var(--foreground);

    --muted: 29.5% 0.0127 279.14;
    --muted-foreground: 71.18% 0.0129 286.07;

    --border: 37.36% 0.0137 280.05;
    --input: 41.6% 0.0183 281.45;
    --ring: 56.73% 0.0456 274.26;
  }
}

/* Tailwind v4 Theme Definitions */
@theme {
  --color-background: oklch(var(--background));
  --color-foreground: oklch(var(--foreground));
  --color-primary: oklch(var(--primary));
  --color-primary-foreground: oklch(var(--primary-foreground));
  --color-secondary: oklch(var(--secondary));
  --color-secondary-foreground: oklch(var(--secondary-foreground));
  --color-destructive: oklch(var(--destructive));
  --color-destructive-foreground: oklch(var(--destructive-foreground));
  --color-success: oklch(var(--success));
  --color-success-foreground: oklch(var(--success-foreground));
  --color-warning: oklch(var(--warning));
  --color-warning-foreground: oklch(var(--warning-foreground));
  --color-accent: oklch(var(--accent));
  --color-accent-foreground: oklch(var(--accent-foreground));
  --color-muted: oklch(var(--muted));
  --color-muted-foreground: oklch(var(--muted-foreground));
  --color-border: oklch(var(--border));
  --color-input: oklch(var(--input));
  --color-ring: oklch(var(--ring));
}

@layer base {
  body {
    @apply bg-background text-foreground;
  }
}
`;

const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const https = require("https");

const args = process.argv.slice(2);
const command = args[0];

const pkgRoot = process.cwd();
const destDir = path.join(pkgRoot, "src", "app", "components", "ui");

const GITHUB_BASE_URL =
  "https://raw.githubusercontent.com/domody/aeriui-pkg/refs/heads/main/src/components/";

const allComponents = [
  "Accordion",
  "Alert",
  "Badge",
  "Card",
  "ContextMenu",
  "Dropdown",
  "Input",
  "Modal",
  "OptionList",
  "Selector",
  "Slot",
  "Tabs",
];

function downloadComponent(componentName) {
  const fileUrl = `${GITHUB_BASE_URL}${componentName}.tsx`;
  const destFilePath = path.join(destDir, `${componentName}.tsx`);

  console.log(`Adding ${componentName}...`);

  // Ensure destination folder exists
  fs.mkdirSync(destDir, { recursive: true });

  https
    .get(fileUrl, (res) => {
      if (res.statusCode !== 200) {
        console.error(
          `❌ Failed to download component "${componentName}". Check if it exists.`
        );
        return;
      }

      const fileStream = fs.createWriteStream(destFilePath);
      res.pipe(fileStream);

      fileStream.on("finish", () => {
        fileStream.close();
        console.log(`✅ Component "${componentName}" added at ${destFilePath}`);
      });
    })
    .on("error", (err) => {
      console.error(`❌ Error fetching component: ${err.message}`);
    });
}

if (command === "init") {
  console.log("Initializing aeriui...\n");

  const prompt = inquirer.createPromptModule();
  prompt([
    {
      type: "input",
      name: "stylesPath",
      message:
        "Enter the path for your main styles.css (default: src/app/styles/globals.css):",
      default: "src/app/styles/globals.css",
    },
    {
      type: "input",
      name: "componentPath",
      message:
        "Where should AeriUI components be stored? (default: src/app/components/ui)",
      default: "src/app/components/ui",
    },
    {
      type: "confirm",
      name: "useAlias",
      message:
        "Would you like to create an alias for AeriUI components? (e.g., @aeriui)",
      default: true,
    },
    {
      type: "input",
      name: "aliasName",
      message: "Enter alias name (default: @aeriui):",
      when: (answers) => answers.useAlias,
      default: "@aeriui",
    },
    {
      type: "input",
      name: "cnPath",
      message:
        "Enter the path for the `cn.ts` utility (default: src/app/lib/utils/cn.ts):",
      default: "src/app/lib/utils/cn.ts",
    },
  ]).then((answers) => {
    const projectRoot = process.cwd();

    // Create Styles
    const stylesFilePath = path.join(projectRoot, answers.stylesPath);
    fs.mkdirSync(path.dirname(stylesFilePath), { recursive: true });
    fs.writeFileSync(stylesFilePath, AERIUI_CSS, {
      flag: "w",
    });
    console.log(
      `✅ CSS variables and Tailwind styles added at ${answers.stylesPath}`
    );

    // Create Components Folder
    const componentsDir = path.join(projectRoot, answers.componentPath);
    fs.mkdirSync(componentsDir, { recursive: true });
    console.log(`✅ Components folder created at ${answers.componentPath}`);

    // Add custom Alias
    if (answers.useAlias) {
      const tsconfigPath = path.join(projectRoot, "tsconfig.json");

      // Read the existing tsconfig.json
      let tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf-8"));

      // Ensure compilerOptions exists
      tsconfig.compilerOptions = tsconfig.compilerOptions || {};

      // Ensure paths exists inside compilerOptions
      tsconfig.compilerOptions.paths = tsconfig.compilerOptions.paths || {};

      // Add the alias
      tsconfig.compilerOptions.paths[answers.aliasName + "/*"] = [
        `./${answers.componentPath}/*`,
      ];

      // Write back to tsconfig.json
      fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));

      console.log(`✅ Alias "${answers.aliasName}" added to tsconfig.json!`);
    }

    // cn File path
    const cnFilePath = path.join(projectRoot, answers.cnPath);
    fs.mkdirSync(path.dirname(cnFilePath), { recursive: true });

    fs.writeFileSync(
      cnFilePath,
      `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`,
      { flag: "w" }
    );
    console.log(`✅ cn.ts utility created at ${answers.cnPath}`);

    console.log("\n🎉 AeriUI has been initialized successfully!");
  });
} else if (command === "add" && args[1]) {
  const componentName = args[1];

  if (componentName === "all" || componentName === "*") {
    console.log("Adding all components...\n");
    allComponents.forEach(downloadComponent);
  } else if (allComponents.includes(componentName)) {
    downloadComponent(componentName);
  } else {
    console.error(`❌ Unknown component "${componentName}".`);
    console.log("Available components:");
    console.log(allComponents.join(", "));
  }
} else {
  console.log(`Usage:
    npx aeriui init  -> Setup the necessary files
    npx aeriui add <component> -> Add a specific component`);
}

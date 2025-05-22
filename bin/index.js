#!/usr/bin/env node

import inquirer from "inquirer";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templates = {
  "node-js": "https://github.com/siddhantcvdi/node-js-template.git",
};

async function main() {
  console.log("✨ Welcome to arcit CLI!");

  const { projectName, template } = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "Enter your project name:",
      validate: (input) => input.length > 0 || "Project name is required",
    },
    {
      type: "list",
      name: "template",
      message: "Choose a template:",
      choices: Object.keys(templates),
    },
  ]);

  const repoUrl = templates[template];
  const projectPath = path.join(process.cwd(), projectName);

  console.log(`\n📁 Creating project '${projectName}' from '${template}' template...`);
  execSync(`git clone --depth=1 ${repoUrl} ${projectName}`, { stdio: "inherit" });

  // Remove .git folder
  fs.rmSync(path.join(projectPath, ".git"), { recursive: true, force: true });

  if (template.startsWith("node")) {
    console.log("\n📦 Initializing Node project...");
    try {
      execSync("npm init -y", { cwd: projectPath, stdio: "inherit" });
      execSync(
        "npm install express mongoose cookie-parser cors dotenv",
        { cwd: projectPath, stdio: "inherit" }
      );
    } catch (err) {
      console.error("\n❌ Failed to initialize or install dependencies:", err.message);
    }
  }

  console.log(`\n✅ Project '${projectName}' is ready!`);
  console.log(`\n👉 Next steps:`);
  console.log(`   cd ${projectName}`);
  console.log(`   npm start (or go run main.go if Golang)`);
}

main();

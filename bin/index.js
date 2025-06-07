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

      // Modify package.json to set "type": "module"
      const packageJsonPath = path.join(projectPath, "package.json");
      const packageJsonRaw = fs.readFileSync(packageJsonPath, "utf-8");
      const packageJson = JSON.parse(packageJsonRaw);
      packageJson.type = "module";

      // Add scripts if not present
      packageJson.scripts = packageJson.scripts || {};
      packageJson.scripts.start = packageJson.scripts.start || "node server.js";
      packageJson.scripts.dev = packageJson.scripts.dev || "nodemon server.js";

      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

      // Install dependencies & devDependencies
      execSync(
        "npm install express mongoose cookie-parser cors dotenv winston",
        { cwd: projectPath, stdio: "inherit" }
      );
      execSync(
        "npm install -D nodemon",
        { cwd: projectPath, stdio: "inherit" }
      );

      // Create a .env file with default content
      const envContent = `PORT=5000
NODE_ENV=development
`;
      fs.writeFileSync(path.join(projectPath, ".env"), envContent);

      // Create a .gitignore file
      const gitignoreContent = `node_modules
.env
error.log
`;
      fs.writeFileSync(path.join(projectPath, ".gitignore"), gitignoreContent);

    } catch (err) {
      console.error("\n❌ Failed to initialize or install dependencies:", err.message);
    }
  }

  console.log(`\n✅ Project '${projectName}' is ready!`);
  console.log(`\n👉 Next steps:`);
  console.log(`   cd ${projectName}`);
  console.log(`   npm run dev   # for development with auto reload`);
  console.log(`   npm start     # for production`);
}

main();

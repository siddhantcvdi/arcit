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
  "node-js-auth": "https://github.com/siddhantcvdi/node-js-auth-template.git",
};

const templateConfigs = {
  "node-js": {
    deps: "express mongoose cookie-parser cors dotenv winston",
    devDeps: "nodemon",
    env: `PORT=5000\nNODE_ENV=development\nMONGO_URI=mongodb://localhost:27017/myapp\n`,
  },
  "node-js-auth": {
    deps: "express mongoose cookie-parser cors dotenv winston jsonwebtoken bcryptjs",
    devDeps: "nodemon",
    env: `PORT=5000\nNODE_ENV=development\nMONGO_URI=mongodb://localhost:27017/myapp\nJWT_SECRET=your_super_secret_key_here\nJWT_EXPIRES_IN=7d\n`,
  },
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
      const config = templateConfigs[template];

      execSync("npm init -y", { cwd: projectPath, stdio: "inherit" });

      // Modify package.json
      const packageJsonPath = path.join(projectPath, "package.json");
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
      packageJson.type = "module";
      packageJson.scripts = packageJson.scripts || {};
      packageJson.scripts.start = packageJson.scripts.start || "node server.js";
      packageJson.scripts.dev = packageJson.scripts.dev || "nodemon server.js";
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

      // Install dependencies
      execSync(`npm install ${config.deps}`, { cwd: projectPath, stdio: "inherit" });
      execSync(`npm install -D ${config.devDeps}`, { cwd: projectPath, stdio: "inherit" });

      // Create .env
      fs.writeFileSync(path.join(projectPath, ".env"), config.env);

      // Create .gitignore
      const gitignoreContent = `node_modules\n.env\nerror.log\n`;
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

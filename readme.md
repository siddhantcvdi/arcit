# arcit

**arcit** is a zero-config CLI tool to instantly scaffold backend project structures using battle-tested templates. It helps you kickstart your development workflow by automating project initialization, cloning templates, and installing dependencies — all with one command.

---

## ✨ Features

- One-line command to bootstrap a backend project
- Supports multiple starter templates
- Automatically installs necessary dependencies
- Removes Git history for a fresh start

---

## 🚀 Installation

You can use `npx` or install globally:

### Option 1: Use via `npx` (No install)

```bash
npx arcit
```

### Option 2: Install globally

```bash
npm install -g arcit
arcit
```

---

## 📦 Usage

Run the command:

```bash
arcit
```

You’ll be prompted to:

- Enter your project name
- Choose a template (e.g. node-js)

The CLI will:

- Clone the selected template
- Remove `.git` history
- Initialize the project
- Install required dependencies

---

## 📁 Example

```bash
arcit
```

Prompt flow:

```
? Enter your project name: my-api
? Choose a template: node-js
```

Output:

```
📁 Creating project 'my-api' from 'node-js' template...
📦 Initializing Node project...
✅ Project 'my-api' is ready!
```


---

## 🛠 Project Structure

After generation, your project will have a clean folder structure, ready to code. You can fully customize it as per your stack and requirements.

---



## 🤝 Contributing

Want to add your own templates or improve the CLI? Contributions are welcome. Open an issue or create a pull request!

---
---

# 📘 Windows Dev Bootstrapper

A fully automated **Windows development environment setup tool** built with Node.js.

It installs tools, configures system settings, prepares project folders, runs cleanup, and generates system reports — all in one command.

---

# 🚀 Overview

This project is a **modular automation engine** that:

* Installs developer tools (VS Code, Git, Docker, Node, Python, etc.)
* Sets up npm global packages
* Clones and configures Git repositories
* Enables system features (WSL, Hyper-V, hibernation)
* Performs system cleanup
* Generates system diagnostic reports
* Verifies installed tools

---

# ⚙️ Core Features

## 📦 Software Installation

Automatically installs via `winget`:

* Visual Studio Code
* Docker Desktop
* Git
* Firefox
* Node.js
* Python
* LibreOffice
* curl
* Chocolatey

---

## 📦 npm Global Setup

Installs developer tools globally:

* opencode-ai
* yarn
* pnpm
* typescript
* nodemon

---

## 📁 Project Automation

* Clones GitHub repositories
* Automatically enters project directory
* Runs predefined setup commands:

  * `npm install`
  * skill setup tools
  * AI tooling setup

---

## 🧠 System Diagnostics

Generates `result_doc.md` including:

* Username
* OS version
* RAM / CPU info
* Admin privilege check
* Internet connectivity
* System health report

---

## 🧹 System Cleanup

Optional cleanup module:

* Clears temp files
* Flushes DNS cache
* Resets network stack
* Cleans Docker system
* Enables hibernation
* Disables startup apps (safe mode)

---

## 🔍 Verification Layer

Checks installed tools:

* node
* git
* python
* docker

Ensures environment is ready.

---

## 🔁 Smart Execution Engine

* Step-based pipeline system
* Retry mechanism for failed installs
* Error logging system
* Optional stop-on-error mode
* Execution timing per step

---

# 🧱 Architecture

```
project/
│
├── main.js              # Entry point (pipeline controller)
├── cli.js               # NPX entry
│
├── config/
│   └── config.js        # All install definitions
│
├── tasks/
│   ├── systemCheckTask.js
│   ├── packageTask.js
│   ├── npmTask.js
│   ├── projectTask.js
│   ├── cleanupTask.js
│   ├── verifyTask.js
│
├── utils/
│   ├── exec.js
│   ├── retry.js
│   ├── logger.js
│
├── logs/
│   ├── run.log
│   ├── result_doc.md
```

---

# 🧠 Execution Flow

When you run the tool:

```
System Check
   ↓
Install Packages (winget)
   ↓
Install npm Globals
   ↓
Clone Project & Setup
   ↓
Verify System
   ↓
Cleanup System
```

---

# 🚀 How to Use

## 🟢 Method 1: Run locally

### Step 1: Install dependencies

```bash
npm install
```

### Step 2: Run tool

```bash
node main.js
```

---

## 🟡 Method 2: Run via NPX (GitHub)

```bash
npx github:yourusername/your-repo
```

This will:

* download repo temporarily
* execute bootstrap automatically

---

## 🔵 Method 3: Install as global CLI (recommended)

### Install:

```bash
npm install -g windows-dev-bootstrapper
```

### Run:

```bash
win-setup
```

---

# 📦 How to Publish to NPM

## Step 1: Login

```bash
npm login
```

---

## Step 2: Prepare package.json

```json
{
  "name": "windows-dev-bootstrapper",
  "version": "1.0.0",
  "bin": {
    "win-setup": "cli.js"
  },
  "type": "commonjs"
}
```

---

## Step 3: Publish

```bash
npm publish
```

---

## Step 4: Use anywhere

```bash
npx win-setup
```

---

# 🌐 How to Deploy from GitHub

## Step 1: Push code

```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/yourname/repo.git
git push -u origin main
```

---

## Step 2: Run via NPX

```bash
npx github:yourname/repo
```

---

# ⚠️ Requirements

* Windows 10/11
* Node.js installed
* Admin terminal (recommended)
* Internet connection
* Winget enabled

---

# 🔐 Permissions Needed

Some features require Administrator:

* Hyper-V enabling
* Network reset
* Hibernation toggle
* System cleanup commands

---

# 🧪 Safety Notes

* Startup disabling is **safe mode only**
* Docker cleanup removes unused containers/images
* Temp cleaning may skip locked files
* System commands may require reboot

---

# 🚀 Future Improvements (Roadmap)

### Planned upgrades:

* GUI installer (progress bar UI)
* Resume after reboot
* Mode selection:

  * dev mode
  * cleanup mode
  * gaming mode
* Parallel installs (faster execution)
* Offline installer bundle
* EXE packaging (one-click setup)
* Cloud config support (GitHub JSON)

---

# 💡 Example Usage

```bash
npx github:yourusername/windows-dev-bootstrapper
```

or

```bash
win-setup
```

---

# 🏁 Result

After execution, your system becomes:

* Fully configured dev machine
* Ready for coding instantly
* Cleaned and optimized
* Verified and logged

---

If you want next step, I can help you:

🔥 convert this into a **Windows .exe installer with GUI + progress bar**
or
🚀 make it a **real CLI tool with modes (--dev --gaming --clean)**

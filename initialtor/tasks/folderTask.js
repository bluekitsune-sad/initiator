// const fs = require('fs');
// const path = require('path');
// const os = require('os');
// const { runCommand } = require('../utils/exec');
// const config = require('../config/config');

// async function run() {
//     console.log("📁 Setting up project folder...\n");

//     const downloadsPath = path.join(os.homedir(), 'Downloads');
//     const projectPath = path.join(downloadsPath, 'project');

//     if (!fs.existsSync(projectPath)) {
//         fs.mkdirSync(projectPath, { recursive: true });
//         console.log("✅ Project folder created:", projectPath);
//     }

//     // 🔽 Clone repo if provided
//     if (config.projectRepo.url) {
//         console.log("⬇️ Cloning repository...");
//         await runCommand(`cd "${projectPath}" && git clone ${config.projectRepo.url}`);
//     }

//     // 🔽 Move into repo folder if specified
//     let workingDir = projectPath;

//     if (config.projectRepo.folderName) {
//         workingDir = path.join(projectPath, config.projectRepo.folderName);
//     }

//     // 🔽 Run commands inside repo
//     for (const cmd of config.projectCommands) {
//         console.log(`➡️ Running: ${cmd}`);
//         await runCommand(`cd "${workingDir}" && ${cmd}`);
//     }
// }

// module.exports = { run };

const config = require('../config/config');
const { runCommand } = require('../utils/exec');
const { log } = require('../utils/logger');
const path = require('path');
const os = require('os');

async function run() {
    const base = path.join(os.homedir(), "Downloads/project");

    if (config.projectRepo?.url) {
        log("⬇️ Cloning repo...");
        await runCommand(`cd "${base}" && git clone ${config.projectRepo.url}`);
    }

    const folder = config.projectRepo?.folderName
        ? path.join(base, config.projectRepo.folderName)
        : base;

    for (const cmd of config.projectCommands) {
        log(`➡️ ${cmd}`);
        await runCommand(`cd "${folder}" && ${cmd}`);
    }
}

module.exports = { run };
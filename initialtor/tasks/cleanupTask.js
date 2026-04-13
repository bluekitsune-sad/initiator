// const { runCommand } = require('../utils/exec');
// const config = require('../config/config');
// const fs = require('fs');
// const path = require('path');
// const os = require('os');

// async function run() {
//     console.log("🧹 Running System Cleanup...\n");

//     const cleanup = config.cleanup || {};

//     try {
//         // 🗑️ TEMP FILES
//         if (cleanup.temp) {
//             console.log("➡️ Cleaning temp files...");
//             await runCommand('del /q/f/s %TEMP%\\*');
//             await runCommand('del /q/f/s C:\\Windows\\Temp\\*');
//         }

//         // 🌐 DNS
//         if (cleanup.dns) {
//             console.log("➡️ Flushing DNS...");
//             await runCommand('ipconfig /flushdns');
//         }

//         // 🌍 NETWORK RESET
//         if (cleanup.network) {
//             console.log("➡️ Resetting network...");
//             await runCommand('netsh winsock reset');
//             await runCommand('netsh int ip reset');
//         }

//         // 🐳 DOCKER CLEANUP
//         if (cleanup.docker) {
//             console.log("➡️ Cleaning Docker...");
//             try {
//                 await runCommand('docker system prune -af');
//             } catch {
//                 console.log("⚠️ Docker not available, skipping...");
//             }
//         }

//         // 🚫 STARTUP APPS (SAFE)
//         if (cleanup.startup) {
//             console.log("➡️ Disabling startup apps (user-level)...");

//             const startupPath = path.join(
//                 os.homedir(),
//                 'AppData',
//                 'Roaming',
//                 'Microsoft',
//                 'Windows',
//                 'Start Menu',
//                 'Programs',
//                 'Startup'
//             );

//             if (fs.existsSync(startupPath)) {
//                 const files = fs.readdirSync(startupPath);

//                 for (const file of files) {
//                     const fullPath = path.join(startupPath, file);

//                     if (!file.endsWith(".disabled")) {
//                         fs.renameSync(fullPath, fullPath + ".disabled");
//                     }
//                 }

//                 console.log("✅ Startup apps disabled (safe mode)");
//             }
//         }

//         // 💤 ENABLE HIBERNATION
//         console.log("➡️ Enabling hibernation...");
//         await runCommand('powercfg /hibernate on');

//         console.log("\n✅ Cleanup completed\n");

//     } catch (err) {
//         console.error("❌ Cleanup failed:", err.message);
//     }
// }

// module.exports = { run };

const config = require('../config/config');
const { runCommand } = require('../utils/exec');
const { log } = require('../utils/logger');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function run() {
    log("🧹 Cleanup Started");

    const c = config.cleanup || {};

    if (c.temp) {
        await runCommand('del /q/f/s %TEMP%\\*');
        await runCommand('del /q/f/s C:\\Windows\\Temp\\*');
    }

    if (c.dns) {
        await runCommand('ipconfig /flushdns');
    }

    if (c.docker) {
        try {
            await runCommand('docker system prune -af');
        } catch {}
    }

    if (c.startup) {
        const startup = path.join(os.homedir(),
            'AppData/Roaming/Microsoft/Windows/Start Menu/Programs/Startup'
        );

        if (fs.existsSync(startup)) {
            fs.readdirSync(startup).forEach(f => {
                fs.renameSync(path.join(startup, f), path.join(startup, f + ".disabled"));
            });
        }
    }

    await runCommand('powercfg /hibernate on');

    log("🧹 Cleanup Done");
}

module.exports = { run };
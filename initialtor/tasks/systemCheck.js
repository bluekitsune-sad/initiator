// const os = require('os');
// const fs = require('fs');
// const path = require('path');
// const { runCommand } = require('../utils/exec');

// async function run() {
//     console.log("🧠 Running System Checks...\n");

//     const results = [];

//     try {
//         // 👤 Current user
//         const user = os.userInfo().username;
//         results.push(`# 🖥️ System Report\n`);
//         results.push(`## 👤 User Info`);
//         results.push(`- Username: ${user}`);

//         // 🏠 Host + OS
//         results.push(`\n## 💻 System Info`);
//         results.push(`- Hostname: ${os.hostname()}`);
//         results.push(`- OS: ${os.type()} ${os.release()}`);
//         results.push(`- Architecture: ${os.arch()}`);
//         results.push(`- CPUs: ${os.cpus().length}`);
//         results.push(`- Total RAM: ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`);

//         // 🔐 Admin check
//         try {
//             await runCommand("net session");
//             results.push(`\n## 🔐 Privileges`);
//             results.push(`- Running as Admin: ✅ Yes`);
//         } catch {
//             results.push(`\n## 🔐 Privileges`);
//             results.push(`- Running as Admin: ❌ No`);
//         }

//         // 👥 User groups
//         try {
//             const groups = await runCommand("whoami /groups");
//             results.push(`\n## 👥 User Groups`);
//             results.push("```");
//             results.push(groups.trim());
//             results.push("```");
//         } catch (err) {
//             results.push(`- Failed to fetch groups`);
//         }

//         // 🌐 Internet check
//         try {
//             await runCommand("ping -n 1 google.com");
//             results.push(`\n## 🌐 Internet`);
//             results.push(`- Connection: ✅ Online`);
//         } catch {
//             results.push(`\n## 🌐 Internet`);
//             results.push(`- Connection: ❌ Offline`);
//         }

//         // 🧾 Full systeminfo
//         try {
//             const sysInfo = await runCommand("systeminfo");
//             results.push(`\n## 📋 Detailed System Info`);
//             results.push("```");
//             results.push(sysInfo.trim());
//             results.push("```");
//         } catch {
//             results.push(`- Failed to get systeminfo`);
//         }

//         // 💾 Save file
//         const filePath = path.join(process.cwd(), "result_doc.md");
//         fs.writeFileSync(filePath, results.join("\n"));

//         console.log(`✅ System report saved to: ${filePath}\n`);

//     } catch (err) {
//         console.error("❌ System check failed:", err.message);
//     }
// }

// module.exports = { run };

const os = require('os');
const fs = require('fs');
const path = require('path');
const { runCommand } = require('../utils/exec');
const { log } = require('../utils/logger');

async function run() {
    log("🧠 System Check Started");

    const report = [];

    report.push(`# SYSTEM REPORT`);
    report.push(`User: ${os.userInfo().username}`);
    report.push(`OS: ${os.type()} ${os.release()}`);
    report.push(`RAM: ${(os.totalmem()/1e9).toFixed(2)} GB`);
    report.push(`CPU: ${os.cpus().length} cores`);

    // Admin check
    try {
        await runCommand("net session");
        report.push(`Admin: YES`);
    } catch {
        report.push(`Admin: NO`);
    }

    // Internet
    try {
        await runCommand("ping -n 1 google.com");
        report.push(`Internet: OK`);
    } catch {
        report.push(`Internet: FAIL`);
    }

    fs.writeFileSync(path.join(process.cwd(), "logs/result_doc.md"), report.join("\n"));
    log("🧠 System Check Completed");
}

module.exports = { run };
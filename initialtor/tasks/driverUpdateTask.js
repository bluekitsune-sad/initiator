const { runCommand } = require('../utils/exec');

async function run() {
    console.log("🧠 Updating Drivers (Windows Update)...\n");

    try {
        await runCommand(`powershell -Command "Install-Module PSWindowsUpdate -Force -Scope CurrentUser"`);
        await runCommand(`powershell -Command "Import-Module PSWindowsUpdate; Get-WindowsUpdate -Install -AcceptAll -AutoReboot"`);
        console.log("✅ Drivers Updated\n");
    } catch (err) {
        console.error("❌ Driver update failed");
    }
}

module.exports = { run };
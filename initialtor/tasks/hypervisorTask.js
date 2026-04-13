const { runCommand } = require('../utils/exec');

async function run() {
    console.log("🖥️ Enabling Hypervisor + WSL...\n");

    try {
        await runCommand(`dism.exe /online /enable-feature /featurename:Microsoft-Hyper-V-All /all /norestart`);
        await runCommand(`dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart`);
        await runCommand(`wsl --install`);
        await runCommand(`wsl --update`);

        console.log("✅ Hypervisor & WSL configured\n");
    } catch (err) {
        console.error("❌ Hypervisor setup failed");
    }
}

module.exports = { run };
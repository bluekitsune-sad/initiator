const { runCommand } = require('../utils/exec');
const { log } = require('../utils/logger');

async function run() {
    log("🔍 Verification Started");

    const checks = [
        "node -v",
        "git --version",
        "python --version",
        "docker --version"
    ];

    for (const c of checks) {
        try {
            const out = await runCommand(c);
            log(`✅ ${c}: OK`);
        } catch {
            log(`❌ ${c}: FAIL`);
        }
    }

    log("🔍 Verification Done");
}

module.exports = { run };
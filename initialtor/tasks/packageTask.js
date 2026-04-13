const config = require('../config/config');
const { runCommand } = require('../utils/exec');
const { retry } = require('../utils/retry');
const { log } = require('../utils/logger');

async function run() {
    log("📦 Installing Packages...");

    for (const pkg of config.packages) {
        try {
            if (pkg.check) {
                try {
                    await runCommand(pkg.check);
                    log(`✅ Exists: ${pkg.name}`);
                    continue;
                } catch {}
            }

            await retry(pkg.cmd);
            log(`✅ Installed: ${pkg.name}`);

        } catch (err) {
            log(`❌ Failed: ${pkg.name}`);
        }
    }
}

module.exports = { run };
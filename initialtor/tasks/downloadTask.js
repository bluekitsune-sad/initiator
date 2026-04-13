const { runCommand } = require('../utils/exec');
const config = require('../config/config');

async function run() {
    console.log("📥 Running Download Tasks...\n");

    for (const url of config.downloadUrls) {
        if (!url) continue;

        console.log(`⬇️ Downloading: ${url}`);
        await runCommand(`curl -L -O ${url}`);
    }

    console.log("✅ Download Task Finished\n");
}

module.exports = { run };
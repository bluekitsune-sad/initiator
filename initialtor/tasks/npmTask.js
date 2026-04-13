const config = require('../config/config');
const { runCommand } = require('../utils/exec');
const { retry } = require('../utils/retry');
const { log } = require('../utils/logger');

async function run() {
    log("📦 Installing NPM Globals");

    for (const p of config.npmGlobals) {
        await retry(`npm install -g ${p}`);
        log(`✅ npm global: ${p}`);
    }
}

module.exports = { run };
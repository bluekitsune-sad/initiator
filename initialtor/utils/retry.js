const { runCommand } = require('./exec');
const { log } = require('./logger');

async function retry(cmd, attempts = 3, delay = 2000) {
    for (let i = 1; i <= attempts; i++) {
        try {
            return await runCommand(cmd);
        } catch (err) {
            log(`❌ Attempt ${i} failed: ${cmd}`);
            if (i === attempts) throw err;
            await new Promise(r => setTimeout(r, delay));
        }
    }
}

module.exports = { retry };
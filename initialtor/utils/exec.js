const { exec } = require('child_process');

function runCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, { maxBuffer: 1024 * 1024 * 10 }, (err, stdout, stderr) => {
            if (err) return reject(stderr || err.message);
            resolve(stdout);
        });
    });
}

module.exports = { runCommand };
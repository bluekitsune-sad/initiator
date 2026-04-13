const fs = require('fs');
const path = require('path');

const logFile = path.join(process.cwd(), 'logs/run.log');

function log(msg) {
    const line = `[${new Date().toISOString()}] ${msg}\n`;
    console.log(msg);
    fs.appendFileSync(logFile, line);
}

module.exports = { log };
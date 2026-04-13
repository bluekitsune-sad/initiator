#!/usr/bin/env node
const systemCheck = require('./tasks/systemCheckTask');
const packages = require('./tasks/packageTask');
const npm = require('./tasks/npmTask');
const project = require('./tasks/projectTask');
const verify = require('./tasks/verifyTask');
const cleanup = require('./tasks/cleanupTask');

const { log } = require('./utils/logger');

// 🧠 Pipeline (fully extensible)
const steps = [
    { name: "System Check", task: systemCheck },
    { name: "Package Install", task: packages },
    { name: "NPM Globals", task: npm },
    { name: "Project Setup", task: project },
    { name: "Verification", task: verify },
    { name: "Cleanup", task: cleanup }
];

// ⚙️ Config
const config = {
    stopOnError: false // change to true if you want strict mode
};

async function run() {
    console.log("\n🚀 ===== WINDOWS SETUP STARTED =====\n");

    const startTime = Date.now();

    for (const step of steps) {
        const stepStart = Date.now();

        try {
            log(`▶️ Starting: ${step.name}`);

            await step.task.run();

            const duration = ((Date.now() - stepStart) / 1000).toFixed(2);
            log(`✅ Finished: ${step.name} (${duration}s)\n`);

        } catch (err) {
            log(`❌ Failed: ${step.name}`);
            log(err?.message || err);

            if (config.stopOnError) {
                log("🛑 Stopping execution due to error");
                break;
            }
        }
    }

    const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log("\n🚀 ===== SETUP COMPLETE =====");
    console.log(`⏱ Total time: ${totalTime}s`);
}

run();
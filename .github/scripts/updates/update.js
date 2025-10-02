import { spawn } from 'child_process';

async function runScript(scriptPath, args = []) {
    return new Promise((resolve, reject) => {
        const child = spawn('node', [scriptPath, ...args], {
            stdio: 'inherit'
        });
        
        child.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Script failed with code ${code}`));
            }
        });
        
        child.on('error', (error) => {
            reject(error);
        });
    });
}

async function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        // No arguments - update all changed integrations
        console.log('Updating all changed integrations...');
        await runScript('.github/scripts/updates/update-changed-integrations.js');
    } else if (args.includes('--bulk')) {
        // -bulk flag provided - update all integrations
        console.log('Running bulk update for all integrations...');
        await runScript('.github/scripts/updates/bulk-update.js');
    } else {
        // Arguments provided - update specific integration
        const integrationName = args[0];
        console.log(`Updating integration: ${integrationName}`);
        await runScript('.github/scripts/updates/update-single-integration.js', [integrationName]);
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(error => {
        console.error('Error:', error.message);
        process.exit(1);
    });
}

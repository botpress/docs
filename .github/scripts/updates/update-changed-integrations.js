import { execSync } from 'child_process';
import { spawn } from 'child_process';

function getModifiedIntegrationFiles() {
    try {
        const modifiedIntegrations = new Set();
        
        // Check for uncommitted changes
        try {
            const uncommittedCommand = `git diff --name-only -- integrations/integration-guides/`;
            const uncommittedOutput = execSync(uncommittedCommand, { encoding: 'utf8' });
            const uncommittedFiles = uncommittedOutput.trim().split('\n').filter(file => file.length > 0);
            
            uncommittedFiles.forEach(file => {
                const match = file.match(/integrations\/integration-guides\/([^\/]+)\.mdx$/);
                if (match) {
                    modifiedIntegrations.add(match[1]);
                }
                
                const subdirMatch = file.match(/integrations\/integration-guides\/([^\/]+)\//);
                if (subdirMatch) {
                    modifiedIntegrations.add(subdirMatch[1]);
                }
            });
        } catch (error) {
            console.log('No uncommitted changes found');
        }
        
        // Check for staged changes
        try {
            const stagedCommand = `git diff --cached --name-only -- integrations/integration-guides/`;
            const stagedOutput = execSync(stagedCommand, { encoding: 'utf8' });
            const stagedFiles = stagedOutput.trim().split('\n').filter(file => file.length > 0);
            
            stagedFiles.forEach(file => {
                const match = file.match(/integrations\/integration-guides\/([^\/]+)\.mdx$/);
                if (match) {
                    modifiedIntegrations.add(match[1]);
                }
                
                const subdirMatch = file.match(/integrations\/integration-guides\/([^\/]+)\//);
                if (subdirMatch) {
                    modifiedIntegrations.add(subdirMatch[1]);
                }
            });
        } catch (error) {
            console.log('No staged changes found');
        }
        
        return Array.from(modifiedIntegrations);
    } catch (error) {
        console.error('Error getting modified files:', error);
        return [];
    }
}

async function updateIntegration(integrationName) {
    return new Promise((resolve, reject) => {
        console.log(`\nUpdating integration: ${integrationName}...`);
        
        const child = spawn('node', ['.github/scripts/updates/update-single-integration.js', integrationName], {
            stdio: 'inherit'
        });
        
        child.on('close', (code) => {
            if (code === 0) {
                console.log(`Successfully updated: ${integrationName}`);
                resolve();
            } else {
                console.log(`Failed to update: ${integrationName}`);
                reject(new Error(`Update failed for ${integrationName}`));
            }
        });
        
        child.on('error', (error) => {
            console.error(`Error updating ${integrationName}:`, error);
            reject(error);
        });
    });
}

async function main() {
    try {
        console.log('Checking for modified integration files...');
        const modifiedIntegrations = getModifiedIntegrationFiles();
        
        if (modifiedIntegrations.length === 0) {
            console.log('No integration files have been modified. Nothing to update.');
            return;
        }
        
        console.log(`Found modified integrations: ${modifiedIntegrations.join(', ')}`);
        
        for (const integrationName of modifiedIntegrations) {
            try {
                await updateIntegration(integrationName);
            } catch (error) {
                console.error(`Failed to update ${integrationName}:`, error.message);
                // Continue with other integrations even if one fails
            }
        }
        
        console.log('\nFinished updating all modified integrations.');
    } catch (error) {
        console.error('Error in update process:', error);
        process.exit(1);
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

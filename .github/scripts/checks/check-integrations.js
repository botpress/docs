import { admin } from '@botpress/client'
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const fsPromises = fs.promises;

const token = process.env.BOTPRESS_TOKEN
const workspaceID = process.env.BOTPRESS_WORKSPACE_ID

const client = new admin.Client({
  token,
  workspaceID,
})

async function getIntegrationByName(name) {
    if (!token) {
        throw new Error('BOTPRESS_TOKEN environment variable is required');
    }
    
    if (!workspaceID) {
        throw new Error('BOTPRESS_WORKSPACE_ID environment variable is required');
    }

    try {
        console.log(`Fetching integration: ${name}`);
        
        const data = await client.getPublicIntegration({
            name: name,
            version: "latest"
        });
        
        if (data.integration.ownerWorkspace?.handle === 'botpress' || 
            data.integration.ownerWorkspace?.handle === 'plus') {
            return data.integration;
        } else {
            console.log(`Integration ${name} is not from botpress or plus workspace`);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching integration ${name}:`, error);
        return null;
    }
}

function getModifiedIntegrationFiles() {
    try {
        const baseBranch = process.env.GITHUB_BASE_REF || 'master';
        
        const command = `git diff --name-only origin/${baseBranch}...HEAD -- integrations/integration-guides/`;
        const output = execSync(command, { encoding: 'utf8' });
        
        const modifiedFiles = output.trim().split('\n').filter(file => file.length > 0);
        
        const modifiedIntegrations = new Set();
        
        modifiedFiles.forEach(file => {
            const match = file.match(/integrations\/integration-guides\/([^\/]+)\.mdx$/);
            if (match) {
                modifiedIntegrations.add(match[1]);
            }
            
            const subdirMatch = file.match(/integrations\/integration-guides\/([^\/]+)\//);
            if (subdirMatch) {
                modifiedIntegrations.add(subdirMatch[1]);
            }
        });
        
        console.log(`Modified integration files: ${Array.from(modifiedIntegrations).join(', ')}`);
        return Array.from(modifiedIntegrations);
    } catch (error) {
        console.error('Error getting modified files:', error);
        return [];
    }
}

async function getCurrentVersionsForIntegrations(integrationNames) {
    try {
        const filePath = './snippets/integrations/versions.mdx';
        const content = await fsPromises.readFile(filePath, 'utf8');
        
        const match = content.match(/export const integrationVersions = ({[\s\S]*})/);
        if (!match) {
            throw new Error('Could not parse current versions file');
        }
        
        const allVersions = JSON.parse(match[1]);
        
        // Filter to only the integrations we care about
        const filteredVersions = {};
        integrationNames.forEach(name => {
            if (allVersions[name]) {
                filteredVersions[name] = allVersions[name];
            }
        });
        
        return filteredVersions;
    } catch (error) {
        console.error('Error reading current versions:', error);
        throw error;
    }
}

async function checkIntegrationUpdates(integrationNames) {
    const updates = [];
    const newIntegrations = [];
    
    // Get current versions for the modified integrations
    const currentVersions = await getCurrentVersionsForIntegrations(integrationNames);
    
    // Check each integration individually
    for (const name of integrationNames) {
        const latestIntegration = await getIntegrationByName(name);
        
        if (latestIntegration) {
            const currentVersion = currentVersions[name];
            
            if (currentVersion) {
                const versionChanged = currentVersion.version !== latestIntegration.version;
                const idChanged = currentVersion.id !== latestIntegration.id;
                
                if (versionChanged || idChanged) {
                    updates.push({
                        name,
                        currentVersion: currentVersion.version,
                        latestVersion: latestIntegration.version,
                        currentId: currentVersion.id,
                        latestId: latestIntegration.id,
                        versionChanged,
                        idChanged
                    });
                }
            } else {
                // Integration exists in Botpress but not in our versions file
                newIntegrations.push({
                    name,
                    version: latestIntegration.version,
                    id: latestIntegration.id
                });
            }
        }
    }
    
    return { updates, newIntegrations };
}

async function setGitHubOutput(name, value) {
    if (process.env.GITHUB_OUTPUT) {
        if (typeof value === 'string' && value.includes('\n')) {
            const delimiter = `EOF_${Math.random().toString(36).substring(7)}`;
            fs.appendFileSync(process.env.GITHUB_OUTPUT, `${name}<<${delimiter}\n${value}\n${delimiter}\n`);
        } else {
            fs.appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${value}\n`);
        }
    } else {
        console.log(`Output: ${name}=${value}`);
    }
}

async function main() {
    try {
        console.log('Checking for modified integration files...');
        const modifiedIntegrations = getModifiedIntegrationFiles();
        
        if (modifiedIntegrations.length === 0) {
            console.log('No integration files have been modified on this branch.');
            await setGitHubOutput('has_updates', 'false');
            process.exit(0);
        }
        
        console.log(`Checking versions for modified integrations: ${modifiedIntegrations.join(', ')}`);
        
        console.log('Checking for integration updates...');
        const { updates, newIntegrations } = await checkIntegrationUpdates(modifiedIntegrations);
        
        const hasUpdates = updates.length > 0 || newIntegrations.length > 0;
        
        if (hasUpdates) {
            console.log(`Found out-of-date integration documentation. Use "pnpm run update-integrations" to fix.`);
            await setGitHubOutput('has_updates', 'true');
            process.exit(1);
        } else {
            console.log('No integration updates found for modified integrations');
            await setGitHubOutput('has_updates', 'false');
            process.exit(0);
        }
    } catch (error) {
        console.error('Error in version check:', error);
        await setGitHubOutput('has_updates', 'false');
        process.exit(1);
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

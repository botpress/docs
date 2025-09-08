const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

async function getIntegrations() {
    const bearerToken = process.env.BOTPRESS_TOKEN;
    const workspaceId = process.env.BOTPRESS_WORKSPACE_ID;
    
    if (!bearerToken) {
        throw new Error('BOTPRESS_TOKEN environment variable is required');
    }
    
    if (!workspaceId) {
        throw new Error('BOTPRESS_WORKSPACE_ID environment variable is required');
    }

    const options = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${bearerToken}`,
            'x-workspace-id': workspaceId
        },
        body: undefined
    };

    let allIntegrations = [];
    let nextToken = null;
    let pageCount = 0;

    try {
        do {
            pageCount++;
            console.log(`Fetching integrations page ${pageCount}${nextToken ? ` (token: ${nextToken.substring(0, 20)}...)` : ''}`);
            
            let url = 'https://api.botpress.cloud/v1/admin/hub/integrations?sortBy=name&limit=1000&version=latest';
            if (nextToken) {
                url += `&nextToken=${encodeURIComponent(nextToken)}`;
            }

            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.integrations && Array.isArray(data.integrations)) {
                allIntegrations = allIntegrations.concat(data.integrations);
                console.log(`Retrieved ${data.integrations.length} integrations from page ${pageCount} (total: ${allIntegrations.length})`);
            }
            
            nextToken = data.meta?.nextToken || null;
            
        } while (nextToken);

        console.log(`Completed pagination. Total integrations retrieved: ${allIntegrations.length}`);
        
        return {
            integrations: allIntegrations
        };
    } catch (error) {
        console.error('Error fetching integrations:', error);
        throw error;
    }
}

function filterIntegrations(data) {
    if (!data || !data.integrations) {
        return {};
    }
    
    const filtered = data.integrations
        .filter(integration => integration.ownerWorkspace?.handle === 'botpress')
        .reduce((acc, integration) => {
            acc[integration.name] = {
                'version': integration.version,
                'id': integration.id
            }
            return acc;
        }, {});
    
    return filtered;
}

async function getCurrentVersions() {
    try {
        const filePath = './snippets/integrations/versions.mdx';
        const content = await fsPromises.readFile(filePath, 'utf8');
        
        const match = content.match(/export const integrationVersions = ({[\s\S]*})/);
        if (!match) {
            throw new Error('Could not parse current versions file');
        }
        
        return JSON.parse(match[1]);
    } catch (error) {
        console.error('Error reading current versions:', error);
        throw error;
    }
}

function compareVersions(current, latest) {
    const updates = [];
    const newIntegrations = [];
    
    for (const [name, latestInfo] of Object.entries(latest)) {
        if (current[name]) {
            const versionChanged = current[name].version !== latestInfo.version;
            const idChanged = current[name].id !== latestInfo.id;
            
            if (versionChanged || idChanged) {
                updates.push({
                    name,
                    currentVersion: current[name].version,
                    latestVersion: latestInfo.version,
                    currentId: current[name].id,
                    latestId: latestInfo.id,
                    versionChanged,
                    idChanged
                });
            }
        } else {
            newIntegrations.push({
                name,
                version: latestInfo.version,
                id: latestInfo.id
            });
        }
    }
    
    return { updates, newIntegrations };
}

async function updateVersionsFile(latestVersions) {
    const content = `export const integrationVersions = ${JSON.stringify(latestVersions, null, 2)}`;
    const filePath = './snippets/integrations/versions.mdx';
    
    await fsPromises.writeFile(filePath, content, 'utf8');
    console.log(`Updated versions file: ${filePath}`);
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

function formatChangesSummary(updates, newIntegrations) {
    let summary = '';
    
    if (updates.length > 0) {
        summary += `**Integration Updates (${updates.length}):**\n`;
        updates.forEach(update => {
            const changes = [];
            if (update.versionChanged) {
                changes.push(`${update.currentVersion} -> ${update.latestVersion}`);
            }
            if (update.idChanged) {
                changes.push(`${update.currentId} -> ${update.latestId}`);
            }
            summary += `- ${update.name}: ${changes.join(', ')}\n`;
        });
    }
    
    if (newIntegrations.length > 0) {
        if (summary) summary += '\n';
        summary += `**New Integrations (${newIntegrations.length}):**\n`;
        newIntegrations.forEach(integration => {
            summary += `- ${integration.name}: ${integration.version} (${integration.id})\n`;
        });
    }
    
    return summary.trim();
}

async function main() {
    try {
        console.log('Fetching latest integration versions from Botpress API...');
        const integrations = await getIntegrations();
        const latestVersions = filterIntegrations(integrations);
        
        console.log('Reading current versions file...');
        const currentVersions = await getCurrentVersions();
        
        console.log('Comparing versions...');
        const { updates, newIntegrations } = compareVersions(currentVersions, latestVersions);
        
        const hasUpdates = updates.length > 0 || newIntegrations.length > 0;
        
        if (hasUpdates) {
            console.log(`Found ${updates.length} integration updates and ${newIntegrations.length} new integrations`);
            
            await updateVersionsFile(latestVersions);
            
            const changesSummary = formatChangesSummary(updates, newIntegrations);
            const updatedIntegrationsList = [
                ...updates.map(u => u.name),
                ...newIntegrations.map(i => i.name)
            ].join(', ');
            
            await setGitHubOutput('has_updates', 'true');
            await setGitHubOutput('changes_summary', changesSummary);
            await setGitHubOutput('updated_integrations', updatedIntegrationsList);
            
            console.log('Changes Summary:');
            console.log(changesSummary);
        } else {
            console.log('No integration updates found');
            await setGitHubOutput('has_updates', 'false');
        }
        
        process.exit(0);
    } catch (error) {
        console.error('Error in version check:', error);
        await setGitHubOutput('has_updates', 'false');
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}
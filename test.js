async function getIntegrations() {
    const url = 'https://api.botpress.cloud/v1/admin/hub/integrations?version=latest&limit=999';
    const options = {
    method: 'GET',
    headers: {
        Authorization: 'Bearer bp_pat_nwVefwn9AMpZjPUxDdQPKaraMeBdNXzanGIm',
        'x-workspace-id': 'wkspace_01JP09YVPQE5NNZXQQC64ER4YF'
    },
    body: undefined
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        console.log(data);
        return data;
        } catch (error) {
        console.error(error);
        return null;
    }
}

function filterIntegrations(data) {
    if (!data || !data.integrations) {
        return {};
    }
    
    const filtered = data.integrations
        .filter(integration => integration.ownerWorkspace?.handle === 'botpress')
        .reduce((acc, integration) => {
            acc[integration.name] = integration.version;
            return acc;
        }, {});
    
    return filtered;
}

async function writeToFile(data, filePath) {
    const fs = require('fs').promises;
    const path = require('path');
    
    const content = `export const integrationVersions = ${JSON.stringify(data, null, 2)}`;
    
    // Ensure directory exists
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    
    await fs.writeFile(filePath, content, 'utf8');
    console.log(`Data written to ${filePath}`);
}

async function main () {
    const integrations = await getIntegrations()
    const filtered = filterIntegrations(integrations)
    console.log('Filtered integrations:', filtered)
    
    // filtered is now directly the object we want
    await writeToFile(filtered, './snippets/integrations/test.mdx')
}

main()
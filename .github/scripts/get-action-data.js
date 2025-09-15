import { admin } from '@botpress/client'
import 'dotenv/config'

const token = process.env.BOTPRESS_TOKEN
const workspaceID = process.env.BOTPRESS_WORKSPACE_ID

const client = new admin.Client({
  token,
  workspaceID,
})

async function getActions(bpIntegrations) {
    let allActions = {}

    if (!bpIntegrations) {
        return {}
    }

    // console.log(bpIntegrations)

    for (const [name, id] of Object.entries(bpIntegrations)) {
        const currentIntegration = await client.getPublicIntegrationById({id: id})
        const currentActions = currentIntegration.integration.actions
        allActions = {
            ...allActions,
            [name]: currentActions
        }
    }

    console.log(allActions)
    return allActions
}

function filterIntegrations(data) {
    if (!data) {
        return {};
    }
    
    const filtered = data
        .filter(integration => integration.ownerWorkspace?.handle === 'botpress')
        .reduce((acc, integration) => {
            acc[integration.name] = integration.id
            return acc;
        }, {});
    
    return filtered;
}

async function getIntegrations() {
    let allIntegrations = [];
    let nextToken = null;
    let pageCount = 0;
    let options = {
        version: "latest",
        sortBy: "name",
        limit: 100
    }

    do {
        pageCount++;

        if (nextToken) {
            options = {
                ...options,
                nextToken: nextToken
            }
        }

        const data = await client.listPublicIntegrations(options)
        
        if (data.integrations && Array.isArray(data.integrations)) {
            allIntegrations = allIntegrations.concat(data.integrations);
        }
        
        nextToken = data.meta?.nextToken || null;
        
    } while (nextToken);

    return allIntegrations;
}

async function main() {
    const integrations = await getIntegrations()
    const bpIntegrations = filterIntegrations(integrations)
    const actions = await getActions(bpIntegrations)

    console.log(actions.webflow.createCollection.input)
}

void main()
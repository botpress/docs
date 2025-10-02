import { admin } from '@botpress/client'

/**
 * Get data for a single integration by name
 * @param {Object} client - Botpress admin client
 * @param {string} integrationName - Name of the integration
 * @param {Object} bpIntegrations - Object containing integration metadata (id, workspace)
 * @returns {Object|null} Integration data or null if not found/no actions or events
 */
export async function getSingleIntegrationData(client, integrationName, bpIntegrations) {
    if (!bpIntegrations) {
        return null
    }

    if (!bpIntegrations[integrationName]) {
        console.log(`No integration found with name "${integrationName}".`)
        return null
    }

    const integrationData = bpIntegrations[integrationName]
    
    try {
        const currentIntegration = await client.getPublicIntegrationById({id: integrationData.id})
        const currentActions = currentIntegration.integration.actions
        const currentEvents = currentIntegration.integration.events
        
        const hasActions = currentActions && Object.keys(currentActions).length > 0
        const hasEvents = currentEvents && Object.keys(currentEvents).length > 0
        
        // Include integration only if it has actions or events
        if (hasActions || hasEvents) {
            const features = []
            if (hasActions) features.push(`${Object.keys(currentActions).length} Cards`)
            if (hasEvents) features.push(`${Object.keys(currentEvents).length} Triggers`)
            console.log(`Found ${integrationName} - ${features.join(', ')}...`)
            
            return {
                actions: currentActions || {},
                events: currentEvents || {},
                workspace: integrationData.workspace,
                version: currentIntegration.integration.version,
                id: currentIntegration.integration.id
            }
        } else {
            console.log(`Skipping ${integrationName} - no Cards or Triggers found`)
            return null
        }
    } catch (error) {
        console.error(`Error fetching data for integration "${integrationName}":`, error.message)
        return null
    }
}

/**
 * Get data for multiple integrations
 * @param {Object} client - Botpress admin client
 * @param {Object} bpIntegrations - Object containing integration metadata
 * @returns {Object} Object with integration names as keys and integration data as values
 */
export async function getIntegrationData(client, bpIntegrations) {
    let allIntegrations = {}

    if (!bpIntegrations) {
        return {}
    }

    for (const [name, integrationData] of Object.entries(bpIntegrations)) {
        const singleIntegrationData = await getSingleIntegrationData(client, name, bpIntegrations)
        
        if (singleIntegrationData) {
            allIntegrations[name] = singleIntegrationData
        }
    }

    return allIntegrations
}

/**
 * Filter integrations to only include Botpress and Plus workspace integrations
 * @param {Array} data - Array of integration objects from the API
 * @returns {Object} Filtered integrations object
 */
export function filterIntegrations(data) {
    if (!data) {
        return {};
    }
    
    const filtered = data
        .filter(integration => 
            integration.ownerWorkspace?.handle === 'botpress' || 
            integration.ownerWorkspace?.handle === 'plus'
        )
        .reduce((acc, integration) => {
            acc[integration.name] = {
                id: integration.id,
                workspace: integration.ownerWorkspace.handle
            }
            return acc;
        }, {});
    
    return filtered;
}

/**
 * Get all public integrations from Botpress
 * @param {Object} client - Botpress admin client
 * @returns {Array} Array of all integration objects
 */
export async function getIntegrations(client) {
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

/**
 * Get a single integration by name, including fetching all available integrations if needed
 * @param {Object} client - Botpress admin client
 * @param {string} integrationName - Name of the integration to fetch
 * @returns {Object|null} Integration data or null if not found
 */
export async function getIntegrationByName(client, integrationName) {
    
    // Get all integrations first
    const allIntegrations = await getIntegrations(client)
    
    // Filter to Botpress and Plus integrations
    const bpIntegrations = filterIntegrations(allIntegrations)
    
    // Get the specific integration data
    return await getSingleIntegrationData(client, integrationName, bpIntegrations)
}

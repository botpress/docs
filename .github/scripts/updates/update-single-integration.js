import { admin } from '@botpress/client'
import { getIntegrationByName } from '../utils/integration-data-fetcher.js'
import { processIntegration } from '../utils/docs-generator.js'
import dotenv from 'dotenv'

dotenv.config()

const token = process.env.BOTPRESS_TOKEN
const workspaceID = process.env.BOTPRESS_WORKSPACE_ID//

if (!token || !workspaceID) {
    console.error('Error: BOTPRESS_TOKEN and BOTPRESS_WORKSPACE_ID environment variables are required')
    process.exit(1)
}

const client = new admin.Client({
    token,
    workspaceID,
})

async function main() {
    const integrationName = process.argv[2]
    
    if (!integrationName) {
        console.error('Error: Please provide an integration name')
        console.log('Usage: pnpm run update-integrations <integration-name>')
        console.log('Example: pnpm run update-integrations whatsapp')
        process.exit(1)
    }
    
    try {
        console.log(`Fetching data for ${integrationName}...`)
        
        // Get the integration data
        const integrationData = await getIntegrationByName(client, integrationName)
        
        if (!integrationData) {
            return
        }
        
        console.log('Processing integration documentation...')
        
        const result = await processIntegration(integrationName, integrationData)

        let hasUpdates = (result.cards.updated || result.triggers.updated) ? true : false
    
        if (hasUpdates) {
            console.log(`Updated documentation for ${integrationName}.`)
        } else {
            console.log(`${integrationName} is already up to date.`)
        }
        
    } catch (error) {
        console.error('Error:', error.message)
        process.exit(1)
    }
}

void main()

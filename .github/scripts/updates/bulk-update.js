import { admin } from '@botpress/client'
import { appendFileSync } from 'fs'
import { getIntegrations, filterIntegrations, getIntegrationData } from '../utils/integration-data-fetcher.js'
import { processIntegrations } from '../utils/docs-generator.js'
import dotenv from 'dotenv'

// Load .env file if it exists (for local development)
dotenv.config()

const token = process.env.BOTPRESS_TOKEN
const workspaceID = process.env.BOTPRESS_WORKSPACE_ID

const client = new admin.Client({
  token,
  workspaceID,
})

// GitHub Actions output functions
async function setGitHubOutput(name, value) {
    if (process.env.GITHUB_OUTPUT) {
        // Handle multiline values using GitHub Actions delimiter format
        if (value.includes('\n')) {
            const delimiter = `EOF_${Math.random().toString(36).substring(2, 15)}`;
            appendFileSync(process.env.GITHUB_OUTPUT, `${name}<<${delimiter}\n${value}\n${delimiter}\n`);
        } else {
            appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${value}\n`);
        }
    }
}

async function main() {
    try {
        console.log('Fetching all integrations from Botpress...')
        const allIntegrations = await getIntegrations(client)
        
        console.log('Filtering Botpress and Plus integrations...')
        const bpIntegrations = filterIntegrations(allIntegrations)
        
        console.log('Fetching Cards and Triggers for all filtered integrations...')
        const integrations = await getIntegrationData(client, bpIntegrations)
        
        if (Object.keys(integrations).length === 0) {
            console.log('No integrations with Cards or Triggers found.')
            await setGitHubOutput('has_updates', 'false')
            await setGitHubOutput('has_card_updates', 'false')
            await setGitHubOutput('has_trigger_updates', 'false')
            return
        }
        
        console.log('Generating reference documentation files...')
        const { updatedCards, newCards, updatedTriggers, newTriggers } = await processIntegrations(integrations)
        
        const totalCardUpdates = updatedCards.length + newCards.length
        const totalTriggerUpdates = updatedTriggers.length + newTriggers.length
        const totalUpdates = totalCardUpdates + totalTriggerUpdates
        const hasUpdates = totalUpdates > 0
        const hasCardUpdates = totalCardUpdates > 0
        const hasTriggerUpdates = totalTriggerUpdates > 0
        
        if (hasUpdates) {
            const changesSummary = [
                updatedCards.length > 0 ? `Updated Cards: ${updatedCards.join(', ')}` : '',
                newCards.length > 0 ? `New Cards: ${newCards.join(', ')}` : '',
                updatedTriggers.length > 0 ? `Updated Triggers: ${updatedTriggers.join(', ')}` : '',
                newTriggers.length > 0 ? `New Triggers: ${newTriggers.join(', ')}` : ''
            ].filter(Boolean).join('\n')
            
            const allUpdatedCards = [...updatedCards, ...newCards].join(', ')
            const allUpdatedTriggers = [...updatedTriggers, ...newTriggers].join(', ')
            const allUpdatedIntegrations = [...new Set([...updatedCards, ...newCards, ...updatedTriggers, ...newTriggers])].join(', ')
            
            await setGitHubOutput('has_updates', 'true')
            await setGitHubOutput('has_card_updates', hasCardUpdates.toString())
            await setGitHubOutput('has_trigger_updates', hasTriggerUpdates.toString())
            await setGitHubOutput('changes_summary', changesSummary)
            await setGitHubOutput('updated_integrations', allUpdatedIntegrations)
            await setGitHubOutput('updated_cards', allUpdatedCards)
            await setGitHubOutput('updated_triggers', allUpdatedTriggers)
            
            console.log(`Successfully updated ${totalUpdates} integration documentation files.`)
            if (hasCardUpdates) {
                console.log(`Cards: ${totalCardUpdates} files updated`)
            }
            if (hasTriggerUpdates) {
                console.log(`Triggers: ${totalTriggerUpdates} files updated.`)
            }
            console.log('Changes Summary:')
            console.log(changesSummary)
        } else {
            await setGitHubOutput('has_updates', 'false')
            await setGitHubOutput('has_card_updates', 'false')
            await setGitHubOutput('has_trigger_updates', 'false')
            console.log('All integration documentation files are up to date.')
        }
        
    } catch (error) {
        console.error('Error:', error)
        await setGitHubOutput('has_updates', 'false')
        process.exit(1)
    }
}

void main()
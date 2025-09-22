import { admin } from '@botpress/client'
import { writeFileSync, existsSync, mkdirSync, readFileSync, appendFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const token = process.env.BOTPRESS_TOKEN
const workspaceID = process.env.BOTPRESS_WORKSPACE_ID

const client = new admin.Client({
  token,
  workspaceID,
})

// GitHub Actions output functions
async function setGitHubOutput(name, value) {
    if (process.env.GITHUB_OUTPUT) {
        appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${value}\n`);
    }
}

function fileExists(filePath) {
    try {
        return existsSync(filePath);
    } catch {
        return false;
    }
}

function getFileHash(content) {
    // Simple hash function for content comparison
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
        const char = content.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
}

async function getIntegrationData(bpIntegrations) {
    let allIntegrations = {}

    if (!bpIntegrations) {
        return {}
    }

    for (const [name, integrationData] of Object.entries(bpIntegrations)) {
        const currentIntegration = await client.getPublicIntegrationById({id: integrationData.id})
        const currentActions = currentIntegration.integration.actions
        const currentEvents = currentIntegration.integration.events
        
        const hasActions = currentActions && Object.keys(currentActions).length > 0
        const hasEvents = currentEvents && Object.keys(currentEvents).length > 0
        
        // Include integrations that have actions or events
        if (hasActions || hasEvents) {
            allIntegrations = {
                ...allIntegrations,
                [name]: {
                    actions: currentActions || {},
                    events: currentEvents || {},
                    workspace: integrationData.workspace
                }
            }
            
            const features = []
            if (hasActions) features.push(`${Object.keys(currentActions).length} Cards`)
            if (hasEvents) features.push(`${Object.keys(currentEvents).length} Triggers`)
            console.log(`✅ Found ${name} - ${features.join(', ')}`)
        } else {
            console.log(`⏭️  Skipping ${name} - no Cards or Triggers found`)
        }
    }

    return allIntegrations
}

function filterIntegrations(data) {
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


function capitalize(str) {
    // Add spaces before uppercase letters (for camelCase) and capitalize first letter
    return str
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .charAt(0).toUpperCase() + str.replace(/([a-z])([A-Z])/g, '$1 $2').slice(1)
}

function preserveEscaping(text) {
    if (!text) return '';
    const escapedText = JSON.stringify(text)
    return `<span>{${escapedText}}</span>`;
}

function generateResponseField(name, field, required = []) {
    const isRequired = required.includes(name)
    const title = field['x-zui']?.title || name
    const fieldType = field.type || 'string'
    
    // Handle special cases
    let typeDisplay = fieldType
    if (field.format) {
        typeDisplay = `${fieldType} (${field.format})`
    }
    if (field.enum) {
        typeDisplay = `enum: ${field.enum.join(', ')}`
    }
    
    const requiredProp = isRequired ? '\n    required' : ''
    const description = preserveEscaping(field.description || '')
    
    let fieldContent = `  <ResponseField
    name="${name}"
    type="${typeDisplay}"${requiredProp}
  >
    ${description}`
    
    // Handle nested properties for objects
    if (field.type === 'object' && field.properties) {
        const nestedRequired = field.required || []
        const nestedFields = Object.entries(field.properties)
            .map(([nestedName, nestedField]) => generateResponseField(nestedName, nestedField, nestedRequired))
            .join('\n')
        
        if (nestedFields) {
            fieldContent += `\n\n    <Expandable>\n${nestedFields}\n    </Expandable>`
        }
    }
    
    // Handle arrays with object items
    if (field.type === 'array' && field.items) {
        let arrayItemContent = ''
        
        // Handle simple object items
        if (field.items.properties) {
            const nestedRequired = field.items.required || []
            const nestedFields = Object.entries(field.items.properties)
                .map(([nestedName, nestedField]) => generateResponseField(nestedName, nestedField, nestedRequired))
                .join('\n')
            
            if (nestedFields) {
                arrayItemContent = `\n\n    <Expandable title="array item properties">\n${nestedFields}\n    </Expandable>`
            }
        }
        
        // Handle anyOf/oneOf schemas (multiple possible item types)
        else if (field.items.anyOf || field.items.oneOf) {
            const schemas = field.items.anyOf || field.items.oneOf
            let schemaContent = ''
            
            schemas.forEach((schema, index) => {
                if (schema.properties) {
                    const schemaRequired = schema.required || []
                    const schemaFields = Object.entries(schema.properties)
                        .map(([nestedName, nestedField]) => generateResponseField(nestedName, nestedField, schemaRequired))
                        .join('\n')
                    
                    if (schemaFields) {
                        const schemaTitle = schema.properties.type?.const 
                            ? `${schema.properties.type.const} properties`
                            : `option ${index + 1} properties`
                        schemaContent += `\n\n    <Expandable title="${schemaTitle}">\n${schemaFields}\n    </Expandable>`
                    }
                }
            })
            
            if (schemaContent) {
                arrayItemContent = schemaContent
            }
        }
        
        if (arrayItemContent) {
            fieldContent += arrayItemContent
        }
    }
    
    fieldContent += `\n  </ResponseField>`
    
    return fieldContent
}

function generateExpandableSection(schema, title) {
    if (!schema?.properties) {
        return `<Expandable title="${title}">\n  <ResponseField name="(empty)" type="object">\n    No specific fields documented.\n  </ResponseField>\n</Expandable>`
    }
    
    const required = schema.required || []
    const fields = Object.entries(schema.properties)
        .map(([name, field]) => generateResponseField(name, field, required))
        .join('\n')
    
    return `<Expandable title="${title}">\n${fields}\n</Expandable>`
}

function generateActionSection(actionName, actionData) {
    const title = actionData.title || capitalize(actionName)
    const description = preserveEscaping(actionData.description || '')
    
    // Generate input section
    const inputSection = actionData.input?.schema?.properties && Object.keys(actionData.input.schema.properties).length > 0
        ? generateExpandableSection(actionData.input.schema, "input fields")
        : 'This Card has no input fields.'
    
    // Generate output section  
    const outputSection = actionData.output?.schema?.properties && Object.keys(actionData.output.schema.properties).length > 0
        ? generateExpandableSection(actionData.output.schema, "output")
        : 'This Card has no output.'
    
    // Build the section with optional description
    let section = `### ${title}\n\n`
    
    if (description) {
        section += `${description}\n\n`
    }
    
    section += `**Input**:\n\n${inputSection}\n\n**Output**:\n\n${outputSection}\n\n`
    
    return section
}

function generateTriggerSection(eventName, eventData) {
    const title = eventData.title || capitalize(eventName)
    const description = preserveEscaping(eventData.description || '')
    
    // Generate payload section
    let payloadSection
    if (eventData.schema?.properties && Object.keys(eventData.schema.properties).length > 0) {
        const required = eventData.schema.required || []
        const fields = Object.entries(eventData.schema.properties)
            .map(([name, field]) => generateResponseField(name, field, required))
            .join('\n')
        
        payloadSection = `  <ResponseField
    name="payload"
    type="object"
  >
    ${preserveEscaping(eventData.schema.description || 'The event payload data')}

    <Expandable>
${fields}
    </Expandable>
  </ResponseField>`
    } else {
        payloadSection = `  <ResponseField
    name="payload"
    type="object"
  >
    This Trigger has no payload.
  </ResponseField>`
    }
    
    // Build the section with optional description
    let section = `### ${title}\n\n`
    
    if (description) {
        section += `${description}\n\n`
    }
    
    section += `${payloadSection}\n\n`
    
    return section
}

function generateCardDocumentation(integrationName, actions) {
    let mdxContent = `{/* This file is auto-generated. Do not edit directly. */}
{/* vale off */}

Here's a reference for all [Cards](/learn/reference/cards/) available with the integration:

`
    
    // Generate action sections
    for (const [actionName, actionData] of Object.entries(actions)) {
        mdxContent += generateActionSection(actionName, actionData)
    }
    
    // Add vale on comment at the end
    mdxContent += '\n{/* vale on */}'
    
    return mdxContent
}

function generateTriggerDocumentation(integrationName, events) {
    let mdxContent = `{/* This file is auto-generated. Do not edit directly. */}
{/* vale off */}

Here's a reference for all [Triggers](/learn/reference/triggers/) available with the integration:

`
    
    // Generate trigger sections
    for (const [eventName, eventData] of Object.entries(events)) {
        mdxContent += generateTriggerSection(eventName, eventData)
    }
    
    // Add vale on comment at the end
    mdxContent += '\n{/* vale on */}'
    
    return mdxContent
}

async function writeReferenceFiles(integrations) {
    // Get the directory of the current script
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)
    
    // Create the paths to the cards and triggers directories
    const cardsDir = join(__dirname, '../../snippets/integrations/cards')
    const triggersDir = join(__dirname, '../../snippets/integrations/triggers')
    
    const updatedCards = []
    const newCards = []
    const updatedTriggers = []
    const newTriggers = []
    
    for (const [integrationName, integrationData] of Object.entries(integrations)) {
        const { actions: integrationActions, events: integrationEvents, workspace } = integrationData
        
        // Sanitize integration name for file system (replace slashes with hyphens)
        const sanitizedName = integrationName.replace(/\//g, '-')
        
        // Handle Cards documentation
        if (integrationActions && Object.keys(integrationActions).length > 0) {
            // Create workspace subdirectory for cards
            const cardsWorkspaceDir = join(cardsDir, workspace)
            if (!existsSync(cardsWorkspaceDir)) {
                mkdirSync(cardsWorkspaceDir, { recursive: true })
            }
            
            // Generate new card content
            const cardFilePath = join(cardsWorkspaceDir, `${sanitizedName}.mdx`)
            const newCardContent = generateCardDocumentation(integrationName, integrationActions)
            
            // Check if file exists and content has changed
            const cardFileExisted = fileExists(cardFilePath)
            let cardHasChanged = true
            
            if (cardFileExisted) {
                try {
                    const existingContent = readFileSync(cardFilePath, 'utf8')
                    const existingHash = getFileHash(existingContent)
                    const newHash = getFileHash(newCardContent)
                    cardHasChanged = existingHash !== newHash
                } catch (error) {
                    console.log(`⚠️  Could not read existing card file ${cardFilePath}, treating as new`)
                    cardHasChanged = true
                }
            }
            
            if (cardHasChanged || !cardFileExisted) {
                writeFileSync(cardFilePath, newCardContent, 'utf8')
                
                const actionCount = Object.keys(integrationActions).length
                if (!cardFileExisted) {
                    newCards.push(integrationName)
                    console.log(`🆕 Created ${workspace}/${sanitizedName}.mdx with ${actionCount} cards`)
                } else {
                    updatedCards.push(integrationName)
                    console.log(`✅ Updated ${workspace}/${sanitizedName}.mdx with ${actionCount} cards`)
                }
            } else {
                console.log(`⏭️  No changes for cards ${workspace}/${sanitizedName}.mdx`)
            }
        }
        
        // Handle Triggers documentation
        if (integrationEvents && Object.keys(integrationEvents).length > 0) {
            // Create workspace subdirectory for triggers
            const triggersWorkspaceDir = join(triggersDir, workspace)
            if (!existsSync(triggersWorkspaceDir)) {
                mkdirSync(triggersWorkspaceDir, { recursive: true })
            }
            
            // Generate new trigger content
            const triggerFilePath = join(triggersWorkspaceDir, `${sanitizedName}.mdx`)
            const newTriggerContent = generateTriggerDocumentation(integrationName, integrationEvents)
            
            // Check if file exists and content has changed
            const triggerFileExisted = fileExists(triggerFilePath)
            let triggerHasChanged = true
            
            if (triggerFileExisted) {
                try {
                    const existingContent = readFileSync(triggerFilePath, 'utf8')
                    const existingHash = getFileHash(existingContent)
                    const newHash = getFileHash(newTriggerContent)
                    triggerHasChanged = existingHash !== newHash
                } catch (error) {
                    console.log(`⚠️  Could not read existing trigger file ${triggerFilePath}, treating as new`)
                    triggerHasChanged = true
                }
            }
            
            if (triggerHasChanged || !triggerFileExisted) {
                writeFileSync(triggerFilePath, newTriggerContent, 'utf8')
                
                const eventCount = Object.keys(integrationEvents).length
                if (!triggerFileExisted) {
                    newTriggers.push(integrationName)
                    console.log(`🆕 Created ${workspace}/${sanitizedName}.mdx with ${eventCount} triggers`)
                } else {
                    updatedTriggers.push(integrationName)
                    console.log(`✅ Updated ${workspace}/${sanitizedName}.mdx with ${eventCount} triggers`)
                }
            } else {
                console.log(`⏭️  No changes for triggers ${workspace}/${sanitizedName}.mdx`)
            }
        }
    }
    
    return { 
        updatedCards, 
        newCards, 
        updatedTriggers, 
        newTriggers 
    }
}

async function main() {
    try {
        console.log('🔍 Fetching all integrations from Botpress...')
        const allIntegrations = await getIntegrations()
        
        console.log('🔧 Filtering Botpress and Plus integrations...')
        const bpIntegrations = filterIntegrations(allIntegrations)
        
        console.log('📥 Fetching Cards and Triggers for all filtered integrations...')
        const integrations = await getIntegrationData(bpIntegrations)
        
        if (Object.keys(integrations).length === 0) {
            console.log('⚠️  No integrations with Cards or Triggers found.')
            await setGitHubOutput('has_updates', 'false')
            await setGitHubOutput('has_card_updates', 'false')
            await setGitHubOutput('has_trigger_updates', 'false')
            return
        }
        
        console.log('💾 Generating reference documentation files...')
        const { updatedCards, newCards, updatedTriggers, newTriggers } = await writeReferenceFiles(integrations)
        
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
            
            console.log(`🎉 Successfully updated ${totalUpdates} integration documentation files!`)
            if (hasCardUpdates) {
                console.log(`   📄 Cards: ${totalCardUpdates} files updated`)
            }
            if (hasTriggerUpdates) {
                console.log(`   ⚡ Triggers: ${totalTriggerUpdates} files updated`)
            }
            console.log('Changes Summary:')
            console.log(changesSummary)
        } else {
            await setGitHubOutput('has_updates', 'false')
            await setGitHubOutput('has_card_updates', 'false')
            await setGitHubOutput('has_trigger_updates', 'false')
            console.log('✨ All integration documentation files are up to date!')
        }
        
    } catch (error) {
        console.error('❌ Error:', error)
        await setGitHubOutput('has_updates', 'false')
        process.exit(1)
    }
}

void main()
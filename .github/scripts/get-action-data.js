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

async function getActions(bpIntegrations) {
    let allActions = {}

    if (!bpIntegrations) {
        return {}
    }

    for (const [name, integrationData] of Object.entries(bpIntegrations)) {
        const currentIntegration = await client.getPublicIntegrationById({id: integrationData.id})
        const currentActions = currentIntegration.integration.actions
        
        // Only include integrations that have actual actions
        if (currentActions && Object.keys(currentActions).length > 0) {
            allActions = {
                ...allActions,
                [name]: {
                    actions: currentActions,
                    workspace: integrationData.workspace
                }
            }
        } else {
            console.log(`⏭️  Skipping ${name} - no Cards found`)
        }
    }

    return allActions
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

function generateActionDocumentation(integrationName, actions) {
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

async function writeReferenceFiles(actions) {
    // Get the directory of the current script
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)
    
    // Create the path to the cards directory
    const cardsDir = join(__dirname, '../../snippets/integrations/cards')
    
    const updatedIntegrations = []
    const newIntegrations = []
    
    for (const [integrationName, integrationData] of Object.entries(actions)) {
        const { actions: integrationActions, workspace } = integrationData
        
        // Create workspace subdirectory
        const workspaceDir = join(cardsDir, workspace)
        if (!existsSync(workspaceDir)) {
            mkdirSync(workspaceDir, { recursive: true })
        }
        
        // Sanitize integration name for file system (replace slashes with hyphens)
        const sanitizedName = integrationName.replace(/\//g, '-')
        
        // Generate new content
        const refFilePath = join(workspaceDir, `${sanitizedName}.mdx`)
        const newContent = generateActionDocumentation(integrationName, integrationActions)
        
        // Check if file exists and content has changed
        const fileExisted = fileExists(refFilePath)
        let hasChanged = true
        
        if (fileExisted) {
            try {
                const existingContent = readFileSync(refFilePath, 'utf8')
                const existingHash = getFileHash(existingContent)
                const newHash = getFileHash(newContent)
                hasChanged = existingHash !== newHash
            } catch (error) {
                console.log(`⚠️  Could not read existing file ${refFilePath}, treating as new`)
                hasChanged = true
            }
        }
        
        if (hasChanged || !fileExisted) {
            writeFileSync(refFilePath, newContent, 'utf8')
            
            const actionCount = Object.keys(integrationActions).length
            if (!fileExisted) {
                newIntegrations.push(integrationName)
                console.log(`🆕 Created ${workspace}/${sanitizedName}.mdx with ${actionCount} cards`)
            } else {
                updatedIntegrations.push(integrationName)
                console.log(`✅ Updated ${workspace}/${sanitizedName}.mdx with ${actionCount} cards`)
            }
        } else {
            console.log(`⏭️  No changes for ${workspace}/${sanitizedName}.mdx`)
        }
    }
    
    return { updatedIntegrations, newIntegrations }
}

async function main() {
    try {
        console.log('🔍 Fetching all integrations from Botpress...')
        const allIntegrations = await getIntegrations()
        
        console.log('🔧 Filtering Botpress and Plus integrations...')
        const bpIntegrations = filterIntegrations(allIntegrations)
        
        console.log('📥 Fetching Cards for all filtered integrations...')
        const actions = await getActions(bpIntegrations)
        
        if (Object.keys(actions).length === 0) {
            console.log('⚠️  No integrations with Cards found.')
            await setGitHubOutput('has_updates', 'false')
            return
        }
        
        console.log('💾 Generating reference documentation files...')
        const { updatedIntegrations, newIntegrations } = await writeReferenceFiles(actions)
        
        const totalUpdates = updatedIntegrations.length + newIntegrations.length
        const hasUpdates = totalUpdates > 0
        
        if (hasUpdates) {
            const changesSummary = [
                updatedIntegrations.length > 0 ? `Updated: ${updatedIntegrations.join(', ')}` : '',
                newIntegrations.length > 0 ? `New: ${newIntegrations.join(', ')}` : ''
            ].filter(Boolean).join('\n')
            
            const allUpdatedIntegrations = [...updatedIntegrations, ...newIntegrations].join(', ')
            
            await setGitHubOutput('has_updates', 'true')
            await setGitHubOutput('changes_summary', changesSummary)
            await setGitHubOutput('updated_integrations', allUpdatedIntegrations)
            
            console.log(`🎉 Successfully updated ${totalUpdates} integration card files!`)
            console.log('Changes Summary:')
            console.log(changesSummary)
        } else {
            await setGitHubOutput('has_updates', 'false')
            console.log('✨ All integration card files are up to date!')
        }
        
    } catch (error) {
        console.error('❌ Error:', error)
        await setGitHubOutput('has_updates', 'false')
        process.exit(1)
    }
}

void main()
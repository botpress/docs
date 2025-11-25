import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

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
    
    // Handle type display with multiple types and enums
    let typeDisplay = 'string' // default
    let enumOptions = null
    
    if (field.type) {
        if (Array.isArray(field.type)) {
            // Multiple types - join with " | "
            typeDisplay = field.type.join(' | ')
        } else {
            typeDisplay = field.type
        }
    }
    
    // Handle anyOf/oneOf for multiple types
    if (field.anyOf || field.oneOf) {
        const schemas = field.anyOf || field.oneOf
        const types = schemas.map(schema => {
            if (schema.type === 'null') return 'null'
            return schema.type || 'string'
        })
        typeDisplay = types.join(' | ')
    }
    
    // Handle format
    if (field.format && !field.enum) {
        typeDisplay = `${typeDisplay} (${field.format})`
    }
    
    // Handle enums - use enum<type> format
    if (field.enum) {
        const baseType = field.type || 'string'
        typeDisplay = `enum<${baseType}>`
        enumOptions = field.enum
    }
    
    const requiredProp = isRequired ? '\n    required' : ''
    let defaultProp = ''
    if (field.default !== undefined) {
        if (typeof field.default === 'string') {
            defaultProp = `\n    default="${field.default}"`
        } else {
            defaultProp = `\n    default={${JSON.stringify(field.default)}}`
        }
    }
    let description = preserveEscaping(field.description || '')
    
    // Add enum options to description if present
    if (enumOptions) {
        const formattedOptions = enumOptions.map(option => `\`${option}\``).join(', ')
        const enumText = `\n\nAvailable options: ${formattedOptions}`
        description = description ? description + enumText : enumText.trim()
    }
    
    let fieldContent = `  <ResponseField
    name="${name}"
    type="${typeDisplay}"${requiredProp}${defaultProp}
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
            let tabContent = ''
            
            schemas.forEach((schema, index) => {
                if (schema.properties) {
                    const schemaRequired = schema.required || []
                    const schemaFields = Object.entries(schema.properties)
                        .map(([nestedName, nestedField]) => generateResponseField(nestedName, nestedField, schemaRequired))
                        .join('\n')
                    
                    if (schemaFields) {
                        const tabTitle = schema.properties.type?.const 
                            ? schema.properties.type.const
                            : `Option ${index + 1}`
                        tabContent += `\n    <Tab title="${tabTitle}">
      <Expandable>
${schemaFields}
      </Expandable>
    </Tab>`
                    }
                }
            })
            
            if (tabContent) {
                arrayItemContent = `\n\n    <Tabs>${tabContent}\n    </Tabs>`
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
    
    // Generate input section wrapped in ResponseField
    let inputSection = ''
    if (actionData.input?.schema?.properties && Object.keys(actionData.input.schema.properties).length > 0) {
        const required = actionData.input.schema.required || []
        const fields = Object.entries(actionData.input.schema.properties)
            .map(([name, field]) => generateResponseField(name, field, required))
            .join('\n')
        
        const inputDescription = preserveEscaping(actionData.input.schema.description || '')
        const descriptionSection = inputDescription ? `    ${inputDescription}\n\n` : ''
        
        inputSection = `  <ResponseField
    name="input"
    type="object"
  >
${descriptionSection}    <Expandable>
${fields}
    </Expandable>
  </ResponseField>`
    } else {
        inputSection = `  <ResponseField
    name="input"
    type="object"
  >
    This Card has no input fields.
  </ResponseField>`
    }
    
    // Generate output section wrapped in ResponseField
    let outputSection = ''
    if (actionData.output?.schema?.properties && Object.keys(actionData.output.schema.properties).length > 0) {
        const required = actionData.output.schema.required || []
        const fields = Object.entries(actionData.output.schema.properties)
            .map(([name, field]) => generateResponseField(name, field, required))
            .join('\n')
        
        const outputDescription = preserveEscaping(actionData.output.schema.description || '')
        const descriptionSection = outputDescription ? `    ${outputDescription}\n\n` : ''
        
        outputSection = `  <ResponseField
    name="output"
    type="object"
  >
${descriptionSection}    <Expandable>
${fields}
    </Expandable>
  </ResponseField>`
    } else {
        outputSection = `  <ResponseField
    name="output"
    type="object"
  >
    This Card has no output.
  </ResponseField>`
    }
    
    // Build the section with optional description
    let section = `### ${title}\n\n`
    
    if (description) {
        section += `${description}\n\n`
    }
    
    section += `${inputSection}\n\n${outputSection}\n\n`
    
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
    ${preserveEscaping(eventData.schema.description || '')}

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

Here's a reference for all [Cards](/studio/concepts/cards/introduction) available with the integration:

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

Here's a reference for all [Triggers](/studio/concepts/triggers/) available with the integration:


<Tip>
You can access data returned from any of these Triggers by reading \`event.payload\` after the Trigger fires.
</Tip>


`
    
    // Generate trigger sections
    for (const [eventName, eventData] of Object.entries(events)) {
        mdxContent += generateTriggerSection(eventName, eventData)
    }
    
    // Add vale on comment at the end
    mdxContent += '\n{/* vale on */}'
    
    return mdxContent
}

/**
 * Update the versions.mdx file with new integration version data
 * @param {string} integrationName - The name of the integration
 * @param {string} version - The version string
 * @param {string} id - The integration version ID
 * @param {string} [baseDir] - Base directory for the script (defaults to current script's directory)
 */
async function updateVersionsFile(integrationName, version, id, baseDir = null) {
    // Get the directory of the current script or use provided baseDir
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = baseDir || dirname(__filename)
    
    // Path to versions.mdx file
    const versionsFilePath = join(__dirname, '../../../snippets/integrations/versions.mdx')
    
    if (!existsSync(versionsFilePath)) {
        console.log(`versions.mdx file not found at ${versionsFilePath}`)
        return false
    }
    
    try {
        // Read and evaluate the versions.mdx file to get the integrationVersions object
        const fileContent = readFileSync(versionsFilePath, 'utf8')
        
        // Extract the integrationVersions object from the file content
        // The file exports: export const integrationVersions = { ... }
        const match = fileContent.match(/export const integrationVersions = ({[\s\S]*})/m)
        if (!match) {
            throw new Error('Could not find integrationVersions export in versions.mdx')
        }
        
        // Parse the JSON object
        const integrationVersions = JSON.parse(match[1])
        
        // Check if this is an update or new entry
        const isUpdate = integrationVersions.hasOwnProperty(integrationName)
        
        // Update the object
        integrationVersions[integrationName] = {
            version: version,
            id: id
        }
        
        // Generate the new file content
        const newContent = `export const integrationVersions = ${JSON.stringify(integrationVersions, null, 2)}\n`
        
        // Write the updated content back to the file
        writeFileSync(versionsFilePath, newContent, 'utf8')
        
        if (isUpdate) {
            console.log(`Updated ${integrationName} version (${version})...`)
        } else {
            console.log(`Added ${integrationName} version (${version})...`)
        }
        
        return true
        
    } catch (error) {
        console.error(`Error updating version for ${integrationName}:`, error.message)
        return false
    }
}

/**
 * Process a single integration's cards and triggers, generating documentation files
 * @param {string} integrationName - The name of the integration
 * @param {Object} integrationData - The integration data containing actions, events, and workspace
 * @param {string} [baseDir] - Base directory for the script (defaults to current script's directory)
 * @returns {Object} Result object with update information
 */
export async function processIntegration(integrationName, integrationData, baseDir = null) {
    // Get the directory of the current script or use provided baseDir
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = baseDir || dirname(__filename)
    
    // Create the paths to the cards and triggers directories
    const cardsDir = join(__dirname, '../../../snippets/integrations/cards')
    const triggersDir = join(__dirname, '../../../snippets/integrations/triggers')
    
    const result = {
        cards: { updated: false, isNew: false, count: 0 },
        triggers: { updated: false, isNew: false, count: 0 }
    }
    
    const { actions: integrationActions, events: integrationEvents, workspace, version, id } = integrationData
    
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
                console.log(`Could not read existing card file ${cardFilePath}, treating as new...`)
                cardHasChanged = true
            }
        }
        
        if (cardHasChanged || !cardFileExisted) {
            writeFileSync(cardFilePath, newCardContent, 'utf8')
            
            const actionCount = Object.keys(integrationActions).length
            result.cards.updated = true
            result.cards.isNew = !cardFileExisted
            result.cards.count = actionCount
            
            if (!cardFileExisted) {
                console.log(`Created ${sanitizedName} Cards reference...`)
            } else {
                console.log(`Updated ${sanitizedName} Cards reference...`)
            }
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
                console.log(`Could not read existing trigger file ${triggerFilePath}, treating as new...`)
                triggerHasChanged = true
            }
        }
        
        if (triggerHasChanged || !triggerFileExisted) {
            writeFileSync(triggerFilePath, newTriggerContent, 'utf8')
            
            const eventCount = Object.keys(integrationEvents).length
            result.triggers.updated = true
            result.triggers.isNew = !triggerFileExisted
            result.triggers.count = eventCount
            
            if (!triggerFileExisted) {
                console.log(`Created ${sanitizedName} Triggers reference...`)
            } else {
                console.log(`Updated ${sanitizedName} Triggers reference...`)
            }
        }
    }
    
    // Update versions.mdx file if we have version and id information
    if (version && id && (result.cards.updated || result.triggers.updated)) {
        const versionUpdated = await updateVersionsFile(integrationName, version, id, baseDir)
        if (versionUpdated) {
            result.versionUpdated = true
        }
    }
    
    return result
}

/**
 * Process multiple integrations' cards and triggers
 * @param {Object} integrations - Object with integration names as keys and integration data as values
 * @param {string} [baseDir] - Base directory for the script (defaults to current script's directory)
 * @returns {Object} Summary of all updates
 */
export async function processIntegrations(integrations, baseDir = null) {
    const updatedCards = []
    const newCards = []
    const updatedTriggers = []
    const newTriggers = []
    
    for (const [integrationName, integrationData] of Object.entries(integrations)) {
        const result = await processIntegration(integrationName, integrationData, baseDir)
        
        if (result.cards.updated) {
            if (result.cards.isNew) {
                newCards.push(integrationName)
            } else {
                updatedCards.push(integrationName)
            }
        }
        
        if (result.triggers.updated) {
            if (result.triggers.isNew) {
                newTriggers.push(integrationName)
            } else {
                updatedTriggers.push(integrationName)
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

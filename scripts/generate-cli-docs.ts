import * as fs from 'fs'
import * as path from 'path'

// Import from the CLI package
// Note: These imports rely on the internal structure of @botpress/cli
// and may break if the internal structure changes
let commandDefinitions: any
let config: any

try {
  // Try to import from node_modules first (when package is installed)
  commandDefinitions = require('@botpress/cli/src/command-definitions').default
  config = require('@botpress/cli/src/config')
} catch {
  // Fallback to relative path for development
  try {
    commandDefinitions = require('../botpress/packages/cli/src/command-definitions').default
    config = require('../botpress/packages/cli/src/config')
  } catch (error) {
    console.error('Failed to import CLI modules:', error)
    console.error('Make sure @botpress/cli is installed or the botpress repo is available at ../botpress')
    process.exit(1)
  }
}

/**
 * Generate markdown documentation for CLI commands
 */
function generateCliDocs(): string {
  const markdown: string[] = []
  
  // Header
  markdown.push('---')
  markdown.push('title: CLI Reference (Auto-generated)')
  markdown.push('description: All commands and flags available with the Botpress CLI. This file is auto-generated.')
  markdown.push('---')
  markdown.push('')
  markdown.push('<Warning>')
  markdown.push('This documentation is auto-generated. Do not edit manually. Run `npx ts-node scripts/generate-cli-docs.ts` to regenerate.')
  markdown.push('</Warning>')
  markdown.push('')
  
  // Global flags section
  markdown.push('## Global flags')
  markdown.push('')
  markdown.push('These flags are available for all commands:')
  markdown.push('')
  markdown.push('| Flag | Alias | Description |')
  markdown.push('|------|-------|-------------|')
  markdown.push('| `--verbose` | `-v` | Enable verbose logging |')
  markdown.push('| `--confirm` | `-y` | Confirm all prompts |')
  markdown.push('| `--json` | | Output raw JSON to stdout (useful for piping) |')
  markdown.push('| `--botpress-home` | | Path to Botpress home directory |')
  markdown.push('| `--profile` | `-p` | CLI profile from $BP_BOTPRESS_HOME/profiles.json |')
  markdown.push('')
  
  // Commands section
  markdown.push('## Commands')
  markdown.push('')
  
  // Generate documentation for each command
  generateCommandDocs(commandDefinitions, [], markdown)
  
  return markdown.join('\n')
}

/**
 * Recursively generate documentation for commands
 */
function generateCommandDocs(commands: any, commandPath: string[], markdown: string[]): void {
  for (const [commandName, commandDef] of Object.entries(commands)) {
    const fullPath = [...commandPath, commandName]
    const commandString = fullPath.join(' ')
    
    if ((commandDef as any).subcommands) {
      // This is a command group
      markdown.push(`### \`${commandString}\``)
      markdown.push('')
      markdown.push((commandDef as any).description || `${commandName} related commands`)
      markdown.push('')
      
      // Generate docs for subcommands
      generateCommandDocs((commandDef as any).subcommands, fullPath, markdown)
    } else {
      // This is a leaf command
      markdown.push(`### \`${commandString}\``)
      markdown.push('')
      
      if ((commandDef as any).description) {
        let description = (commandDef as any).description
        if ((commandDef as any).alias) {
          description += `. Alias: \`${(commandDef as any).alias}\``
        }
        markdown.push(description)
        markdown.push('')
      }
      
      // Generate usage examples
      markdown.push('**Usage:**')
      markdown.push('```bash')
      markdown.push(`bp ${commandString}`)
      
      // Add usage example with common flags if available
      const schema = (commandDef as any).schema || {}
      const commonFlags = Object.entries(schema)
        .filter(([key, option]: [string, any]) => !option.positional && ['string', 'number'].includes(option.type))
        .slice(0, 2) // Show max 2 example flags
        .map(([key, option]: [string, any]) => {
          const exampleValue = option.type === 'string' ? 'value' : '8080'
          return `--${key} ${exampleValue}`
        })
      
      if (commonFlags.length > 0) {
        markdown.push(`bp ${commandString} ${commonFlags.join(' ')}`)
      }
      
      markdown.push('```')
      markdown.push('')
      
      // Generate options table
      if (schema && Object.keys(schema).length > 0) {
        markdown.push('| Flag | Description | Default |')
        markdown.push('|------|-------------|---------|')
        
        for (const [optionName, option] of Object.entries(schema)) {
          if ((option as any).positional) continue // Skip positional arguments for now
          
          const flagName = `--${optionName.replace(/([A-Z])/g, '-$1').toLowerCase()}`
          const description = (option as any).description || 'No description available'
          const defaultValue = (option as any).default !== undefined ? 
            (typeof (option as any).default === 'string' ? (option as any).default : JSON.stringify((option as any).default)) : 
            ''
          
          markdown.push(`| \`${flagName}\` | ${description} | ${defaultValue} |`)
        }
        
        markdown.push('')
      }
      
      markdown.push('---')
      markdown.push('')
    }
  }
}

/**
 * Main function to generate and write CLI documentation
 */
function main(): void {
  try {
    console.log('Generating CLI documentation...')
    
    const markdown = generateCliDocs()
    const outputPath = path.join(__dirname, '../for-developers/sdk/cli-reference-generated.mdx')
    
    // Ensure directory exists
    const outputDir = path.dirname(outputPath)
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }
    
    // Write the generated documentation
    fs.writeFileSync(outputPath, markdown, 'utf8')
    
    console.log(`CLI documentation generated successfully at: ${outputPath}`)
    console.log(`Generated ${markdown.split('\n').length} lines of documentation`)
    
    // Count commands for summary
    const commandCount = countCommands(commandDefinitions)
    console.log(`Documented ${commandCount} commands`)
    
  } catch (error) {
    console.error('Error generating CLI documentation:', error)
    process.exit(1)
  }
}

/**
 * Count total number of leaf commands
 */
function countCommands(commands: any): number {
  let count = 0
  for (const [commandName, commandDef] of Object.entries(commands)) {
    if ((commandDef as any).subcommands) {
      count += countCommands((commandDef as any).subcommands)
    } else {
      count++
    }
  }
  return count
}

main()

import fs from 'fs/promises'

function filterIntegrations(integrations) {
        return integrations
                .filter(integration => integration.ownerWorkspace.handle === "botpress")
                .map(({ id, title, description, updatedAt, version }) => ({
                        id,
                        title,
                        description,
                        updatedAt,
                        version
                }));
}

async function getIntegrationsList() {
        const baseUrl = 'https://api.botpress.cloud/v1/admin/hub/integrations';
        const options = {
                method: 'GET',
                headers: {
                        Authorization: '',
                        'x-workspace-id': ''
                },
                body: undefined
        };

        const allIntegrations = [];
        let nextToken = null;

        try {
                do {
                        // Build URL with pagination parameters
                        const urlParams = new URLSearchParams({
                                version: 'latest',
                                limit: '100'
                        });

                        if (nextToken) {
                                urlParams.append('nextToken', nextToken);
                        }

                        const url = `${baseUrl}?${urlParams.toString()}`;
                        console.log(`Fetching: ${url}`);

                        const response = await fetch(url, options);
                        const data = await response.json();

                        // Add integrations from this page to our collection
                        if (data.integrations && Array.isArray(data.integrations)) {
                                allIntegrations.push(...data.integrations);
                                console.log(`Fetched ${data.integrations.length} integrations (total: ${allIntegrations.length})`);
                        }

                        // Check if there's a next page
                        nextToken = data.meta?.nextToken || null;

                } while (nextToken);

                const botpressIntegrations = filterIntegrations(allIntegrations)

                // Write botpressIntegrations to a JSON file at the root of the project
                await fs.writeFile('botpress-integrations.json', JSON.stringify(botpressIntegrations, null, 2));
                console.log('Saved botpress-integrations.json');

                console.log(`Total Botpress integrations collected: ${botpressIntegrations.length}`);
                return botpressIntegrations


        } catch (error) {
                console.error('Error fetching integrations:', error);
                throw error;
        }
}

async function getIntegrationData(integrationId) {
        const url = `https://api.botpress.cloud/v1/admin/hub/integrations/${integrationId}`;
        const options = {
                method: 'GET',
                headers: {
                        Authorization: '',
                        'x-workspace-id': ''
                }
        };
        try {
                const response = await fetch(url, options);
                const data = await response.json();
                return data
        } catch (error) {
                console.error(error);
        }
}

function uncamelCase(str) {
        return str
                .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
                .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
                .replace(/^./, s => s.toUpperCase());
}

function createPropertiesReference(property, propKey) {
        const reference = `
\t<ResponseField name=\"${propKey}\" type=\"${property.type || ""}\">\n\t${property.description || ""}\n</ResponseField>\n
`
        return reference
}

async function writeToFile(integrationData) {
        const HEADER = `/** THIS FILE WAS AUTOMATICALLY GENERATED */`.trim();
        const headerLine = `The following [Cards](/learn/reference/cards/introduction) are available with the ${uncamelCase(integrationData.integration.title)} integration:\n\n`;
        const content = `
${headerLine}${Object.keys(integrationData.integration.actions)
                        .map(key => {
                                const action = integrationData.integration.actions[key];
                                let result = `### ${uncamelCase(action.title || key)}\n\n`;
                                if (action.description) {
                                        result += `${action.description}\n\n`
                                }

                                result += "**Input fields**:\n\n";

                                // Add input fields if schema and properties exist
                                if (action.input.schema.properties && Object.keys(action.input.schema.properties).length > 0) {
                                        const properties = Object.keys(action.input.schema.properties).map(propKey => {
                                                const property = action.input.schema.properties[propKey];
                                                const title = uncamelCase(property.title || property["x-zui"]?.title || propKey);
                                                const description = property.description?.trim();
                                                if (description) {
                                                        return `- **${title}**: ${description}`;
                                                } else {
                                                        return `- **${title}**`;
                                                }
                                        });
                                        result += properties.join('\n');
                                } else result += "This Card has no input fields.";

                                result += "\n\n**Output**:\n\n";

                                if (action.output.schema.properties && Object.keys(action.output.schema.properties).length > 0) {
                                        result += `\n\n<Expandable title=\"properties\">\n`
                                        const properties = Object.keys(action.output.schema.properties).map(propKey => {
                                                const property = action.output.schema.properties[propKey];
                                                const title = uncamelCase(property.title || property["x-zui"]?.title || propKey);
                                                const description = property.description?.trim();
                                                return `${createPropertiesReference(property, propKey)}`;
                                        });
                                        result += properties.join('\n');
                                        result += `</Expandable>`
                                } else result += "This Card has no output.";

                                return result;
                        })
                        .join('\n\n')}
`.trim();

        await fs.writeFile(`snippets/integration-cards/${integrationData.integration.name}.mdx`, content)
}

async function main() {
        const botpressIntegrations = await getIntegrationsList();

        console.log(`Processing ${botpressIntegrations.length} integrations...`);

        for (const integration of botpressIntegrations) {
                console.log(`Fetching data for integration: ${integration.title} (${integration.id})`);
                try {
                        const integrationData = await getIntegrationData(integration.id);
                        console.log(`Successfully fetched data for ${integration.title}`);
                        if (integrationData.integration.actions && Object.keys(integrationData.integration.actions).length > 0) {
                                await writeToFile(integrationData);
                        }

                } catch (error) {
                        console.error(`Failed to fetch data for ${integration.title}:`, error);
                }
        }

        console.log('Finished processing all integrations');
}

main();
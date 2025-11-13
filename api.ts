import { readFile, mkdir, writeFile } from 'fs/promises'

const loadOpenApi = async (filename: string) => {
  const content = await readFile(filename, 'utf8')
  return JSON.parse(content)
}

const generateDocs = async (folder: string, api: any, openapiFilename: string, absolutePath: string) => {
  const docs: string[] = []

  await mkdir(folder, { recursive: true })

  for (const [path, value] of Object.entries(api.paths)) {
    for (const [method, endpoint] of Object.entries(value as any)) {
      const operation = (endpoint as any).operationId
      await writeFile(`${folder}/${operation}.mdx`, `---\ntitle: ${operation}\nopenapi: ${openapiFilename} ${method.toUpperCase()} ${path}\n---\n`)
      docs.push(`${absolutePath}/${operation}`)
    }
  }

  console.log(JSON.stringify(docs, null, 2))
}

const main = async () => {
  const chatApi = await loadOpenApi('./chat-openapi.json')
  await generateDocs('./api-reference/chat-api/openapi', chatApi, '/chat-openapi.json', '/api-reference/chat-api/openapi')
}

void main()

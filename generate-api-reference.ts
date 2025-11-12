import { runtimeApi, adminApi, tablesApi, filesApi } from '@botpress/api'
import { readFile, writeFile } from 'node:fs/promises'
import fs from 'node:fs'
import path from 'node:path'

const OUTPUT_DIR = './gen-openapi'
const X_HIDDEN = 'x-hidden'
const X_MINT = 'x-mint'
const EXPERIMENTAL_CALLOUT = '<Tip>This is an experimental feature and may change in future versions.</Tip'

type Operation = {
  operationId?: string
  tags?: string[]
  deprecated?: boolean
  [X_HIDDEN]?: boolean
  [X_MINT]?: {
    metadata: {
      title: string
    }
  }
  description?: string
}

const postProcessOperation = (operation: Operation) => {
  if (operation.operationId) {
    operation[X_MINT] = {
      metadata: {
        title: operation.operationId
      }
    }
  }
  if (!operation.tags?.includes('documented')) {
    operation[X_HIDDEN] = true
  } else {
    operation.tags = operation.tags?.filter((tag) => tag !== 'documented')
  }
  if (operation.tags?.includes('expermimental')) {
    operation.description = EXPERIMENTAL_CALLOUT + '\n' + (operation.description || '')
    operation.tags = operation.tags?.filter((tag) => tag !== 'expermimental')
  }
  if (operation.tags?.length === 0) {
    delete operation.tags
  }
  return operation
}

const postProcessApi = async (path: string) => {
  let content = await readFile(path, { encoding: 'utf8' })
  const openapi = JSON.parse(content)
  for (const path of Object.keys(openapi['paths'])) {
    for (const verb of Object.keys(openapi['paths'][path])) {
      openapi['paths'][path][verb] = postProcessOperation(openapi['paths'][path][verb])
    }
  }
  content = JSON.stringify(openapi, null, 2)
  await writeFile(path, content, { encoding: 'utf8' })
}

const moveFileAndDeleteFolder = async (sourceFolder: string, destinationFile: string) => {
  const sourceFile = path.join(sourceFolder, 'openapi.json');

  try {
    await fs.promises.access(sourceFile, fs.constants.F_OK);
    await fs.promises.rename(sourceFile, destinationFile);
    await fs.promises.rm(sourceFolder, { recursive: true, force: true });

    console.log(`Moved ${sourceFile} to ${destinationFile} and deleted ${sourceFolder}`);
  } catch (error) {
    console.error('Error moving openapi.json:', error);
    throw error;
  }

}

const main = async () => {
  runtimeApi.exportOpenapi(`${OUTPUT_DIR}/runtime`)
  await moveFileAndDeleteFolder(`${OUTPUT_DIR}/runtime`, './runtime-openapi.json')
  await postProcessApi('./runtime-openapi.json')

  adminApi.exportOpenapi(`${OUTPUT_DIR}/admin`)
  await moveFileAndDeleteFolder(`${OUTPUT_DIR}/admin`, './admin-openapi.json')
  await postProcessApi('./admin-openapi.json')

  tablesApi.exportOpenapi(`${OUTPUT_DIR}/tables`)
  await moveFileAndDeleteFolder(`${OUTPUT_DIR}/tables`, './tables-openapi.json')
  await postProcessApi('./tables-openapi.json')

  filesApi.exportOpenapi(`${OUTPUT_DIR}/files`)
  await moveFileAndDeleteFolder(`${OUTPUT_DIR}/files`, './files-openapi.json')
  await postProcessApi('./files-openapi.json')

  await fs.promises.rm(OUTPUT_DIR, { recursive: true, force: true });
}

void main()

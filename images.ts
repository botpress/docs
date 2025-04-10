import { glob } from 'glob'
import { writeFile } from 'fs/promises'

const images = await glob("**/*.png", { ignore: 'node_modules/**' })

await writeFile('images.mdx', images.map(image => `![](/${image})`).join('\n'))

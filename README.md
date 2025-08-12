# Botpress Documentation

Welcome to the Botpress documentation repository. This project powers the docs site of Botpress, the complete AI Agent platform.

To get started with contributions, please review the entire README.

## Prerequisites

To contribute, install the following software if you haven't already:

- [VS Code](https://code.visualstudio.com), [Cursor](https://cursor.com/agents), or another text editor
- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) package manager
- [Vale](https://vale.sh/) for writing style checks (optional but recommended)

## Getting started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/botpress/docs.git
   cd docs
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Start the development server:**
   ```bash
   mint dev
   ```
   This will start a local Mintlify server at `http://localhost:3000`.

## Project structure

The Botpress documentation is built with [Mintlify](https://mintlify.com/). Here's how the project is organized:

```
docs/
├── docs.json              # Mintlify configuration & navigation
├── home.mdx               # Homepage content
├── learn/                 # Learning materials and guides
├── integrations/          # Integration documentation
├── webchat/              # Webchat-specific docs
├── for-developers/       # Developer-focused content
├── api-reference/        # API documentation
├── snippets/             # Reusable content snippets
├── changelog.mdx         # Product changelog
├── *-openapi.json        # OpenAPI specifications
└── assets/               # Images and other static files
```

## Content guidelines

### MDX

All documentation is written in MDX (Markdown with JSX components). You can find full list of supported components in the [Mintlify documentation](https://mintlify.com/docs/text). 

> [!NOTE]
> 
> If you're using VS Code or Cursor, we recommend also installing the official Mintlify extension. This will enable autocomplete for most Mintlify components.

### Images

- Mintlify supports [responsive light/dark images](https://mintlify.com/docs/image-embeds#light-and-dark-mode-images). If you're using UI screenshots, make sure you include both a light and dark version.
- Wrap all images in Mintlify's [Frame](https://mintlify.com/docs/components/frames) component.
- Include appropriate alt text for all images

If you're using VS Code or Cursor, you can use the snippet at `/.vscode/mdx.code-snippets` for any images.

### Navigation

The `docs.json` file at the root of the repository determines the navigation structure of the documentation. If you're adding new pages, make sure you update `docs.json` to include them.

### Check writing

Botpress uses [Vale](https://vale.sh) to enforce consistent style and branding throughout the documentation. Vale executes on all pull requests in this repository.

You can also run Vale locally using the Vale CLI:

1. [Install Vale](https://vale.sh/docs/install) if you haven't already
2. Download the required packages:

```
vale sync
```

3. Run a writing check against files you've modified:

```
make check-writing
```

> [!NOTE]
>
> You can also download the [official Vale extension for VS Code](https://marketplace.visualstudio.com/items?itemName=ChrisChinchilla.vale-vscode). However, this extension highlights Vale errors across the entire documentation project—not just files you've changed. Because of this, we haven't included it in the repository's recommend extensions.

### Check links

To check for broken links, run:

```
mint broken-links
```

This check also runs on every pull request in the repository.

## Development workflow


### Make a change

1. Fork the repository
2. Create a feature branch: `git checkout -b name/feature/your-improvement`
3. Make your changes following our style guidelines
4. Test your changes locally with `mint dev`
5. Validate writing style with `make check-writing` (if Vale is installed)
6. Check for broken links using `mint broken-links`
7. Submit a pull request with a clear description of your changes
   
### Raise an issue

Use this repository for specific documentation-related issues only. Report any product bugs (or general documentation feedback) via [Discord](https://discord.gg/botpress).

## Support

Join the conversation on our [Discord](https://discord.gg/botpress) server for any other questions related to Botpress—we'd love to hear from you.

Thank you for helping us improve the Botpress documentation!
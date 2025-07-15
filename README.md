# Obsidian Plugin Template (Svelte)

A template for creating Obsidian plugins using Svelte and TypeScript.

## Features & Tech Stack

This template provides a modern development environment for building Obsidian plugins:

- **Frontend Framework**: [Svelte](https://svelte.dev/) for reactive UI components with minimal boilerplate
- **Build System**: [Vite](https://vitejs.dev/) for fast development and optimized builds
- **Styling**: 
  - [Tailwind CSS](https://tailwindcss.com/) v4.x beta for utility-first styling
  - Note: Tailwind classes will NOT override Obsidian's default styles
- **Type Safety**: Full TypeScript support with pre-configured types for Obsidian API
- **Development Experience**:
  - Hot Module Replacement (HMR) for instant feedback
  - Automatic plugin reloading in development vault
  - Built-in development safeguards and verification

## Getting Started

1. **Initial Setup (Required)**
   ```bash
   # Install dependencies
   npm install

   # Run the setup script to configure your plugin
   npm run setup
   ```
   The setup script will prompt you for:
   - Plugin name
   - Description
   - Author name
   - Author URL

   This will automatically:
   - Update package.json with your plugin's name
   - Generate manifest.json with your plugin's metadata

2. **Development**
   ```bash
   npm run dev
   ```
   This will:
   - Create the plugin directory in your development vault
   - Build your plugin in development mode
   - Watch for changes
   - Hot reload the plugin in your development vault (MAKE SURE TO ACTIVATE THE HOT-RELOAD PLUGIN)

3. **Production Build**
   ```bash
   npm run build
   ```
   This creates a production build of your plugin.

## Project Structure

- `src/` - Source code
  - `main.ts` - Plugin entry point
  - `modules/` - Plugin modules and components
- `public/` - Static files
  - `manifest.json` - Plugin manifest (auto-generated)
- `test-vault/` - Development vault for testing

## Development Safeguards

This template includes automatic verification to ensure:
- Setup script has been run before development
- Plugin name consistency across package.json, manifest.json, and plugin directory
- All required plugin metadata is present

If you encounter errors about missing setup or mismatched names, run:
```bash
npm run setup
```

## IDE Setup

[VS Code](https://code.visualstudio.com/) is recommended with the following extensions:
- [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode)
- [TypeScript and JavaScript Language Features](https://marketplace.visualstudio.com/items?itemName=vscode.typescript-language-features)

## FAQ

### Why aren't my Tailwind styles working?
Due to the way Tailwind v4.x beta works, some Tailwind classes will work while others won't, particularly when trying to override default Obsidian styles. This is a known limitation and is being investigated for a potential fix.

### Hot-reloading isn't working
Make sure the Hot-Reload plugin is active in your Obsidian vault. This plugin is required for the development hot-reloading functionality to work properly.

### Something isn't allowing me to turn on my plugin
Restart Obsidian and try activating your plugin again. There are some temporary files that can cause issues with plugin activation.

import { intro, outro, text, group, cancel, log, spinner } from '@clack/prompts';
import fs from 'fs/promises';

async function checkExistingSetup() {
    try {
        const manifest = JSON.parse(await fs.readFile('public/manifest.json', 'utf8'));
        const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));

        // Check if manifest has been customized (not using default values)
        const isManifestCustomized = manifest.id !== 'obsidian-svelte5-template' ||
            manifest.name !== 'Obsidian Svelte 5 Template' ||
            manifest.description !== 'A template for building Obsidian plugins with Svelte 5' ||
            manifest.author !== 'Steven Stavrakis';

        // Check if package name has been changed from default
        const isPackageCustomized = packageJson.name !== 'obsidian-svelte5-template';

        if (isManifestCustomized || isPackageCustomized) {
            log.warn('⚠️  WARNING: Existing Configuration Detected ⚠️');
            log.warn('It appears this plugin has already been set up or manually configured.');
            log.warn('Running this script will overwrite any existing customizations.');

            // Give user a chance to cancel
            const shouldContinue = await text({
                message: 'Do you want to continue? (Type "yes" to proceed)',
                validate: (value) => {
                    if (value.toLowerCase() !== 'yes' && value !== '') {
                        return 'Type "yes" to proceed or press Ctrl+C to cancel';
                    }
                }
            });

            if (shouldContinue.toLowerCase() !== 'yes') {
                cancel('Setup cancelled');
                process.exit(0);
            }
        }
    } catch (err) {
        // If files don't exist, that's fine - it means this is a fresh setup
        if (err.code !== 'ENOENT') {
            throw err;
        }
    }
}

async function setup() {
    await checkExistingSetup();

    intro(`Obsidian Plugin Setup 🚀
This script will help you configure your new Obsidian plugin`);

    const promptGroup = await group(
        {
            displayName: () => text({
                message: 'What is your plugin name?',
                placeholder: 'My Awesome Plugin',
                validate: (value) => {
                    if (value.length === 0) return 'Please enter a name for your plugin';
                    if (value.length < 3) return 'Plugin name must be at least 3 characters long';
                }
            }),

            description: () => text({
                message: 'Plugin description:',
                placeholder: 'A short description of what your plugin does',
                validate: (value) => {
                    if (value.length === 0) return 'Please provide a description of your plugin';
                    if (value.length < 10) return 'Description should be at least 10 characters long';
                }
            }),

            author: () => text({
                message: 'Author name:',
                placeholder: 'Your name',
                validate: (value) => {
                    if (value.length === 0) return 'Please enter your name';
                }
            }),

            authorUrl: () => text({
                message: 'Author URL:',
                placeholder: 'https://github.com/yourusername',
                initialValue: 'https://github.com/',
                validate: (value) => {
                    if (value.length === 0) return 'Please provide your website or GitHub URL';
                    if (!value.startsWith('http://') && !value.startsWith('https://')) {
                        return 'URL must start with http:// or https://';
                    }
                }
            })
        },
        {
            onCancel: () => {
                cancel('Setup cancelled');
                process.exit(0);
            }
        }
    );

    const npmName = promptGroup.displayName
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

    const s = spinner();

    s.start('Updating package.json');
    const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));
    packageJson.name = npmName;
    await fs.writeFile('package.json', JSON.stringify(packageJson, null, 2));
    s.stop('Updated package.json');

    s.start('Generating manifest.json');
    const manifest = {
        id: npmName,
        name: promptGroup.displayName,
        description: promptGroup.description,
        author: promptGroup.author,
        authorUrl: promptGroup.authorUrl,
        version: '1.0.0',
        minAppVersion: '1.0.0',
        isDesktopOnly: true
    };
    await fs.writeFile('public/manifest.json', JSON.stringify(manifest, null, 2));
    s.stop('Generated manifest.json');

    s.start('Renaming development plugin directory');
    const oldPluginPath = 'test-vault/.obsidian/plugins/dev-plugin';
    const newPluginPath = `test-vault/.obsidian/plugins/${npmName}`;
    try {
        await fs.rename(oldPluginPath, newPluginPath);
    } catch (err) {
        // Directory might not exist yet, which is fine
        if (err.code !== 'ENOENT') {
            throw err;
        }
    }
    s.stop('Renamed development plugin directory');

    outro('Setup complete! Your plugin is ready for development. 🎉');

    // Add prominent message about restarting Obsidian
    log.warn('⚠️  IMPORTANT ⚠️');
    log.warn('Please restart Obsidian and re-activate any plugins in the test-vault');
    log.warn('to ensure all changes take effect.');
}

setup().catch((err) => {
    log.error(err);
    process.exit(1);
});

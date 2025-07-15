import { intro, outro, text, group, cancel, log, spinner } from '@clack/prompts';
import fs from 'fs/promises';

async function update() {
    intro(`Obsidian Plugin Update 🔄
This script will help you update your plugin's configuration`);

    // Read current values
    const manifest = JSON.parse(await fs.readFile('public/manifest.json', 'utf8'));
    const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));

    const promptGroup = await group(
        {
            displayName: () => text({
                message: 'Plugin name:',
                placeholder: 'My Awesome Plugin',
                initialValue: manifest.name,
                validate: (value) => {
                    if (value.length === 0) return 'Please enter a name for your plugin';
                    if (value.length < 3) return 'Plugin name must be at least 3 characters long';
                }
            }),

            description: () => text({
                message: 'Plugin description:',
                placeholder: 'A short description of what your plugin does',
                initialValue: manifest.description,
                validate: (value) => {
                    if (value.length === 0) return 'Please provide a description of your plugin';
                    if (value.length < 10) return 'Description should be at least 10 characters long';
                }
            }),

            author: () => text({
                message: 'Author name:',
                placeholder: 'Your name',
                initialValue: manifest.author,
                validate: (value) => {
                    if (value.length === 0) return 'Please enter your name';
                }
            }),

            authorUrl: () => text({
                message: 'Author URL:',
                placeholder: 'https://github.com/yourusername',
                initialValue: manifest.authorUrl || 'https://github.com/',
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
                cancel('Update cancelled');
                process.exit(0);
            }
        }
    );

    const npmName = promptGroup.displayName
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

    // Check if anything changed
    const hasChanges =
        manifest.name !== promptGroup.displayName ||
        manifest.description !== promptGroup.description ||
        manifest.author !== promptGroup.author ||
        manifest.authorUrl !== promptGroup.authorUrl ||
        manifest.id !== npmName ||
        packageJson.name !== npmName;

    if (!hasChanges) {
        log.warn('No changes detected. Configuration remains the same.');
        process.exit(0);
    }

    const s = spinner();

    s.start('Updating package.json');
    packageJson.name = npmName;
    await fs.writeFile('package.json', JSON.stringify(packageJson, null, 2));
    s.stop('Updated package.json');

    s.start('Updating manifest.json');
    manifest.id = npmName;
    manifest.name = promptGroup.displayName;
    manifest.description = promptGroup.description;
    manifest.author = promptGroup.author;
    manifest.authorUrl = promptGroup.authorUrl;
    await fs.writeFile('public/manifest.json', JSON.stringify(manifest, null, 2));
    s.stop('Updated manifest.json');

    s.start('Updating development plugin directory');
    // Get all directories in test-vault/.obsidian/plugins
    const pluginsPath = 'test-vault/.obsidian/plugins';
    try {
        const entries = await fs.readdir(pluginsPath, { withFileTypes: true });
        for (const entry of entries) {
            if (entry.isDirectory() && entry.name !== npmName) {
                // Rename old plugin directory to new name
                await fs.rename(
                    `${pluginsPath}/${entry.name}`,
                    `${pluginsPath}/${npmName}`
                );
                break;
            }
        }
    } catch (err) {
        // Directory might not exist yet, which is fine
        if (err.code !== 'ENOENT') {
            throw err;
        }
    }
    s.stop('Updated development plugin directory');

    outro('Update complete! Your plugin configuration has been updated. 🎉');

    // Add prominent message about restarting Obsidian
    log.warn('⚠️  IMPORTANT ⚠️');
    log.warn('Please restart Obsidian and re-activate any plugins in the test-vault');
    log.warn('to ensure all changes take effect.');
}

update().catch((err) => {
    log.error(err);
    process.exit(1);
});

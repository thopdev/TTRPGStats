import { App, TFile, parseYaml, stringifyYaml } from 'obsidian';


export async function updateProperties(app: App, file: TFile, updates: KeyValue[]) {
    const content = await app.vault.read(file);
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    let frontmatter: Record<string, any> = {};
    let body = content;
    if (match) {
        frontmatter = parseYaml(match[1]) as Record<string, any>;
        body = content.slice(match[0].length);
    }
    for (const [_, keyValue] of Object.entries(updates)) {
        debugger;
        if (keyValue?.value === null || keyValue?.value === undefined) {
            delete frontmatter[keyValue.key];
            continue;
        }
        frontmatter[keyValue.key] = keyValue.value;
    }
    const newContent = `---\n${stringifyYaml(frontmatter)}---\n${body.replace(/^\n+/, '')}`;
    await app.vault.modify(file, newContent);
}



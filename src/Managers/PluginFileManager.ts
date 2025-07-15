import { stringifyYaml, type App, type FrontMatterCache, type TFile } from "obsidian";
import { PluginEvent } from "@src/Events/PluginEvent";
import { TrackerEventModel } from "@src/Events/TrackerEventModel";
import { EmptyPluginEvent } from "@src/Events/EmptyPluginEvent";

export class PluginFileManager {


    private file: TFile;
    private app: App;
    private fileLocks = new Map<string, Promise<void>>();

    public properties: FrontMatterCache;

    public propertyChangedEvent: EmptyPluginEvent = new EmptyPluginEvent();
    public trackerEvent: PluginEvent<TrackerEventModel> = new PluginEvent<TrackerEventModel>();

    private propertyUpdatedBy: string | undefined;

    constructor(app: App, file: TFile) {
        this.app = app;
        this.file = file;

        const metadata = this.app.metadataCache.getFileCache(file);
        this.properties = metadata?.frontmatter ?? {} as FrontMatterCache;

    }

    propertiesUpdated() {
        const filePath = this.file.path;
        let release: () => void = () => { };
        const prev = this.fileLocks.get(filePath) || Promise.resolve();
        const lock = new Promise<void>(resolve => (release = resolve));
        this.fileLocks.set(filePath, prev.then(() => lock));
        prev.then(() => {
            const fileCache = this.app.metadataCache.getFileCache(this.file);
            this.properties = fileCache?.frontmatter ?? {} as FrontMatterCache;
            this.propertyChangedEvent.emit(this.propertyUpdatedBy);
            this.propertyUpdatedBy = undefined;
            release();
            // Clean up lock if this is the last queued update
            if (this.fileLocks.get(filePath) === lock) this.fileLocks.delete(filePath);
        });
    }

    async saveProperties(sender: string) {
        const filePath = this.file.path;
        let release: () => void = () => { };
        const prev = this.fileLocks.get(filePath) || Promise.resolve();
        const lock = new Promise<void>(resolve => (release = resolve));
        this.fileLocks.set(filePath, prev.then(() => lock));
        await prev;
        try {
            this.propertyUpdatedBy = sender;

            const content = await this.app.vault.read(this.file);
            const match = content.match(/^---\n([\s\S]*?)\n---/);
            let body = content;
            if (match) {
                body = content.slice(match[0].length);
            }

            const newContent = `---\n${stringifyYaml(this.properties)}---\n${body.replace(/^\n+/, '')}`;
            await this.app.vault.modify(this.file, newContent);
        } finally {
            release();
            // Clean up lock if this is the last queued update
            if (this.fileLocks.get(filePath) === lock) this.fileLocks.delete(filePath);
        }
    }
}


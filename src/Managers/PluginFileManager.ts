import { type App, type FrontMatterCache, type TFile } from "obsidian";
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

    propertiesUpdated(): void {
        const filePath = this.file.path;
        let release: () => void = () => { };
        const prev = this.fileLocks.get(filePath) ?? Promise.resolve();
        const lock = new Promise<void>(resolve => (release = resolve));
        this.fileLocks.set(filePath, prev.then(() => lock));
        void prev.then(() => {
            const fileCache = this.app.metadataCache.getFileCache(this.file);
            this.properties = fileCache?.frontmatter ?? {} as FrontMatterCache;
            this.propertyChangedEvent.emit(this.propertyUpdatedBy);
            this.propertyUpdatedBy = undefined;
            release();
            if (this.fileLocks.get(filePath) === lock) this.fileLocks.delete(filePath);
        });
    }

    async saveProperties(sender: string): Promise<void> {
        this.propertyUpdatedBy = sender;
        await this.app.fileManager.processFrontMatter(this.file, (frontmatter) => {
            for (const key in this.properties) {
                if (Object.prototype.hasOwnProperty.call(this.properties, key)) {
                    frontmatter[key] = this.properties[key];
                }
            }
        });
    }
}

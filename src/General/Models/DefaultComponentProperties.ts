import type { PluginFileManager } from "../../Managers/PluginFileManager";

export interface DefaultComponentProperties {
    settings: TtrpgStatsPluginSettings,
    content?: Record<string, any> | undefined;
    pluginFileManager: PluginFileManager
}

export interface KeyValue {
    key: string;
    value: any;
}
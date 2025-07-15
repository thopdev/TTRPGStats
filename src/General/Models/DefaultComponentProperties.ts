import { PluginFileManager } from "@src/Managers/PluginFileManager";
import type { TtrpgStatsPluginSettings } from "@src/Settings/TtrpgStatsPluginSettings";

export interface DefaultComponentProperties {
    settings: TtrpgStatsPluginSettings | undefined,
    content?: Record<string, any> | undefined;
    pluginFileManager: PluginFileManager
}

export interface KeyValue {
    key: string;
    value: any;
}
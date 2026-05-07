import { PluginFileManager } from "@src/Managers/PluginFileManager";
import type { TtrpgStatsPluginSettings } from "@src/Settings/TtrpgStatsPluginSettings";

export interface DefaultComponentProperties {
    settings: TtrpgStatsPluginSettings | undefined,
    content?: Record<string, unknown> | undefined;
    pluginFileManager: PluginFileManager
}

export interface KeyValue {
    key: string;
    value: unknown;
}
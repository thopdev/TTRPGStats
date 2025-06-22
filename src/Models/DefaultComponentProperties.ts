
interface DefaultComponentProperties {
    properties?: any;
    updateProperties: (updates: KeyValue[]) => void;
    settings: TtrpgStatsPluginSettings
}

interface KeyValue {
    key: string;
    value: any;
}
import { ConfigError } from '../Error/ConfigError';
import { ConfigResult } from '../General/Models/ConfigResult';
import { ToArray } from '../Functions/ToArray';

type TrackerAction = "zero" | "max" | "decrease" | "increase" | "devideMaxUp" | "devideMaxDown" | "double";

export class TrackerConfigEvent {

    constructor(name: string, action: TrackerAction = "zero") {
        this.name = name;
        this.action = action;
    }

    name: string;
    action: TrackerAction = "zero";
}

export class TrackerConfig {

    id: string = "";
    name: string | undefined;
    max: number = 1;
    color: string = "blue";
    events: TrackerConfigEvent[] = [];

    public constructor(init?: Partial<TrackerConfig>) {
        Object.assign(this, init);
    }

    static DEFAULT: TrackerConfig = new TrackerConfig({
        id: "tracker1",
        name: "Tracker 1",
        max: 5,
        color: "red",
        events: [new TrackerConfigEvent("event1", "zero"), new TrackerConfigEvent("event2", "devideMaxUp")]
    });
}

export function ToTrackerConfig(obj: Record<string, unknown> | undefined): ConfigResult<TrackerConfig> {

    if (obj === undefined || obj === null || obj.id === undefined || obj.name === undefined) {
        return new ConfigResult<TrackerConfig>({ error: new ConfigError("Yaml is missing required propertie id or name", TrackerConfig.DEFAULT) });
    }

    return new ConfigResult<TrackerConfig>({
        value: new TrackerConfig({
            id: String(obj.id ?? obj.name),
            name: obj.name !== undefined ? String(obj.name) : undefined,
            max: typeof obj.max === "number" ? obj.max : 1,
            color: typeof obj.color === "string" ? obj.color : "blue",
            events: ToArray(obj.events).map(x => ToTrackerConfigEvent(x))
        })
    });
}

export function ToTrackerConfigEvent(value: unknown): TrackerConfigEvent {
    if (typeof value === "string") {
        return new TrackerConfigEvent(value);
    }

    const obj = value as Record<string, unknown>;
    const name = typeof obj.name === "string" ? obj.name : "";
    const calc = typeof obj.calc === "string" ? obj.calc as TrackerAction : "zero";
    return new TrackerConfigEvent(name, calc);
}

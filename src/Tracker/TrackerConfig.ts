import { ConfigError } from '../Error/ConfigError';
import { ConfigResult } from '../General/Models/ConfigResult';
import { ToArray } from '../Functions/ToArray';

export class TrackerConfigEvent {

    constructor(name: string, action: "zero" | "max" | "decrease" | "increase" | "devideMaxUp" | "devideMaxDown" | "double" = "zero") {
        this.name = name;
        this.action = action;
    }

    name: string;
    action: "zero" | "max" | "decrease" | "increase" | "devideMaxUp" | "devideMaxDown" | "double" = "zero";

}

export class TrackerConfig {

    id: string;
    name: string | undefined;
    max: number = 1;
    color: string = "blue";
    events: TrackerConfigEvent[];

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



export function ToTrackerConfig(obj: Record<string, any> | undefined): ConfigResult<TrackerConfig> {

    if (obj === undefined || obj === null || obj.id === undefined || obj.name === undefined) {

        return new ConfigResult<TrackerConfig>({ error: new ConfigError("Yaml is missing required propertie id or name", TrackerConfig.DEFAULT) });
    }

    return new ConfigResult<TrackerConfig>({
        value: new TrackerConfig({
            id: obj.id ?? obj.name,
            name: obj.name,
            max: obj.max ?? 1,
            color: obj.color ?? "blue",
            events: ToArray(obj.events).map(x => ToTrackerConfigEvent(x))
        })
    });
}

export function ToTrackerConfigEvent(value: any): TrackerConfigEvent {
    if (typeof value === "string") {
        return new TrackerConfigEvent(value);
    }

    let name = value.name;
    let calc = value.calc;
    if (!calc) {
        calc = "zero";
    }
    return new TrackerConfigEvent(name, calc);

}



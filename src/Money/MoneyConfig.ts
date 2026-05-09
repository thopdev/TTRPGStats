import { ConfigResult } from "@src/General/Models/ConfigResult";

export class MoneyConfig {

    valutas: ValutaConfig[];
    convert: boolean = false;
    id: string = "valuta";
    allowNegative: boolean = false;
    displayNull: boolean = true;

    constructor(valutas: ValutaConfig[], convert: boolean, id: string, allowNegative: boolean, displayNull: boolean) {
        this.valutas = valutas;
        this.convert = convert;
        this.id = id;
        this.allowNegative = allowNegative;
        this.displayNull = displayNull;
    }
}


export class ValutaConfig {
    name: string;
    multiplier: number;
    defaultValue: boolean;

    constructor(name: string, multiplier: number, defaultValue: boolean) {
        this.name = name;
        this.multiplier = multiplier;
        this.defaultValue = defaultValue;
    }
}


export function ToMoneyConfig(obj: Record<string, unknown> | undefined): ConfigResult<MoneyConfig> {
    if (!obj) {
        throw new Error("obj cannot be undefined");
    }

    const valutas = Array.isArray(obj.valutas) ? obj.valutas : [];

    return new ConfigResult({
        value: new MoneyConfig(
            valutas.map((v: Record<string, unknown>) => {
                const name = Object.keys(v).find((k) => k !== "value");
                if (!name) {
                    throw new Error("ValutaConfig name is undefined");
                }
                const defaultValue = v.default === true;
                const namedVal = v[name];
                const multiplier = typeof v.value === "number" ? v.value : (typeof namedVal === "number" ? namedVal : 1);
                return new ValutaConfig(name, multiplier, defaultValue);
            }),
            obj.convert === true,
            typeof obj.id === "string" ? obj.id : "coins",
            obj.allowNegative === true,
            obj.displayNull !== false
        )
    });
}

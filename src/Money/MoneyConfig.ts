import { ConfigResult } from "src/General/Models/ConfigResult";

export class MoneyConfig {

    valutas: ValutaConfig[];

    constructor(valutas: ValutaConfig[]) {
        this.valutas = valutas;
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


export function ToMoneyConfig(obj: Record<string, any> | undefined): ConfigResult<MoneyConfig> {
    return new ConfigResult({
        value: new MoneyConfig(obj.valutas.map((v: any) => {
            let name = Object.keys(v).find((k) => k !== "value");
            if (!name) {
                throw new Error("ValutaConfig name is undefined");
            }
            const defaultValue = v.default ?? false;

            return new ValutaConfig(name, v.value ?? v[name], defaultValue);
        }))
    });
}
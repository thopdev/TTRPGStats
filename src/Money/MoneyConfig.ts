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


export function ToMoneyConfig(obj: Record<string, any> | undefined): ConfigResult<MoneyConfig> {
    if (!obj) {
        throw new Error("obj cannot be undefined");
    }


    return new ConfigResult({
        value: new MoneyConfig(obj.valutas.map((v: any) => {
            let name = Object.keys(v).find((k) => k !== "value");
            if (!name) {
                throw new Error("ValutaConfig name is undefined");
            }
            const defaultValue = v.default ?? false;

            return new ValutaConfig(name, v.value ?? v[name], defaultValue);
        }), obj.convert ?? false, obj.id ?? 'coins', obj.allowNegative ?? false, obj.displayNull ?? true)
    });

}
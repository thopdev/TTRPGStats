import type { ValutaConfig } from "./MoneyConfig";

export class ValutaData {
    config: ValutaConfig;
    value: number;
    inputValue: number;

    constructor(config: ValutaConfig, value: number) {
        this.config = config;
        this.value = $state(value);
        this.inputValue = $state(0);
    }
}
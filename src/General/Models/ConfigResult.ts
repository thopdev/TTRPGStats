import { ConfigError } from '@src/Error/ConfigError';



export class ConfigResult<T> {
    public constructor(init?: Partial<ConfigResult<T>>) {
        Object.assign(this, init);
    }

    public value: T | undefined;
    public error: ConfigError | undefined;
}

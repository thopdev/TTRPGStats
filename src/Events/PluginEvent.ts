
export class PluginEvent<T> {

    private listeners: Function[] = [];

    public on(listener: (event: T) => void): void {
        if (!this.listeners) {
            this.listeners = [];
        }
        this.listeners.push(listener);
    }

    public off(listener: (event: T) => void): void {
        if (!this.listeners) return;
        this.listeners = this.listeners.filter(l => l !== listener);
    }

    public emit(arg: T): void {
        if (!this.listeners) return;
        this.listeners.forEach(listener => listener(arg));
    }
}

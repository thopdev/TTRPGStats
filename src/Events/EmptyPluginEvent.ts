import type { TrackerEventModel } from "./TrackerEventModel";


export class EmptyPluginEvent {

    private listeners = new Map<string, Function>();

    public on(object: string, listener: Function): void {
        this.listeners.set(object, listener);
    }

    public off(object: any): void {
        this.listeners.delete(object);
    }

    public emit(sender: string | undefined): void {
        if (!this.listeners) return;
        this.listeners.forEach((listener, object) => {
            if (sender !== object) {
                listener();
            }
        });
    }
}

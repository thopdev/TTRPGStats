export class EmptyPluginEvent {

    private listeners = new Map<string, () => void>();

    public on(object: string, listener: () => void): void {
        this.listeners.set(object, listener);
    }

    public off(object: string): void {
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

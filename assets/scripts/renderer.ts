export class HatcherRenderer {

    private readonly beforeBootListeners: Array<() => any> = [];
    private readonly onBootListeners: Array<() => any> = [];

    public beforeBoot(listener: () => any) {
        this.beforeBootListeners.push(listener);
    }

    public onBoot(listener: () => any) {
        this.onBootListeners.push(listener);
    }

    public async boot() {
        for (const beforeBootListener of this.beforeBootListeners) await beforeBootListener(); 
        for (const onBootListener of this.onBootListeners) await onBootListener();

        return true;
    }
}
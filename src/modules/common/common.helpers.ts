export function makeRegularTimestampOf(date: Date): number {
    return Math.floor(date.getTime() / 100);
}
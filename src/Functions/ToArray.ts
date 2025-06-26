export function ToArray<T>(obj: T | T[] | undefined): T[] {
    if (obj === undefined) {
        return [];
    }
    if (Array.isArray(obj)) {
        return obj;
    }
    return [obj];
}

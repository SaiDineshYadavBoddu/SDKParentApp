/**
 * Toggles an item in a Set. If the item exists, it is removed; otherwise, it is added.
 * @param set The current Set of items.
 * @param item The item to toggle.
 * @returns A new Set with the item toggled.
 */
export const toggleInSet = <T>(set: Set<T>, item: T): Set<T> => {
    const newSet = new Set(set);
    if (newSet.has(item)) {
        newSet.delete(item);
    } else {
        newSet.add(item);
    }
    return newSet;
};

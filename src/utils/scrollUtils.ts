/**
 * Calculates the current slide index based on the scroll offset and slide width.
 * @param offsetX The current horizontal scroll offset.
 * @param width The width of a single slide.
 * @returns The current slide index.
 */
export const getSlideIndex = (offsetX: number, width: number): number => {
    return Math.ceil(offsetX / width);
};

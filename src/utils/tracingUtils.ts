/**
 * Generates a random hex string of a given length.
 * @param length The length of the hex string to generate.
 * @returns A random hex string.
 */
const hex = (length: number): string => {
    let result = '';
    const characters = '0123456789abcdef';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

/**
 * Generates a traceparent header value following the W3C Trace Context specification.
 * Format: version-traceid-parentid-flags
 * Example: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
 * 
 * @returns A valid traceparent header string.
 */
export const generateTraceparent = (): string => {
    const version = '00';
    const traceId = hex(32);
    const parentId = hex(16);
    const flags = '01'; // Sampled

    return `${version}-${traceId}-${parentId}-${flags}`;
};

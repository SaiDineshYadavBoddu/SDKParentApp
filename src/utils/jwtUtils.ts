import { Buffer } from 'buffer';

export const decodeJWT = (token: string): any => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('Error decoding JWT:', e);
        return null;
    }
};

export const hasRole = (token: string, roleName: string, clientName: string): boolean => {
    const decoded = decodeJWT(token);
    console.log('decoded', decoded);
    if (!decoded) return false;

    // Check resource_access for the specific client roles
    if (
        decoded.resource_access &&
        decoded.resource_access[clientName] &&
        decoded.resource_access[clientName].roles
    ) {
        return decoded.resource_access[clientName].roles.includes(roleName);
    }

    return false;
};

/**
 * Extracts bank_code from JWT token
 * @param token - JWT access token
 * @returns bank_code value or null
 */
export const getBankCode = (token: string): string | null => {
    const decoded = decodeJWT(token);
    return decoded?.bank_code || null;
};

/**
 * Extracts bank_id from JWT token
 * @param token - JWT access token
 * @returns bank_id value or null
 */
export const getBankId = (token: string): string | null => {
    const decoded = decodeJWT(token);
    return decoded?.bank_id || null;
};

/**
 * Extracts role from JWT token groups array
 * Example: groups: ["/FI/d2c/TEST 1"] => "/FI/d2c/TEST 1"
 * @param token - JWT access token
 * @returns role (entire first group path) or null
 */
export const getRole = (token: string): string | null => {
    const decoded = decodeJWT(token);
    if (decoded?.groups && Array.isArray(decoded.groups) && decoded.groups.length > 0) {
        return decoded.groups[0] || null;
    }
    return null;
};

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

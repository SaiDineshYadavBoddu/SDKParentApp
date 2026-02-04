// Card number formatting utilities
/**
 * Formats a card number to show last 8 digits with first 4 masked.
 * Format: "**** 1234"
 * @param cardNumber - The full or masked card number/pan
 * @returns Formatted string like "**** 1234"
 */
export const formatMaskedCardNumber = (cardNumber?: string): string => {
    if (!cardNumber) return '**** **** **** ****';

    // Remove any existing spaces or special characters
    const cleanNumber = cardNumber.replace(/[\s-]/g, '');

    if (cleanNumber.length < 12) return cleanNumber;

    const firstFour = cleanNumber.slice(0, 4);
    const lastFour = cleanNumber.slice(-4);

    return `${firstFour} **** **** ${lastFour}`;
};

// Card status check utilities
export const isCardPendingActivation = (status?: string) => {
    return status === 'Pending Activation' || status === 'PENDING_ACTIVATION';
};

export const isCardActive = (status?: string) => {
    return status === 'Active';
};

export const isCardTempBlocked = (status?: string, cause?: string) => {
    return status === 'Blocked' && cause === 'TempBlocked';
};

export const isCardPermanentBlocked = (status?: string, cause?: string) => {
    return status === 'Blocked' && !cause;
};

export const isCardBlocked = (status?: string) => {
    return status === 'Blocked';
};

export const isCardReplaced = (status?: string) => {
    return status === 'Replaced';
};

export const isCardPendingClosure = (status?: string) => {
    return status === 'Pending Closure' || status === 'PENDING_CLOSURE';
};

// Visual state helpers
export const shouldBlurCard = (status?: string, cause?: string) => {
    return isCardBlocked(status);
};

export const shouldShowTransactions = (status?: string) => {
    // Show transactions for all statuses except pending activation
    // Pending closure and replaced cards should show transactions
    return !isCardPendingActivation(status);
};

// App-defined scopes based on card status
// These define what actions are available for each card status
export const canActivateCard = (status?: string) => {
    return isCardPendingActivation(status);
};

export const canBlockCard = (status?: string) => {
    return isCardActive(status);
};

export const canUnblockCard = (status?: string, cause?: string) => {
    return isCardTempBlocked(status, cause);
};

export const canReplaceCard = (status?: string, cause?: string) => {
    // Can replace if: pending activation, active, or blocked
    return isCardPendingActivation(status) ||
        isCardActive(status) ||
        isCardBlocked(status);
};

export const canCloseCard = (status?: string) => {
    // Can close if: active or blocked
    return isCardActive(status) || isCardBlocked(status);
};

export const canSetPin = (status?: string) => {
    // Visible for active and blocked cards, but disabled for blocked
    return isCardActive(status) || isCardBlocked(status);
};

export const canViewTransactions = (status?: string) => {
    // Can view transactions for all except pending activation
    return !isCardPendingActivation(status);
};

export const canViewLimits = (status?: string) => {
    // Can view limits for all statuses
    return true;
};

export const canViewRestrictions = (status?: string) => {
    // Can view restrictions for all statuses
    return true;
};

export const shouldShowManageCard = (status?: string) => {
    // Hide manage card for: pending activation, replaced, pending closure
    return !isCardPendingActivation(status) &&
        !isCardReplaced(status) &&
        !isCardPendingClosure(status);
};

export const hasResourceAction = (card: any, resourceName: string, action: string) => {
    if (!card?.availableActions) return false;
    const resource = card.availableActions.find((a: any) => a.resourceName === resourceName);
    return resource?.scopes?.includes(action) || false;
};

export const isCardPendingActivation = (status?: string) => {
    return status === 'Pending Activation' || status === 'PENDING_ACTIVATION';
};

export const isCardTempBlocked = (status?: string, cause?: string) => {
    return status === 'Blocked' && cause === 'TempBlocked';
};

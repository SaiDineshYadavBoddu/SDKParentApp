
type TimeoutCallback = () => void;

let timeoutCallback: TimeoutCallback | null = null;

export const registerTimeoutListener = (callback: TimeoutCallback) => {
    timeoutCallback = callback;
};

export const unregisterTimeoutListener = () => {
    timeoutCallback = null;
};

export const triggerTimeout = () => {
    if (timeoutCallback) {
        timeoutCallback();
    }
};

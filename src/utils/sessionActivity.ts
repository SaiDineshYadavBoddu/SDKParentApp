/**
 * Shared session activity tracking for timeout and silent refresh logic.
 * "Activity" = API request started, app became active, or user logged in.
 */
let lastActivityTime = 0;

export const recordActivity = (): void => {
  lastActivityTime = Date.now();
};

export const getLastActivityTime = (): number => lastActivityTime;

export const getInactivityMs = (): number => Date.now() - lastActivityTime;

export const INACTIVITY_THRESHOLD_MS = 3 * 60 * 1000; // 3 minutes

export const isInactiveForThreshold = (): boolean =>
  getInactivityMs() >= INACTIVITY_THRESHOLD_MS;

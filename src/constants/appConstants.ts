export const LOGIN_ONBOARDING_DATA = [
  {
    id: '1',
    image: require('../assets/images/onboarding1.png'),
    title: 'onboarding.step1.title',
    description: 'onboarding.step1.description',
  },
  {
    id: '2',
    image: require('../assets/images/onboarding2.png'),
    title: 'onboarding.step2.title',
    description: 'onboarding.step2.description',
  },
  {
    id: '3',
    image: require('../assets/images/onboarding3.png'),
    title: 'onboarding.step3.title',
    description: 'onboarding.step3.description',
  },
];

export const REPLACE_CARD_REASONS = [
  "Lost",
  "Stolen",
  "Damaged",
  "Fraud"
];

export const FREEZE_CARD_REASONS = [
  "Temp",
  "Loss",
  "Stolen",
  "Fraud"
];

export const TOPICS = ['general', 'portal', 'tariffs', 'card_service', 'transaction', 'others'];

export const TRANSACTIONS_TIME_RANGES = ['thisMonth', 'lastMonth', 'last3Months', 'thisYear', 'custom'];
export const STATEMENTS_TIME_RANGES = ['lastWeek', 'lastMonth', 'last3Months', 'thisYear', 'custom'];

export const CARD_STATUS = {
  PENDING_ACTIVATION: 'Pending Activation',
  ACTIVE: 'Active',
  BLOCKED: 'Blocked',
  REPLACED: 'Replaced',
  PENDING_CLOSURE: 'Pending Closure',
} as const;

export const STATUS_CAUSE = {
  TEMP_BLOCKED: 'TempBlocked',
} as const;

export const Spacing = {
    xs: 4,
    s: 8,
    m: 12,
    l: 16,
    xl: 24,
    xxl: 32,
} as const;

export type SpacingType = keyof typeof Spacing;
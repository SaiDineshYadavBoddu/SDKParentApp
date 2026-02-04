import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ms } from 'react-native-size-matters';
import CustomText, { TextType } from '../../../common/components/CustomText';
import CustomButton from '../../../common/components/CustomButton';
import { Spacing } from '../../../theme/spacing';
import { useTheme } from '../../../theme/ThemeProvider';
import CustomIcon from '../../../common/components/CustomIcon';
import { useTranslation } from 'react-i18next';

export type TimelineEvent = {
    title: string;
    description?: string;
    status: 'success' | 'error' | 'pending';
};

interface RequestTimelineProps {
    events: TimelineEvent[];
    onRetry?: () => void;
    isRetryLoading?: boolean;
}

const RequestTimeline: React.FC<RequestTimelineProps> = ({ events, onRetry, isRetryLoading = false }) => {
    const { colors } = useTheme();
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            {events.map((event, index) => {
                const showLine = index < events.length - 1;
                const lineColor = event.status === 'success' 
                    ? colors.statusResolved 
                    : colors.outline;

                return (
                    <View key={index} style={styles.eventContainer}>
                        <View style={styles.indicatorColumn}>
                            <View style={styles.iconWrapper}>
                                {event.status === 'success' ? (
                                    <View style={[styles.circle, { backgroundColor: colors.statusResolved }]}>
                                        <CustomIcon name="check" size={ms(10)} color={colors.onPrimary} type="mci" />
                                    </View>
                                ) : event.status === 'error' ? (
                                    <View style={[styles.circle, { backgroundColor: colors.error }]}>
                                        <CustomIcon name="close" size={ms(10)} color={colors.onPrimary} type="mci" />
                                    </View>
                                ) : (
                                    <View style={[styles.circle, { backgroundColor: colors.outline }]} />
                                )}
                            </View>
                            {showLine && (
                                <View
                                    style={[
                                        styles.line,
                                        { backgroundColor: lineColor },
                                    ]}
                                />
                            )}
                        </View>
                        <View style={styles.contentColumn}>
                            <View style={styles.titleRow}>
                                <CustomText
                                    type={TextType.Label}
                                    style={[
                                        styles.eventTitle,
                                        { color: event.status === 'pending' ? colors.secondaryText : colors.onBackground },
                                    ]}
                                    numberOfLines={2}
                                >
                                    {event.title}
                                </CustomText>
                                {event.status === 'error' && event.description && (
                                    <CustomButton
                                        title={t('requests.detailSheet.retry')}
                                        onPress={onRetry}
                                        variant="text"
                                        textColor={colors.error}
                                        style={[styles.retryButton]}
                                        uppercase={false}
                                        loading={isRetryLoading}
                                    />
                                )}
                            </View>
                            {event.description && (
                                <View style={[styles.descriptionCard, { backgroundColor: colors.screenBackground }]}>
                                    <CustomText type={TextType.Label} style={[styles.quoteMark, { color: colors.tertiaryText }]}>"</CustomText>
                                    <CustomText
                                        type={TextType.Label}
                                        style={[styles.descriptionText, { color: colors.secondaryText }]}
                                    >
                                        {event.description}
                                    </CustomText>
                                </View>
                            )}
                        </View>
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: Spacing.s,
    },
    eventContainer: {
        flexDirection: 'row',
    },
    indicatorColumn: {
        alignItems: 'center',
        width: ms(24),
        marginRight: Spacing.s,
    },
    iconWrapper: {
        height: ms(24),
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    circle: {
        width: ms(20),
        height: ms(20),
        borderRadius: ms(10),
        justifyContent: 'center',
        alignItems: 'center',
    },
    line: {
        width: 2,
        flex: 1,
        marginTop: ms(-4), // Overlap with previous circle
        marginBottom: ms(-4), // Overlap with next circle
    },
    contentColumn: {
        flex: 1,
        paddingBottom: Spacing.l,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingTop: ms(2),
    },
    eventTitle: {
        fontSize: ms(14),
        fontWeight: '500',
        flexShrink: 1,
        paddingRight: Spacing.s,
    },
    retryButton: {
        paddingHorizontal: Spacing.xs,
        paddingVertical: Spacing.xs,
        height: ms(26),
    },
    descriptionCard: {
        marginTop: Spacing.s,
        padding: Spacing.m,
        borderRadius: ms(8),
        flexDirection: 'row',
    },
    quoteMark: {
        fontSize: ms(24),
        marginRight: Spacing.xs,
        lineHeight: ms(28),
    },
    descriptionText: {
        flex: 1,
        fontSize: ms(13),
        lineHeight: ms(18),
        fontWeight: '500',
    },
});

export default RequestTimeline;

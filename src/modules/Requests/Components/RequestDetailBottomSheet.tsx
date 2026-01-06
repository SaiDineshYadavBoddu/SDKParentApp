import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Animated, Dimensions } from 'react-native';
import { ms } from 'react-native-size-matters';
import CustomBottomSheet from '../../../common/components/CustomBottomSheet';
import CustomText, { TextType } from '../../../common/components/CustomText';
import { Spacing } from '../../../theme/spacing';
import { useTheme } from '../../../theme/ThemeProvider';
import PaymentCard from '../../../common/components/PaymentCard';
import RequestInfoGroup, { RequestDetail } from './RequestInfoGroup';
import Accordion from '../../../common/components/Accordion';
import RequestTimeline, { TimelineEvent } from './RequestTimeline';
import { useTranslation } from 'react-i18next';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface RequestDetailBottomSheetProps {
    visible: boolean;
    onClose: () => void;
    request: {
        requestNumber: string;
        badgeText: string;
        details: RequestDetail[];
        // Extended fields for the detail view
        technicalDetails?: Array<{ label: string; value: string }>;
        timeline?: TimelineEvent[];
    } | null;
}

const RequestDetailBottomSheet: React.FC<RequestDetailBottomSheetProps> = ({
    visible,
    onClose,
    request,
}) => {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const [isCardDetailVisible, setIsCardDetailVisible] = useState(false);
    const scrollX = useRef(new Animated.Value(0)).current;

    if (!request) return null;

    // Mock card data - in a real app, this might come from the request object or a separate fetch
    const mockCardData = {
        id: '1',
        cardIdentifier: '1238 **** **** 0329',
        maskedPan: '423456******0329',
        expiryDate: '2028-07-01',
        cvv: '329',
        cardholderName: 'Jonathan Paul',
    };

    const getStatusColors = (status: string, colors: any) => {
        switch (status) {
            case 'activation':
                return { backgroundColor: colors.onStatusActivation, textColor: colors.statusActivation };
            case 'cardUnblocking':
                return { backgroundColor: colors.onStatusUnblocking, textColor: colors.statusUnblocking };
            default:
                return { backgroundColor: colors.screenBackground, textColor: colors.tertiaryText };
        }
    };

    const { backgroundColor, textColor } = getStatusColors(request.badgeText, colors);

    return (
        <CustomBottomSheet
            visible={visible}
            onClose={onClose}
            maxHeight={SCREEN_HEIGHT * 0.85}
            title={
                <View style={styles.headerTitleRow}>
                    <CustomText type={TextType.CardTitle} style={styles.requestNumber}>
                        {t('requests.idPrefix')} {request.requestNumber}
                    </CustomText>
                    <View style={[styles.badge, { backgroundColor }]}>
                        <View style={[styles.badgeDot, { backgroundColor: textColor }]} />
                        <CustomText type={TextType.CardSubtitle} style={[styles.badgeText, { color: textColor }]}>
                            {t(`requests.types.${request.badgeText}`)}
                        </CustomText>
                    </View>
                </View>
            }
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Card Section */}
                <View style={styles.cardContainer}>
                    <PaymentCard
                        item={mockCardData}
                        index={0}
                        scrollX={scrollX}
                        snapInterval={ms(300)}
                        cardWidth={ms(320)}
                        cardMargin={0}
                        isDetailsVisible={isCardDetailVisible}
                        onToggleVisibility={() => setIsCardDetailVisible(!isCardDetailVisible)}
                    />
                </View>

                {/* Basic Info Rows */}
                <View style={styles.infoGroupWrapper}>
                    <RequestInfoGroup details={request.details} />
                </View>

                {/* Technical Details Accordion */}
                <Accordion title={t('requests.detailSheet.detailsTitle')}>
                    <View style={styles.detailsGrid}>
                        {request.technicalDetails?.map((item, index) => (
                            <View key={index} style={styles.gridItem}>
                                <CustomText type={TextType.Label} style={[styles.gridLabel, { color: colors.tertiaryText }]}>
                                    {item.label}:
                                </CustomText>
                                <CustomText type={TextType.Label} style={[styles.gridValue, { color: colors.onBackground }]} numberOfLines={1} ellipsizeMode="tail">
                                    {item.value}
                                </CustomText>
                            </View>
                        ))}
                    </View>
                </Accordion>

                {/* Decision Details Accordion */}
                <Accordion title={t('requests.detailSheet.decisionTitle')}>
                    {request.timeline && <RequestTimeline events={request.timeline} />}
                </Accordion>
            </ScrollView>
        </CustomBottomSheet>
    );
};

const styles = StyleSheet.create({
    headerTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.m,
    },
    requestNumber: {
        fontSize: ms(18),
        fontWeight: '700',
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(8),
        paddingVertical: ms(4),
        borderRadius: ms(12),
        gap: ms(4),
    },
    badgeDot: {
        width: ms(6),
        height: ms(6),
        borderRadius: ms(3),
    },
    badgeText: {
        fontSize: ms(11),
        fontWeight: '500',
    },
    scrollContent: {
        paddingBottom: ms(40),
    },
    cardContainer: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
        // Adjust PaymentCard style if needed within this parent
    },
    infoGroupWrapper: {
        marginBottom: Spacing.xl,
        paddingHorizontal: Spacing.s,
    },
    detailsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: ms(16),
    },
    gridItem: {
        width: '45%', // Two-column grid
        gap: Spacing.xs,
    },
    gridLabel: {
        fontSize: ms(12),
        fontWeight: '400',
    },
    gridValue: {
        fontSize: ms(14),
        fontWeight: '700',
    },
});

export default RequestDetailBottomSheet;

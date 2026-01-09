import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Animated, Dimensions } from 'react-native';
import { ms } from 'react-native-size-matters';
import CustomBottomSheet from '../../../common/components/CustomBottomSheet';
import CustomText, { TextType } from '../../../common/components/CustomText';
import { Spacing } from '../../../theme/spacing';
import { useTheme } from '../../../theme/ThemeProvider';
import PaymentCard from '../../../common/components/PaymentCard';
import RequestInfoGroup from './RequestInfoGroup';
import Accordion from '../../../common/components/Accordion';
import RequestTimeline, { TimelineEvent } from './RequestTimeline';
import { useTranslation } from 'react-i18next';
import { RequestItem } from '../../../network/requests/request.types';
import { getStatusColors } from '../../../utils/requestUtils';
import { useGetRequestByIdQuery } from '../../../network/requests/request.api';
import { ActivityIndicator } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface RequestDetailBottomSheetProps {
    visible: boolean;
    onClose: () => void;
    request: RequestItem | null;
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

    const { data: fullRequestDetails, isLoading } = useGetRequestByIdQuery(request?.id || '', {
        skip: !visible || !request?.id,
    });

    // Use fetched details if available, otherwise fallback to the item from the list
    const activeRequest = fullRequestDetails || request;

    if (!activeRequest && !isLoading) return null;

    // Mock card data - in a real app, this might come from the request object or a separate fetch
    const mockCardData = {
        id: '1',
        cardIdentifier: '1238 **** **** 0329',
        maskedPan: '423456******0329',
        expiryDate: '2028-07-01',
        cvv: '329',
        cardholderName: 'Jonathan Paul',
    };


    const mainAction = activeRequest?.actions?.[0];
    const { backgroundColor, textColor } = getStatusColors(mainAction?.actionType || 'default', colors);

    let actionData: any = {};
    if (mainAction?.payload?.actionBody) {
        try {
            actionData = JSON.parse(mainAction.payload.actionBody);
        } catch (e) {
            console.error('Failed to parse actionBody', e);
        }
    }

    const detailsFields = [
        { label: 'BankId', value: actionData?.bankId || '-' },
        { label: 'BankId', value: actionData?.bankRequestId || '-' }, // Assuming the second BankId in mockup is a request ID
        { label: 'cardMaskedPan', value: actionData?.cardMaskedPan || '-' },
        { label: 'cardholderRequest', value: String(actionData?.cardholderRequest ?? '-') },
        { label: 'companyId', value: actionData?.companyId || '-' },
        { label: 'customerId', value: actionData?.customerId || '-' },
        { label: 'requester', value: activeRequest?.requester || '-' },
        { label: 'requesterId', value: activeRequest?.requesterId || '-' },
    ];

    const timeline: TimelineEvent[] = [
        {
            title: activeRequest?.createdAt ? `${t('requests.createdAt')}: ${new Date(activeRequest.createdAt).toLocaleString()}` : '',
            isCompleted: true,
        },
    ];

    if (activeRequest?.status === 'AUTO_APPROVED') {
        timeline.push({
            title: t('requests.status.AUTO_APPROVED'),
            isCompleted: true,
        });
    } else if (activeRequest?.approval?.approvedAt) {
        timeline.push({
            title: `${t('requests.detailSheet.approvedBy')} ${activeRequest.approver} ${t('common.at')} ${new Date(activeRequest.approval.approvedAt).toLocaleString()}`,
            isCompleted: true,
        });
    }

    if (activeRequest?.status === 'REJECTED' || activeRequest?.status === 'FAILED' || activeRequest?.status === 'CANCELLED') {
         timeline.push({
            title: `${t(`requests.status.${activeRequest.status}`)}`,
            isCompleted: true, // It's complete even if failed
        });
    }

    return (
        <>
        <CustomBottomSheet
            visible={visible}
            onClose={onClose}
            maxHeight={SCREEN_HEIGHT * 0.85}
            title={
                <View style={styles.headerTitleRow}>
                    <CustomText type={TextType.CardTitle} style={styles.requestNumber}>
                        {t('requests.idPrefix')} {activeRequest?.id}
                    </CustomText>
                    <View style={[styles.badge, { backgroundColor }]}>
                        <View style={[styles.badgeDot, { backgroundColor: textColor }]} />
                        <CustomText type={TextType.CardSubtitle} style={[styles.badgeText, { color: textColor }]}>
                             {mainAction?.displayName || (activeRequest?.status ? t(`requests.status.${activeRequest.status}`) : '')}
                        </CustomText>
                    </View>
                </View>
            }
        >
            {isLoading ? (
                <View style={styles.loadingWrapper}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
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
                    {activeRequest && <RequestInfoGroup item={activeRequest} />}
                </View>

                {/* Details Accordion */}
                <Accordion title={t('requests.detailSheet.detailsTitle')}>
                    <View style={styles.detailsGrid}>
                        {detailsFields.map((item, index) => (
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
                    <RequestTimeline events={timeline} />
                </Accordion>
            </ScrollView>
            )}
        </CustomBottomSheet>
        </>
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
        fontWeight: '500',
        color: '#636E72', // Desaturated blue/grey for labels as in image
    },
    gridValue: {
        fontSize: ms(16),
        fontWeight: '600',
        color: '#2D3436', // Dark grey/black for values
    },
    loadingWrapper: {
        paddingVertical: Spacing.m,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default RequestDetailBottomSheet;

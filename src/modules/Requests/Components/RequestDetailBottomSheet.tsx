import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Animated, Dimensions, TouchableOpacity, Alert } from 'react-native';
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
import { useSearchCardsQuery } from '../../../network/card/card.api';
import { ActivityIndicator } from 'react-native';
import { getGlobalRole } from '../../../context/AuthContext';

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
    const [tooltipInfo, setTooltipInfo] = useState<{ label: string; value: string } | null>(null);
    const scrollX = useRef(new Animated.Value(0)).current;

    const { data: fullRequestDetails, isLoading } = useGetRequestByIdQuery(request?.id || '', {
        skip: !visible || !request?.id,
    });

    // Use fetched details if available, otherwise fallback to the item from the list
    const activeRequest = fullRequestDetails || request;

    const mainAction = activeRequest?.actions?.[0];
    const isCardSubject = mainAction?.subject?.toLowerCase() === 'card';
    const subjectId = mainAction?.subjectId;

    const { currentData: searchResults, isFetching: isCardFetching } = useSearchCardsQuery(
        { ids: [subjectId || ''] },
        {
            skip: !isCardSubject || !subjectId || !visible,
            refetchOnMountOrArgChange: true
        }
    );

    const cardData = searchResults?.content?.[0];

    if (!activeRequest && !isLoading) return null;


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
        { label: 'bankCode', value: actionData?.bankCode || '-' },
        { label: 'bankId', value: actionData?.bankId || '-' },
        { label: 'cardId', value: actionData?.cardId || '-' },
        { label: 'cardMaskedPan', value: actionData?.cardMaskedPan || '-' },
        { label: 'cardholderRequest', value: String(actionData?.cardholderRequest ?? '-') },
        { label: 'companyId', value: actionData?.companyId || '-' },
        { label: 'customerId', value: actionData?.customerId || '-' },
        { label: 'requester', value: activeRequest?.requester || '-' },
        { label: 'requesterId', value: activeRequest?.requesterId || '-' },
        { label: 'requesterName', value: activeRequest?.requester || '-' },
        { label: 'role', value: getGlobalRole() || '-' },
    ];

    const getTimeline = (): TimelineEvent[] => {
        if (!activeRequest) return [];

        const status = activeRequest.status;
        console.log('🚀 ~ Request status:', status, 'Type:', typeof status);

        // One-line timeline for CANCELLED or REJECTED
        if (status === 'CANCELLED' || status === 'REJECTED') {
            const dateStr = new Date(activeRequest.lastModifiedAt).toLocaleString();
            const person = activeRequest.approver || activeRequest.requester || '';
            const key = status === 'CANCELLED' ? 'requests.detailSheet.canceledBy' : 'requests.detailSheet.rejectedBy';

            return [{
                title: t(key, { name: person, date: dateStr }),
                status: 'error',
            }];
        }

        const events: TimelineEvent[] = [];
        const isAuto = status === 'AUTO_APPROVED';
        const resultStatus = activeRequest.resultStatus;
        const isDone = resultStatus === 'DONE';
        const isFailed = resultStatus === 'FAILED';

        // 1. Approval Step
        const approvalDate = activeRequest.lastModifiedAt || activeRequest.createdAt;
        const approvalDateStr = new Date(approvalDate).toLocaleString();

        if (isAuto || (!activeRequest.approval && (status === 'APPROVED' || isDone || isFailed))) {
            events.push({
                title: t('requests.detailSheet.autoApproved', { date: approvalDateStr }),
                status: 'success',
            });
        } else {
            const approverName = activeRequest.approver || activeRequest.approval?.approver || '';
            events.push({
                title: t('requests.detailSheet.approvedBy', { name: approverName, date: approvalDateStr }),
                status: 'success',
            });
        }

        // 2. Processing Step
        if (isFailed) {
            events.push({
                title: t('requests.detailSheet.processingFailed'),
                status: 'error',
                description: activeRequest.actions?.[0]?.resultPayload?.errorMessage || 'Request fail reason: internal error',
            });
        } else {
            events.push({
                title: t('requests.detailSheet.processed'),
                status: isDone ? 'success' : 'pending',
            });
        }

        // 3. Completion Step
        events.push({
            title: t('requests.detailSheet.completed'),
            status: isDone ? 'success' : isFailed ? 'error' : 'pending',
        });

        return events;
    };

    const timeline = getTimeline();

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
                        {mainAction?.details && (
                            <CustomText type={TextType.CardTitle} style={styles.actionDetails}>
                                {mainAction.details}
                            </CustomText>
                        )}
                        {/* Card Section */}
                        {isCardSubject && (
                            <View style={styles.cardContainer}>
                                {isCardFetching ? (
                                    <ActivityIndicator size="small" color={colors.primary} />
                                ) : cardData ? (
                                    <PaymentCard
                                        item={cardData}
                                        index={0}
                                        scrollX={scrollX}
                                        snapInterval={ms(300)}
                                        cardWidth={ms(320)}
                                        cardMargin={0}
                                        isDetailsVisible={isCardDetailVisible}
                                        onToggleVisibility={() => setIsCardDetailVisible(!isCardDetailVisible)}
                                    />
                                ) : null}
                            </View>
                        )}

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
                                        <TouchableOpacity
                                            onPress={() => {
                                                setTooltipInfo({ label: item.label, value: item.value });
                                            }}
                                            activeOpacity={0.7}
                                        >
                                            <CustomText type={TextType.Label} style={[styles.gridValue, { color: colors.onBackground }]} numberOfLines={1} ellipsizeMode="tail">
                                                {item.value}
                                            </CustomText>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                        </Accordion>

                        {/* Decision Details Accordion - only show if not PENDING */}
                        {activeRequest?.status !== 'PENDING_APPROVAL' && (
                            <Accordion title={t('requests.detailSheet.decisionTitle')}>
                                <RequestTimeline events={timeline} />
                            </Accordion>
                        )}
                    </ScrollView>
                )}
            </CustomBottomSheet>

            {/* Tooltip Info Box */}
            {tooltipInfo && (
                <TouchableOpacity
                    style={styles.tooltipOverlay}
                    activeOpacity={1}
                    onPress={() => setTooltipInfo(null)}
                >
                    <View style={[styles.tooltipBox, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
                        <CustomText type={TextType.CardTitle} style={[styles.tooltipLabel, { color: colors.primary }]}>
                            {tooltipInfo.label}
                        </CustomText>
                        <CustomText type={TextType.CardSubtitle} style={[styles.tooltipValue, { color: colors.onSurface }]}>
                            {tooltipInfo.value}
                        </CustomText>
                    </View>
                </TouchableOpacity>
            )}
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
        paddingHorizontal: Spacing.m,
    },
    actionDetails: {
        marginBottom: Spacing.m,
        paddingHorizontal: Spacing.m,
        fontWeight: '600',
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
    tooltipOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    tooltipBox: {
        marginHorizontal: Spacing.xl,
        padding: Spacing.l,
        borderRadius: ms(12),
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
        maxWidth: '80%',
    },
    tooltipLabel: {
        fontSize: ms(14),
        fontWeight: '700',
        marginBottom: Spacing.xs,
    },
    tooltipValue: {
        fontSize: ms(14),
        fontWeight: '400',
        lineHeight: ms(20),
    },
});

export default RequestDetailBottomSheet;

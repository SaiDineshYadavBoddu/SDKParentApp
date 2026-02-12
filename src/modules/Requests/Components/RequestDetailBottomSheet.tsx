import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, AppState } from 'react-native';
import Animated, { useSharedValue } from 'react-native-reanimated';
import { ms } from 'react-native-size-matters';
import CustomBottomSheet from '../../../common/components/CustomBottomSheet';
import CustomText, { TextType } from '../../../common/components/CustomText';
import CustomButton from '../../../common/components/CustomButton';
import { Spacing } from '../../../theme/spacing';
import { useTheme } from '../../../theme/ThemeProvider';
import PaymentCard from '../../../common/components/PaymentCard';
import RequestInfoGroup from './RequestInfoGroup';
import Accordion from '../../../common/components/Accordion';
import RequestTimeline, { TimelineEvent } from './RequestTimeline';
import { useTranslation } from 'react-i18next';
import { RequestItem } from '../../../network/requests/request.types';
import { getStatusColors } from '../../../utils/requestUtils';
import { useGetRequestByIdQuery, useRetryRequestMutation } from '../../../network/requests/request.api';
import { useSearchCardsQuery } from '../../../network/card/card.api';
import { ActivityIndicator } from 'react-native';
import { getGlobalRole } from '../../../context/AuthContext';
import CustomErrorView from '../../../common/components/CustomErrorView';
import CurrencySVG from '../../../assets/svgs/CurrencySVG';
import InfoSVG from '../../../assets/svgs/InfoSVG';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface RequestDetailBottomSheetProps {
    visible: boolean;
    onClose: () => void;
    request: RequestItem | null;
    onCancelRequest?: () => void;
    isCancelling?: boolean;
    showCancelRequestError?: boolean;
}

const RequestDetailBottomSheet: React.FC<RequestDetailBottomSheetProps> = ({
    visible,
    onClose,
    request,
    onCancelRequest,
    isCancelling,
    showCancelRequestError
}) => {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const [isCardDetailVisible, setIsCardDetailVisible] = useState(false);
    const scrollX = useSharedValue(0);

    // Hide details when app goes to background
    React.useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (nextAppState.match(/inactive|background/)) {
                setIsCardDetailVisible(false);
            }
        });

        return () => {
            subscription.remove();
        };
    }, []);

    const { data: fullRequestDetails, isLoading, error, refetch: refetchRequest } = useGetRequestByIdQuery(request?.id || '', {
        skip: !visible || !request?.id,
    });
    const [retryRequest, { isLoading: isRetryLoading }] = useRetryRequestMutation();

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

    const { backgroundColor, textColor } = getStatusColors(
        activeRequest?.status === 'CANCELLED' || activeRequest?.status === 'REJECTED' || activeRequest?.status === 'FAILED'
            ? activeRequest.status
            : mainAction?.actionType || 'default',
        colors
    );

    let actionData: any = {};
    if (mainAction?.payload?.actionBody) {
        try {
            actionData = JSON.parse(mainAction.payload.actionBody) || {};
        } catch (e) {
            console.error('Failed to parse actionBody', e);
        }
    }

    let detailsFields: { label: string; value: string }[] = [];

    if (mainAction?.actionType === 'SUPPORT_REQUEST') {
        detailsFields = [
            { label: 'description', value: actionData?.description || '-' },
            { label: 'phoneNumber', value: actionData?.phoneNumber || '-' },
            { label: 'topic', value: actionData?.topic || '-' },
        ];
    } else {
        detailsFields = [
            { label: 'actionType', value: mainAction?.actionType || '-' },
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
    }

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
        if (isRetryLoading) {
            events.push({
                title: t('requests.detailSheet.processing'),
                status: 'processing',
            });
        } else if (isFailed) {
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
            status: isDone ? 'success' : (isFailed && !isRetryLoading) ? 'error' : 'pending',
        });

        return events;
    };

    const timeline = getTimeline();

    const renderHeader = () => (
        <View style={styles.headerTitleRow}>
            <CustomText type={TextType.CardTitle} style={styles.requestNumber}>
                {t('requests.idPrefix')} #{request?.id || activeRequest?.id || ''}
            </CustomText>
            {activeRequest && (
                <View style={[styles.badge, { backgroundColor }]}>
                    <View style={[styles.badgeDot, { backgroundColor: textColor }]} />
                    <CustomText type={TextType.CardSubtitle} style={[styles.badgeText, { color: textColor }]}>
                        {mainAction?.displayName || (activeRequest?.status ? t(`requests.status.${activeRequest.status}`) : '')}
                    </CustomText>
                </View>
            )}
        </View>
    );

    const handleRetryRequest = async () => {
        if (!activeRequest?.id) return;
        try {
            await retryRequest(activeRequest.id).unwrap();
            refetchRequest();
        } catch (error) {
            console.error('Failed to retry request', error);
        }
    };

    return (
        <>
            <CustomBottomSheet
                visible={visible}
                onClose={onClose}
                maxHeight={SCREEN_HEIGHT * 0.85}
                title={renderHeader()}
            >
                {isLoading ? (
                    <View style={styles.loadingWrapper}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                ) : error ? (
                    <View style={{ height: ms(400) }}>
                        <CustomErrorView
                            onRetry={refetchRequest}
                            loading={isLoading}
                        />
                    </View>
                ) : (
                    showCancelRequestError ? <View style={{ height: ms(400) }}><CustomErrorView onRetry={onCancelRequest || (() => { })} loading={isCancelling} /></View>
                        :
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.scrollContent}
                        >
                            {mainAction?.details && (
                                <CustomText type={TextType.CardTitle} style={styles.actionDetails}>
                                    {mainAction.details}
                                </CustomText>
                            )}

                            {/* Manager Comment - Only if rejected and reason exists */}
                            {activeRequest?.rejectReason && (
                                <View style={styles.commentContainer}>
                                    <CustomText type={TextType.Label} style={[styles.commentLabel, { color: colors.onBackground }]}>
                                        {t('requests.detailSheet.managerComment', 'Manager Comment')}
                                    </CustomText>
                                    <View style={[styles.descriptionBox, { backgroundColor: colors.backgroundVariant }]}>
                                        <CustomText type={TextType.CardTitle} style={[styles.quoteIcon, { color: colors.onBackground }]}>"</CustomText>
                                        <CustomText type={TextType.CardText} style={[styles.descriptionText, { color: colors.onBackground }]}>
                                            {activeRequest.rejectReason}
                                        </CustomText>
                                    </View>
                                </View>
                            )}

                            {/* Cardholder Comment */}
                            {mainAction?.description && (
                                <View style={styles.commentContainer}>
                                    <CustomText type={TextType.Label} style={[styles.commentLabel, { color: colors.secondaryText }]}>
                                        {t('requests.detailSheet.cardholderComment', 'Cardholder Comment')}
                                    </CustomText>
                                    <View style={[styles.descriptionBox, { backgroundColor: colors.backgroundVariant }]}>
                                        <CustomText type={TextType.CardTitle} style={[styles.quoteIcon, { color: colors.primary }]}>"</CustomText>
                                        <CustomText type={TextType.CardText} style={[styles.descriptionText, { color: colors.onBackground }]}>
                                            {mainAction.description}
                                        </CustomText>
                                    </View>
                                </View>
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

                            {/* Card Balance and Status Section */}
                            {isCardSubject && cardData && (
                                <View style={styles.cardBalanceRow}>
                                    <View style={styles.balanceColumn}>
                                        <CurrencySVG width={ms(16)} height={ms(16)} color={colors.secondaryText} />
                                        <CustomText type={TextType.ScreenDisplaySmall} style={[styles.balanceText, { color: colors.secondaryText }]}>
                                            {cardData.currencyCode} {(cardData.balance ?? 0).toFixed(2)}
                                        </CustomText>
                                    </View>

                                    <View style={styles.statusColumn}>
                                        <InfoSVG width={ms(16)} height={ms(16)} color={colors.secondaryText} />
                                        <CustomText
                                            type={TextType.ScreenDisplaySmall}
                                            style={[styles.balanceText, { color: colors.secondaryText }]}
                                        >
                                            {cardData.cardStatus}
                                        </CustomText>
                                    </View>
                                </View>
                            )}

                            {/* Basic Info Rows */}
                            <View style={styles.infoGroupWrapper}>
                                {activeRequest && <RequestInfoGroup item={activeRequest} dateUsage='detail' />}
                            </View>

                            {/* Details Accordion */}
                            <Accordion title={t('requests.detailSheet.detailsTitle')}>
                                <View style={styles.detailsGrid}>
                                    {detailsFields.map((item, index) => (
                                        <View key={index} style={styles.gridItem}>
                                            <CustomText type={TextType.Label} style={[styles.gridLabel, { color: colors.tertiaryText }]}>
                                                {item.label}:
                                            </CustomText>
                                            <ScrollView
                                                horizontal
                                                showsHorizontalScrollIndicator={false}
                                                style={styles.gridValueScroll}
                                            >
                                                <CustomText type={TextType.Label} style={[styles.gridValue, { color: colors.onBackground }]}>
                                                    {item.value}
                                                </CustomText>
                                            </ScrollView>
                                        </View>
                                    ))}
                                </View>
                            </Accordion>

                            {/* Decision Details Accordion - only show if not PENDING */}
                            {activeRequest?.status !== 'PENDING_APPROVAL' && (
                                <Accordion title={t('requests.detailSheet.decisionTitle')}>
                                    <RequestTimeline
                                        events={timeline}
                                        onRetry={handleRetryRequest}
                                        isRetryLoading={isRetryLoading}
                                    />
                                </Accordion>
                            )}
                            {/* Cancel Request Button - Only show for PENDING_APPROVAL status */}
                            {activeRequest?.status === 'PENDING_APPROVAL' && (
                                <View>
                                    <CustomButton
                                        title={t('requests.detailSheet.cancelRequest')}
                                        onPress={onCancelRequest}
                                        variant="outlined"
                                        textColor={colors.error}
                                        style={[styles.cancelButton, { borderColor: colors.error }]}
                                        uppercase={false}
                                    />
                                </View>
                            )}

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
        paddingHorizontal: Spacing.m,
    },
    actionDetails: {
        marginBottom: Spacing.m,
        paddingHorizontal: Spacing.m,
        fontWeight: '600',
    },
    commentContainer: {
        marginHorizontal: Spacing.m,
        marginBottom: Spacing.l,
    },
    commentLabel: {
        marginBottom: Spacing.xs,
        marginLeft: Spacing.xs,
        fontWeight: '600',
    },
    descriptionBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.m,
        borderRadius: ms(12),
        gap: Spacing.s,
    },
    quoteIcon: {
        fontSize: ms(32),
        fontWeight: '700',
        lineHeight: ms(36),
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    descriptionText: {
        flex: 1,
        fontSize: ms(14),
        lineHeight: ms(20),
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
    },
    gridValue: {
        fontSize: ms(16),
        fontWeight: '600',
    },
    gridValueScroll: {
        maxWidth: '100%',
    },
    loadingWrapper: {
        paddingVertical: Spacing.m,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        marginTop: Spacing.xl
    },
    cardBalanceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: Spacing.m,
        marginBottom: Spacing.xl,
    },
    balanceColumn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.s,
        width: '55%',
    },
    statusColumn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.s,
        width: '45%',
    },
    balanceText: {
        fontSize: ms(13),
        fontWeight: '600',
    },
});

export default RequestDetailBottomSheet;

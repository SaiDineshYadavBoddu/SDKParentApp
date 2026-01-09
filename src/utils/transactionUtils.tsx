import React from 'react';
import { View } from 'react-native';
import { ms } from 'react-native-size-matters';
import CustomText, { TextType } from '../common/components/CustomText';
import CurrencySVG from '../assets/svgs/CurrencySVG';
import { SectionItem } from '../common/components/SectionContainer';

/**
 * Formats a transaction date string into a human-readable format.
 * @param dateString The ISO date string to format.
 */
export const formatTransactionDate = (dateString: string) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
    const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
    return `${formattedDate}, ${formattedTime}`;
};

/**
 * Maps API transaction objects to SectionItem objects for display in SectionContainer.
 * @param transactions Array of transaction objects from the API.
 */
export const mapTransactionsToSectionItems = (transactions: any[]): SectionItem[] => {
    return transactions.map((txn) => ({
        id: txn.transactionRefId,
        top: (
            <>
                <CustomText type={TextType.CardTitle}>{txn.merchantName}</CustomText>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: ms(4) }}>
                    <CurrencySVG width={ms(14)} height={ms(14)} />
                    <CustomText type={TextType.CardTitle}>{txn.amount}</CustomText>
                </View>
            </>
        ),
        middle: (
            <>
                <CustomText type={TextType.ScreenHeadlineSmall} style={{ color: '#707070', fontSize: ms(12) }}>
                    {txn.transactionRefId}
                </CustomText>
                <CustomText type={TextType.ScreenHeadlineSmall} style={{ color: '#707070', fontSize: ms(12) }}>
                    {formatTransactionDate(txn.transactionDate)}
                </CustomText>
            </>
        ),
    }));
};

/**
 * Filters a list of transactions based on search query and card ID.
 */
export const filterTransactions = (
    transactions: any[],
    searchQuery: string,
    cardId: string
) => {
    return transactions.filter((txn) => {
        const matchesSearch =
            (txn.merchantName || txn.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (txn.transactionRefId || '').includes(searchQuery);
        const matchesCard = txn.cardId === cardId;
        return matchesSearch && matchesCard;
    });
};

/**
 * Sorts a list of transactions by the specified criteria.
 */
export const sortTransactions = (transactions: any[], sortBy: string) => {
    return [...transactions].sort((a, b) => {
        const idA = a.transactionRefId || '';
        const idB = b.transactionRefId || '';
        // Very basic manual sort simulation for mock data
        return sortBy === 'newest'
            ? idA < idB
                ? 1
                : -1
            : idA > idB
                ? 1
                : -1;
    });
};
/**
 * Calculates a date range string (from and to) based on a specified time range key.
 * @param timeRange The range key (e.g., 'thisMonth', 'lastMonth').
 * @param customRange Optional start and end dates for 'custom' range.
 */
export const calculateDateRange = (
    timeRange: string,
    customRange?: { start?: string; end?: string }
) => {
    const to = new Date();
    const from = new Date();
    switch (timeRange) {
        case 'thisMonth':
            from.setDate(1);
            break;
        case 'lastMonth':
            from.setMonth(to.getMonth() - 1);
            from.setDate(1);
            to.setDate(0); // Last day of previous month
            break;
        case 'last3Months':
            from.setMonth(to.getMonth() - 3);
            break;
        case 'thisYear':
            from.setMonth(0, 1); // January 1st
            break;
        case 'custom':
            if (customRange?.start && customRange?.end) {
                return {
                    dateFrom: customRange.start,
                    dateTo: customRange.end,
                };
            }
            break;
        default:
            from.setMonth(to.getMonth() - 1);
    }
    return {
        dateFrom: from.toISOString().split('T')[0],
        dateTo: to.toISOString().split('T')[0],
    };
};

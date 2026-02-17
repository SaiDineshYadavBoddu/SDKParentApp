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
 * Formats a transaction amount with sign and multi-currency support.
 * @param txn The transaction object.
 * @returns An object containing the formatted amount string and its color.
 */
export const getFormattedTransaction = (txn: any, colors: any) => {
    const isCredit = txn.debitCardFlag === 'C';
    const sign = isCredit ? '+ ' : '- ';
    const color = isCredit ? colors.statusResolved : colors.onSurface;

    const absAmount = Math.abs(txn.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const absSourceAmount = Math.abs(txn.sourceAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    let amountDisplay = `${sign}${txn.currency} ${absAmount}`;

    if (txn.sourceCurrency && txn.sourceCurrency !== txn.currency) {
        amountDisplay = `${sign}${txn.sourceCurrency} ${absSourceAmount} (${txn.currency} ${absAmount})`;
    }

    const displayName = txn.merchantName || (txn.debitCardFlag === 'D' ? 'Withdrawal' : txn.description);

    return { amountDisplay, color, displayName };
};

/**
 * Maps API transaction objects to SectionItem objects for display in SectionContainer.
 * @param transactions Array of transaction objects from the API.
 */
export const mapTransactionsToSectionItems = (transactions: any[], colors: any): SectionItem[] => {
    return transactions.map((txn) => {
        const { amountDisplay, color, displayName } = getFormattedTransaction(txn, colors);
        return {
            id: txn.transactionRefId,
            top: (
                <>
                    <CustomText type={TextType.CardTitle}>{displayName}</CustomText>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: ms(4) }}>
                        <CustomText type={TextType.CardTitle} style={{ color }}>
                            {amountDisplay}
                        </CustomText>
                    </View>
                </>
            ),
            middle: (
                <>
                    <CustomText type={TextType.ScreenHeadlineSmall} style={{ color: colors.secondaryText, fontSize: ms(12) }}>
                        {txn.transactionRefId}
                    </CustomText>
                    <CustomText type={TextType.ScreenHeadlineSmall} style={{ color: colors.secondaryText, fontSize: ms(12) }}>
                        {formatTransactionDate(txn.transactionDate)}
                    </CustomText>
                </>
            ),
        };
    });
};

/**
 * Filters a list of transactions based on search query and card ID.
 */
export const filterTransactions = (
    transactions: any[],
    searchQuery: string
) => {
    return transactions.filter((txn) => {
        const matchesSearch =
            (txn.merchantName || txn.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (txn.transactionRefId || '').includes(searchQuery);
        return matchesSearch;
    });
};

/**
 * Sorts a list of transactions by the specified criteria.
 */
export const sortTransactions = (transactions: any[], sortBy: string) => {
    return [...transactions].sort((a, b) => {
        const dateA = a.transactionDate ? new Date(a.transactionDate).getTime() : 0;
        const dateB = b.transactionDate ? new Date(b.transactionDate).getTime() : 0;

        if (sortBy === 'newest') {
            return dateB - dateA;
        } else {
            return dateA - dateB;
        }
    });
};
/**
 * Calculates a date range string (from and to) based on a specified time range key.
 * @param timeRange The range key (e.g., 'thisMonth', 'lastMonth').
 * @param customRange Optional start and end dates for 'custom' range.
 */
const formatToISODate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const calculateDateRange = (
    timeRange: string,
    customRange?: { start?: string; end?: string }
) => {
    const today = new Date();
    const to = new Date(today);
    const from = new Date(today);

    console.log(`calculateDateRange called with: ${timeRange}`);

    switch (timeRange) {
        case 'lastWeek':
            // 7 days ago to today
            from.setDate(today.getDate() - 7);
            break;
        case 'thisMonth':
            // Start of current month to today
            from.setDate(1);
            break;
        case 'lastMonth':
            // 30 days ago to today (e.g. Jan 18 to Feb 17)
            from.setDate(today.getDate() - 30);
            break;
        case 'last3Months':
            // 90 days ago to today (e.g. Nov 19 to Feb 17)
            from.setDate(today.getDate() - 90);
            break;
        case 'thisYear':
            // Start of current year to today
            from.setMonth(0, 1);
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
            // Default to last 30 days
            from.setDate(today.getDate() - 30);
    }

    const result = {
        dateFrom: formatToISODate(from),
        dateTo: formatToISODate(to),
    };
    console.log(`calculated result:`, result);
    return result;
};

/**
 * Formats a date string to DD.MM.YYYY format.
 * @param dateString The date string to format (e.g., "2026-01-13").
 * @returns Formatted date string in DD.MM.YYYY format.
 */
export const formatDateRange = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
};

/**
 * Formats a creation timestamp to "DD MMM YYYY, HH:MMAM/PM" format.
 * @param dateString The ISO date string to format.
 * @returns Formatted timestamp string without the "Created" prefix.
 */
export const formatCreationTimestamp = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-GB', { month: 'short' });
    const year = date.getFullYear();
    const time = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
    return `${day} ${month} ${year}, ${time}`;
};
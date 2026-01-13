import React from 'react';
import { ms } from 'react-native-size-matters';
import ResolvedSVG from '../assets/svgs/ResolvedSVG';
import InProgressSVG from '../assets/svgs/InProgressSVG';
import CloseSVG from '../assets/svgs/CloseSVG';
import RequestCheckMarkSVG from '../assets/svgs/RequestCheckMarkSVG';
import ClockSVG from '../assets/svgs/ClockSVG';
import DatePickerSVG from '../assets/svgs/DatePickerSVG';

export const renderIcon = (type: string) => {
    switch (type) {
        case 'clock':
            return <ClockSVG width={ms(16)} height={ms(16)} />;
        case 'check':
            return <RequestCheckMarkSVG width={ms(16)} height={ms(16)} />;
        case 'calendar':
            return <DatePickerSVG width={ms(16)} height={ms(16)} />;
        case 'close':
            return <CloseSVG width={ms(16)} height={ms(16)} />;
        default:
            return null;
    }
};

export const getProgressStatusIcon = (status: string, colors: any) => {
    switch (status) {
        case 'AUTO_APPROVED':
        case 'APPROVED':
        case 'RESOLVED':
            return <ResolvedSVG width={ms(16)} height={ms(16)} />;
        case 'DONE':
            return <RequestCheckMarkSVG width={ms(16)} height={ms(16)} />;
        case 'PENDING_APPROVAL':
        case 'inProgress':
            return <InProgressSVG width={ms(16)} height={ms(16)} />;
        case 'REJECTED':
        case 'FAILED':
        case 'CANCELLED':
            return <CloseSVG width={ms(16)} height={ms(16)} color={colors?.error} />;
        default:
            return null;
    }
};

export const getProgressStatusColor = (status: string, colors: any) => {
    switch (status) {
        case 'AUTO_APPROVED':
        case 'APPROVED':
        case 'DONE':
        case 'RESOLVED':
            return colors.statusResolved;
        case 'PENDING_APPROVAL':
        case 'inProgress':
            return colors.statusInProgress;
        case 'REJECTED':
        case 'FAILED':
        case 'CANCELLED':
            return colors.error || '#FF0000';
        default:
            return colors.tertiaryText;
    }
};

export const getStatusColors = (type: string, colors: any) => {
    switch (type) {
        case 'ACTIVATE':
            return { backgroundColor: colors.onStatusActivation, textColor: colors.statusActivation };
        case 'UNBLOCK':
            return { backgroundColor: colors.onStatusUnblocking, textColor: colors.statusUnblocking };
        case 'BLOCK':
            return { backgroundColor: colors.onStatusBlocked, textColor: colors.statusBlocked };
        case 'REPLACE':
            return { backgroundColor: colors.onStatusReplacement, textColor: colors.statusReplacement };
        case 'CLOSE':
            return { backgroundColor: colors.onStatusClosure, textColor: colors.statusClosure };
        default:
            return { backgroundColor: colors.outline, textColor: colors.secondaryText };
    }
};

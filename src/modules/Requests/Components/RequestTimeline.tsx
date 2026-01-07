import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ms } from 'react-native-size-matters';
import CustomText, { TextType } from '../../../common/components/CustomText';
import { Spacing } from '../../../theme/spacing';
import { useTheme } from '../../../theme/ThemeProvider';

export type TimelineEvent = {
    title: string;
    isCompleted: boolean;
};

interface RequestTimelineProps {
    events: TimelineEvent[];
}

const RequestTimeline: React.FC<RequestTimelineProps> = ({ events }) => {
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            {events.map((event, index) => (
                <View key={index} style={styles.eventContainer}>
                    <View style={styles.indicatorColumn}>
                        <View
                            style={[
                                styles.dot,
                                { backgroundColor: event.isCompleted ? '#2FBF71' : '#E0E0E0' },
                            ]}
                        />
                        {index < events.length - 1 && (
                            <View
                                style={[
                                    styles.line,
                                    { backgroundColor: event.isCompleted ? '#2FBF71' : '#E0E0E0' },
                                ]}
                            />
                        )}
                    </View>
                    <View style={styles.contentColumn}>
                        <CustomText
                            type={TextType.Label}
                            style={[
                                styles.eventTitle,
                                { color: event.isCompleted ? '#000' : '#757575' },
                            ]}
                        >
                            {event.title}
                        </CustomText>
                    </View>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: Spacing.s,
    },
    eventContainer: {
        flexDirection: 'row',
        minHeight: ms(40),
    },
    indicatorColumn: {
        alignItems: 'center',
        width: ms(20),
        marginRight: Spacing.m,
    },
    dot: {
        width: ms(12),
        height: ms(12),
        borderRadius: ms(6),
        zIndex: 1,
    },
    line: {
        width: 2,
        flex: 1,
        marginVertical: -2, // Slight overlap to ensure continuous line
    },
    contentColumn: {
        flex: 1,
        paddingBottom: Spacing.l,
    },
    eventTitle: {
        fontSize: ms(13),
        fontWeight: '500',
        lineHeight: ms(18),
    },
});

export default RequestTimeline;

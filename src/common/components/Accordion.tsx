import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { ms } from 'react-native-size-matters';
import CustomText, { TextType } from './CustomText';
import CustomIcon from './CustomIcon';
import { Spacing } from '../../theme/spacing';
import { useTheme } from '../../theme/ThemeProvider';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AccordionProps {
    title: string;
    children: React.ReactNode;
    initiallyExpanded?: boolean;
    containerStyle?: any;
    headerStyle?: any;
    contentStyle?: any;
}

const Accordion: React.FC<AccordionProps> = ({
    title,
    children,
    initiallyExpanded = true,
    containerStyle,
    headerStyle,
    contentStyle,
}) => {
    const { colors } = useTheme();
    const [isExpanded, setIsExpanded] = useState(initiallyExpanded);

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsExpanded(!isExpanded);
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }, containerStyle]}>
            <TouchableOpacity
                onPress={toggleExpand}
                style={[styles.header, headerStyle]}
                activeOpacity={0.7}
            >
                <CustomText type={TextType.SectionTitle} style={styles.title}>
                    {title}
                </CustomText>
                <CustomIcon
                    type="feather"
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={ms(20)}
                    color={colors.onBackground}
                />
            </TouchableOpacity>
            {isExpanded && (
                <>
                    <View style={styles.separator} />
                    <View style={[styles.content, contentStyle]}>{children}</View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: ms(16),
        borderWidth: 1,
        borderColor: '#F0F0F0',
        marginBottom: Spacing.m,
        overflow: 'hidden',
        // Subtle shadow for premium feel
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: ms(16),
    },
    separator: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginHorizontal: ms(16),
    },
    title: {
        fontSize: ms(16),
        fontWeight: '700',
    },
    content: {
        paddingHorizontal: ms(16),
        paddingBottom: ms(16),
        paddingTop: ms(12),
    },
});

export default Accordion;

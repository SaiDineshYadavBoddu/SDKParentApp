import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager, Animated } from 'react-native';
import { ms } from 'react-native-size-matters';
import CustomText, { TextType } from './CustomText';
import { Spacing } from '../../theme/spacing';
import { useTheme } from '../../theme/ThemeProvider';

import ChevronDownSVG from '../../assets/svgs/CheveronDownSVG';

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
    const animatedController = React.useRef(new Animated.Value(initiallyExpanded ? 1 : 0)).current;

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        
        Animated.timing(animatedController, {
            toValue: isExpanded ? 0 : 1,
            duration: 300,
            useNativeDriver: true,
        }).start();

        setIsExpanded(!isExpanded);
    };

    const arrowTransform = animatedController.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    return (
        <View style={[styles.container, { backgroundColor: colors.background, borderColor: colors.outline }, containerStyle]}>
            <TouchableOpacity
                onPress={toggleExpand}
                style={[styles.header, headerStyle]}
                activeOpacity={0.7}
            >
                <CustomText type={TextType.SectionTitle} style={styles.title}>
                    {title}
                </CustomText>
                <Animated.View style={{ transform: [{ rotate: arrowTransform }] }}>
                    <ChevronDownSVG width={ms(24)} height={ms(24)} color={colors.onBackground} />
                </Animated.View>
            </TouchableOpacity>
            {isExpanded && (
                <>
                    <View style={[styles.separator, { backgroundColor: colors.outline }]} />
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
        marginHorizontal: ms(16),
    },
    title: {
        fontWeight: '500',
    },
    content: {
        paddingHorizontal: ms(16),
        paddingBottom: ms(16),
        paddingTop: ms(12),
    },
});

export default Accordion;

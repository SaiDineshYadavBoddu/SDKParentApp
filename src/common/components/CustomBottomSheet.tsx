import React, { useEffect, useRef } from "react";
import {
    Modal,
    View,
    StyleSheet,
    Animated,
    Dimensions,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ScrollView,
} from "react-native";
import { ms } from "react-native-size-matters";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../theme/ThemeProvider";
import { Spacing } from "../../theme/spacing";
import CustomText, { TextType } from "./CustomText";
import CustomIcon from "./CustomIcon";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface CustomBottomSheetProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    scrollEnabled?: boolean;
}

const CustomBottomSheet: React.FC<CustomBottomSheetProps> = ({
    visible,
    onClose,
    title,
    children,
    scrollEnabled = true,
}) => {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: SCREEN_HEIGHT,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start(() => { });
        }
    }, [visible, translateY, opacity]);

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={onClose}>
                    <Animated.View
                        style={[
                            styles.backdrop,
                            {
                                opacity,
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                            },
                        ]}
                    />
                </TouchableWithoutFeedback>
                <Animated.View style={[styles.sheet, {
                    backgroundColor: colors.background,
                    paddingBottom: Math.max(Spacing.l, insets.bottom),
                    transform: [{ translateY }],
                    maxHeight: SCREEN_HEIGHT * 0.8,
                }]}>
                    <View style={styles.header}>
                        {title && (
                            <CustomText type={TextType.SectionTitle}>{title}</CustomText>
                        )}
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <CustomIcon
                                type="feather"
                                name="x"
                                size={ms(24)}
                                color={colors.onBackground}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.content}>
                        {scrollEnabled ? (
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {children}
                            </ScrollView>
                        ) : children}
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-end",
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    sheet: {
        borderTopLeftRadius: ms(24),
        borderTopRightRadius: ms(24),
        minHeight: ms(200),
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: Spacing.l,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#E0E0E0",
    },
    closeButton: {
        padding: ms(4),
    },
    content: {
        padding: Spacing.l,
    },
});

export default CustomBottomSheet;

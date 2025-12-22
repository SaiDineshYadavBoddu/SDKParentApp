// components/SectionContainer.tsx
import React from "react";
import {
    View,
    StyleSheet,
    FlatList,
    ListRenderItemInfo,
    StyleProp,
    ViewStyle,
    TouchableOpacity,
} from "react-native";
import { ms } from "react-native-size-matters";
import CustomText, { TextType } from "./CustomText";
import FlexibleCard from "./FlexibleCard";
import { Spacing } from "../../theme/spacing";
import { useTheme } from "../../theme/ThemeProvider";

export type SectionItem = {
    id: string;
    start?: React.ReactNode;
    top?: React.ReactNode;
    middle?: React.ReactNode;
    end?: React.ReactNode;
    body?: React.ReactNode;
    onPress?: () => void;
};

interface Props {
    title?: string;
    rightTitle?: string;
    onRightTitlePress?: () => void;
    items: SectionItem[];
    style?: StyleProp<ViewStyle>;
    contentStyle?: StyleProp<ViewStyle>;
    ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null | undefined;
}

export default function SectionContainer({
    title,
    rightTitle,
    onRightTitlePress,
    items,
    style,
    contentStyle,
    ListEmptyComponent,
}: Props) {
    const { colors } = useTheme();

    const renderItem = ({ item }: ListRenderItemInfo<SectionItem>) => {
        return (
            <FlexibleCard
                start={item.start}
                top={item.top}
                middle={item.middle}
                end={item.end}
                body={item.body}
                onPress={item.onPress}
            />
        );
    };

    return (
        <View style={[styles.root, style]}>
            {title ? (
                <View style={styles.headerRow}>
                    <CustomText type={TextType.SectionTitle}>
                        {title}
                    </CustomText>
                    {rightTitle && (
                        <TouchableOpacity onPress={onRightTitlePress}>
                            <CustomText type={TextType.ActionLabel} style={{ color: colors.primary }}>
                                {rightTitle}
                            </CustomText>
                        </TouchableOpacity>
                    )}
                </View>
            ) : null}

            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                ListEmptyComponent={ListEmptyComponent ?? null}
                ItemSeparatorComponent={() => <View style={{ height: Spacing.s }} />}
                contentContainerStyle={[
                    styles.content,
                    contentStyle,
                    items.length === 0 && { paddingVertical: Spacing.m },
                ]}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        width: "100%",
        paddingVertical: ms(8),
        paddingHorizontal: ms(18),
        backgroundColor: "#fff",
        borderRadius: ms(20),
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        zIndex: 1,
    },
    headerRow: {
        paddingVertical: ms(10),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    content: {
        width: "100%",
    },
});

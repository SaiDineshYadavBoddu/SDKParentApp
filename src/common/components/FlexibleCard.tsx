// components/FlexibleCard.tsx
import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { ms } from 'react-native-size-matters';
import { useTheme } from '../../theme/ThemeProvider';
import { Spacing } from '../../theme/spacing';

interface Props {
  start?: React.ReactNode;
  top?: React.ReactNode;
  middle?: React.ReactNode;
  end?: React.ReactNode;
  body?: React.ReactNode;

  onPress?: () => void;
  elevated?: boolean;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
}

export default function FlexibleCard({
  start,
  top,
  middle,
  end,
  body,
  onPress,
  elevated = false,
  style,
  backgroundColor,
}: Props) {
  const { colors } = useTheme();
  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        styles.card,
        {
          backgroundColor: backgroundColor ?? colors.surface,
          elevation: elevated ? 6 : 0,
        },
        style,
      ]}
    >
      <View style={styles.row}>
        {/* START SLOT */}
        {start ? <View style={styles.start}>{start}</View> : null}

        {/* CENTER COLUMN */}
        <View style={styles.centerColumn}>
          {top ? <View style={styles.fullRow}>{top}</View> : null}

          {middle ? (
            <>
              <View style={{ height: Spacing.xs }} />
              <View style={styles.fullRow}>{middle}</View>
            </>
          ) : null}
        </View>

        {/* END SLOT */}
        {end ? <View style={styles.end}>{end}</View> : null}
      </View>

      {/* BODY SLOT */}
      {body ? <View style={styles.body}>{body}</View> : null}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: ms(12),
    paddingVertical: ms(8),
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },

  start: {
    minWidth: ms(36),
    paddingRight: ms(12),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  end: {
    minWidth: ms(36),
    paddingLeft: ms(6),
    justifyContent: 'center',
    alignItems: 'flex-end',
  },

  centerColumn: {
    flex: 1,
    justifyContent: 'center',
  },

  fullRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  body: {
    paddingTop: ms(6),
  },
});

import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, scale, spacing, typography } from '../theme';

type AppHeaderProps = {
  title?: string;
  onPressSettings?: () => void;
};

/** Compact brand bar. Pinned via the `header` prop on `Screen`. */
export function AppHeader({ title = 'SizeKit', onPressSettings }: AppHeaderProps) {
  return (
    <View style={styles.brandRow} accessibilityRole="header">
      <View style={styles.mark}>
        <View style={styles.markInner} />
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      {onPressSettings ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Settings"
          onPress={onPressSettings}
          hitSlop={10}
          style={({ pressed }) => [
            styles.settingsButton,
            pressed && styles.settingsButtonPressed,
          ]}
        >
          <Ionicons
            name="settings-outline"
            size={scale(20)}
            color={colors.inkSecondary}
          />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  mark: {
    width: scale(34),
    height: scale(34),
    borderRadius: radii.sm,
    backgroundColor: colors.primaryCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markInner: {
    width: scale(13),
    height: scale(13),
    borderRadius: scale(4),
    borderWidth: 2,
    borderColor: colors.accentMid,
    backgroundColor: 'transparent',
  },
  title: {
    ...typography.brand,
    fontSize: scale(22),
    letterSpacing: -0.4,
    flex: 1,
  },
  settingsButton: {
    width: scale(38),
    height: scale(38),
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  settingsButtonPressed: {
    backgroundColor: colors.surfaceMuted,
  },
});

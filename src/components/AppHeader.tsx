import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, scale, spacing, typography } from '../theme';

type AppHeaderProps = {
  title?: string;
  tagline?: string;
  onPressSettings?: () => void;
};

export function AppHeader({
  title = 'SizeKit',
  tagline = 'Make your files fit.',
  onPressSettings,
}: AppHeaderProps) {
  return (
    <View style={styles.container} accessibilityRole="header">
      <View style={styles.brandRow}>
        <View style={styles.mark}>
          <View style={styles.markInner} />
        </View>
        <Text style={styles.title} accessibilityRole="header">
          {title}
        </Text>
        {onPressSettings ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Settings"
            onPress={onPressSettings}
            hitSlop={12}
            style={styles.settingsButton}
          >
            <Text style={styles.settingsLabel}>Settings</Text>
          </Pressable>
        ) : null}
      </View>
      <Text style={styles.tagline}>{tagline}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  mark: {
    width: scale(36),
    height: scale(36),
    borderRadius: radii.sm,
    backgroundColor: colors.primaryCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markInner: {
    width: scale(14),
    height: scale(14),
    borderRadius: scale(4),
    borderWidth: 2,
    borderColor: colors.accentMid,
    backgroundColor: 'transparent',
  },
  title: {
    ...typography.brand,
    flex: 1,
  },
  settingsButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  settingsLabel: {
    ...typography.caption,
    color: colors.accentDark,
    fontWeight: '600',
  },
  tagline: {
    ...typography.tagline,
    paddingLeft: 2,
  },
});

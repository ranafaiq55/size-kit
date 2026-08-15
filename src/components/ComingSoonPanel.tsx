import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radii, scale, spacing, typography } from '../theme';

type ComingSoonPanelProps = {
  title: string;
  description: string;
  icon?: keyof typeof Ionicons.glyphMap;
};

export function ComingSoonPanel({
  title,
  description,
  icon = 'construct-outline',
}: ComingSoonPanelProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={scale(28)} color={colors.accent} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Coming soon</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  iconWrap: {
    width: scale(64),
    height: scale(64),
    borderRadius: radii.lg,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.title,
    fontSize: scale(22),
    textAlign: 'center',
  },
  description: {
    ...typography.body,
    textAlign: 'center',
    maxWidth: scale(320),
  },
  badge: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  badgeText: {
    ...typography.caption,
    color: colors.inkSecondary,
    fontWeight: '600',
  },
});

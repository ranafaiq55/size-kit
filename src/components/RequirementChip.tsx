import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { RequirementListItem } from '../constants/tools';
import { colors, radii, scale, spacing, typography } from '../theme';

type RequirementChipProps = {
  preset: RequirementListItem;
  onPress: () => void;
};

export function RequirementChip({ preset, onPress }: RequirementChipProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${preset.title}. ${preset.subtitle}`}
      style={({ pressed }) => [styles.chip, pressed && styles.pressed]}
    >
      <View style={styles.iconWrap}>
        <Ionicons name={preset.icon} size={scale(18)} color={colors.accentDark} />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>{preset.title}</Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {preset.subtitle}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={scale(16)} color={colors.borderStrong} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  pressed: {
    backgroundColor: colors.surfaceMuted,
  },
  iconWrap: {
    width: scale(36),
    height: scale(36),
    borderRadius: radii.sm,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...typography.button,
    color: colors.ink,
    fontSize: scale(14),
  },
  subtitle: {
    ...typography.caption,
  },
});

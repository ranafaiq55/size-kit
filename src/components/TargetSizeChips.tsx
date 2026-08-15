import { Pressable, StyleSheet, Text, View } from 'react-native';

import { TARGET_SIZE_PRESETS } from '../utils/fileSize';
import { colors, radii, scale, spacing, typography } from '../theme';

type TargetSizeChipsProps = {
  selectedBytes: number | null;
  onSelect: (bytes: number) => void;
};

export function TargetSizeChips({ selectedBytes, onSelect }: TargetSizeChipsProps) {
  return (
    <View style={styles.wrap}>
      {TARGET_SIZE_PRESETS.map((preset) => {
        const selected = selectedBytes === preset.bytes;
        return (
          <Pressable
            key={preset.id}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onSelect(preset.bytes)}
            style={[styles.chip, selected && styles.chipSelected]}
          >
            <Text style={[styles.label, selected && styles.labelSelected]}>
              {preset.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  label: {
    ...typography.caption,
    color: colors.inkSecondary,
    fontSize: scale(13),
    fontWeight: '600',
  },
  labelSelected: {
    color: colors.accentDark,
  },
});

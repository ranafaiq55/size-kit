import { Pressable, StyleSheet, Text, View } from 'react-native';

import { DIMENSION_PRESETS, type DimensionPreset } from '../utils/dimensions';
import { colors, radii, scale, spacing, typography } from '../theme';

type DimensionPresetChipsProps = {
  selected: DimensionPreset | null;
  onSelect: (preset: DimensionPreset) => void;
};

export function DimensionPresetChips({
  selected,
  onSelect,
}: DimensionPresetChipsProps) {
  return (
    <View style={styles.wrap}>
      {DIMENSION_PRESETS.map((preset) => {
        const isSelected = selected?.id === preset.id;
        return (
          <Pressable
            key={preset.id}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            onPress={() => onSelect(preset)}
            style={[styles.chip, isSelected && styles.chipSelected]}
          >
            <Text style={[styles.label, isSelected && styles.labelSelected]}>
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

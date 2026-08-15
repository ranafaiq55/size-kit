import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  CROP_ASPECT_PRESETS,
  type CropAspectPreset,
} from '../constants/cropAspects';
import { colors, radii, scale, spacing, typography } from '../theme';

type CropAspectChipsProps = {
  selectedId: string;
  onSelect: (preset: CropAspectPreset) => void;
};

export function CropAspectChips({ selectedId, onSelect }: CropAspectChipsProps) {
  return (
    <View style={styles.wrap}>
      {CROP_ASPECT_PRESETS.map((preset) => {
        const selected = selectedId === preset.id;
        return (
          <Pressable
            key={preset.id}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onSelect(preset)}
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

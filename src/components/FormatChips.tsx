import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  OUTPUT_FORMAT_OPTIONS,
  type OutputImageFormat,
} from '../services/convertFormat';
import { colors, radii, scale, spacing, typography } from '../theme';

type FormatChipsProps = {
  selected: OutputImageFormat;
  onSelect: (format: OutputImageFormat) => void;
};

export function FormatChips({ selected, onSelect }: FormatChipsProps) {
  return (
    <View style={styles.wrap}>
      {OUTPUT_FORMAT_OPTIONS.map((option) => {
        const isSelected = selected === option.id;
        return (
          <Pressable
            key={option.id}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            onPress={() => onSelect(option.id)}
            style={[styles.chip, isSelected && styles.chipSelected]}
          >
            <Text style={[styles.label, isSelected && styles.labelSelected]}>
              {option.label}
            </Text>
            <Text style={styles.subtitle}>{option.subtitle}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
  },
  chip: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    gap: 2,
  },
  chipSelected: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  label: {
    ...typography.button,
    color: colors.ink,
    fontSize: scale(14),
  },
  labelSelected: {
    color: colors.accentDark,
  },
  subtitle: {
    ...typography.caption,
  },
});

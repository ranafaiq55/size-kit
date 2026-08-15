import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { PdfPageSize } from '../services/imageToPdf';
import { colors, radii, scale, spacing, typography } from '../theme';

const PAGE_OPTIONS: { id: PdfPageSize; label: string; subtitle: string }[] = [
  { id: 'a4', label: 'A4', subtitle: 'Common for forms' },
  { id: 'letter', label: 'Letter', subtitle: 'US letter size' },
  { id: 'fit', label: 'Fit photo', subtitle: 'Page matches photo' },
];

type PdfPageSizeChipsProps = {
  selected: PdfPageSize;
  onSelect: (size: PdfPageSize) => void;
};

export function PdfPageSizeChips({ selected, onSelect }: PdfPageSizeChipsProps) {
  return (
    <View style={styles.wrap}>
      {PAGE_OPTIONS.map((option) => {
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

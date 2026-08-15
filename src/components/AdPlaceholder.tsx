import { StyleSheet, Text, View } from 'react-native';

import { adService } from '../services/adService';
import type { AdPlacement } from '../services/adService';
import { colors, radii, spacing, typography } from '../theme';

type AdPlaceholderProps = {
  placement: AdPlacement;
};

/** Visible only while ads are disabled — keeps layout ready for a real banner later. */
export function AdPlaceholder({ placement }: AdPlaceholderProps) {
  if (adService.isEnabled()) {
    // Future: render real AdMob banner for `placement`.
    return null;
  }

  // Hide empty ad chrome in production UX for now.
  if (placement) {
    return null;
  }

  return (
    <View style={styles.box} accessibilityElementsHidden>
      <Text style={styles.label}>Ad space</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    marginTop: spacing.lg,
    minHeight: 50,
    borderRadius: radii.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceMuted,
  },
  label: {
    ...typography.caption,
  },
});

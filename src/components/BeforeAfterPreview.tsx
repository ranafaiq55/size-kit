import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, scale, spacing, typography } from '../theme';
import { formatFileSize } from '../utils/fileSize';

type PreviewMode = 'original' | 'compressed';

type BeforeAfterPreviewProps = {
  originalUri: string;
  originalBytes: number;
  resultUri: string;
  resultBytes: number;
  onPressImage?: (uri: string, caption: string) => void;
};

/** Lets the user compare the picked photo with the compressed result before saving. */
export function BeforeAfterPreview({
  originalUri,
  originalBytes,
  resultUri,
  resultBytes,
  onPressImage,
}: BeforeAfterPreviewProps) {
  const [mode, setMode] = useState<PreviewMode>('compressed');

  const isOriginal = mode === 'original';
  const uri = isOriginal ? originalUri : resultUri;
  const bytes = isOriginal ? originalBytes : resultBytes;
  const label = isOriginal ? 'Original' : 'Compressed';
  const caption = `${label} · ${formatFileSize(bytes)}`;

  return (
    <View style={styles.container}>
      <View style={styles.toggle}>
        <ToggleOption
          label="Original"
          selected={isOriginal}
          onPress={() => setMode('original')}
        />
        <ToggleOption
          label="Compressed"
          selected={!isOriginal}
          onPress={() => setMode('compressed')}
        />
      </View>

      <Pressable
        accessibilityRole="imagebutton"
        accessibilityLabel={`${caption}. Tap to view full screen.`}
        onPress={() => onPressImage?.(uri, caption)}
        style={({ pressed }) => [styles.imageWrap, pressed && styles.imagePressed]}
      >
        <Image
          source={{ uri }}
          style={styles.image}
          accessibilityIgnoresInvertColors
        />
        <View style={styles.zoomBadge}>
          <Ionicons name="expand-outline" size={scale(14)} color={colors.white} />
        </View>
      </Pressable>

      <View style={styles.footer}>
        <Text style={styles.footerLabel}>{label}</Text>
        <Text style={styles.footerValue}>{formatFileSize(bytes)}</Text>
      </View>
    </View>
  );
}

function ToggleOption({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.toggleOption, selected && styles.toggleOptionSelected]}
    >
      <Text
        style={[styles.toggleLabel, selected && styles.toggleLabelSelected]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  toggle: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.full,
    padding: scale(4),
    gap: scale(4),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  toggleOption: {
    flex: 1,
    minHeight: scale(36),
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  toggleOptionSelected: {
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderStrong,
  },
  toggleLabel: {
    ...typography.caption,
    fontWeight: '600',
  },
  toggleLabelSelected: {
    color: colors.ink,
  },
  imageWrap: {
    borderRadius: radii.lg,
    overflow: 'hidden',
    backgroundColor: colors.surfaceMuted,
  },
  imagePressed: {
    opacity: 0.92,
  },
  image: {
    width: '100%',
    height: scale(280),
    resizeMode: 'contain',
  },
  zoomBadge: {
    position: 'absolute',
    right: spacing.sm,
    bottom: spacing.sm,
    width: scale(28),
    height: scale(28),
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(11, 18, 32, 0.55)',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLabel: {
    ...typography.caption,
  },
  footerValue: {
    ...typography.button,
    color: colors.ink,
    fontSize: scale(14),
  },
});

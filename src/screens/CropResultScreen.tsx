import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { AdPlaceholder } from '../components/AdPlaceholder';
import { ImagePreviewModal } from '../components/ImagePreviewModal';
import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { adService } from '../services/adService';
import { isGallerySaveAvailable, saveImageToGallery } from '../services/saveImage';
import { colors, radii, scale, spacing, typography } from '../theme';
import type { RootStackParamList } from '../types/navigation';
import { formatFileSize } from '../utils/fileSize';

type Props = NativeStackScreenProps<RootStackParamList, 'CropResult'>;

export function CropResultScreen({ navigation, route }: Props) {
  const { resultUri, resultBytes, width, height, aspectLabel, note } =
    route.params;

  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const canSaveToGallery = isGallerySaveAvailable();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await saveImageToGallery(resultUri);

      if (result.status === 'saved') {
        setSaved(true);
        await adService.showInterstitialIfAppropriate('after_save');
        Alert.alert('Saved', 'Your cropped photo was saved to your gallery.');
        return;
      }

      if (result.status === 'permission_denied') {
        Alert.alert(
          'Permission needed',
          'Allow SizeKit to save the cropped photo to your gallery. The file stays on your device.',
        );
        return;
      }

      if (result.status === 'unavailable') {
        await handleShare();
        return;
      }

      Alert.alert(
        'Could not save',
        'Something went wrong while saving. Please try again.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const available = await Sharing.isAvailableAsync();
      if (!available) {
        Alert.alert(
          'Sharing unavailable',
          'Sharing is not available on this device.',
        );
        return;
      }

      await Sharing.shareAsync(resultUri, {
        mimeType: 'image/jpeg',
        dialogTitle: 'Share cropped photo',
      });
      await adService.showInterstitialIfAppropriate('after_share');
    } catch {
      Alert.alert(
        'Could not share',
        'Something went wrong while sharing. Please try again.',
      );
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Screen scrollable>
      <Pressable
        accessibilityRole="imagebutton"
        accessibilityLabel="View cropped photo full screen"
        onPress={() => setPreviewOpen(true)}
        style={({ pressed }) => [styles.previewWrap, pressed && styles.pressed]}
      >
        <Image
          source={{ uri: resultUri }}
          style={styles.preview}
          accessibilityIgnoresInvertColors
        />
        <Text style={styles.zoomHint}>Tap to zoom</Text>
      </Pressable>

      <View style={styles.stats}>
        <Stat label="Frame" value={aspectLabel} />
        <Stat label="Size" value={formatFileSize(resultBytes)} />
        <Stat label="Pixels" value={`${width}×${height}`} emphasize />
      </View>

      {note ? (
        <View style={styles.note}>
          <Text style={styles.noteText}>{note}</Text>
        </View>
      ) : (
        <Text style={styles.success}>Ready to use — cropped on device.</Text>
      )}

      <PrimaryButton
        label={
          saved
            ? 'Saved to gallery'
            : canSaveToGallery
              ? 'Save photo'
              : 'Save or share photo'
        }
        onPress={() => {
          void handleSave();
        }}
        loading={isSaving}
        disabled={saved}
        style={styles.action}
      />
      <PrimaryButton
        label="Share"
        variant="secondary"
        onPress={() => {
          void handleShare();
        }}
        loading={isSharing}
        style={styles.action}
      />
      <PrimaryButton
        label="Crop another"
        variant="ghost"
        onPress={() => navigation.navigate('CropPhoto')}
      />

      <AdPlaceholder placement="result_banner" />

      <ImagePreviewModal
        uri={previewOpen ? resultUri : null}
        caption={`Cropped · ${width}×${height} · ${formatFileSize(resultBytes)}`}
        onClose={() => setPreviewOpen(false)}
      />
    </Screen>
  );
}

function Stat({
  label,
  value,
  emphasize = false,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, emphasize && styles.statEmphasize]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  previewWrap: {
    borderRadius: radii.lg,
    overflow: 'hidden',
    backgroundColor: colors.surfaceMuted,
    marginBottom: spacing.lg,
  },
  pressed: {
    opacity: 0.92,
  },
  preview: {
    width: '100%',
    height: scale(280),
    resizeMode: 'contain',
  },
  zoomHint: {
    ...typography.caption,
    textAlign: 'center',
    paddingVertical: spacing.sm,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  stat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    gap: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
  },
  statValue: {
    ...typography.button,
    color: colors.ink,
    fontSize: scale(12),
    textAlign: 'center',
  },
  statEmphasize: {
    color: colors.accentDark,
  },
  note: {
    backgroundColor: colors.accentSoft,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  noteText: {
    ...typography.caption,
    color: colors.accentDark,
    lineHeight: scale(18),
  },
  success: {
    ...typography.caption,
    color: colors.accentDark,
    marginBottom: spacing.lg,
  },
  action: {
    marginBottom: spacing.sm,
  },
});

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Sharing from 'expo-sharing';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { AdPlaceholder } from '../components/AdPlaceholder';
import { BeforeAfterPreview } from '../components/BeforeAfterPreview';
import { ImagePreviewModal } from '../components/ImagePreviewModal';
import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { adService } from '../services/adService';
import { isGallerySaveAvailable, saveImageToGallery } from '../services/saveImage';
import { colors, radii, scale, spacing, typography } from '../theme';
import type { RootStackParamList } from '../types/navigation';
import { formatFileSize } from '../utils/fileSize';
import { deleteUrisQuietly } from '../utils/files';

type Props = NativeStackScreenProps<RootStackParamList, 'CompressResult'>;

export function CompressResultScreen({ navigation, route }: Props) {
  const {
    originalUri,
    originalBytes,
    resultUri,
    resultBytes,
    targetBytes,
    width,
    height,
    note,
    tempUris = [],
  } = route.params;

  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState<{ uri: string; caption: string } | null>(
    null,
  );
  const canSaveToGallery = isGallerySaveAvailable();

  useEffect(() => {
    return () => {
      void deleteUrisQuietly(tempUris);
    };
  }, [tempUris]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await saveImageToGallery(resultUri);

      if (result.status === 'saved') {
        setSaved(true);
        await adService.showInterstitialIfAppropriate('after_save');
        Alert.alert('Saved', 'Your compressed photo was saved to your gallery.');
        return;
      }

      if (result.status === 'permission_denied') {
        Alert.alert(
          'Permission needed',
          'Allow SizeKit to save the compressed photo to your gallery. The file stays on your device.',
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
        dialogTitle: 'Share compressed photo',
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
      <BeforeAfterPreview
        originalUri={originalUri}
        originalBytes={originalBytes}
        resultUri={resultUri}
        resultBytes={resultBytes}
        onPressImage={(uri, caption) => setPreview({ uri, caption })}
      />

      <View style={styles.stats}>
        <Stat label="Original" value={formatFileSize(originalBytes)} />
        <Stat label="Target" value={formatFileSize(targetBytes)} />
        <Stat label="Result" value={formatFileSize(resultBytes)} emphasize />
      </View>

      <Text style={styles.dimensions}>
        {width} × {height} px
      </Text>

      {note ? (
        <View style={styles.note}>
          <Text style={styles.noteText}>{note}</Text>
        </View>
      ) : (
        <Text style={styles.success}>Ready to upload — processed on device.</Text>
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
        label="Compress another"
        variant="ghost"
        onPress={() => navigation.navigate('CompressPhoto')}
      />

      <AdPlaceholder placement="result_banner" />

      <ImagePreviewModal
        uri={preview?.uri ?? null}
        caption={preview?.caption}
        onClose={() => setPreview(null)}
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
    fontSize: scale(14),
  },
  statEmphasize: {
    color: colors.accentDark,
  },
  dimensions: {
    ...typography.caption,
    marginBottom: spacing.md,
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

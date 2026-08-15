import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { FormatChips } from '../components/FormatChips';
import { ImagePreviewModal } from '../components/ImagePreviewModal';
import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { SectionHeader } from '../components/SectionHeader';
import {
  convertImageFormat,
  type OutputImageFormat,
} from '../services/convertFormat';
import { pickImageFromLibrary } from '../services/imagePicker';
import { colors, radii, scale, spacing, typography } from '../theme';
import type { RootStackParamList } from '../types/navigation';
import { formatFileSize } from '../utils/fileSize';
import { getFileSizeBytes } from '../utils/files';

type Props = NativeStackScreenProps<RootStackParamList, 'ConvertFormat'>;

type SelectedImage = {
  uri: string;
  width: number;
  height: number;
  bytes: number;
};

export function ConvertFormatScreen({ navigation }: Props) {
  const [image, setImage] = useState<SelectedImage | null>(null);
  const [format, setFormat] = useState<OutputImageFormat>('jpeg');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const canConvert = useMemo(
    () => Boolean(image && !isProcessing),
    [image, isProcessing],
  );

  const handlePick = async () => {
    setError(null);
    const result = await pickImageFromLibrary();

    if (result.status === 'cancelled') {
      return;
    }

    if (result.status === 'permission_denied') {
      Alert.alert(
        'Photo access needed',
        'SizeKit needs access to your photos so it can convert them on your device. Your photos are never uploaded.',
        [
          { text: 'Not now', style: 'cancel' },
          {
            text: 'Open settings',
            onPress: () => {
              void Linking.openSettings();
            },
          },
        ],
      );
      return;
    }

    if (result.status === 'error') {
      setError(result.message);
      return;
    }

    setImage({
      uri: result.image.uri,
      width: result.image.width,
      height: result.image.height,
      bytes: result.image.fileSizeBytes ?? getFileSizeBytes(result.image.uri),
    });
  };

  const handleConvert = async () => {
    if (!image) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const result = await convertImageFormat({
        uri: image.uri,
        format,
        quality: 0.92,
      });

      navigation.navigate('ConvertResult', {
        originalUri: image.uri,
        originalBytes: image.bytes,
        resultUri: result.uri,
        resultBytes: result.bytes,
        width: result.width,
        height: result.height,
        format: result.format,
        mimeType: result.mimeType,
        note: result.note,
      });
    } catch {
      setError(
        'This image could not be converted on this device. Try another photo or format.',
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Screen scrollable>
      <Text style={styles.lead}>
        Pick a photo and choose JPG, PNG, or WebP. SizeKit converts it on your
        device, nothing is uploaded.
      </Text>

      <View style={styles.pickerCard}>
        {image ? (
          <Pressable
            accessibilityRole="imagebutton"
            accessibilityLabel="View selected photo full screen"
            onPress={() => setIsPreviewOpen(true)}
            style={({ pressed }) => pressed && styles.previewPressed}
          >
            <Image
              source={{ uri: image.uri }}
              style={styles.preview}
              accessibilityIgnoresInvertColors
            />
          </Pressable>
        ) : (
          <View style={styles.previewPlaceholder}>
            <Text style={styles.placeholderText}>No photo selected</Text>
          </View>
        )}

        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Original</Text>
          <Text style={styles.metaValue}>
            {image ? formatFileSize(image.bytes) : '—'}
          </Text>
        </View>
        {image ? (
          <Text style={styles.dimensions}>
            {image.width} × {image.height} px
          </Text>
        ) : null}

        <PrimaryButton
          label={image ? 'Choose a different photo' : 'Choose photo'}
          onPress={() => {
            void handlePick();
          }}
          variant={image ? 'secondary' : 'primary'}
          style={styles.pickButton}
        />
      </View>

      <SectionHeader title="Output format" />
      <FormatChips selected={format} onSelect={setFormat} />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <PrimaryButton
        label="Convert photo"
        onPress={() => {
          void handleConvert();
        }}
        disabled={!canConvert}
        loading={isProcessing}
        style={styles.convertButton}
      />

      <ImagePreviewModal
        uri={isPreviewOpen && image ? image.uri : null}
        caption={
          image
            ? `Original · ${image.width}×${image.height} · ${formatFileSize(image.bytes)}`
            : undefined
        }
        onClose={() => setIsPreviewOpen(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  lead: {
    ...typography.body,
    marginBottom: spacing.lg,
  },
  pickerCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  preview: {
    width: '100%',
    height: scale(220),
    borderRadius: radii.md,
    backgroundColor: colors.surfaceMuted,
    resizeMode: 'contain',
  },
  previewPressed: {
    opacity: 0.92,
  },
  previewPlaceholder: {
    width: '100%',
    height: scale(180),
    borderRadius: radii.md,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    ...typography.caption,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  metaLabel: {
    ...typography.caption,
  },
  metaValue: {
    ...typography.button,
    color: colors.ink,
  },
  dimensions: {
    ...typography.caption,
  },
  pickButton: {
    marginTop: spacing.sm,
  },
  error: {
    ...typography.caption,
    color: '#B42318',
    marginTop: spacing.md,
  },
  convertButton: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
});

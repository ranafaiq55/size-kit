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

import { ImagePreviewModal } from '../components/ImagePreviewModal';
import { PdfPageSizeChips } from '../components/PdfPageSizeChips';
import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { SectionHeader } from '../components/SectionHeader';
import {
  convertImageToPdf,
  type PdfPageSize,
} from '../services/imageToPdf';
import { pickImageFromLibrary } from '../services/imagePicker';
import { colors, radii, scale, spacing, typography } from '../theme';
import type { RootStackParamList } from '../types/navigation';
import { formatFileSize } from '../utils/fileSize';
import { getFileSizeBytes } from '../utils/files';

type Props = NativeStackScreenProps<RootStackParamList, 'ImageToPdf'>;

type SelectedImage = {
  uri: string;
  width: number;
  height: number;
  bytes: number;
};

export function ImageToPdfScreen({ navigation }: Props) {
  const [image, setImage] = useState<SelectedImage | null>(null);
  const [pageSize, setPageSize] = useState<PdfPageSize>('a4');
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
        'SizeKit needs access to your photos so it can create a PDF on your device. Your photos are never uploaded.',
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
      const result = await convertImageToPdf({
        uri: image.uri,
        width: image.width,
        height: image.height,
        pageSize,
      });

      navigation.navigate('PdfResult', {
        sourceUri: image.uri,
        sourceBytes: image.bytes,
        pdfUri: result.pdfUri,
        pdfBytes: result.bytes,
        pageWidth: result.pageWidth,
        pageHeight: result.pageHeight,
        pageSize,
        note: result.note,
      });
    } catch {
      setError(
        'This image is too large to turn into a PDF on this device. Try a smaller photo.',
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Screen scrollable>
      <Text style={styles.lead}>
        Pick a photo and SizeKit will make a PDF on your device, ready to
        submit or share. Nothing is uploaded.
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

      <SectionHeader title="PDF page size" />
      <PdfPageSizeChips selected={pageSize} onSelect={setPageSize} />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <PrimaryButton
        label="Create PDF"
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

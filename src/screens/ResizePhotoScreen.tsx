import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { DimensionPresetChips } from '../components/DimensionPresetChips';
import { ImagePreviewModal } from '../components/ImagePreviewModal';
import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { SectionHeader } from '../components/SectionHeader';
import { pickImageFromLibrary } from '../services/imagePicker';
import { resizeImage } from '../services/resizeImage';
import { colors, radii, scale, spacing, typography } from '../theme';
import type { RootStackParamList } from '../types/navigation';
import {
  parsePositiveInt,
  type DimensionPreset,
  type ResizeMode,
} from '../utils/dimensions';
import { formatFileSize } from '../utils/fileSize';
import { getFileSizeBytes } from '../utils/files';

type Props = NativeStackScreenProps<RootStackParamList, 'ResizePhoto'>;

type SelectedImage = {
  uri: string;
  width: number;
  height: number;
  bytes: number;
};

export function ResizePhotoScreen({ navigation }: Props) {
  const [image, setImage] = useState<SelectedImage | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<DimensionPreset | null>(
    null,
  );
  const [widthText, setWidthText] = useState('600');
  const [heightText, setHeightText] = useState('600');
  const [mode, setMode] = useState<ResizeMode>('fit');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const canResize = useMemo(() => {
    const w = parsePositiveInt(widthText);
    const h = parsePositiveInt(heightText);
    return Boolean(image && w && h && !isProcessing);
  }, [image, widthText, heightText, isProcessing]);

  const handlePick = async () => {
    setError(null);
    const result = await pickImageFromLibrary();

    if (result.status === 'cancelled') {
      return;
    }

    if (result.status === 'permission_denied') {
      Alert.alert(
        'Photo access needed',
        'SizeKit needs access to your photos so it can resize them on your device. Your photos are never uploaded.',
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

  const handleSelectPreset = (preset: DimensionPreset) => {
    setSelectedPreset(preset);
    setWidthText(String(preset.width));
    setHeightText(String(preset.height));
    setError(null);
  };

  const handleResize = async () => {
    if (!image) {
      return;
    }

    const targetWidth = parsePositiveInt(widthText);
    const targetHeight = parsePositiveInt(heightText);

    if (!targetWidth || !targetHeight) {
      setError('Enter width and height as whole numbers between 1 and 10000.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const result = await resizeImage({
        uri: image.uri,
        sourceWidth: image.width,
        sourceHeight: image.height,
        targetWidth,
        targetHeight,
        mode,
      });

      navigation.navigate('ResizeResult', {
        originalUri: image.uri,
        originalBytes: image.bytes,
        originalWidth: image.width,
        originalHeight: image.height,
        resultUri: result.uri,
        resultBytes: result.bytes,
        width: result.width,
        height: result.height,
        targetWidth,
        targetHeight,
        mode,
        note: result.note,
      });
    } catch {
      setError(
        'This image is too large to process on this device. Try choosing a smaller photo.',
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Screen scrollable>
      <Text style={styles.lead}>
        Pick a photo and choose the pixel size you need. SizeKit resizes it on
        your device, nothing is uploaded.
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

      <SectionHeader title="Target dimensions" />
      <DimensionPresetChips
        selected={selectedPreset}
        onSelect={handleSelectPreset}
      />

      <View style={styles.dimensionRow}>
        <View style={styles.dimensionField}>
          <Text style={styles.fieldLabel}>Width (px)</Text>
          <TextInput
            value={widthText}
            onChangeText={(text) => {
              setSelectedPreset(null);
              setWidthText(text);
            }}
            keyboardType="number-pad"
            placeholder="600"
            placeholderTextColor={colors.muted}
            style={styles.input}
          />
        </View>
        <View style={styles.dimensionField}>
          <Text style={styles.fieldLabel}>Height (px)</Text>
          <TextInput
            value={heightText}
            onChangeText={(text) => {
              setSelectedPreset(null);
              setHeightText(text);
            }}
            keyboardType="number-pad"
            placeholder="600"
            placeholderTextColor={colors.muted}
            style={styles.input}
          />
        </View>
      </View>

      <SectionHeader title="Resize mode" />
      <View style={styles.modeToggle}>
        <ModeOption
          label="Keep shape"
          subtitle="Fit inside the box"
          selected={mode === 'fit'}
          onPress={() => setMode('fit')}
        />
        <ModeOption
          label="Exact size"
          subtitle="May stretch"
          selected={mode === 'exact'}
          onPress={() => setMode('exact')}
        />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <PrimaryButton
        label="Resize photo"
        onPress={() => {
          void handleResize();
        }}
        disabled={!canResize}
        loading={isProcessing}
        style={styles.resizeButton}
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

function ModeOption({
  label,
  subtitle,
  selected,
  onPress,
}: {
  label: string;
  subtitle: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.modeOption, selected && styles.modeOptionSelected]}
    >
      <Text style={[styles.modeLabel, selected && styles.modeLabelSelected]}>
        {label}
      </Text>
      <Text style={styles.modeSubtitle}>{subtitle}</Text>
    </Pressable>
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
  dimensionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  dimensionField: {
    flex: 1,
    gap: spacing.xs,
  },
  fieldLabel: {
    ...typography.caption,
  },
  input: {
    minHeight: scale(48),
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    color: colors.ink,
    fontSize: scale(14),
  },
  modeToggle: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  modeOption: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 2,
  },
  modeOptionSelected: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  modeLabel: {
    ...typography.button,
    color: colors.ink,
    fontSize: scale(14),
  },
  modeLabelSelected: {
    color: colors.accentDark,
  },
  modeSubtitle: {
    ...typography.caption,
  },
  error: {
    ...typography.caption,
    color: '#B42318',
    marginTop: spacing.md,
  },
  resizeButton: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
});

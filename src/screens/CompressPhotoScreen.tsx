import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { SectionHeader } from '../components/SectionHeader';
import { TargetSizeChips } from '../components/TargetSizeChips';
import { getPresetById } from '../constants/presets';
import { compressToTargetSize } from '../services/compressImage';
import { pickImageFromLibrary } from '../services/imagePicker';
import { colors, radii, scale, spacing, typography } from '../theme';
import type { RootStackParamList } from '../types/navigation';
import {
  formatFileSize,
  parseCustomSizeToBytes,
} from '../utils/fileSize';
import { getFileSizeBytes } from '../utils/files';

type Props = NativeStackScreenProps<RootStackParamList, 'CompressPhoto'>;

type SelectedImage = {
  uri: string;
  width: number;
  height: number;
  bytes: number;
};

export function CompressPhotoScreen({ navigation, route }: Props) {
  const presetId = route.params?.presetId;
  const presetTitle = route.params?.presetTitle;
  const preset = presetId ? getPresetById(presetId) : undefined;

  const initialTarget =
    route.params?.maxFileSizeBytes ??
    preset?.maxFileSizeBytes ??
    200 * 1024;

  const [image, setImage] = useState<SelectedImage | null>(null);
  const [targetBytes, setTargetBytes] = useState<number>(initialTarget);
  const [customText, setCustomText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: presetTitle ? `${presetTitle}` : 'Compress Photo',
    });
  }, [navigation, presetTitle]);

  useEffect(() => {
    if (route.params?.maxFileSizeBytes) {
      setTargetBytes(route.params.maxFileSizeBytes);
    } else if (preset?.maxFileSizeBytes) {
      setTargetBytes(preset.maxFileSizeBytes);
    }
  }, [route.params?.maxFileSizeBytes, preset?.maxFileSizeBytes]);

  const canCompress = useMemo(
    () => Boolean(image && targetBytes > 0 && !isProcessing),
    [image, targetBytes, isProcessing],
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
        'SizeKit needs access to your photos so it can compress them on your device. Your photos are never uploaded.',
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

    const bytes =
      result.image.fileSizeBytes ?? getFileSizeBytes(result.image.uri);

    setImage({
      uri: result.image.uri,
      width: result.image.width,
      height: result.image.height,
      bytes,
    });
  };

  const applyCustomTarget = () => {
    const parsed = parseCustomSizeToBytes(customText);
    if (!parsed) {
      setError('Enter a size like 200, 200kb, or 1.5mb.');
      return;
    }
    setError(null);
    setTargetBytes(parsed);
  };

  const handleCompress = async () => {
    if (!image || targetBytes <= 0) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const result = await compressToTargetSize({
        uri: image.uri,
        width: image.width,
        height: image.height,
        targetBytes,
      });

      navigation.navigate('CompressResult', {
        originalUri: image.uri,
        originalBytes: image.bytes,
        resultUri: result.uri,
        resultBytes: result.bytes,
        targetBytes,
        width: result.width,
        height: result.height,
        note: result.note,
        tempUris: result.tempUris,
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
        Pick a photo and choose the file size you need. SizeKit compresses it
        on your device — nothing is uploaded.
      </Text>

      {preset?.description ? (
        <View style={styles.presetNote}>
          <Text style={styles.presetNoteText}>{preset.description}</Text>
        </View>
      ) : null}

      <View style={styles.pickerCard}>
        {image ? (
          <Image source={{ uri: image.uri }} style={styles.preview} />
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

      <SectionHeader title="Target size" />
      <TargetSizeChips
        selectedBytes={targetBytes}
        onSelect={(bytes) => {
          setCustomText('');
          setTargetBytes(bytes);
          setError(null);
        }}
      />

      <View style={styles.customRow}>
        <TextInput
          value={customText}
          onChangeText={setCustomText}
          placeholder="Custom (e.g. 200 or 1.5mb)"
          placeholderTextColor={colors.muted}
          keyboardType="default"
          returnKeyType="done"
          onSubmitEditing={applyCustomTarget}
          style={styles.input}
        />
        <PrimaryButton
          label="Set"
          variant="secondary"
          onPress={applyCustomTarget}
          style={styles.setButton}
        />
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.metaLabel}>Selected target</Text>
        <Text style={styles.metaValue}>{formatFileSize(targetBytes)}</Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <PrimaryButton
        label="Compress photo"
        onPress={() => {
          void handleCompress();
        }}
        disabled={!canCompress}
        loading={isProcessing}
        style={styles.compressButton}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  lead: {
    ...typography.body,
    marginBottom: spacing.lg,
  },
  presetNote: {
    backgroundColor: colors.accentSoft,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  presetNoteText: {
    ...typography.caption,
    color: colors.accentDark,
    lineHeight: scale(18),
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
  customRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    minHeight: scale(48),
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    color: colors.ink,
    fontSize: scale(14),
  },
  setButton: {
    minWidth: scale(72),
  },
  error: {
    ...typography.caption,
    color: '#B42318',
    marginTop: spacing.md,
  },
  compressButton: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
});

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Alert, Linking, Platform, StyleSheet, Text, View } from 'react-native';

import { CropAspectChips } from '../components/CropAspectChips';
import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { SectionHeader } from '../components/SectionHeader';
import { CROP_ASPECT_PRESETS } from '../constants/cropAspects';
import { pickAndCropFromLibrary } from '../services/cropImage';
import { colors, radii, scale, spacing, typography } from '../theme';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'CropPhoto'>;

export function CropPhotoScreen({ navigation }: Props) {
  const [selectedId, setSelectedId] = useState(CROP_ASPECT_PRESETS[1].id);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected =
    CROP_ASPECT_PRESETS.find((preset) => preset.id === selectedId) ??
    CROP_ASPECT_PRESETS[1];

  const handleCrop = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const result = await pickAndCropFromLibrary(selected.aspect);

      if (result.status === 'cancelled') {
        return;
      }

      if (result.status === 'permission_denied') {
        Alert.alert(
          'Photo access needed',
          'SizeKit needs access to your photos so it can crop them on your device. Your photos are never uploaded.',
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

      navigation.navigate('CropResult', {
        resultUri: result.image.uri,
        resultBytes: result.image.fileSizeBytes ?? 0,
        width: result.image.width,
        height: result.image.height,
        aspectLabel: selected.label,
        note: result.image.note,
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
        Choose a frame, then pick a photo. SizeKit opens the crop tool on your
        device, nothing is uploaded.
      </Text>

      <SectionHeader title="Crop frame" />
      <CropAspectChips
        selectedId={selectedId}
        onSelect={(preset) => {
          setSelectedId(preset.id);
          setError(null);
        }}
      />

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Selected: {selected.label}</Text>
        <Text style={styles.infoBody}>
          {selected.aspect
            ? `Keeps a ${selected.aspect[0]}:${selected.aspect[1]} frame while you crop.`
            : 'Freeform crop — move and resize the frame yourself.'}
        </Text>
        {Platform.OS === 'ios' && selected.aspect && selected.id !== '1x1' ? (
          <Text style={styles.infoNote}>
            On iPhone the system crop tool is square. SizeKit will finish the
            selected ratio afterward.
          </Text>
        ) : null}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <PrimaryButton
        label="Choose & crop photo"
        onPress={() => {
          void handleCrop();
        }}
        loading={isProcessing}
        style={styles.action}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  lead: {
    ...typography.body,
    marginBottom: spacing.lg,
  },
  infoCard: {
    marginTop: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  infoTitle: {
    ...typography.button,
    color: colors.ink,
  },
  infoBody: {
    ...typography.body,
  },
  infoNote: {
    ...typography.caption,
    color: colors.accentDark,
    lineHeight: scale(18),
  },
  error: {
    ...typography.caption,
    color: '#B42318',
    marginTop: spacing.md,
  },
  action: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
});

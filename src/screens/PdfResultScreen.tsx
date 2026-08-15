import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { AdPlaceholder } from '../components/AdPlaceholder';
import { ImagePreviewModal } from '../components/ImagePreviewModal';
import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { adService } from '../services/adService';
import { sharePdf } from '../services/sharePdf';
import { colors, radii, scale, spacing, typography } from '../theme';
import type { RootStackParamList } from '../types/navigation';
import { formatFileSize } from '../utils/fileSize';

type Props = NativeStackScreenProps<RootStackParamList, 'PdfResult'>;

function pageSizeLabel(pageSize: 'a4' | 'letter' | 'fit'): string {
  if (pageSize === 'a4') {
    return 'A4';
  }
  if (pageSize === 'letter') {
    return 'Letter';
  }
  return 'Fit photo';
}

export function PdfResultScreen({ navigation, route }: Props) {
  const {
    sourceUri,
    sourceBytes,
    pdfUri,
    pdfBytes,
    pageWidth,
    pageHeight,
    pageSize,
    note,
  } = route.params;

  const [isSharing, setIsSharing] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const result = await sharePdf(pdfUri);

      if (result.status === 'shared') {
        await adService.showInterstitialIfAppropriate('after_share');
        return;
      }

      if (result.status === 'unavailable') {
        Alert.alert(
          'Sharing unavailable',
          'Sharing is not available on this device.',
        );
        return;
      }

      Alert.alert(
        'Could not share',
        'No app accepted this PDF. Try installing or opening a files, email, or messaging app, then try again.',
      );
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Screen scrollable>
      <View style={styles.pdfCard}>
        <View style={styles.pdfIconWrap}>
          <Ionicons
            name="document-text"
            size={scale(36)}
            color={colors.accentDark}
          />
        </View>
        <Text style={styles.pdfTitle}>PDF ready</Text>
        <Text style={styles.pdfSubtitle}>
          {formatFileSize(pdfBytes)} · {pageSizeLabel(pageSize)} page
        </Text>
      </View>

      <Pressable
        accessibilityRole="imagebutton"
        accessibilityLabel="View source photo"
        onPress={() => setPreviewOpen(true)}
        style={({ pressed }) => [styles.sourceWrap, pressed && styles.pressed]}
      >
        <Image
          source={{ uri: sourceUri }}
          style={styles.sourcePreview}
          accessibilityIgnoresInvertColors
        />
        <Text style={styles.sourceHint}>
          Source photo · {formatFileSize(sourceBytes)} · tap to zoom
        </Text>
      </Pressable>

      <View style={styles.stats}>
        <Stat label="Page" value={pageSizeLabel(pageSize)} />
        <Stat label="PDF size" value={formatFileSize(pdfBytes)} emphasize />
        <Stat label="Page px" value={`${pageWidth}×${pageHeight}`} />
      </View>

      {note ? (
        <View style={styles.note}>
          <Text style={styles.noteText}>{note}</Text>
        </View>
      ) : (
        <Text style={styles.success}>
          Created on your device. Use Share to save or send the PDF.
        </Text>
      )}

      <PrimaryButton
        label="Share PDF"
        onPress={() => {
          void handleShare();
        }}
        loading={isSharing}
        style={styles.action}
      />
      <PrimaryButton
        label="Convert another"
        variant="ghost"
        onPress={() => navigation.navigate('ImageToPdf')}
      />

      <AdPlaceholder placement="result_banner" />

      <ImagePreviewModal
        uri={previewOpen ? sourceUri : null}
        caption={`Source · ${formatFileSize(sourceBytes)}`}
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
  pdfCard: {
    backgroundColor: colors.accentSoft,
    borderRadius: radii.lg,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  pdfIconWrap: {
    width: scale(64),
    height: scale(64),
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pdfTitle: {
    ...typography.title,
    color: colors.accentDark,
  },
  pdfSubtitle: {
    ...typography.caption,
    color: colors.accentDark,
  },
  sourceWrap: {
    borderRadius: radii.lg,
    overflow: 'hidden',
    backgroundColor: colors.surfaceMuted,
    marginBottom: spacing.lg,
  },
  pressed: {
    opacity: 0.92,
  },
  sourcePreview: {
    width: '100%',
    height: scale(180),
    resizeMode: 'contain',
  },
  sourceHint: {
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

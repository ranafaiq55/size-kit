import { Ionicons } from '@expo/vector-icons';
import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { radii, scale, spacing, typography } from '../theme';

type ImagePreviewModalProps = {
  uri: string | null;
  caption?: string;
  onClose: () => void;
};

/** Full-screen look at a photo before saving. */
export function ImagePreviewModal({
  uri,
  caption,
  onClose,
}: ImagePreviewModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={Boolean(uri)}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable
          style={StyleSheet.absoluteFill}
          accessibilityRole="button"
          accessibilityLabel="Close preview"
          onPress={onClose}
        />

        <View style={[styles.topBar, { paddingTop: insets.top + spacing.md }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close preview"
            onPress={onClose}
            hitSlop={12}
            style={({ pressed }) => [
              styles.closeButton,
              pressed && styles.closeButtonPressed,
            ]}
          >
            <Ionicons name="close" size={scale(22)} color="#FFFFFF" />
          </Pressable>
        </View>

        {uri ? (
          <Image
            source={{ uri }}
            style={styles.image}
            accessibilityIgnoresInvertColors
          />
        ) : null}

        {caption ? (
          <Text
            style={[styles.caption, { paddingBottom: insets.bottom + spacing.xl }]}
          >
            {caption}
          </Text>
        ) : null}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(6, 10, 18, 0.94)',
  },
  topBar: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    alignItems: 'flex-end',
  },
  closeButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  closeButtonPressed: {
    backgroundColor: 'rgba(255,255,255,0.24)',
  },
  image: {
    flex: 1,
    width: '100%',
    resizeMode: 'contain',
  },
  caption: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
  },
});

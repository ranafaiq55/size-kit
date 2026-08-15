import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ZoomableImage } from './ZoomableImage';
import { radii, scale, spacing, typography } from '../theme';

type ImagePreviewModalProps = {
  uri: string | null;
  caption?: string;
  onClose: () => void;
};

/** Full-screen look at a photo with pinch / double-tap zoom. */
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
      {/* Modal hosts its own root so gestures work above the app tree. */}
      <GestureHandlerRootView style={styles.backdrop}>
        <View style={[styles.topBar, { paddingTop: insets.top + spacing.md }]}>
          <Text style={styles.hint}>Pinch or double-tap to zoom</Text>
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

        {uri ? <ZoomableImage uri={uri} /> : null}

        {caption ? (
          <Text
            style={[styles.caption, { paddingBottom: insets.bottom + spacing.xl }]}
          >
            {caption}
          </Text>
        ) : null}
      </GestureHandlerRootView>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  hint: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.55)',
    flex: 1,
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
  caption: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
  },
});

import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { ToolDefinition } from '../constants/tools';
import { colors, radii, scale, shadows, spacing, typography } from '../theme';

type ToolTileProps = {
  tool: ToolDefinition;
  onPress: () => void;
};

export function ToolTile({ tool, onPress }: ToolTileProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${tool.title}. ${tool.subtitle}`}
      style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
    >
      <View style={styles.iconWrap}>
        <Ionicons name={tool.icon} size={scale(22)} color={colors.accent} />
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {tool.title}
      </Text>
      <Text style={styles.subtitle} numberOfLines={1}>
        {tool.subtitle}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    // Each row splits its width evenly between its tiles.
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    ...shadows.soft,
  },
  pressed: {
    backgroundColor: colors.surfaceMuted,
    transform: [{ scale: 0.98 }],
  },
  iconWrap: {
    width: scale(40),
    height: scale(40),
    borderRadius: radii.sm,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.button,
    color: colors.ink,
  },
  subtitle: {
    ...typography.caption,
  },
});

import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { ToolDefinition } from '../constants/tools';
import { colors, radii, scale, shadows, spacing, typography } from '../theme';

type PrimaryToolCardProps = {
  tool: ToolDefinition;
  onPress: () => void;
};

export function PrimaryToolCard({ tool, onPress }: PrimaryToolCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${tool.title}. ${tool.subtitle}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.glow} />
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <Ionicons name={tool.icon} size={scale(26)} color={colors.accentMid} />
        </View>
        <View style={styles.copy}>
          <Text style={styles.title}>{tool.title}</Text>
          <Text style={styles.subtitle}>{tool.subtitle}</Text>
        </View>
        <View style={styles.chevron}>
          <Ionicons name="arrow-forward" size={scale(18)} color={colors.white} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primaryCard,
    borderRadius: radii.xl,
    overflow: 'hidden',
    ...shadows.card,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
  },
  glow: {
    position: 'absolute',
    top: -40,
    right: -20,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.accent,
    opacity: 0.22,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  iconWrap: {
    width: scale(52),
    height: scale(52),
    borderRadius: radii.md,
    backgroundColor: colors.primaryCardSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    ...typography.title,
    color: colors.white,
    fontSize: scale(20),
  },
  subtitle: {
    ...typography.body,
    color: 'rgba(255,255,255,0.72)',
  },
  chevron: {
    width: scale(36),
    height: scale(36),
    borderRadius: radii.full,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

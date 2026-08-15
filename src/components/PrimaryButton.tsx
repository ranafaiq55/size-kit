import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radii, scale, spacing, typography } from '../theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
  style?: StyleProp<ViewStyle>;
};

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  style,
}: PrimaryButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          variant === 'primary' && styles.labelOnPrimary,
          variant === 'secondary' && styles.labelOnSecondary,
          variant === 'ghost' && styles.labelOnGhost,
        ]}
      >
        {loading ? 'Working…' : label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: scale(48),
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  primary: {
    backgroundColor: colors.primaryCard,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderStrong,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    ...typography.button,
  },
  labelOnPrimary: {
    color: colors.white,
  },
  labelOnSecondary: {
    color: colors.ink,
  },
  labelOnGhost: {
    color: colors.accentDark,
  },
});

import { Linking, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { getUserEntitlements } from '../services/entitlements';
import { colors, radii, spacing, typography } from '../theme';

const PRIVACY_POLICY_URL =
  'https://ranafaiq55.github.io/size-kit/privacy';

export function SettingsScreen() {
  const { isPro } = getUserEntitlements();

  return (
    <Screen scrollable>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Privacy</Text>
        <Text style={styles.body}>
          SizeKit processes photos on your device. Your files are not uploaded
          to SizeKit servers. When ads are enabled later, this policy will also
          describe advertising identifiers.
        </Text>
        <PrimaryButton
          label="Open privacy policy"
          variant="secondary"
          onPress={() => {
            void Linking.openURL(PRIVACY_POLICY_URL).catch(() => {
              // Hosted page may not exist yet — in-app text above still applies.
            });
          }}
          style={styles.button}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Pro</Text>
        <Text style={styles.body}>
          {isPro
            ? 'Pro is active. Ads stay off.'
            : 'A one-time Pro purchase (coming soon) will remove ads and unlock premium tools. No monthly subscription.'}
        </Text>
        <PrimaryButton
          label="Remove ads (coming soon)"
          disabled
          onPress={() => undefined}
          style={styles.button}
        />
      </View>

      <Text style={styles.footer}>SizeKit · v1.0.0 · Offline-first</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.title,
    fontSize: 22,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  cardTitle: {
    ...typography.button,
    color: colors.ink,
  },
  body: {
    ...typography.body,
  },
  button: {
    marginTop: spacing.sm,
  },
  footer: {
    ...typography.caption,
    textAlign: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
});

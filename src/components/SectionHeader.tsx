import { StyleSheet, Text, View } from 'react-native';

import { spacing, typography } from '../theme';

type SectionHeaderProps = {
  title: string;
};

export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  title: {
    ...typography.section,
  },
});

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text } from 'react-native';

import { AppHeader } from '../components/AppHeader';
import { PopularRequirements } from '../components/PopularRequirements';
import { PrimaryToolCard } from '../components/PrimaryToolCard';
import { Screen } from '../components/Screen';
import { SecondaryToolsGrid } from '../components/SecondaryToolsGrid';
import { PRIMARY_TOOL } from '../constants/tools';
import { scale, spacing, typography } from '../theme';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  return (
    <Screen
      scrollable
      header={<AppHeader onPressSettings={() => navigation.navigate('Settings')} />}
    >
      <Text style={styles.tagline}>Make your files fit.</Text>
      <PrimaryToolCard
        tool={PRIMARY_TOOL}
        onPress={() => navigation.navigate('CompressPhoto')}
      />
      <SecondaryToolsGrid onSelect={(route) => navigation.navigate(route)} />
      <PopularRequirements
        onSelect={(preset) =>
          navigation.navigate('CompressPhoto', {
            presetId: preset.id,
            presetTitle: preset.title,
            maxFileSizeBytes: preset.maxFileSizeBytes,
          })
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  tagline: {
    ...typography.tagline,
    fontSize: scale(16),
    marginBottom: spacing.lg,
  },
});

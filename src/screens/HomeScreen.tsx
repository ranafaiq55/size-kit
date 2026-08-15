import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppHeader } from '../components/AppHeader';
import { PopularRequirements } from '../components/PopularRequirements';
import { PrimaryToolCard } from '../components/PrimaryToolCard';
import { Screen } from '../components/Screen';
import { SecondaryToolsGrid } from '../components/SecondaryToolsGrid';
import { PRIMARY_TOOL } from '../constants/tools';
import { colors, radii, scale } from '../theme';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Screen
      withTopInset
      scrollable
      decoration={
        <View style={[styles.atmosphere, { height: insets.top + scale(180) }]} />
      }
    >
      <AppHeader onPressSettings={() => navigation.navigate('Settings')} />
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
  atmosphere: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.backgroundWarm,
    borderBottomLeftRadius: radii.xl,
    borderBottomRightRadius: radii.xl,
  },
});

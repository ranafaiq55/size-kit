import { StyleSheet, View } from 'react-native';

import {
  POPULAR_REQUIREMENTS,
  type RequirementPreset,
} from '../constants/tools';
import { spacing } from '../theme';
import { RequirementChip } from './RequirementChip';
import { SectionHeader } from './SectionHeader';

type PopularRequirementsProps = {
  onSelect: (preset: RequirementPreset) => void;
};

export function PopularRequirements({ onSelect }: PopularRequirementsProps) {
  return (
    <View style={styles.container}>
      <SectionHeader title="Popular requirements" />
      <View style={styles.list}>
        {POPULAR_REQUIREMENTS.map((preset) => (
          <RequirementChip
            key={preset.id}
            preset={preset}
            onPress={() => onSelect(preset)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.xxl,
  },
  list: {
    gap: spacing.sm,
  },
});

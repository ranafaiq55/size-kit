import { StyleSheet, View } from 'react-native';

import { SECONDARY_TOOLS, type ToolDefinition } from '../constants/tools';
import type { ToolRouteName } from '../types/navigation';
import { layout, spacing } from '../theme';
import { SectionHeader } from './SectionHeader';
import { ToolTile } from './ToolTile';

const COLUMNS = 2;

type SecondaryToolsGridProps = {
  onSelect: (route: ToolRouteName) => void;
};

function toRows(tools: ToolDefinition[]): ToolDefinition[][] {
  const rows: ToolDefinition[][] = [];

  for (let index = 0; index < tools.length; index += COLUMNS) {
    rows.push(tools.slice(index, index + COLUMNS));
  }

  return rows;
}

export function SecondaryToolsGrid({ onSelect }: SecondaryToolsGridProps) {
  const rows = toRows(SECONDARY_TOOLS);

  return (
    <View style={styles.container}>
      <SectionHeader title="More tools" />
      <View style={styles.grid}>
        {rows.map((row) => (
          <View key={row[0].id} style={styles.row}>
            {row.map((tool) => (
              <ToolTile
                key={tool.id}
                tool={tool}
                onPress={() => onSelect(tool.route)}
              />
            ))}
            {/* Keeps tiles half-width when the last row is not full. */}
            {row.length < COLUMNS
              ? Array.from({ length: COLUMNS - row.length }, (_, index) => (
                  <View key={`filler-${index}`} style={styles.filler} />
                ))
              : null}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.xxl,
  },
  grid: {
    gap: layout.gridGap,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: layout.gridGap,
  },
  filler: {
    flex: 1,
  },
});

import type { ReactNode } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, layout, spacing } from '../theme';

type ScreenProps = {
  children: ReactNode;
  /** Screens rendered without a navigation header must inset themselves from the status bar. */
  withTopInset?: boolean;
  scrollable?: boolean;
  /** Fills the screen and centers the content vertically. */
  centered?: boolean;
  /** Rendered behind the content, outside the safe area padding. */
  decoration?: ReactNode;
  /** Pinned above the scroll area; stays visible while the content scrolls. */
  header?: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
};

export function Screen({
  children,
  withTopInset = false,
  scrollable = false,
  centered = false,
  decoration,
  header,
  contentStyle,
}: ScreenProps) {
  const insets = useSafeAreaInsets();

  // Android runs edge-to-edge, so every edge (including cutouts and gesture
  // bars in landscape) has to be padded by the app itself.
  const horizontalPadding: ViewStyle = {
    paddingLeft: insets.left + layout.screenPadding,
    paddingRight: insets.right + layout.screenPadding,
  };

  const safeAreaPadding: ViewStyle = {
    // A pinned header already clears the status bar for the whole screen.
    paddingTop: header ? spacing.lg : (withTopInset ? insets.top : 0) + spacing.lg,
    paddingBottom: insets.bottom + spacing.xl,
    ...horizontalPadding,
  };

  const content = (
    <View style={[styles.content, centered && styles.centered, contentStyle]}>
      {children}
    </View>
  );

  return (
    <View style={styles.root}>
      {decoration}
      {header ? (
        <View
          style={[
            styles.header,
            horizontalPadding,
            { paddingTop: insets.top + spacing.sm },
          ]}
        >
          <View style={styles.headerInner}>{header}</View>
        </View>
      ) : null}
      {scrollable ? (
        <ScrollView
          style={styles.fill}
          contentContainerStyle={[styles.scrollContent, safeAreaPadding]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {content}
        </ScrollView>
      ) : (
        <View style={[styles.fill, styles.staticContent, safeAreaPadding]}>
          {content}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  fill: {
    flex: 1,
  },
  header: {
    backgroundColor: colors.backgroundWarm,
    paddingBottom: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  headerInner: {
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
  },
  staticContent: {
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: layout.maxContentWidth,
    flexGrow: 1,
  },
  centered: {
    justifyContent: 'center',
  },
});

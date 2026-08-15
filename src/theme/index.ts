import { Dimensions, TextStyle, ViewStyle } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/** Baseline for scaling type and spacing across Android screen sizes. */
const BASE_WIDTH = 390;

export const scale = (size: number): number =>
  Math.round((SCREEN_WIDTH / BASE_WIDTH) * size);

export const colors = {
  background: '#F3F5F7',
  backgroundWarm: '#EEF2F4',
  surface: '#FFFFFF',
  surfaceMuted: '#F8FAFB',
  ink: '#0B1220',
  inkSecondary: '#3D4A5C',
  muted: '#6B7A8D',
  border: '#E4E9EF',
  borderStrong: '#D0D8E2',
  accent: '#0F766E',
  accentDark: '#0A5C56',
  accentSoft: '#E6F7F5',
  accentMid: '#14B8A6',
  primaryCard: '#0F1C2E',
  primaryCardSoft: '#1A2D45',
  white: '#FFFFFF',
  dangerSoft: '#FEF2F2',
  overlay: 'rgba(11, 18, 32, 0.04)',
} as const;

export const spacing = {
  xs: scale(4),
  sm: scale(8),
  md: scale(12),
  lg: scale(16),
  xl: scale(20),
  xxl: scale(28),
  xxxl: scale(36),
} as const;

export const radii = {
  sm: scale(10),
  md: scale(14),
  lg: scale(18),
  xl: scale(24),
  full: 999,
} as const;

export const typography = {
  brand: {
    fontSize: scale(34),
    fontWeight: '700',
    letterSpacing: -0.8,
    color: colors.ink,
  } satisfies TextStyle,
  tagline: {
    fontSize: scale(15),
    fontWeight: '400',
    letterSpacing: 0.1,
    color: colors.muted,
  } satisfies TextStyle,
  section: {
    fontSize: scale(13),
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.muted,
  } satisfies TextStyle,
  title: {
    fontSize: scale(18),
    fontWeight: '600',
    letterSpacing: -0.2,
    color: colors.ink,
  } satisfies TextStyle,
  body: {
    fontSize: scale(14),
    fontWeight: '400',
    lineHeight: scale(20),
    color: colors.inkSecondary,
  } satisfies TextStyle,
  caption: {
    fontSize: scale(12),
    fontWeight: '500',
    color: colors.muted,
  } satisfies TextStyle,
  button: {
    fontSize: scale(15),
    fontWeight: '600',
    letterSpacing: -0.1,
  } satisfies TextStyle,
} as const;

export const shadows = {
  soft: {
    shadowColor: '#0B1220',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  } satisfies ViewStyle,
  card: {
    shadowColor: '#0B1220',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
  } satisfies ViewStyle,
} as const;

export const layout = {
  screenPadding: spacing.xl,
  maxContentWidth: 480,
  gridGap: spacing.md,
} as const;

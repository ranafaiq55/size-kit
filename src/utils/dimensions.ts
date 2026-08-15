export type DimensionPreset = {
  id: string;
  label: string;
  width: number;
  height: number;
};

/** Common practical sizes — not official claims. */
export const DIMENSION_PRESETS: DimensionPreset[] = [
  { id: '600sq', label: '600 × 600', width: 600, height: 600 },
  { id: '300sq', label: '300 × 300', width: 300, height: 300 },
  { id: '1080sq', label: '1080 × 1080', width: 1080, height: 1080 },
  { id: '1280x720', label: '1280 × 720', width: 1280, height: 720 },
  { id: '1920x1080', label: '1920 × 1080', width: 1920, height: 1080 },
  { id: '800x600', label: '800 × 600', width: 800, height: 600 },
];

export type ResizeMode = 'fit' | 'exact';

/**
 * Fit = scale to fit inside the box, keep proportions.
 * Exact = stretch to the exact width and height.
 */
export function resolveOutputSize(input: {
  sourceWidth: number;
  sourceHeight: number;
  targetWidth: number;
  targetHeight: number;
  mode: ResizeMode;
}): { width: number; height: number } {
  const { sourceWidth, sourceHeight, targetWidth, targetHeight, mode } = input;

  if (mode === 'exact') {
    return {
      width: Math.max(1, Math.round(targetWidth)),
      height: Math.max(1, Math.round(targetHeight)),
    };
  }

  const scale = Math.min(
    targetWidth / sourceWidth,
    targetHeight / sourceHeight,
  );

  return {
    width: Math.max(1, Math.round(sourceWidth * scale)),
    height: Math.max(1, Math.round(sourceHeight * scale)),
  };
}

export function parsePositiveInt(value: string): number | null {
  const trimmed = value.trim();
  if (!/^\d+$/.test(trimmed)) {
    return null;
  }
  const n = Number(trimmed);
  if (!Number.isFinite(n) || n < 1 || n > 10000) {
    return null;
  }
  return n;
}

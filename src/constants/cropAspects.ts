export type CropAspectPreset = {
  id: string;
  label: string;
  /** null = freeform crop in the system editor */
  aspect: [number, number] | null;
};

export const CROP_ASPECT_PRESETS: CropAspectPreset[] = [
  { id: 'free', label: 'Free', aspect: null },
  { id: '1x1', label: '1 : 1', aspect: [1, 1] },
  { id: '4x3', label: '4 : 3', aspect: [4, 3] },
  { id: '3x4', label: '3 : 4', aspect: [3, 4] },
  { id: '16x9', label: '16 : 9', aspect: [16, 9] },
  { id: '9x16', label: '9 : 16', aspect: [9, 16] },
];

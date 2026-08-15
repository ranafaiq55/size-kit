import {
  ImageManipulator,
  SaveFormat,
  type ImageResult,
} from 'expo-image-manipulator';

import { getFileSizeBytes } from '../utils/files';

export type OutputImageFormat = 'jpeg' | 'png' | 'webp';

export type ConvertFormatInput = {
  uri: string;
  format: OutputImageFormat;
  /** 0–1, JPEG/WebP only. Ignored for PNG. */
  quality?: number;
};

export type ConvertFormatResult = {
  uri: string;
  width: number;
  height: number;
  bytes: number;
  format: OutputImageFormat;
  mimeType: string;
  note?: string;
};

const FORMAT_TO_SAVE: Record<OutputImageFormat, SaveFormat> = {
  jpeg: SaveFormat.JPEG,
  png: SaveFormat.PNG,
  webp: SaveFormat.WEBP,
};

export const OUTPUT_FORMAT_OPTIONS: {
  id: OutputImageFormat;
  label: string;
  subtitle: string;
  mimeType: string;
}[] = [
  {
    id: 'jpeg',
    label: 'JPG',
    subtitle: 'Smaller files, great for photos',
    mimeType: 'image/jpeg',
  },
  {
    id: 'png',
    label: 'PNG',
    subtitle: 'Lossless, good for graphics',
    mimeType: 'image/png',
  },
  {
    id: 'webp',
    label: 'WebP',
    subtitle: 'Modern, usually smaller',
    mimeType: 'image/webp',
  },
];

export function mimeTypeForFormat(format: OutputImageFormat): string {
  return (
    OUTPUT_FORMAT_OPTIONS.find((option) => option.id === format)?.mimeType ??
    'image/jpeg'
  );
}

export function labelForFormat(format: OutputImageFormat): string {
  return (
    OUTPUT_FORMAT_OPTIONS.find((option) => option.id === format)?.label ??
    format.toUpperCase()
  );
}

/** Converts a local image to JPG, PNG, or WebP on-device. */
export async function convertImageFormat(
  input: ConvertFormatInput,
): Promise<ConvertFormatResult> {
  const context = ImageManipulator.manipulate(input.uri);
  const rendered = await context.renderAsync();

  const compress =
    input.format === 'png' ? 1 : Math.min(1, Math.max(0.1, input.quality ?? 0.9));

  const saved: ImageResult = await rendered.saveAsync({
    compress,
    format: FORMAT_TO_SAVE[input.format],
  });

  let note: string | undefined;
  if (input.format === 'png') {
    note =
      'PNG keeps full detail and may be larger than JPG for photos.';
  }

  return {
    uri: saved.uri,
    width: saved.width,
    height: saved.height,
    bytes: getFileSizeBytes(saved.uri),
    format: input.format,
    mimeType: mimeTypeForFormat(input.format),
    note,
  };
}

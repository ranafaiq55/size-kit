import {
  ImageManipulator,
  SaveFormat,
  type ImageResult,
} from 'expo-image-manipulator';

import {
  resolveOutputSize,
  type ResizeMode,
} from '../utils/dimensions';
import { getFileSizeBytes } from '../utils/files';

export type ResizeImageInput = {
  uri: string;
  sourceWidth: number;
  sourceHeight: number;
  targetWidth: number;
  targetHeight: number;
  mode: ResizeMode;
};

export type ResizeImageResult = {
  uri: string;
  width: number;
  height: number;
  bytes: number;
  note?: string;
};

/** Resize a local image on-device. Returns a JPEG in the cache directory. */
export async function resizeImage(
  input: ResizeImageInput,
): Promise<ResizeImageResult> {
  const { width, height } = resolveOutputSize({
    sourceWidth: input.sourceWidth,
    sourceHeight: input.sourceHeight,
    targetWidth: input.targetWidth,
    targetHeight: input.targetHeight,
    mode: input.mode,
  });

  if (
    width === input.sourceWidth &&
    height === input.sourceHeight
  ) {
    return {
      uri: input.uri,
      width,
      height,
      bytes: getFileSizeBytes(input.uri),
      note: 'Your photo already matches these dimensions.',
    };
  }

  const context = ImageManipulator.manipulate(input.uri);
  context.resize({ width, height });
  const rendered = await context.renderAsync();
  const saved: ImageResult = await rendered.saveAsync({
    compress: 0.92,
    format: SaveFormat.JPEG,
  });

  let note: string | undefined;
  if (input.mode === 'fit') {
    if (
      saved.width !== input.targetWidth ||
      saved.height !== input.targetHeight
    ) {
      note = `Fitted inside ${input.targetWidth} × ${input.targetHeight} without stretching. Result is ${saved.width} × ${saved.height}.`;
    }
  } else {
    note =
      'Exact size stretches the photo to match both width and height. Use “Keep shape” if you want to avoid distortion.';
  }

  return {
    uri: saved.uri,
    width: saved.width,
    height: saved.height,
    bytes: getFileSizeBytes(saved.uri),
    note,
  };
}

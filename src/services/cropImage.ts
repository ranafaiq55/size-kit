import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';
import {
  ImageManipulator,
  SaveFormat,
  type ImageResult,
} from 'expo-image-manipulator';

import { getFileSizeBytes } from '../utils/files';
import type { PickImageResult, PickedImage } from './imagePicker';

export type CroppedImage = PickedImage & {
  note?: string;
};

export type CropImageResult =
  | { status: 'success'; image: CroppedImage }
  | { status: 'cancelled' }
  | { status: 'permission_denied' }
  | { status: 'error'; message: string };

/**
 * Opens the system photo picker with the native crop UI.
 * Aspect locks apply on Android; iOS crop UI is square — we note that when needed.
 */
export async function pickAndCropFromLibrary(
  aspect: [number, number] | null,
): Promise<CropImageResult> {
  try {
    const current = await ImagePicker.getMediaLibraryPermissionsAsync();
    let granted = current.granted;

    if (!granted && current.canAskAgain) {
      const requested = await ImagePicker.requestMediaLibraryPermissionsAsync();
      granted = requested.granted;
    }

    if (!granted) {
      return { status: 'permission_denied' };
    }

    const isIosLockedSquare =
      Platform.OS === 'ios' && aspect !== null && !(aspect[0] === 1 && aspect[1] === 1);

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      // Aspect is honored on Android. iOS always uses a square crop UI.
      aspect: aspect ?? undefined,
      quality: 1,
      exif: false,
    });

    if (result.canceled || !result.assets?.[0]) {
      return { status: 'cancelled' };
    }

    const asset = result.assets[0];
    const normalized = await normalizeCroppedJpeg({
      uri: asset.uri,
      width: asset.width,
      height: asset.height,
      targetAspect: isIosLockedSquare ? aspect : null,
    });

    let note: string | undefined;
    if (isIosLockedSquare && aspect) {
      note = `On iPhone the crop tool is square, so SizeKit finished with a centered ${aspect[0]}:${aspect[1]} frame.`;
    }

    return {
      status: 'success',
      image: {
        ...normalized,
        note,
      },
    };
  } catch {
    return {
      status: 'error',
      message: 'Something went wrong while cropping. Please try again.',
    };
  }
}

async function normalizeCroppedJpeg(input: {
  uri: string;
  width: number;
  height: number;
  targetAspect: [number, number] | null;
}): Promise<CroppedImage> {
  let sourceUri = input.uri;
  let width = input.width;
  let height = input.height;

  if (input.targetAspect) {
    const [aw, ah] = input.targetAspect;
    const targetRatio = aw / ah;
    const sourceRatio = width / height;

    let cropWidth = width;
    let cropHeight = height;
    let originX = 0;
    let originY = 0;

    if (sourceRatio > targetRatio) {
      cropWidth = Math.round(height * targetRatio);
      originX = Math.round((width - cropWidth) / 2);
    } else if (sourceRatio < targetRatio) {
      cropHeight = Math.round(width / targetRatio);
      originY = Math.round((height - cropHeight) / 2);
    }

    if (cropWidth !== width || cropHeight !== height) {
      const context = ImageManipulator.manipulate(sourceUri);
      context.crop({
        originX,
        originY,
        width: cropWidth,
        height: cropHeight,
      });
      const rendered = await context.renderAsync();
      const cropped: ImageResult = await rendered.saveAsync({
        compress: 0.92,
        format: SaveFormat.JPEG,
      });
      sourceUri = cropped.uri;
      width = cropped.width;
      height = cropped.height;
    }
  }

  // Ensure a consistent JPEG output for share/save.
  const context = ImageManipulator.manipulate(sourceUri);
  const rendered = await context.renderAsync();
  const saved: ImageResult = await rendered.saveAsync({
    compress: 0.92,
    format: SaveFormat.JPEG,
  });

  return {
    uri: saved.uri,
    width: saved.width,
    height: saved.height,
    fileSizeBytes: getFileSizeBytes(saved.uri),
  };
}

// Re-export shape helper for callers that still use PickImageResult patterns.
export type { PickImageResult };

import * as ImagePicker from 'expo-image-picker';

export type PickedImage = {
  uri: string;
  width: number;
  height: number;
  fileSizeBytes: number | null;
};

export type PickImageResult =
  | { status: 'success'; image: PickedImage }
  | { status: 'cancelled' }
  | { status: 'permission_denied' }
  | { status: 'error'; message: string };

/**
 * Requests media library access with a clear rationale, then opens the picker.
 * Photos are never uploaded — processing stays on device.
 */
export async function pickImageFromLibrary(): Promise<PickImageResult> {
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

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
      exif: false,
    });

    if (result.canceled || !result.assets?.[0]) {
      return { status: 'cancelled' };
    }

    const asset = result.assets[0];
    return {
      status: 'success',
      image: {
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
        fileSizeBytes: asset.fileSize ?? null,
      },
    };
  } catch {
    return {
      status: 'error',
      message: 'Something went wrong while opening your photos. Please try again.',
    };
  }
}

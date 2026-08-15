import { ComingSoonPanel } from '../components/ComingSoonPanel';
import { Screen } from '../components/Screen';

export function CropPhotoScreen() {
  return (
    <Screen centered>
      <ComingSoonPanel
        title="Crop Photo"
        description="Crop images to the frame you need. Processing will be added in a later milestone."
        icon="crop-outline"
      />
    </Screen>
  );
}

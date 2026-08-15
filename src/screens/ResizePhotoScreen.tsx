import { ComingSoonPanel } from '../components/ComingSoonPanel';
import { Screen } from '../components/Screen';

export function ResizePhotoScreen() {
  return (
    <Screen centered>
      <ComingSoonPanel
        title="Resize Photo"
        description="Resize images to exact pixel dimensions. Processing will be added in a later milestone."
        icon="expand-outline"
      />
    </Screen>
  );
}

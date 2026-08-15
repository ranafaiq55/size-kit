import { ComingSoonPanel } from '../components/ComingSoonPanel';
import { Screen } from '../components/Screen';

export function ImageToPdfScreen() {
  return (
    <Screen centered>
      <ComingSoonPanel
        title="Image to PDF"
        description="Convert images into a PDF ready to submit. Processing will be added in a later milestone."
        icon="document-text-outline"
      />
    </Screen>
  );
}

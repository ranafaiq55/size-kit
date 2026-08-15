import { ComingSoonPanel } from '../components/ComingSoonPanel';
import { Screen } from '../components/Screen';

export function ConvertFormatScreen() {
  return (
    <Screen centered>
      <ComingSoonPanel
        title="Convert Format"
        description="Convert between JPG, PNG, WebP, and more. Processing will be added in a later milestone."
        icon="swap-horizontal-outline"
      />
    </Screen>
  );
}

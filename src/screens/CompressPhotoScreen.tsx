import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useLayoutEffect } from 'react';

import { ComingSoonPanel } from '../components/ComingSoonPanel';
import { Screen } from '../components/Screen';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'CompressPhoto'>;

export function CompressPhotoScreen({ navigation, route }: Props) {
  const presetTitle = route.params?.presetTitle;
  const title = presetTitle ? `${presetTitle} preset` : 'Compress Photo';
  const description = presetTitle
    ? `${presetTitle} preset will open here. Exact KB/MB compression is coming in a later milestone.`
    : 'Compress images to an exact file size. Processing will be added in a later milestone.';

  useLayoutEffect(() => {
    navigation.setOptions({ title });
  }, [navigation, title]);

  return (
    <Screen centered>
      <ComingSoonPanel
        title={title}
        description={description}
        icon="resize-outline"
      />
    </Screen>
  );
}

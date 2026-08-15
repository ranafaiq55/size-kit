import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { CompressPhotoScreen } from '../screens/CompressPhotoScreen';
import { CompressResultScreen } from '../screens/CompressResultScreen';
import { ConvertFormatScreen } from '../screens/ConvertFormatScreen';
import { ConvertResultScreen } from '../screens/ConvertResultScreen';
import { CropPhotoScreen } from '../screens/CropPhotoScreen';
import { CropResultScreen } from '../screens/CropResultScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ImageToPdfScreen } from '../screens/ImageToPdfScreen';
import { PdfResultScreen } from '../screens/PdfResultScreen';
import { ResizePhotoScreen } from '../screens/ResizePhotoScreen';
import { ResizeResultScreen } from '../screens/ResizeResultScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { colors } from '../theme';
import type { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShadowVisible: false,
          headerTintColor: colors.ink,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTitleStyle: {
            fontWeight: '600',
            color: colors.ink,
          },
          contentStyle: {
            backgroundColor: colors.background,
          },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CompressPhoto"
          component={CompressPhotoScreen}
          options={{ title: 'Compress Photo' }}
        />
        <Stack.Screen
          name="CompressResult"
          component={CompressResultScreen}
          options={{ title: 'Result' }}
        />
        <Stack.Screen
          name="ResizePhoto"
          component={ResizePhotoScreen}
          options={{ title: 'Resize Photo' }}
        />
        <Stack.Screen
          name="ResizeResult"
          component={ResizeResultScreen}
          options={{ title: 'Result' }}
        />
        <Stack.Screen
          name="CropPhoto"
          component={CropPhotoScreen}
          options={{ title: 'Crop Photo' }}
        />
        <Stack.Screen
          name="CropResult"
          component={CropResultScreen}
          options={{ title: 'Result' }}
        />
        <Stack.Screen
          name="ImageToPdf"
          component={ImageToPdfScreen}
          options={{ title: 'Image to PDF' }}
        />
        <Stack.Screen
          name="PdfResult"
          component={PdfResultScreen}
          options={{ title: 'PDF ready' }}
        />
        <Stack.Screen
          name="ConvertFormat"
          component={ConvertFormatScreen}
          options={{ title: 'Convert Format' }}
        />
        <Stack.Screen
          name="ConvertResult"
          component={ConvertResultScreen}
          options={{ title: 'Result' }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: 'Settings' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

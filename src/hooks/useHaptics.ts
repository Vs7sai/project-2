import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { useMobile } from './useMobile';

export function useHaptics() {
  const { isNative } = useMobile();

  const vibrate = async () => {
    if (!isNative) return;
    
    try {
      await Haptics.vibrate();
    } catch (error) {
      console.error('Error with haptic vibration:', error);
    }
  };

  const impact = async (style: ImpactStyle = ImpactStyle.Medium) => {
    if (!isNative) return;
    
    try {
      await Haptics.impact({ style });
    } catch (error) {
      console.error('Error with haptic impact:', error);
    }
  };

  const buttonPress = async () => {
    if (!isNative) return;
    
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (error) {
      console.error('Error with haptic button press:', error);
    }
  };

  const notificationFeedback = async (type: 'success' | 'warning' | 'error') => {
    if (!isNative) return;
    
    try {
      await Haptics.notification({ type });
    } catch (error) {
      console.error('Error with haptic notification:', error);
    }
  };

  return {
    vibrate,
    impact,
    buttonPress,
    notificationFeedback,
  };
}
import { useEffect, useState } from 'react';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

export function useMobile() {
  const [isNative, setIsNative] = useState(false);
  const [appInfo, setAppInfo] = useState<{
    appName: string;
    packageName: string;
    versionName: string;
    versionCode: number;
    build: string;
  } | null>(null);

  useEffect(() => {
    // Check if running in a native app context
    const checkPlatform = async () => {
      const isNativeApp = Capacitor.isNativePlatform();
      setIsNative(isNativeApp);

      if (isNativeApp) {
        try {
          const info = await App.getInfo();
          setAppInfo(info);
        } catch (error) {
          console.error('Error getting app info:', error);
        }
      }
    };

    checkPlatform();
  }, []);

  const getPlatform = () => {
    return Capacitor.getPlatform();
  };

  return {
    isNative,
    appInfo,
    platform: getPlatform(),
    isIOS: getPlatform() === 'ios',
    isAndroid: getPlatform() === 'android',
  };
}
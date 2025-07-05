import { useEffect, useState } from 'react';
import { 
  PushNotifications, 
  PushNotificationSchema, 
  ActionPerformed, 
  Token 
} from '@capacitor/push-notifications';
import { LocalNotifications, LocalNotificationSchema } from '@capacitor/local-notifications';
import { useMobile } from './useMobile';

export function useNotifications() {
  const { isNative } = useMobile();
  const [hasPermission, setHasPermission] = useState(false);
  const [notifications, setNotifications] = useState<PushNotificationSchema[]>([]);
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    if (!isNative) return;

    // Request permission and register for push notifications
    const registerPushNotifications = async () => {
      try {
        // Request permission
        const permissionStatus = await PushNotifications.requestPermissions();
        setHasPermission(permissionStatus.receive === 'granted');

        if (permissionStatus.receive === 'granted') {
          // Register with FCM
          await PushNotifications.register();

          // Setup listeners
          PushNotifications.addListener('registration', (token: Token) => {
            console.log('Push registration success:', token.value);
            setFcmToken(token.value);
          });

          PushNotifications.addListener('registrationError', (error: any) => {
            console.error('Push registration error:', error);
          });

          PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
            console.log('Push notification received:', notification);
            setNotifications(prevNotifications => [...prevNotifications, notification]);
          });

          PushNotifications.addListener('pushNotificationActionPerformed', (action: ActionPerformed) => {
            console.log('Push notification action performed:', action);
          });
        }
      } catch (error) {
        console.error('Error setting up push notifications:', error);
      }
    };

    registerPushNotifications();

    return () => {
      // Remove listeners when component unmounts
      PushNotifications.removeAllListeners();
    };
  }, [isNative]);

  // Function to send a local notification
  const sendLocalNotification = async (notification: Partial<LocalNotificationSchema>) => {
    if (!isNative) return;

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: Math.floor(Math.random() * 100000),
            title: notification.title || 'RupeeRush',
            body: notification.body || '',
            largeBody: notification.largeBody,
            summaryText: notification.summaryText,
            schedule: notification.schedule,
            extra: notification.extra,
            actionTypeId: notification.actionTypeId,
            sound: notification.sound || 'beep.wav',
            smallIcon: notification.smallIcon || 'ic_stat_icon_config_sample',
            iconColor: notification.iconColor || '#f97316',
          }
        ]
      });
    } catch (error) {
      console.error('Error sending local notification:', error);
    }
  };

  return {
    hasPermission,
    notifications,
    fcmToken,
    sendLocalNotification,
  };
}
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

class NotificationService {
  NotificationService._();

  static final FlutterLocalNotificationsPlugin _localNotifications =
      FlutterLocalNotificationsPlugin();

  static const AndroidNotificationChannel _channel = AndroidNotificationChannel(
    'smartguard_alerts',
    'SmartGuard Alerts',
    description: 'Intrusion and access notifications',
    importance: Importance.max,
  );

  static Future<void> initialize() async {
    const androidSettings = AndroidInitializationSettings('@mipmap/ic_launcher');
    const initSettings = InitializationSettings(android: androidSettings);
    await _localNotifications.initialize(initSettings);

    await _localNotifications
        .resolvePlatformSpecificImplementation<
            AndroidFlutterLocalNotificationsPlugin>()
        ?.createNotificationChannel(_channel);

    await FirebaseMessaging.instance.requestPermission(
      alert: true,
      badge: true,
      sound: true,
      announcement: false,
    );

    FirebaseMessaging.onMessage.listen(_handleForegroundMessage);
    FirebaseMessaging.onMessageOpenedApp.listen(_handleMessageTap);
  }

  static Future<void> _handleForegroundMessage(RemoteMessage message) async {
    await _showNotification(
      title: message.notification?.title ?? 'SmartGuard Alert',
      body: message.notification?.body ?? 'Security event received.',
    );
  }

  static void _handleMessageTap(RemoteMessage message) {}

  static Future<void> _showNotification({
    required String title,
    required String body,
  }) async {
    const androidDetails = AndroidNotificationDetails(
      'smartguard_alerts',
      'SmartGuard Alerts',
      channelDescription: 'Intrusion and access notifications',
      importance: Importance.max,
      priority: Priority.high,
      ticker: 'ticker',
    );

    await _localNotifications.show(
      DateTime.now().millisecondsSinceEpoch ~/ 1000,
      title,
      body,
      const NotificationDetails(android: androidDetails),
    );
  }
}

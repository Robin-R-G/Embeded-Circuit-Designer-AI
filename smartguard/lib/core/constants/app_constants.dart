class AppConstants {
  static const String appName = 'SmartGuard';
  static const String defaultApiBaseUrl = 'https://api.smartguard.local';
  static const String tokenStorageKey = 'security_token';
  static const String pinStorageKey = 'fallback_pin';
  static const String biometricEnabledKey = 'biometric_enabled';
  static const String pushEnabledKey = 'push_enabled';
  static const String defaultPin = '2580';
  static const Duration splashDuration = Duration(seconds: 2);
  static const int maxTimestampSkewSeconds = 10;
}

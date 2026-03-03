import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:smartguard/core/constants/app_constants.dart';

class SecureStorageService {
  SecureStorageService() : _storage = const FlutterSecureStorage();

  final FlutterSecureStorage _storage;

  Future<void> setToken(String token) =>
      _storage.write(key: AppConstants.tokenStorageKey, value: token);

  Future<String?> getToken() => _storage.read(key: AppConstants.tokenStorageKey);

  Future<void> setPin(String pin) =>
      _storage.write(key: AppConstants.pinStorageKey, value: pin);

  Future<String?> getPin() => _storage.read(key: AppConstants.pinStorageKey);

  Future<void> setApiBaseUrl(String value) =>
      _storage.write(key: 'api_base_url', value: value);

  Future<String?> getApiBaseUrl() => _storage.read(key: 'api_base_url');

  Future<void> setBiometricEnabled(bool enabled) => _storage.write(
        key: AppConstants.biometricEnabledKey,
        value: enabled.toString(),
      );

  Future<bool> isBiometricEnabled() async {
    final value = await _storage.read(key: AppConstants.biometricEnabledKey);
    return value == null ? true : value == 'true';
  }

  Future<void> setPushEnabled(bool enabled) => _storage.write(
        key: AppConstants.pushEnabledKey,
        value: enabled.toString(),
      );

  Future<bool> isPushEnabled() async {
    final value = await _storage.read(key: AppConstants.pushEnabledKey);
    return value == null ? true : value == 'true';
  }

  Future<void> clearAll() => _storage.deleteAll();
}

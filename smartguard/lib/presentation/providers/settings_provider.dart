import 'package:flutter/material.dart';
import 'package:smartguard/core/constants/app_constants.dart';
import 'package:smartguard/data/datasources/secure_storage_service.dart';

class SettingsProvider extends ChangeNotifier {
  SettingsProvider(this._storage);

  final SecureStorageService _storage;

  String apiBaseUrl = AppConstants.defaultApiBaseUrl;
  String token = '';
  bool pushEnabled = true;
  bool biometricEnabled = true;

  Future<void> load() async {
    apiBaseUrl = await _storage.getApiBaseUrl() ?? AppConstants.defaultApiBaseUrl;
    token = await _storage.getToken() ?? '';
    pushEnabled = await _storage.isPushEnabled();
    biometricEnabled = await _storage.isBiometricEnabled();
    notifyListeners();
  }

  Future<void> saveApiBaseUrl(String value) async {
    apiBaseUrl = value.trim();
    await _storage.setApiBaseUrl(apiBaseUrl);
    notifyListeners();
  }

  Future<void> saveToken(String value) async {
    token = value.trim();
    await _storage.setToken(token);
    notifyListeners();
  }

  Future<void> setPushEnabled(bool value) async {
    pushEnabled = value;
    await _storage.setPushEnabled(value);
    notifyListeners();
  }

  Future<void> setBiometricEnabled(bool value) async {
    biometricEnabled = value;
    await _storage.setBiometricEnabled(value);
    notifyListeners();
  }

  Future<void> logout() => _storage.clearAll();
}

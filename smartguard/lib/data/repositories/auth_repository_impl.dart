import 'package:local_auth/local_auth.dart';
import 'package:smartguard/core/constants/app_constants.dart';
import 'package:smartguard/data/datasources/secure_storage_service.dart';
import 'package:smartguard/domain/repositories/auth_repository.dart';

class AuthRepositoryImpl implements AuthRepository {
  AuthRepositoryImpl(this._storage, this._auth);

  final SecureStorageService _storage;
  final LocalAuthentication _auth;

  @override
  Future<bool> authenticateWithBiometric() async {
    final enabled = await _storage.isBiometricEnabled();
    if (!enabled) return false;

    final canCheck = await _auth.canCheckBiometrics;
    final isSupported = await _auth.isDeviceSupported();
    if (!canCheck || !isSupported) {
      return false;
    }

    return _auth.authenticate(
      localizedReason: 'Authenticate to access SmartGuard',
      options: const AuthenticationOptions(
        stickyAuth: true,
        biometricOnly: true,
      ),
    );
  }

  @override
  Future<bool> validatePin(String pin) async {
    final storedPin = await _storage.getPin() ?? AppConstants.defaultPin;
    return pin == storedPin;
  }

  @override
  Future<void> saveToken(String token) => _storage.setToken(token);

  @override
  Future<String?> getToken() => _storage.getToken();

  @override
  Future<void> ensureDefaults() async {
    if (await _storage.getPin() == null) {
      await _storage.setPin(AppConstants.defaultPin);
    }
    if (await _storage.getToken() == null) {
      await _storage.setToken('demo-token-123');
    }
  }
}

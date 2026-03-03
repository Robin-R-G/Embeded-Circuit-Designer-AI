import 'package:flutter/material.dart';
import 'package:smartguard/domain/repositories/auth_repository.dart';

class AuthProvider extends ChangeNotifier {
  AuthProvider(this._repository);

  final AuthRepository _repository;

  bool isLoading = false;

  Future<bool> authenticateBiometric() async {
    isLoading = true;
    notifyListeners();
    final result = await _repository.authenticateWithBiometric();
    isLoading = false;
    notifyListeners();
    return result;
  }

  Future<bool> loginWithPin(String pin) => _repository.validatePin(pin);

  Future<void> saveToken(String token) => _repository.saveToken(token);

  Future<void> initializeDefaults() => _repository.ensureDefaults();
}

abstract class AuthRepository {
  Future<bool> authenticateWithBiometric();
  Future<bool> validatePin(String pin);
  Future<void> saveToken(String token);
  Future<String?> getToken();
  Future<void> ensureDefaults();
}

import 'package:smartguard/core/constants/app_constants.dart';
import 'package:smartguard/core/error/app_exception.dart';
import 'package:smartguard/data/datasources/secure_storage_service.dart';
import 'package:smartguard/domain/entities/log_event.dart';
import 'package:smartguard/domain/entities/system_status.dart';
import 'package:smartguard/domain/repositories/lock_repository.dart';
import 'package:smartguard/services/api_service.dart';

class LockRepositoryImpl implements LockRepository {
  LockRepositoryImpl(this._storage);

  final SecureStorageService _storage;

  Future<ApiService> _api() async {
    final token = await _storage.getToken();
    final baseUrl =
        await _storage.getApiBaseUrl() ?? AppConstants.defaultApiBaseUrl;
    if (token == null || token.isEmpty) {
      throw AppException('Token not found. Please login again.');
    }
    return ApiService(baseUrl: baseUrl, token: token);
  }

  @override
  Future<SystemStatus> getStatus() async => (await _api()).fetchStatus();

  @override
  Future<void> lock() async => (await _api()).lock();

  @override
  Future<void> lockdown() async => (await _api()).lockdown();

  @override
  Future<List<LogEvent>> getLogs() async => (await _api()).fetchLogs();

  @override
  Future<void> unlock() async => (await _api()).unlock();
}

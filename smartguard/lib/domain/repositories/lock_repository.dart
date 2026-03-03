import 'package:smartguard/domain/entities/log_event.dart';
import 'package:smartguard/domain/entities/system_status.dart';

abstract class LockRepository {
  Future<SystemStatus> getStatus();
  Future<void> lock();
  Future<void> unlock();
  Future<void> lockdown();
  Future<List<LogEvent>> getLogs();
}

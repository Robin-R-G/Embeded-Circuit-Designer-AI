import 'package:smartguard/domain/entities/log_event.dart';
import 'package:smartguard/domain/repositories/lock_repository.dart';

class GetLogsUseCase {
  GetLogsUseCase(this.repository);
  final LockRepository repository;

  Future<List<LogEvent>> call() => repository.getLogs();
}

import 'package:smartguard/domain/entities/system_status.dart';
import 'package:smartguard/domain/repositories/lock_repository.dart';

class GetStatusUseCase {
  GetStatusUseCase(this.repository);
  final LockRepository repository;

  Future<SystemStatus> call() => repository.getStatus();
}

import 'package:smartguard/domain/repositories/lock_repository.dart';

class LockActionsUseCase {
  LockActionsUseCase(this.repository);
  final LockRepository repository;

  Future<void> lock() => repository.lock();
  Future<void> unlock() => repository.unlock();
  Future<void> lockdown() => repository.lockdown();
}

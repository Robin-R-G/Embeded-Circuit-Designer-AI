import 'package:flutter/material.dart';
import 'package:smartguard/domain/entities/system_status.dart';
import 'package:smartguard/domain/usecases/get_status_usecase.dart';
import 'package:smartguard/domain/usecases/lock_actions_usecase.dart';

class DashboardProvider extends ChangeNotifier {
  DashboardProvider(this._statusUseCase, this._actionsUseCase);

  final GetStatusUseCase _statusUseCase;
  final LockActionsUseCase _actionsUseCase;

  SystemStatus? status;
  bool loading = false;

  Future<void> loadStatus() async {
    loading = true;
    notifyListeners();
    status = await _statusUseCase();
    loading = false;
    notifyListeners();
  }

  Future<void> unlock() => _performAction(_actionsUseCase.unlock);
  Future<void> lock() => _performAction(_actionsUseCase.lock);
  Future<void> lockdown() => _performAction(_actionsUseCase.lockdown);

  Future<void> _performAction(Future<void> Function() action) async {
    loading = true;
    notifyListeners();
    await action();
    await loadStatus();
  }
}

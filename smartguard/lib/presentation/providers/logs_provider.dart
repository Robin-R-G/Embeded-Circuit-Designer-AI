import 'package:flutter/material.dart';
import 'package:smartguard/domain/entities/log_event.dart';
import 'package:smartguard/domain/usecases/get_logs_usecase.dart';

class LogsProvider extends ChangeNotifier {
  LogsProvider(this._getLogsUseCase);

  final GetLogsUseCase _getLogsUseCase;

  List<LogEvent> logs = <LogEvent>[];
  bool loading = false;

  Future<void> loadLogs() async {
    loading = true;
    notifyListeners();
    logs = await _getLogsUseCase();
    loading = false;
    notifyListeners();
  }
}

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:smartguard/core/theme/app_theme.dart';
import 'package:smartguard/core/utils/date_formatter.dart';
import 'package:smartguard/domain/entities/log_event.dart';
import 'package:smartguard/presentation/providers/logs_provider.dart';

class LogsScreen extends StatefulWidget {
  const LogsScreen({super.key});

  @override
  State<LogsScreen> createState() => _LogsScreenState();
}

class _LogsScreenState extends State<LogsScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      try {
        await context.read<LogsProvider>().loadLogs();
      } catch (_) {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Unable to load logs.')),
        );
      }
    });
  }

  IconData _iconForType(String type) {
    switch (type) {
      case 'Authorized':
        return Icons.verified;
      case 'Unauthorized':
        return Icons.block;
      case 'Spoof detected':
        return Icons.masks;
      case 'Lockdown triggered':
        return Icons.warning;
      default:
        return Icons.info;
    }
  }

  Color _colorForType(String type) {
    switch (type) {
      case 'Unauthorized':
      case 'Spoof detected':
      case 'Lockdown triggered':
        return AppTheme.warningRed;
      default:
        return Colors.greenAccent;
    }
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<LogsProvider>();

    return Scaffold(
      appBar: AppBar(title: const Text('Access Logs')),
      body: provider.loading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              itemCount: provider.logs.length,
              itemBuilder: (BuildContext context, int index) {
                final LogEvent event = provider.logs[index];
                return ListTile(
                  leading: Icon(_iconForType(event.type), color: _colorForType(event.type)),
                  title: Text(event.type),
                  subtitle: Text(
                    '${DateFormatter.format(event.timestamp)} • ${event.location}',
                  ),
                );
              },
            ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:smartguard/core/router/app_router.dart';
import 'package:smartguard/core/utils/date_formatter.dart';
import 'package:smartguard/presentation/providers/dashboard_provider.dart';
import 'package:smartguard/presentation/widgets/blinking_alert_icon.dart';
import 'package:smartguard/presentation/widgets/neumorphic_card.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _runSafely(() => context.read<DashboardProvider>().loadStatus());
    });
  }

  Future<void> _runSafely(Future<void> Function() action) async {
    try {
      await action();
    } catch (_) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Network failure. Please retry.')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<DashboardProvider>();
    final status = provider.status;

    return Scaffold(
      appBar: AppBar(title: const Text('SmartGuard Dashboard')),
      body: RefreshIndicator(
        onRefresh: () => _runSafely(provider.loadStatus),
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: <Widget>[
            NeumorphicCard(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  children: <Widget>[
                    GestureDetector(
                      onTap: () => _runSafely(() async {
                        if (status?.isLocked ?? true) {
                          HapticFeedback.heavyImpact();
                          await provider.unlock();
                        } else {
                          await provider.lock();
                        }
                      }),
                      child: Container(
                        width: 200,
                        height: 200,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: LinearGradient(
                            colors: <Color>[
                              Colors.blueAccent,
                              (status?.isLocked ?? true)
                                  ? Colors.grey.shade700
                                  : Colors.green,
                            ],
                          ),
                        ),
                        child: Icon(
                          (status?.isLocked ?? true)
                              ? Icons.lock
                              : Icons.lock_open,
                          size: 70,
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      (status?.isLocked ?? true) ? 'Locked' : 'Unlocked',
                      style: Theme.of(context).textTheme.headlineSmall,
                    ),
                    const SizedBox(height: 10),
                    Text('Face Detection: ${status?.faceDetected == true ? 'Active' : 'Idle'}'),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: <Widget>[
                        BlinkingAlertIcon(active: status?.intrusionDetected ?? false),
                        const SizedBox(width: 8),
                        Text((status?.intrusionDetected ?? false)
                            ? 'Intrusion Alert'
                            : 'No Intrusion'),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Last Access: ${status == null ? '--' : DateFormatter.format(status.lastAccess)}',
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            Wrap(
              spacing: 10,
              runSpacing: 10,
              children: <Widget>[
                FilledButton(
                  onPressed: () => _runSafely(() async {
                    HapticFeedback.heavyImpact();
                    await provider.unlock();
                  }),
                  child: const Text('Unlock'),
                ),
                FilledButton(
                  onPressed: () => _runSafely(provider.lock),
                  child: const Text('Lock'),
                ),
                FilledButton.tonal(
                  onPressed: () => _runSafely(provider.lockdown),
                  child: const Text('Activate Lockdown'),
                ),
                OutlinedButton(
                  onPressed: () => Navigator.pushNamed(context, AppRouter.logs),
                  child: const Text('View Logs'),
                ),
                OutlinedButton(
                  onPressed: () => Navigator.pushNamed(context, AppRouter.settings),
                  child: const Text('Settings'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

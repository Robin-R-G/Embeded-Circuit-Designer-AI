import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:smartguard/core/router/app_router.dart';
import 'package:smartguard/presentation/providers/settings_provider.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  final TextEditingController _urlController = TextEditingController();
  final TextEditingController _tokenController = TextEditingController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      final provider = context.read<SettingsProvider>();
      await provider.load();
      _urlController.text = provider.apiBaseUrl;
      _tokenController.text = provider.token;
    });
  }

  @override
  void dispose() {
    _urlController.dispose();
    _tokenController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<SettingsProvider>();

    return Scaffold(
      appBar: AppBar(title: const Text('Settings')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: <Widget>[
          TextField(
            controller: _urlController,
            decoration: const InputDecoration(labelText: 'API Base URL'),
            onSubmitted: (v) => provider.saveApiBaseUrl(v),
          ),
          const SizedBox(height: 14),
          TextField(
            controller: _tokenController,
            decoration: const InputDecoration(labelText: 'Security Token'),
            onSubmitted: (v) => provider.saveToken(v),
          ),
          SwitchListTile(
            value: provider.pushEnabled,
            onChanged: provider.setPushEnabled,
            title: const Text('Push Notifications'),
          ),
          SwitchListTile(
            value: provider.biometricEnabled,
            onChanged: provider.setBiometricEnabled,
            title: const Text('Biometric Login'),
          ),
          const SizedBox(height: 20),
          FilledButton(
            onPressed: () async {
              await provider.logout();
              if (!mounted) return;
              Navigator.pushNamedAndRemoveUntil(
                context,
                AppRouter.login,
                (Route<dynamic> route) => false,
              );
            },
            child: const Text('Logout'),
          ),
        ],
      ),
    );
  }
}

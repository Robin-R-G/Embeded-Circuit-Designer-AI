import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:smartguard/core/router/app_router.dart';
import 'package:smartguard/presentation/providers/auth_provider.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _pinController = TextEditingController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      final provider = context.read<AuthProvider>();
      await provider.initializeDefaults();
      final success = await provider.authenticateBiometric();
      if (success && mounted) {
        Navigator.pushReplacementNamed(context, AppRouter.dashboard);
      }
    });
  }

  Future<void> _submitPin() async {
    final provider = context.read<AuthProvider>();
    final valid = await provider.loginWithPin(_pinController.text.trim());
    if (!mounted) return;
    if (valid) {
      Navigator.pushReplacementNamed(context, AppRouter.dashboard);
      return;
    }
    ScaffoldMessenger.of(context)
        .showSnackBar(const SnackBar(content: Text('Invalid PIN')));
  }

  @override
  Widget build(BuildContext context) {
    final loading = context.watch<AuthProvider>().isLoading;

    return Scaffold(
      appBar: AppBar(title: const Text('Secure Login')),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 420),
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                const Icon(Icons.fingerprint, size: 72),
                const SizedBox(height: 14),
                ElevatedButton.icon(
                  onPressed: loading
                      ? null
                      : () async {
                          final ok = await context
                              .read<AuthProvider>()
                              .authenticateBiometric();
                          if (!mounted) return;
                          if (ok) {
                            Navigator.pushReplacementNamed(
                                context, AppRouter.dashboard);
                          }
                        },
                  icon: const Icon(Icons.verified_user),
                  label: const Text('Authenticate with Biometrics'),
                ),
                const SizedBox(height: 28),
                TextField(
                  controller: _pinController,
                  keyboardType: TextInputType.number,
                  obscureText: true,
                  maxLength: 6,
                  decoration: const InputDecoration(
                    labelText: 'Fallback PIN',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 8),
                FilledButton(
                  onPressed: _submitPin,
                  child: const Text('Login with PIN'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

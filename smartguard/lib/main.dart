import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:local_auth/local_auth.dart';
import 'package:provider/provider.dart';
import 'package:smartguard/core/router/app_router.dart';
import 'package:smartguard/core/theme/app_theme.dart';
import 'package:smartguard/data/datasources/secure_storage_service.dart';
import 'package:smartguard/data/repositories/auth_repository_impl.dart';
import 'package:smartguard/data/repositories/lock_repository_impl.dart';
import 'package:smartguard/domain/usecases/get_logs_usecase.dart';
import 'package:smartguard/domain/usecases/get_status_usecase.dart';
import 'package:smartguard/domain/usecases/lock_actions_usecase.dart';
import 'package:smartguard/presentation/providers/auth_provider.dart';
import 'package:smartguard/presentation/providers/dashboard_provider.dart';
import 'package:smartguard/presentation/providers/logs_provider.dart';
import 'package:smartguard/presentation/providers/settings_provider.dart';
import 'package:smartguard/services/notification_service.dart';

Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
}

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
  await NotificationService.initialize();

  final storage = SecureStorageService();
  final authRepo = AuthRepositoryImpl(storage, LocalAuthentication());
  final lockRepo = LockRepositoryImpl(storage);

  runApp(SmartGuardApp(
    storage: storage,
    authRepository: authRepo,
    lockRepository: lockRepo,
  ));
}

class SmartGuardApp extends StatelessWidget {
  const SmartGuardApp({
    required this.storage,
    required this.authRepository,
    required this.lockRepository,
    super.key,
  });

  final SecureStorageService storage;
  final AuthRepositoryImpl authRepository;
  final LockRepositoryImpl lockRepository;

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider<AuthProvider>(
          create: (_) => AuthProvider(authRepository),
        ),
        ChangeNotifierProvider<DashboardProvider>(
          create: (_) => DashboardProvider(
            GetStatusUseCase(lockRepository),
            LockActionsUseCase(lockRepository),
          ),
        ),
        ChangeNotifierProvider<LogsProvider>(
          create: (_) => LogsProvider(GetLogsUseCase(lockRepository)),
        ),
        ChangeNotifierProvider<SettingsProvider>(
          create: (_) => SettingsProvider(storage),
        ),
      ],
      child: MaterialApp(
        title: 'SmartGuard',
        debugShowCheckedModeBanner: false,
        themeMode: ThemeMode.dark,
        theme: AppTheme.darkTheme(),
        onGenerateRoute: AppRouter.generateRoute,
        initialRoute: AppRouter.splash,
      ),
    );
  }
}

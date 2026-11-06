export interface FlutterFile {
  path: string;
  category: 'config' | 'entry' | 'model' | 'service' | 'provider' | 'screen' | 'widget' | 'test' | 'docs';
  description: string;
  code: string;
}

export const FLUTTER_PROJECT_FILES: FlutterFile[] = [
  {
    path: 'pubspec.yaml',
    category: 'config',
    description: 'Flutter dependencies, assets, and Android configuration',
    code: `name: foodsafe_app
description: "FoodSafe - Food Safety Management System for Android"
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  # State Management
  provider: ^6.1.2
  # Local SQLite Database
  sqflite: ^2.3.2
  path: ^1.9.0
  # Key-Value Persistent Storage
  shared_preferences: ^2.2.2
  # Date formatting & localization
  intl: ^0.19.0
  # Material Icons & Google Fonts
  google_fonts: ^6.1.0
  cupertino_icons: ^1.0.6

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
`
  },
  {
    path: 'lib/main.dart',
    category: 'entry',
    description: 'App root with MultiProvider setup, Green & White Material 3 theme and routing',
    code: `import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';

import 'providers/food_provider.dart';
import 'providers/hygiene_provider.dart';
import 'screens/home_screen.dart';
import 'screens/expiry_tracker_screen.dart';
import 'screens/add_food_screen.dart';
import 'screens/safety_info_screen.dart';
import 'screens/hygiene_checklist_screen.dart';
import 'screens/profile_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Set Android status bar to transparent with dark icons
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
    ),
  );

  runApp(const FoodSafeApp());
}

class FoodSafeApp extends StatelessWidget {
  const FoodSafeApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => FoodProvider()..initDatabase()),
        ChangeNotifierProvider(create: (_) => HygieneProvider()..loadChecklist()),
      ],
      child: MaterialApp(
        title: 'FoodSafe',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(
            seedColor: const Color(0xFF10B981), // Emerald 500
            primary: const Color(0xFF059669),   // Emerald 600
            secondary: const Color(0xFF0D9488), // Teal 600
            surface: Colors.white,
            background: const Color(0xFFF8FAFC),
          ),
          textTheme: GoogleFonts.plusJakartaSansTextTheme(
            Theme.of(context).textTheme,
          ),
          appBarTheme: const AppBarTheme(
            elevation: 0,
            backgroundColor: Colors.white,
            foregroundColor: Color(0xFF0F172A),
            centerTitle: true,
          ),
        ),
        home: const MainNavigationHolder(),
        routes: {
          '/add-food': (ctx) => const AddFoodScreen(),
          '/expiry-tracker': (ctx) => const ExpiryTrackerScreen(),
          '/safety-info': (ctx) => const SafetyInfoScreen(),
          '/hygiene-checklist': (ctx) => const HygieneChecklistScreen(),
          '/profile': (ctx) => const ProfileScreen(),
        },
      ),
    );
  }
}

class MainNavigationHolder extends StatefulWidget {
  const MainNavigationHolder({super.key});

  @override
  State<MainNavigationHolder> createState() => _MainNavigationHolderState();
}

class _MainNavigationHolderState extends State<MainNavigationHolder> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    HomeScreen(),
    ExpiryTrackerScreen(),
    SafetyInfoScreen(),
    HygieneChecklistScreen(),
    ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        backgroundColor: Colors.white,
        elevation: 3,
        indicatorColor: const Color(0xFFD1FAE5), // Mint active indicator
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home, color: Color(0xFF059669)),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(Icons.inventory_2_outlined),
            selectedIcon: Icon(Icons.inventory_2, color: Color(0xFF059669)),
            label: 'Tracker',
          ),
          NavigationDestination(
            icon: Icon(Icons.shield_outlined),
            selectedIcon: Icon(Icons.shield, color: Color(0xFF059669)),
            label: 'Safety',
          ),
          NavigationDestination(
            icon: Icon(Icons.checklist_rtl_outlined),
            selectedIcon: Icon(Icons.checklist_rtl, color: Color(0xFF059669)),
            label: 'Hygiene',
          ),
          NavigationDestination(
            icon: Icon(Icons.person_outline),
            selectedIcon: Icon(Icons.person, color: Color(0xFF059669)),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}
`
  },
  {
    path: 'lib/models/food_item.dart',
    category: 'model',
    description: 'Food item data model with SQLite serialization and expiry calculation',
    code: `class FoodItem {
  final int? id;
  final String name;
  final String category;
  final String storageLocation; // fridge, freezer, pantry
  final String purchaseDate;    // YYYY-MM-DD
  final String expiryDate;      // YYYY-MM-DD
  final String quantity;
  final String notes;
  final int isConsumed;         // 0 or 1 for SQLite

  FoodItem({
    this.id,
    required this.name,
    required this.category,
    required this.storageLocation,
    required this.purchaseDate,
    required this.expiryDate,
    this.quantity = '1 pack',
    this.notes = '',
    this.isConsumed = 0,
  });

  // Calculate days remaining until expiry
  int get daysUntilExpiry {
    try {
      final now = DateTime.now();
      final today = DateTime(now.year, now.month, now.day);
      final exp = DateTime.parse(expiryDate);
      final expiryDay = DateTime(exp.year, exp.month, exp.day);
      return expiryDay.difference(today).inDays;
    } catch (_) {
      return 0;
    }
  }

  bool get isExpired => daysUntilExpiry < 0;
  bool get isExpiringSoon => daysUntilExpiry >= 0 && daysUntilExpiry <= 2;
  bool get isFresh => daysUntilExpiry > 2;

  // Convert to SQLite Map
  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'category': category,
      'storageLocation': storageLocation,
      'purchaseDate': purchaseDate,
      'expiryDate': expiryDate,
      'quantity': quantity,
      'notes': notes,
      'isConsumed': isConsumed,
    };
  }

  // Factory from SQLite Map
  factory FoodItem.fromMap(Map<String, dynamic> map) {
    return FoodItem(
      id: map['id'] as int?,
      name: map['name'] ?? '',
      category: map['category'] ?? 'pantry',
      storageLocation: map['storageLocation'] ?? 'fridge',
      purchaseDate: map['purchaseDate'] ?? '',
      expiryDate: map['expiryDate'] ?? '',
      quantity: map['quantity'] ?? '1 item',
      notes: map['notes'] ?? '',
      isConsumed: map['isConsumed'] ?? 0,
    );
  }

  FoodItem copyWith({
    int? id,
    String? name,
    String? category,
    String? storageLocation,
    String? purchaseDate,
    String? expiryDate,
    String? quantity,
    String? notes,
    int? isConsumed,
  }) {
    return FoodItem(
      id: id ?? this.id,
      name: name ?? this.name,
      category: category ?? this.category,
      storageLocation: storageLocation ?? this.storageLocation,
      purchaseDate: purchaseDate ?? this.purchaseDate,
      expiryDate: expiryDate ?? this.expiryDate,
      quantity: quantity ?? this.quantity,
      notes: notes ?? this.notes,
      isConsumed: isConsumed ?? this.isConsumed,
    );
  }
}
`
  },
  {
    path: 'lib/models/hygiene_item.dart',
    category: 'model',
    description: 'Hygiene checklist task model',
    code: `class HygieneItem {
  final String id;
  final String category; // handwashing, kitchen, storage, cooking
  final String title;
  final String description;
  final String frequency; // daily, each_meal, weekly
  bool isChecked;

  HygieneItem({
    required this.id,
    required this.category,
    required this.title,
    required this.description,
    required this.frequency,
    this.isChecked = false,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'category': category,
    'title': title,
    'description': description,
    'frequency': frequency,
    'isChecked': isChecked,
  };

  factory HygieneItem.fromJson(Map<String, dynamic> json) => HygieneItem(
    id: json['id'],
    category: json['category'],
    title: json['title'],
    description: json['description'],
    frequency: json['frequency'],
    isChecked: json['isChecked'] ?? false,
  );
}
`
  },
  {
    path: 'lib/services/database_helper.dart',
    category: 'service',
    description: 'SQLite database helper using sqflite for local persistence and queries',
    code: `import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import '../models/food_item.dart';

class DatabaseHelper {
  static const _databaseName = "foodsafe_database.db";
  static const _databaseVersion = 1;
  static const tableFood = 'food_items';

  // Singleton instance
  DatabaseHelper._privateConstructor();
  static final DatabaseHelper instance = DatabaseHelper._privateConstructor();

  static Database? _database;

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDatabase();
    return _database!;
  }

  Future<Database> _initDatabase() async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, _databaseName);

    return await openDatabase(
      path,
      version: _databaseVersion,
      onCreate: _onCreate,
    );
  }

  Future _onCreate(Database db, int version) async {
    await db.execute('''
      CREATE TABLE $tableFood (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        storageLocation TEXT NOT NULL,
        purchaseDate TEXT NOT NULL,
        expiryDate TEXT NOT NULL,
        quantity TEXT,
        notes TEXT,
        isConsumed INTEGER DEFAULT 0
      )
    ''');

    // Prepopulate seed items for first app install
    await db.insert(tableFood, {
      'name': 'Whole Fresh Milk',
      'category': 'dairy',
      'storageLocation': 'fridge',
      'purchaseDate': DateTime.now().subtract(const Duration(days: 4)).toString().split(' ')[0],
      'expiryDate': DateTime.now().add(const Duration(days: 1)).toString().split(' ')[0],
      'quantity': '1 Liter',
      'notes': 'Keep on interior middle shelf, not door pockets.',
      'isConsumed': 0,
    });

    await db.insert(tableFood, {
      'name': 'Raw Chicken Breasts',
      'category': 'poultry',
      'storageLocation': 'fridge',
      'purchaseDate': DateTime.now().subtract(const Duration(days: 1)).toString().split(' ')[0],
      'expiryDate': DateTime.now().add(const Duration(days: 1)).toString().split(' ')[0],
      'quantity': '500g',
      'notes': 'Bottom shelf in leakproof container.',
      'isConsumed': 0,
    });
  }

  // Insert Food Item
  Future<int> insertFoodItem(FoodItem item) async {
    final db = await database;
    return await db.insert(tableFood, item.toMap());
  }

  // Get All Food Items
  Future<List<FoodItem>> getAllFoodItems() async {
    final db = await database;
    final List<Map<String, dynamic>> maps = await db.query(
      tableFood,
      where: 'isConsumed = 0',
      orderBy: 'expiryDate ASC',
    );
    return List.generate(maps.length, (i) => FoodItem.fromMap(maps[i]));
  }

  // Update Food Item
  Future<int> updateFoodItem(FoodItem item) async {
    final db = await database;
    return await db.update(
      tableFood,
      item.toMap(),
      where: 'id = ?',
      whereArgs: [item.id],
    );
  }

  // Delete Food Item
  Future<int> deleteFoodItem(int id) async {
    final db = await database;
    return await db.delete(
      tableFood,
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  // Mark as Consumed
  Future<int> markAsConsumed(int id) async {
    final db = await database;
    return await db.update(
      tableFood,
      {'isConsumed': 1},
      where: 'id = ?',
      whereArgs: [id],
    );
  }
}
`
  },
  {
    path: 'lib/services/shared_prefs_service.dart',
    category: 'service',
    description: 'Persistent SharedPreferences for user profile, safety score, and reminders',
    code: `import 'package:shared_preferences/shared_preferences.dart';

class SharedPrefsService {
  static const String keyUserName = 'user_name';
  static const String keyUserEmail = 'user_email';
  static const String keyHouseholdType = 'household_type';
  static const String keyNotifyDays = 'notify_days';
  static const String keyHygieneScore = 'hygiene_score';

  static Future<void> saveProfile({
    required String name,
    required String email,
    required String householdType,
    required int notifyDays,
  }) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(keyUserName, name);
    await prefs.setString(keyUserEmail, email);
    await prefs.setString(keyHouseholdType, householdType);
    await prefs.setInt(keyNotifyDays, notifyDays);
  }

  static Future<Map<String, dynamic>> getProfile() async {
    final prefs = await SharedPreferences.getInstance();
    return {
      'name': prefs.getString(keyUserName) ?? 'Alex Johnson',
      'email': prefs.getString(keyUserEmail) ?? 'alex@foodsafe.org',
      'householdType': prefs.getString(keyHouseholdType) ?? 'family_with_kids',
      'notifyDays': prefs.getInt(keyNotifyDays) ?? 2,
    };
  }
}
`
  },
  {
    path: 'lib/providers/food_provider.dart',
    category: 'provider',
    description: 'ChangeNotifier managing food items, database CRUD, search and filters',
    code: `import 'package:flutter/material.dart';
import '../models/food_item.dart';
import '../services/database_helper.dart';

class FoodProvider extends ChangeNotifier {
  final DatabaseHelper _dbHelper = DatabaseHelper.instance;

  List<FoodItem> _items = [];
  bool _isLoading = false;
  String _searchQuery = '';
  String _selectedFilter = 'all'; // all, expiring, expired, fresh

  List<FoodItem> get items {
    var filtered = _items.where((item) {
      if (_searchQuery.isNotEmpty &&
          !item.name.toLowerCase().contains(_searchQuery.toLowerCase())) {
        return false;
      }
      if (_selectedFilter == 'expiring') return item.isExpiringSoon;
      if (_selectedFilter == 'expired') return item.isExpired;
      if (_selectedFilter == 'fresh') return item.isFresh;
      return true;
    }).toList();
    return filtered;
  }

  List<FoodItem> get expiringSoonItems =>
      _items.where((i) => i.isExpiringSoon).toList();

  List<FoodItem> get expiredItems =>
      _items.where((i) => i.isExpired).toList();

  bool get isLoading => _isLoading;
  String get selectedFilter => _selectedFilter;

  Future<void> initDatabase() async {
    await fetchFoodItems();
  }

  Future<void> fetchFoodItems() async {
    _isLoading = true;
    notifyListeners();
    try {
      _items = await _dbHelper.getAllFoodItems();
    } catch (e) {
      debugPrint('Error loading items: \$e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> addFoodItem(FoodItem item) async {
    final id = await _dbHelper.insertFoodItem(item);
    final newItem = item.copyWith(id: id);
    _items.add(newItem);
    _items.sort((a, b) => a.expiryDate.compareTo(b.expiryDate));
    notifyListeners();
  }

  Future<void> updateFoodItem(FoodItem item) async {
    await _dbHelper.updateFoodItem(item);
    final index = _items.indexWhere((i) => i.id == item.id);
    if (index != -1) {
      _items[index] = item;
      _items.sort((a, b) => a.expiryDate.compareTo(b.expiryDate));
      notifyListeners();
    }
  }

  Future<void> deleteFoodItem(int id) async {
    await _dbHelper.deleteFoodItem(id);
    _items.removeWhere((i) => i.id == id);
    notifyListeners();
  }

  Future<void> markConsumed(int id) async {
    await _dbHelper.markAsConsumed(id);
    _items.removeWhere((i) => i.id == id);
    notifyListeners();
  }

  void setSearchQuery(String query) {
    _searchQuery = query;
    notifyListeners();
  }

  void setFilter(String filter) {
    _selectedFilter = filter;
    notifyListeners();
  }
}
`
  },
  {
    path: 'lib/providers/hygiene_provider.dart',
    category: 'provider',
    description: 'ChangeNotifier managing hygiene checklists and score computation',
    code: `import 'package:flutter/material.dart';
import '../models/hygiene_item.dart';

class HygieneProvider extends ChangeNotifier {
  List<HygieneItem> _checklist = [];

  List<HygieneItem> get checklist => _checklist;

  int get completedCount => _checklist.where((i) => i.isChecked).length;
  int get totalCount => _checklist.length;
  
  double get scorePercentage =>
      totalCount == 0 ? 0.0 : (completedCount / totalCount) * 100;

  void loadChecklist() {
    _checklist = [
      HygieneItem(
        id: 'h1',
        category: 'handwashing',
        title: '20-Second Soap & Warm Water Handwash',
        description: 'Scrub palms, fingers, and under nails before food preparation.',
        frequency: 'each_meal',
        isChecked: true,
      ),
      HygieneItem(
        id: 'h2',
        category: 'handwashing',
        title: 'Immediate Wash After Raw Meats',
        description: 'Sanitize hands immediately after touching raw poultry or meat.',
        frequency: 'each_meal',
        isChecked: false,
      ),
      HygieneItem(
        id: 'h3',
        category: 'kitchen',
        title: 'Disinfect Food Contact Prep Counters',
        description: 'Spray food-safe disinfectant on cutting and prep counters.',
        frequency: 'daily',
        isChecked: true,
      ),
      HygieneItem(
        id: 'h4',
        category: 'kitchen',
        title: 'Separate Chopping Boards (Meat vs Produce)',
        description: 'Never slice ready-to-eat produce on a raw poultry board.',
        frequency: 'each_meal',
        isChecked: true,
      ),
      HygieneItem(
        id: 'h5',
        category: 'storage',
        title: 'Raw Poultry Placed on Bottom Shelf',
        description: 'Store raw poultry on the lowest fridge shelf in a tray.',
        frequency: 'daily',
        isChecked: true,
      ),
      HygieneItem(
        id: 'h6',
        category: 'cooking',
        title: 'Probe Food Thermometer (Poultry 74°C)',
        description: 'Verify thickest part of cooked meat with digital thermometer.',
        frequency: 'each_meal',
        isChecked: false,
      ),
    ];
    notifyListeners();
  }

  void toggleItem(String id) {
    final index = _checklist.indexWhere((i) => i.id == id);
    if (index != -1) {
      _checklist[index].isChecked = !_checklist[index].isChecked;
      notifyListeners();
    }
  }

  void resetDaily() {
    for (var item in _checklist) {
      item.isChecked = false;
    }
    notifyListeners();
  }
}
`
  },
  {
    path: 'lib/screens/home_screen.dart',
    category: 'screen',
    description: 'Home Screen: hygiene reminders, food safety tips, temperature danger zone gauge and summary cards',
    code: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/food_provider.dart';
import '../providers/hygiene_provider.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final foodProvider = Provider.of<FoodProvider>(context);
    final hygieneProvider = Provider.of<HygieneProvider>(context);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: const Color(0xFF10B981).withOpacity(0.12),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.shield, color: Color(0xFF059669), size: 20),
            ),
            const SizedBox(width: 8),
            const Text(
              'FoodSafe',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_none_rounded),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('All food safety reminders are up-to-date!')),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Hero Welcome & Hygiene Score Banner
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF059669), Color(0xFF047857)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF059669).withOpacity(0.25),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Household Safety Score',
                          style: TextStyle(color: Colors.white70, fontSize: 13),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '\${hygieneProvider.scorePercentage.toInt()}% Protected',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 6),
                        const Text(
                          'Daily hygiene checklist & temperature checks in progress.',
                          style: TextStyle(color: Colors.white, fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    width: 54,
                    height: 54,
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.2),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.health_and_safety, color: Colors.white, size: 30),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Expiry Quick Status Cards
            const Text(
              'Food Expiry Overview',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                Expanded(
                  child: _buildMetricCard(
                    title: 'Expiring Soon',
                    count: '\${foodProvider.expiringSoonItems.length}',
                    color: const Color(0xFFD97706),
                    bgColor: const Color(0xFFFEF3C7),
                    icon: Icons.hourglass_bottom_rounded,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildMetricCard(
                    title: 'Expired Items',
                    count: '\${foodProvider.expiredItems.length}',
                    color: const Color(0xFFDC2626),
                    bgColor: const Color(0xFFFEE2E2),
                    icon: Icons.warning_amber_rounded,
                  ),
                ),
              ],
            ),

            const SizedBox(height: 24),

            // Temperature Danger Zone Info Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: const [
                      Icon(Icons.thermostat, color: Color(0xFFEF4444)),
                      SizedBox(width: 8),
                      Text(
                        'Temperature Danger Zone',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Bacteria proliferate rapidly between 4°C and 60°C (40°F–140°F). Keep cold foods below 4°C and hot foods steaming above 60°C.',
                    style: TextStyle(fontSize: 13, color: Color(0xFF64748B), height: 1.4),
                  ),
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF1F5F9),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: const [
                        Text('Fridge: < 4°C', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                        Text('Danger: 4°–60°C', style: TextStyle(fontSize: 12, color: Colors.red, fontWeight: FontWeight.bold)),
                        Text('Cook: > 74°C', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Daily Food Safety Tip
            const Text(
              'Food Safety Tip of the Day',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFFECFDF5),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: const Color(0xFFA7F3D0)),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Icon(Icons.lightbulb_outline, color: Color(0xFF059669)),
                  SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Never Wash Raw Poultry',
                          style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF065F46)),
                        ),
                        SizedBox(height: 4),
                        Text(
                          'Washing raw chicken splashes Salmonella and Campylobacter up to 3 feet onto sinks, clean dishes, and countertops. Cook thoroughly to 74°C instead.',
                          style: TextStyle(fontSize: 12, color: Color(0xFF047857), height: 1.4),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMetricCard({
    required String title,
    required String count,
    required Color color,
    required Color bgColor,
    required IconData icon,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(color: bgColor, borderRadius: BorderRadius.circular(10)),
            child: Icon(icon, color: color, size: 22),
          ),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                count,
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: color),
              ),
              Text(
                title,
                style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
`
  },
  {
    path: 'lib/screens/expiry_tracker_screen.dart',
    category: 'screen',
    description: 'Food Expiry Tracker Screen: search, filter chips, list view, and navigate to details or add item',
    code: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/food_provider.dart';
import '../widgets/food_card.dart';
import 'add_food_screen.dart';

class ExpiryTrackerScreen extends StatelessWidget {
  const ExpiryTrackerScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final foodProvider = Provider.of<FoodProvider>(context);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Food Expiry Tracker', style: TextStyle(fontWeight: FontWeight.bold)),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const AddFoodScreen()),
          );
        },
        backgroundColor: const Color(0xFF059669),
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text('Add Food', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
      body: Column(
        children: [
          // Search Bar
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: TextField(
              onChanged: foodProvider.setSearchQuery,
              decoration: InputDecoration(
                hintText: 'Search stored food items...',
                prefixIcon: const Icon(Icons.search, color: Color(0xFF94A3B8)),
                filled: true,
                fillColor: Colors.white,
                contentPadding: const EdgeInsets.symmetric(horizontal: 16),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                ),
              ),
            ),
          ),

          // Filter Chips
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            child: Row(
              children: [
                _buildFilterChip(context, 'All', 'all', foodProvider),
                const SizedBox(width: 8),
                _buildFilterChip(context, 'Expiring Soon', 'expiring', foodProvider),
                const SizedBox(width: 8),
                _buildFilterChip(context, 'Expired', 'expired', foodProvider),
                const SizedBox(width: 8),
                _buildFilterChip(context, 'Fresh', 'fresh', foodProvider),
              ],
            ),
          ),

          const SizedBox(height: 8),

          // Items List or Empty State
          Expanded(
            child: foodProvider.isLoading
                ? const Center(child: CircularProgressIndicator(color: Color(0xFF059669)))
                : foodProvider.items.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.inventory_2_outlined, size: 64, color: Colors.grey[400]),
                            const SizedBox(height: 12),
                            const Text(
                              'No food items found',
                              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Color(0xFF475569)),
                            ),
                            const SizedBox(height: 6),
                            const Text(
                              'Tap "+ Add Food" to register a product.',
                              style: TextStyle(fontSize: 13, color: Color(0xFF94A3B8)),
                            ),
                          ],
                        ),
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        itemCount: foodProvider.items.length,
                        itemBuilder: (ctx, i) {
                          final item = foodProvider.items[i];
                          return FoodCard(item: item);
                        },
                      ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip(
    BuildContext context,
    String label,
    String value,
    FoodProvider provider,
  ) {
    final isSelected = provider.selectedFilter == value;
    return ChoiceChip(
      label: Text(label),
      selected: isSelected,
      onSelected: (_) => provider.setFilter(value),
      selectedColor: const Color(0xFFD1FAE5),
      labelStyle: TextStyle(
        color: isSelected ? const Color(0xFF065F46) : const Color(0xFF475569),
        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
        fontSize: 13,
      ),
    );
  }
}
`
  },
  {
    path: 'lib/screens/add_food_screen.dart',
    category: 'screen',
    description: 'Add Food Item Screen: Form validation, date pickers, location selector, and storage advice',
    code: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../models/food_item.dart';
import '../providers/food_provider.dart';

class AddFoodScreen extends StatefulWidget {
  const AddFoodScreen({super.key});

  @override
  State<AddFoodScreen> createState() => _AddFoodScreenState();
}

class _AddFoodScreenState extends State<AddFoodScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _quantityController = TextEditingController(text: '1 pack');
  final _notesController = TextEditingController();

  String _selectedCategory = 'dairy';
  String _selectedLocation = 'fridge';
  DateTime _purchaseDate = DateTime.now();
  DateTime _expiryDate = DateTime.now().add(const Duration(days: 5));

  final List<String> _categories = [
    'dairy',
    'meat',
    'poultry',
    'seafood',
    'produce',
    'leftovers',
    'bakery',
    'pantry',
    'canned'
  ];

  @override
  void dispose() {
    _nameController.dispose();
    _quantityController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  Future<void> _selectDate(BuildContext context, bool isPurchase) async {
    final initial = isPurchase ? _purchaseDate : _expiryDate;
    final picked = await showDatePicker(
      context: context,
      initialDate: initial,
      firstDate: DateTime(2020),
      lastDate: DateTime(2035),
    );
    if (picked != null) {
      setState(() {
        if (isPurchase) {
          _purchaseDate = picked;
        } else {
          _expiryDate = picked;
        }
      });
    }
  }

  void _saveItem() {
    if (!_formKey.currentState!.validate()) return;

    if (_expiryDate.isBefore(_purchaseDate)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Expiry date cannot be earlier than purchase date!')),
      );
      return;
    }

    final newItem = FoodItem(
      name: _nameController.text.trim(),
      category: _selectedCategory,
      storageLocation: _selectedLocation,
      purchaseDate: DateFormat('yyyy-MM-dd').format(_purchaseDate),
      expiryDate: DateFormat('yyyy-MM-dd').format(_expiryDate),
      quantity: _quantityController.text.trim(),
      notes: _notesController.text.trim(),
    );

    Provider.of<FoodProvider>(context, listen: false).addFoodItem(newItem);
    Navigator.pop(context);
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Food item added successfully!')),
    );
  }

  @override
  Widget build(BuildContext context) {
    final dateFormat = DateFormat('MMM dd, yyyy');

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Add Food Item', style: TextStyle(fontWeight: FontWeight.bold)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Food Name Field
              TextFormField(
                controller: _nameController,
                decoration: InputDecoration(
                  labelText: 'Food Name *',
                  hintText: 'e.g. Fresh Milk, Raw Chicken Breast',
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
                validator: (val) {
                  if (val == null || val.trim().isEmpty) {
                    return 'Please enter the food name';
                  }
                  return null;
                },
              ),

              const SizedBox(height: 16),

              // Category Dropdown
              DropdownButtonFormField<String>(
                value: _selectedCategory,
                decoration: InputDecoration(
                  labelText: 'Category',
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
                items: _categories.map((c) {
                  return DropdownMenuItem(
                    value: c,
                    child: Text(c[0].toUpperCase() + c.substring(1)),
                  );
                }).toList(),
                onChanged: (val) {
                  if (val != null) setState(() => _selectedCategory = val);
                },
              ),

              const SizedBox(height: 16),

              // Storage Location Segment
              const Text('Storage Location', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
              const SizedBox(height: 6),
              Row(
                children: [
                  _buildLocationOption('fridge', 'Refrigerator', Icons.kitchen),
                  const SizedBox(width: 8),
                  _buildLocationOption('freezer', 'Freezer', Icons.ac_unit),
                  const SizedBox(width: 8),
                  _buildLocationOption('pantry', 'Pantry', Icons.shelves),
                ],
              ),

              const SizedBox(height: 16),

              // Date Selectors
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Purchase Date', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                        const SizedBox(height: 6),
                        InkWell(
                          onTap: () => _selectDate(context, true),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: const Color(0xFFCBD5E1)),
                            ),
                            child: Row(
                              children: [
                                const Icon(Icons.calendar_today, size: 16, color: Color(0xFF64748B)),
                                const SizedBox(width: 8),
                                Text(dateFormat.format(_purchaseDate), style: const TextStyle(fontSize: 13)),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Expiry Date *', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                        const SizedBox(height: 6),
                        InkWell(
                          onTap: () => _selectDate(context, false),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: const Color(0xFF059669)),
                            ),
                            child: Row(
                              children: [
                                const Icon(Icons.event_available, size: 16, color: Color(0xFF059669)),
                                const SizedBox(width: 8),
                                Text(
                                  dateFormat.format(_expiryDate),
                                  style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF059669)),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 16),

              // Quantity Field
              TextFormField(
                controller: _quantityController,
                decoration: InputDecoration(
                  labelText: 'Quantity / Packaging',
                  hintText: 'e.g. 500g, 1 Liter, 4 pieces',
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),

              const SizedBox(height: 16),

              // Handling Notes
              TextFormField(
                controller: _notesController,
                maxLines: 2,
                decoration: InputDecoration(
                  labelText: 'Storage Notes / Opened Date',
                  hintText: 'e.g. Opened on Monday; seal tightly',
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),

              const SizedBox(height: 24),

              // Submit Button
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: _saveItem,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF059669),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text(
                    'Save Food Item',
                    style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLocationOption(String key, String label, IconData icon) {
    final isSelected = _selectedLocation == key;
    return Expanded(
      child: InkWell(
        onTap: () => setState(() => _selectedLocation = key),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            color: isSelected ? const Color(0xFFD1FAE5) : Colors.white,
            borderRadius: BorderRadius.circular(10),
            border: Border.all(
              color: isSelected ? const Color(0xFF059669) : const Color(0xFFCBD5E1),
              width: isSelected ? 1.5 : 1,
            ),
          ),
          child: Column(
            children: [
              Icon(icon, size: 20, color: isSelected ? const Color(0xFF065F46) : const Color(0xFF64748B)),
              const SizedBox(height: 4),
              Text(
                label,
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                  color: isSelected ? const Color(0xFF065F46) : const Color(0xFF334155),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
`
  },
  {
    path: 'lib/screens/food_details_screen.dart',
    category: 'screen',
    description: 'Food Details Screen: Full food safety recommendations, temperature requirements, and action handlers',
    code: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/food_item.dart';
import '../providers/food_provider.dart';

class FoodDetailsScreen extends StatelessWidget {
  final FoodItem item;

  const FoodDetailsScreen({super.key, required this.item});

  @override
  Widget build(BuildContext context) {
    final days = item.daysUntilExpiry;

    Color statusColor = const Color(0xFF059669);
    String statusText = '\$days days remaining';
    if (days < 0) {
      statusColor = const Color(0xFFDC2626);
      statusText = 'Expired \${days.abs()} days ago';
    } else if (days <= 2) {
      statusColor = const Color(0xFFD97706);
      statusText = 'Expiring soon (\${days == 0 ? "Today" : "$days day"} left)';
    }

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: Text(item.name, style: const TextStyle(fontWeight: FontWeight.bold)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Status Banner
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: statusColor.withOpacity(0.1),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: statusColor.withOpacity(0.3)),
              ),
              child: Row(
                children: [
                  Icon(
                    days < 0 ? Icons.error_outline : Icons.check_circle_outline,
                    color: statusColor,
                    size: 28,
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          statusText,
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: statusColor,
                          ),
                        ),
                        Text(
                          'Expiry Date: \${item.expiryDate}',
                          style: TextStyle(fontSize: 12, color: statusColor.withOpacity(0.8)),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Item Details Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                children: [
                  _buildDetailRow('Category', item.category.toUpperCase()),
                  const Divider(),
                  _buildDetailRow('Storage Location', item.storageLocation.toUpperCase()),
                  const Divider(),
                  _buildDetailRow('Purchased On', item.purchaseDate),
                  const Divider(),
                  _buildDetailRow('Quantity', item.quantity),
                  if (item.notes.isNotEmpty) ...[
                    const Divider(),
                    _buildDetailRow('Notes', item.notes),
                  ],
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Safe Handling Guidelines
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFFECFDF5),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: const Color(0xFFA7F3D0)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: const [
                      Icon(Icons.shield_outlined, color: Color(0xFF059669)),
                      SizedBox(width: 8),
                      Text(
                        'Safe Handling Guidance',
                        style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF065F46)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    item.category == 'poultry' || item.category == 'meat'
                        ? 'Ensure cooked to internal 74°C (165°F). Never wash raw meat in sink. Store in bottom fridge shelf.'
                        : 'Store at recommended temperature. Check for off-odors, mold, or discoloration prior to consumption.',
                    style: const TextStyle(fontSize: 13, color: Color(0xFF047857), height: 1.4),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 30),

            // Action Buttons
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () {
                      if (item.id != null) {
                        Provider.of<FoodProvider>(context, listen: false).deleteFoodItem(item.id!);
                        Navigator.pop(context);
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Item discarded/removed.')),
                        );
                      }
                    },
                    icon: const Icon(Icons.delete_outline, color: Colors.red),
                    label: const Text('Discard', style: TextStyle(color: Colors.red)),
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: Colors.red),
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {
                      if (item.id != null) {
                        Provider.of<FoodProvider>(context, listen: false).markConsumed(item.id!);
                        Navigator.pop(context);
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Marked as safely consumed!')),
                        );
                      }
                    },
                    icon: const Icon(Icons.check, color: Colors.white),
                    label: const Text('Consumed', style: TextStyle(color: Colors.white)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF059669),
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: Color(0xFF64748B), fontSize: 13)),
          Text(value, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
        ],
      ),
    );
  }
}
`
  },
  {
    path: 'lib/screens/safety_info_screen.dart',
    category: 'screen',
    description: 'Food Safety Information: Foodborne diseases, contamination vectors, safe cooking temperatures, and handling',
    code: `import 'package:flutter/material.dart';

class SafetyInfoScreen extends StatelessWidget {
  const SafetyInfoScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 3,
      child: Scaffold(
        backgroundColor: const Color(0xFFF8FAFC),
        appBar: AppBar(
          title: const Text('Food Safety Hub', style: TextStyle(fontWeight: FontWeight.bold)),
          bottom: const TabBar(
            indicatorColor: Color(0xFF059669),
            labelColor: Color(0xFF059669),
            unselectedLabelColor: Color(0xFF64748B),
            tabs: [
              Tab(text: 'Pathogens'),
              Tab(text: 'Temperatures'),
              Tab(text: 'Prevention'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            _buildPathogensTab(),
            _buildTemperaturesTab(),
            _buildPreventionTab(),
          ],
        ),
      ),
    );
  }

  Widget _buildPathogensTab() {
    final pathogens = [
      {
        'name': 'Salmonella enterica',
        'type': 'Bacteria',
        'sources': 'Raw poultry, unpasteurized eggs, dairy',
        'temp': 'Destroyed at 74°C (165°F)',
        'symptoms': 'Diarrhea, fever, abdominal cramps (6-72 hrs)',
      },
      {
        'name': 'Escherichia coli (O157:H7)',
        'type': 'Bacteria',
        'sources': 'Undercooked ground beef, raw produce',
        'temp': 'Destroyed at 71°C (160°F)',
        'symptoms': 'Severe cramps, bloody diarrhea, HUS risk',
      },
      {
        'name': 'Listeria monocytogenes',
        'type': 'Bacteria',
        'sources': 'Deli cold cuts, soft cheeses, unpasteurized milk',
        'temp': 'Multiplies even below 4°C in refrigerators!',
        'symptoms': 'High fever, muscle aches, pregnancy risk',
      },
      {
        'name': 'Norovirus',
        'type': 'Virus',
        'sources': 'Infected food handlers, raw shellfish',
        'temp': 'Survives freezing; sanitize with chlorine bleach',
        'symptoms': 'Acute vomiting, watery diarrhea within 24 hrs',
      },
    ];

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: pathogens.length,
      itemBuilder: (ctx, i) {
        final p = pathogens[i];
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      p['name']!,
                      style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFEE2E2),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        p['type']!,
                        style: const TextStyle(fontSize: 11, color: Colors.red, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text('Sources: \${p['sources']}', style: const TextStyle(fontSize: 13, color: Color(0xFF475569))),
                const SizedBox(height: 4),
                Text('Critical Temp: \${p['temp']}', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: Color(0xFF059669))),
                const SizedBox(height: 4),
                Text('Symptoms: \${p['symptoms']}', style: const TextStyle(fontSize: 12, color: Color(0xFF64748B))),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildTemperaturesTab() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        _buildTempRow('Poultry (Chicken & Turkey)', '74°C (165°F)', 'Innermost thigh & breast'),
        _buildTempRow('Ground Meats (Beef, Pork)', '71°C (160°F)', 'No pink juices'),
        _buildTempRow('Whole Steaks & Chops', '63°C (145°F)', 'Mandatory 3-min rest'),
        _buildTempRow('Fish & Shellfish', '63°C (145°F)', 'Flesh opaque & flakes'),
        _buildTempRow('Leftovers & Casseroles', '74°C (165°F)', 'Steaming hot throughout'),
        _buildTempRow('Refrigerator Storage', '< 4°C (40°F)', 'Slows bacterial growth'),
        _buildTempRow('Freezer Storage', '< -18°C (0°F)', 'Inactivates microbes'),
      ],
    );
  }

  Widget _buildTempRow(String food, String temp, String note) {
    return Card(
      margin: const EdgeInsets.only(bottom: 10),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: const Color(0xFFD1FAE5),
            borderRadius: BorderRadius.circular(8),
          ),
          child: const Icon(Icons.thermostat, color: Color(0xFF059669)),
        ),
        title: Text(food, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
        subtitle: Text(note, style: const TextStyle(fontSize: 12)),
        trailing: Text(
          temp,
          style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF059669), fontSize: 14),
        ),
      ),
    );
  }

  Widget _buildPreventionTab() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        _buildGuideCard(
          '1. Clean: Wash Hands & Surfaces',
          'Wash hands for 20 seconds with soap and warm water. Sanitize cutting boards after each use.',
          Icons.clean_hands_outlined,
        ),
        _buildGuideCard(
          '2. Separate: Don’t Cross-Contaminate',
          'Keep raw meat, poultry, and seafood away from ready-to-eat produce in cart and fridge.',
          Icons.call_split_outlined,
        ),
        _buildGuideCard(
          '3. Cook: Cook to Safe Internal Temperatures',
          'Use a food thermometer. Food is safely cooked when internal temperature kills pathogens.',
          Icons.outdoor_grill_outlined,
        ),
        _buildGuideCard(
          '4. Chill: Refrigerate Promptly',
          'Refrigerate perishables within 2 hours. Thaw in the fridge, never at room temperature.',
          Icons.ac_unit_outlined,
        ),
      ],
    );
  }

  Widget _buildGuideCard(String title, String desc, IconData icon) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: const Color(0xFF059669), size: 28),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                  const SizedBox(height: 6),
                  Text(desc, style: const TextStyle(fontSize: 13, color: Color(0xFF475569), height: 1.4)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
`
  },
  {
    path: 'lib/screens/hygiene_checklist_screen.dart',
    category: 'screen',
    description: 'Food Hygiene Checklist Screen: interactive checklist, score progress bar, and categories',
    code: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/hygiene_provider.dart';

class HygieneChecklistScreen extends StatelessWidget {
  const HygieneChecklistScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final hygieneProvider = Provider.of<HygieneProvider>(context);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Hygiene Checklist', style: TextStyle(fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            tooltip: 'Reset daily checklist',
            onPressed: () {
              hygieneProvider.resetDaily();
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Daily checklist has been reset.')),
              );
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Score Header
          Container(
            padding: const EdgeInsets.all(16),
            margin: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Daily Hygiene Compliance', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                    Text(
                      '\${hygieneProvider.completedCount} / \${hygieneProvider.totalCount} completed',
                      style: const TextStyle(fontSize: 12, color: Color(0xFF059669), fontWeight: FontWeight.w600),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                LinearProgressIndicator(
                  value: hygieneProvider.totalCount == 0
                      ? 0
                      : hygieneProvider.completedCount / hygieneProvider.totalCount,
                  backgroundColor: const Color(0xFFE2E8F0),
                  color: const Color(0xFF059669),
                  minHeight: 8,
                  borderRadius: BorderRadius.circular(4),
                ),
              ],
            ),
          ),

          // Checklist items
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: hygieneProvider.checklist.length,
              itemBuilder: (ctx, i) {
                final item = hygieneProvider.checklist[i];
                return Card(
                  margin: const EdgeInsets.only(bottom: 10),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  child: CheckboxListTile(
                    value: item.isChecked,
                    activeColor: const Color(0xFF059669),
                    onChanged: (_) => hygieneProvider.toggleItem(item.id),
                    title: Text(
                      item.title,
                      style: TextStyle(
                        fontWeight: FontWeight.w600,
                        fontSize: 14,
                        decoration: item.isChecked ? TextDecoration.lineThrough : null,
                        color: item.isChecked ? const Color(0xFF94A3B8) : const Color(0xFF0F172A),
                      ),
                    ),
                    subtitle: Text(
                      item.description,
                      style: TextStyle(
                        fontSize: 12,
                        color: item.isChecked ? const Color(0xFFCBD5E1) : const Color(0xFF64748B),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
`
  },
  {
    path: 'lib/models/team_member.dart',
    category: 'model',
    description: 'Project team member and group contributor model for college submission',
    code: `class TeamMember {
  final String id;
  final String name;
  final String role;
  final String studentId;
  final String email;
  final String contribution;

  TeamMember({
    required this.id,
    required this.name,
    required this.role,
    required this.studentId,
    required this.email,
    required this.contribution,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'role': role,
    'studentId': studentId,
    'email': email,
    'contribution': contribution,
  };

  factory TeamMember.fromJson(Map<String, dynamic> json) => TeamMember(
    id: json['id'],
    name: json['name'],
    role: json['role'],
    studentId: json['studentId'] ?? '',
    email: json['email'] ?? '',
    contribution: json['contribution'] ?? '',
  );
}
`
  },
  {
    path: 'lib/screens/profile_screen.dart',
    category: 'screen',
    description: 'User Profile & College Team Members: contributors list, student IDs, notification settings',
    code: `import 'package:flutter/material.dart';

class TeamMember {
  final String name;
  final String role;
  final String studentId;
  final String email;
  final String contribution;

  const TeamMember({
    required this.name,
    required this.role,
    required this.studentId,
    required this.email,
    required this.contribution,
  });
}

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final String _name = 'Alex Johnson';
  final String _email = 'alex.foodsafe@gmail.com';
  bool _expiryAlerts = true;
  bool _hygieneReminders = true;
  int _alertDaysBefore = 2;

  // College Group Project Team Members
  final List<TeamMember> _teamMembers = [
    const TeamMember(
      name: 'Karthik Juvva',
      role: 'Project Lead & Flutter Architect',
      studentId: '21CS042',
      email: 'karthikjuvva02@gmail.com',
      contribution: 'MultiProvider state management, SQLite integration & navigation routing.',
    ),
    const TeamMember(
      name: 'Priya Sharma',
      role: 'UI/UX & Mobile Ergonomics Lead',
      studentId: '21CS058',
      email: 'priya.sharma@college.edu',
      contribution: 'Material 3 green & white design system, responsive touch targets & Food Card components.',
    ),
    const TeamMember(
      name: 'Rahul Varma',
      role: 'Database & Storage Engineer',
      studentId: '21CS089',
      email: 'rahul.varma@college.edu',
      contribution: 'sqflite local database helper, schema migrations & SharedPreferences persistence.',
    ),
    const TeamMember(
      name: 'Ananya Patel',
      role: 'Food Safety Specialist & QA',
      studentId: '21CS015',
      email: 'ananya.patel@college.edu',
      contribution: 'WHO & USDA pathogen database curation, danger zone algorithmic calculations & widget unit tests.',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('User Profile & Team', style: TextStyle(fontWeight: FontWeight.bold)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // User Avatar Card
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 28,
                    backgroundColor: const Color(0xFFD1FAE5),
                    child: const Text('AJ', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF059669))),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(_name, style: const TextStyle(fontSize: 17, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 2),
                        Text(_email, style: const TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                        const SizedBox(height: 4),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: const Color(0xFFECFDF5),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: const Text('FoodSafe Certified Kitchen · College Project', style: TextStyle(fontSize: 11, color: Color(0xFF059669), fontWeight: FontWeight.w600)),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // ==========================================
            // PROJECT TEAM MEMBERS LIST
            // ==========================================
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Project Team Members',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF0F172A)),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: const Color(0xFFD1FAE5),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    '\${_teamMembers.length} Members',
                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF065F46)),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),

            ..._teamMembers.map((member) => Container(
              margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      CircleAvatar(
                        radius: 18,
                        backgroundColor: const Color(0xFF059669),
                        child: Text(
                          member.name.split(' ').map((n) => n[0]).take(2).join(),
                          style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Text(member.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                                const SizedBox(width: 8),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFF1F5F9),
                                    borderRadius: BorderRadius.circular(4),
                                  ),
                                  child: Text(member.studentId, style: const TextStyle(fontSize: 11, fontFamily: 'monospace', color: Color(0xFF475569))),
                                ),
                              ],
                            ),
                            Text(member.role, style: const TextStyle(fontSize: 12, color: Color(0xFF059669), fontWeight: FontWeight.w600)),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF8FAFC),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      'Contribution: \${member.contribution}',
                      style: const TextStyle(fontSize: 12, color: Color(0xFF475569), height: 1.3),
                    ),
                  ),
                ],
              ),
            )),

            const SizedBox(height: 16),

            // Settings Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Notifications & Reminders', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                  const SizedBox(height: 8),
                  SwitchListTile(
                    value: _expiryAlerts,
                    activeColor: const Color(0xFF059669),
                    contentPadding: EdgeInsets.zero,
                    title: const Text('Expiry Push Alerts', style: TextStyle(fontSize: 14)),
                    subtitle: const Text('Notify before food products expire', style: TextStyle(fontSize: 12)),
                    onChanged: (val) => setState(() => _expiryAlerts = val),
                  ),
                  const Divider(),
                  SwitchListTile(
                    value: _hygieneReminders,
                    activeColor: const Color(0xFF059669),
                    contentPadding: EdgeInsets.zero,
                    title: const Text('Daily Hygiene Prompts', style: TextStyle(fontSize: 14)),
                    subtitle: const Text('Prompts before meal prep and at bedtime', style: TextStyle(fontSize: 12)),
                    onChanged: (val) => setState(() => _hygieneReminders = val),
                  ),
                  const Divider(),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Notify Days in Advance', style: TextStyle(fontSize: 14)),
                      DropdownButton<int>(
                        value: _alertDaysBefore,
                        items: const [
                          DropdownMenuItem(value: 1, child: Text('1 day before')),
                          DropdownMenuItem(value: 2, child: Text('2 days before')),
                          DropdownMenuItem(value: 3, child: Text('3 days before')),
                        ],
                        onChanged: (v) {
                          if (v != null) setState(() => _alertDaysBefore = v);
                        },
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // College Project Info Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFFF1F5F9),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Text('Project Metadata', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF334155))),
                  SizedBox(height: 6),
                  Text('Application: FoodSafe Mobile Management System', style: TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                  Text('Tech Stack: Flutter 3.x, Dart, Provider, SQLite', style: TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                  Text('Target Platform: Android (API 21+)', style: TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
`
  },
  {
    path: 'lib/widgets/food_card.dart',
    category: 'widget',
    description: 'Reusable FoodCard widget displaying status badges, category icons, and days count',
    code: `import 'package:flutter/material.dart';
import '../models/food_item.dart';
import '../screens/food_details_screen.dart';

class FoodCard extends StatelessWidget {
  final FoodItem item;

  const FoodCard({super.key, required this.item});

  @override
  Widget build(BuildContext context) {
    final days = item.daysUntilExpiry;

    Color badgeColor = const Color(0xFF059669);
    Color badgeBg = const Color(0xFFECFDF5);
    String statusLabel = '\$days days';

    if (item.isExpired) {
      badgeColor = const Color(0xFFDC2626);
      badgeBg = const Color(0xFFFEF2F2);
      statusLabel = 'Expired';
    } else if (item.isExpiringSoon) {
      badgeColor = const Color(0xFFD97706);
      badgeBg = const Color(0xFFFFFBEB);
      statusLabel = days == 0 ? 'Today' : '\$days d left';
    }

    return Card(
      margin: const EdgeInsets.only(bottom: 10),
      elevation: 0.5,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: const BorderSide(color: Color(0xFFE2E8F0)),
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => FoodDetailsScreen(item: item),
            ),
          );
        },
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Row(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: const Color(0xFFF1F5F9),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(_getCategoryIcon(item.category), color: const Color(0xFF059669)),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      item.name,
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '\${item.quantity} · \${item.storageLocation.toUpperCase()}',
                      style: const TextStyle(color: Color(0xFF64748B), fontSize: 12),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: badgeBg,
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(color: badgeColor.withOpacity(0.3)),
                ),
                child: Text(
                  statusLabel,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: badgeColor,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  IconData _getCategoryIcon(String cat) {
    switch (cat.toLowerCase()) {
      case 'dairy':
        return Icons.local_drink;
      case 'meat':
      case 'poultry':
        return Icons.lunch_dining;
      case 'seafood':
        return Icons.set_meal;
      case 'produce':
        return Icons.eco;
      case 'bakery':
        return Icons.bakery_dining;
      default:
        return Icons.fastfood;
    }
  }
}
`
  },
  {
    path: 'test/widget_test.dart',
    category: 'test',
    description: 'Unit & Widget tests verifying app initialization and navigation',
    code: `import 'package:flutter_test/flutter_test.dart';
import 'package:foodsafe_app/main.dart';
import 'package:foodsafe_app/models/food_item.dart';

void main() {
  test('FoodItem expiry logic calculation', () {
    final tomorrow = DateTime.now().add(const Duration(days: 1)).toString().split(' ')[0];
    final item = FoodItem(
      name: 'Test Milk',
      category: 'dairy',
      storageLocation: 'fridge',
      purchaseDate: '2026-01-01',
      expiryDate: tomorrow,
    );

    expect(item.daysUntilExpiry, 1);
    expect(item.isExpired, false);
    expect(item.isExpiringSoon, true);
  });

  testWidgets('App initializes with title FoodSafe', (WidgetTester tester) async {
    await tester.pumpWidget(const FoodSafeApp());
    expect(find.text('FoodSafe'), findsWidgets);
  });
}
`
  },
  {
    path: 'README.md',
    category: 'docs',
    description: 'Comprehensive college project instructions, how to run, and release APK generation guide',
    code: `# FoodSafe – Food Safety Management System (Flutter & Android)

**FoodSafe** is an Android mobile application engineered with Flutter, Dart, SQLite, and Provider. It empowers households and food businesses to prevent foodborne illness, manage expiry dates, conduct hygiene audits, and understand temperature danger zones.

---

## 📌 Features
- **Food Expiry Tracker**: Local SQLite persistent inventory with automatic expiry status (Expired, Expiring Soon, Fresh).
- **Food Hygiene Checklist**: Categorized audits (Handwashing, Kitchen, Storage, Cooking) with real-time compliance score.
- **Safety Knowledge Hub**: Pathogens database (Salmonella, E. coli, Listeria, Norovirus), cross-contamination prevention, and cooking temperature guides.
- **Material 3 Theme**: Clean Emerald Green & White aesthetic tailored for health & safety management.

---

## 🛠️ Tech Stack
- **Framework**: Flutter (v3.19+)
- **Language**: Dart (v3.3+)
- **State Management**: Provider
- **Local Database**: sqflite (SQLite)
- **Key-Value Store**: shared_preferences
- **Typography**: Google Fonts (Plus Jakarta Sans)

---

## 🚀 How to Run the Project

### 1. Prerequisites
- Install [Flutter SDK](https://flutter.dev/docs/get-started/install)
- Install Android Studio or VS Code with Flutter extension
- Connected Android Device or Emulator running Android 7.0+ (API 24+)

### 2. Setup
\`\`\`bash
# Clone the repository
git clone https://github.com/your-username/foodsafe-flutter.git
cd foodsafe-flutter

# Get dependencies
flutter pub get

# Run on connected device
flutter run
\`\`\`

---

## 📦 How to Build the Release APK

To create an optimized Android APK for submission or sharing:

\`\`\`bash
# Build fat release APK
flutter build apk --release

# Locate output APK at:
# build/app/outputs/flutter-apk/app-release.apk
\`\`\`

---

## 📂 Project Structure
\`\`\`
lib/
├── main.dart                      # MultiProvider & MaterialApp setup
├── models/
│   ├── food_item.dart             # SQLite schema & expiry calculations
│   └── hygiene_item.dart          # Checklist model
├── providers/
│   ├── food_provider.dart         # Items state & database CRUD
│   └── hygiene_provider.dart      # Hygiene score & checklist state
├── screens/
│   ├── home_screen.dart           # Dashboard & temperature gauge
│   ├── expiry_tracker_screen.dart # Inventory with filters & search
│   ├── add_food_screen.dart       # Form with date pickers & validation
│   ├── food_details_screen.dart   # Detail view & handling guidelines
│   ├── safety_info_screen.dart    # Pathogens & temperature guides
│   ├── hygiene_checklist_screen.dart # Interactive audit checklist
│   └── profile_screen.dart        # User profile & notification settings
├── services/
│   ├── database_helper.dart       # sqflite SQLite helper
│   └── shared_prefs_service.dart  # Key-value storage
└── widgets/
    └── food_card.dart             # Reusable card component
test/
└── widget_test.dart               # Unit & Widget tests
\`\`\`
`
  }
];

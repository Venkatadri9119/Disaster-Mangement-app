import 'package:flutter/material.dart';
import 'theme/app_theme.dart';
import 'screens/citizen/citizen_home.dart';
import 'screens/citizen/shelter_list.dart';
import 'screens/volunteer/volunteer_home.dart';

void main() {
  runApp(const DisasterAIApp());
}

class DisasterAIApp extends StatelessWidget {
  const DisasterAIApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Disaster AI',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      home: const MainNavigationWrapper(),
    );
  }
}

class MainNavigationWrapper extends StatefulWidget {
  const MainNavigationWrapper({Key? key}) : super(key: key);

  @override
  State<MainNavigationWrapper> createState() => _MainNavigationWrapperState();
}

class _MainNavigationWrapperState extends State<MainNavigationWrapper> {
  int _currentIndex = 0;
  bool _isVolunteerRole = false;

  @override
  Widget build(BuildContext context) {
    if (_isVolunteerRole) {
      return VolunteerHomeScreen(
        onSwitchToCitizen: () => setState(() => _isVolunteerRole = false),
      );
    }

    final List<Widget> pages = [
      CitizenHomeScreen(
        onSwitchToVolunteer: () => setState(() => _isVolunteerRole = true),
      ),
      const ShelterListScreen(),
      Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.person, size: 48, color: Colors.blueAccent),
            const SizedBox(height: 12),
            const Text("Citizen Profile & Emergency Contacts", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            const Text("Phone: +91 91234 56789 • Lang: Telugu / English", style: TextStyle(color: Colors.gray, fontSize: 13)),
          ],
        ),
      ),
    ];

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: pages,
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        backgroundColor: const Color(0xFF111827),
        selectedItemColor: AppTheme.criticalRed,
        unselectedItemColor: Colors.gray,
        onTap: (idx) => setState(() => _currentIndex = idx),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.chat), label: "AI Chat"),
          BottomNavigationBarItem(icon: Icon(Icons.home_work), label: "Shelters"),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: "Profile"),
        ],
      ),
    );
  }
}

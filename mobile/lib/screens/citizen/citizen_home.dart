import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';

class CitizenHomeScreen extends StatefulWidget {
  final VoidCallback onSwitchToVolunteer;
  const CitizenHomeScreen({Key? key, required this.onSwitchToVolunteer}) : super(key: key);

  @override
  State<CitizenHomeScreen> createState() => _CitizenHomeScreenState();
}

class _CitizenHomeScreenState extends State<CitizenHomeScreen> {
  final TextEditingController _messageController = TextEditingController();
  String _selectedLanguage = "en"; // "en" or "te"
  bool _isListening = false;
  bool _hasActiveRequest = false;
  
  final List<Map<String, String>> _messages = [
    {
      "sender": "ai",
      "text": "How can I help you?\n\nTell me what happened. You can type or speak in English or Telugu (తెలుగు).",
      "lang": "en"
    }
  ];

  final List<Map<String, dynamic>> _suggestedPrompts = [
    {"label": "🚑 Emergency Rescue", "prompt": "Our house is flooded. 5 people trapped, mother needs medical help."},
    {"label": "🏠 Safe Shelter", "prompt": "I need a safe shelter nearby for my family."},
    {"label": "🏥 Medical Help", "prompt": "Someone is injured and needs immediate medical assistance."},
    {"label": "🍲 Food & Water", "prompt": "We need clean drinking water and food packets."},
    {"label": "👨‍👩‍👧 Missing Person", "prompt": "My brother is missing since yesterday's storm."},
    {"label": "🚗 Evacuation", "prompt": "We need boat evacuation from flooded area."}
  ];

  void _sendMessage(String text) {
    if (text.trim().isEmpty) return;

    setState(() {
      _messages.add({"sender": "user", "text": text, "lang": _selectedLanguage});
      _messageController.clear();
    });

    // Simulate AI Agent Triage Response
    Future.delayed(const Duration(milliseconds: 800), () {
      setState(() {
        _hasActiveRequest = true;
        if (_selectedLanguage == "te" || text.contains("వరద")) {
          _messages.add({
            "sender": "ai",
            "text": "మీ అభ్యర్థన అత్యవసర పరిధిలో (CRITICAL) నమోదు చేయబడింది.\n\nసహాయ బృందం Ravi (2.4 కి.మీ) అనుసంధానించబడింది.\nచేరుకోవడానికి అంచనా సమయం: 8 నిమిషాలు.",
            "prio": "CRITICAL",
            "team": "Rescue Team Ravi",
            "eta": "8 mins"
          });
        } else {
          _messages.add({
            "sender": "ai",
            "text": "Your request has been logged as **CRITICAL** priority.\n\nLooking for nearest rescue team...\n\nRescue Team **Ravi** (2.4 km away) is assigned and on the way.\nEstimated arrival: **8 minutes**.",
            "prio": "CRITICAL",
            "team": "Rescue Team Ravi",
            "eta": "8 mins"
          });
        }
      });
    });
  }

  void _toggleLanguage() {
    setState(() {
      _selectedLanguage = _selectedLanguage == "en" ? "te" : "en";
      if (_selectedLanguage == "te") {
        _messages.add({
          "sender": "ai",
          "text": "భాష తెలుగుకి మార్చబడింది. మీ అత్యవసర పరిస్థితిని తెలపండి.",
          "lang": "te"
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: AppTheme.criticalRed.withOpacity(0.2),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.shield_outlined, color: AppTheme.criticalRed, size: 20),
            ),
            const SizedBox(width: 10),
            const Text(
              "Disaster AI",
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
          ],
        ),
        actions: [
          TextButton.icon(
            onPressed: _toggleLanguage,
            icon: const Icon(Icons.language, size: 16, color: Colors.amber),
            label: Text(
              _selectedLanguage == "en" ? "తెలుగు" : "English",
              style: const TextStyle(color: Colors.amber, fontWeight: FontWeight.bold, fontSize: 12),
            ),
          ),
          IconButton(
            icon: const Icon(Icons.swap_horiz, color: Colors.blueAccent),
            tooltip: "Switch to Volunteer Role",
            onPressed: widget.onSwitchToVolunteer,
          ),
        ],
      ),
      body: Column(
        children: [
          // Active Request Status Card
          if (_hasActiveRequest)
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppTheme.criticalRed.withOpacity(0.5)),
              ),
              child: Row(
                children: [
                  const CircleAvatar(
                    backgroundColor: AppTheme.criticalRed,
                    radius: 16,
                    child: Icon(Icons.warning_amber_rounded, color: Colors.white, size: 18),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Text(
                          "Active Request: CRITICAL Flood Rescue",
                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.white),
                        ),
                        Text(
                          "Rescue Team Ravi • ETA 8 mins",
                          style: TextStyle(fontSize: 11, color: Colors.amber),
                        ),
                      ],
                    ),
                  ),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.volunteerBlue,
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    ),
                    onPressed: () {},
                    child: const Text("Track", style: TextStyle(fontSize: 11, color: Colors.white)),
                  )
                ],
              ),
            ),

          // Suggestion Prompts Carousel
          SizedBox(
            height: 44,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 12),
              itemCount: _suggestedPrompts.length,
              itemBuilder: (context, index) {
                final prompt = _suggestedPrompts[index];
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: ActionChip(
                    backgroundColor: const Color(0xFF1F2937),
                    label: Text(
                      prompt["label"]!,
                      style: const TextStyle(fontSize: 12, color: Colors.white70),
                    ),
                    onPressed: () => _sendMessage(prompt["prompt"]!),
                  ),
                );
              },
            ),
          ),

          // Chat Messages Feed
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(12),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final msg = _messages[index];
                final isUser = msg["sender"] == "user";
                return Align(
                  alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(14),
                    constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.82),
                    decoration: BoxDecoration(
                      color: isUser ? AppTheme.volunteerBlue.withOpacity(0.9) : const Color(0xFF1F2937),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: isUser ? Colors.transparent : Colors.white.withOpacity(0.08),
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          msg["text"]!,
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.white,
                            height: 1.4,
                            fontFamily: msg["lang"] == "te" ? "Roboto" : null,
                          ),
                        ),
                        if (msg.containsKey("prio"))
                          Padding(
                            padding: const EdgeInsets.only(top: 8),
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: AppTheme.criticalRed.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(6),
                                border: Border.all(color: AppTheme.criticalRed.withOpacity(0.4)),
                              ),
                              child: Text(
                                "AI Priority: ${msg['prio']} • ${msg['team']}",
                                style: const TextStyle(fontSize: 11, color: AppTheme.criticalRed, fontWeight: FontWeight.bold),
                              ),
                            ),
                          )
                      ],
                    ),
                  ),
                );
              },
            ),
          ),

          // SOS Floating Trigger
          Container(
            width: double.infinity,
            margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
            child: ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.criticalRed,
                padding: const EdgeInsets.symmetric(vertical: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              icon: const Icon(Icons.sos, color: Colors.white, size: 26),
              label: const Text(
                "INSTANT EMERGENCY SOS",
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.black, letterSpacing: 1.2, color: Colors.white),
              ),
              onPressed: () => _sendMessage("EMERGENCY SOS! I need immediate rescue at my GPS location!"),
            ),
          ),

          // Bottom Input Bar with Voice Button
          Container(
            padding: const EdgeInsets.all(10),
            color: const Color(0xFF111827),
            child: Row(
              children: [
                IconButton(
                  icon: Icon(_isListening ? Icons.mic : Icons.mic_none, color: _isListening ? AppTheme.criticalRed : Colors.amber),
                  onPressed: () {
                    setState(() => _isListening = !_isListening);
                    if (_isListening) {
                      _sendMessage("మా ఇంట్లోకి వరద నీళ్లు వచ్చాయి. మేము ఐదుగురం ఉన్నాం. మా అమ్మకి మెడికల్ హెల్ప్ కావాలి.");
                      setState(() => _isListening = false);
                    }
                  },
                ),
                Expanded(
                  child: TextField(
                    controller: _messageController,
                    decoration: const InputDecoration(
                      hintText: "Type your emergency...",
                      hintStyle: TextStyle(color: Colors.gray, fontSize: 13),
                      border: InputBorder.none,
                    ),
                    style: const TextStyle(color: Colors.white, fontSize: 14),
                    onSubmitted: _sendMessage,
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.send, color: AppTheme.volunteerBlue),
                  onPressed: () => _sendMessage(_messageController.text),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

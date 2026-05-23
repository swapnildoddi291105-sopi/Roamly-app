import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

void main() {
  runApp(const MultiWalletApp());
}

class MultiWalletApp extends StatelessWidget {
  const MultiWalletApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Multi Wallet Telemetry',
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: const Color(0xFF0F172A), // Slate Dark
        primaryColor: const Color(0xFF10B981), // Emerald Green
      ),
      home: const TelemetryDashboard(),
    );
  }
}

class TelemetryDashboard extends StatefulWidget {
  const TelemetryDashboard({super.key});

  @override
  State<TelemetryDashboard> createState() => _TelemetryDashboardState();
}

class _TelemetryDashboardState extends State<TelemetryDashboard> {
  final TextEditingController _messageController = TextEditingController();
  List<dynamic> _transactions = [];
  bool _isLoading = false;

  // STEP A: Fetch data directly from your local Express API
  Future<void> _fetchTransactions() async {
    setState(() => _isLoading = true);
    try {
      final response = await http.get(Uri.parse('http://localhost:3000/messages'));
      if (response.statusCode == 200) {
        setState(() => _transactions = json.decode(response.body));
      }
    } catch (e) {
      debugPrint("API Fetch Error: $e");
    } finally {
      setState(() => _isLoading = false);
    }
  }

  // STEP B: Post a raw transaction string to your API queue
  Future<void> _sendTransaction(String text) async {
    if (text.trim().isEmpty) return;
    try {
      final response = await http.post(
        Uri.parse('http://localhost:3000/messages'),
        headers: {"Content-Type": "application/json"},
        body: json.encode({
          "raw_text": text,
          "source": "web_client",
          "wallet_id": "personal-wallet"
        }),
      );
      if (response.statusCode == 201 || response.statusCode == 200) {
        _messageController.clear();
        
        // Safety guard for asynchronous context usage
        if (!mounted) return;

        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Success! Payload sent to Redis queue.')),
        );
        _fetchTransactions(); // Auto-refresh the telemetry list
      }
    } catch (e) {
      debugPrint("API Post Error: $e");
    }
  }

  @override
  void initState() {
    super.initState();
    _fetchTransactions();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('⚡ Multi-Wallet Telemetry Monitor'),
        backgroundColor: const Color(0xFF1E293B),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _fetchTransactions,
          )
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // Raw Ingestion Input Box Card Scaffold
            Card(
              color: const Color(0xFF1E293B),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    TextField(
                      controller: _messageController,
                      maxLines: 2,
                      decoration: const InputDecoration(
                        hintText: 'Enter text: Paid 499 INR to AMAZON Mktp...',
                        border: OutlineInputBorder(),
                      ),
                    ),
                    const SizedBox(height: 12),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF10B981),
                        foregroundColor: Colors.black,
                      ),
                      onPressed: () => _sendTransaction(_messageController.text),
                      child: const Text('Dispatch To Pipeline Queue'),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),
            
            // Live Database Feed Matrix List Grid
            Expanded(
              child: _isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : _transactions.isEmpty
                      ? const Center(child: Text('No transactions processed yet.'))
                      : ListView.builder(
                          itemCount: _transactions.length,
                          itemBuilder: (context, index) {
                            final tx = _transactions[index];
                            
                            // Map incoming Knex Postgres metadata keys safely
                            final parsed = tx['parsed_metadata'] ?? tx['parsed'] ?? {};
                            
                            // Extract properties cleanly falling back on raw text if parsing is pending
                            final String merchantName = parsed['merchant'] ?? tx['raw_text'] ?? 'Unknown';
                            final String currentStatus = tx['status'] ?? 'queued';
                            final String displayAmount = parsed['amount'] != null 
                                ? parsed['amount'].toString() 
                                : '0';

                            return Card(
                              color: const Color(0xFF1E293B),
                              margin: const EdgeInsets.symmetric(vertical: 6),
                              child: ListTile(
                                leading: const Icon(Icons.receipt_long, color: Color(0xFF10B981)),
                                title: Text(merchantName),
                                subtitle: Text("Status: $currentStatus"),
                                trailing: Text(
                                  "$displayAmount INR",
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold, 
                                    fontSize: 16,
                                    color: Color(0xFF10B981),
                                  ),
                                ),
                              ),
                            );
                          },
                        ),
            ),
          ],
        ),
      ),
    );
  }
}
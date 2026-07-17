# Flutter Web

> **Back to:** [INDEX.md](../../INDEX.md) | **Root doc:** [FRONTEND.md](../../FRONTEND.md)

## Overview

Flutter Web is a secondary frontend option for cross-platform applications (web, mobile, desktop from a single codebase).

## When to Use Flutter Web

| Scenario | React | Flutter Web |
|---|---|---|
| Web-first application | ✅ Preferred | ✅ Optional |
| Mobile + Web from one codebase | ❌ | ✅ Preferred |
| Complex animations | ✅ | ✅ |
| SEO-critical pages | ✅ | ⚠️ Limited |

## Flutter Web + Cloudflare Workers

Flutter Web is hosted on Cloudflare Pages:
```bash
# Build Flutter web app
flutter build web --release

# Deploy to Cloudflare Pages
wrangler pages deploy build/web --project-name my-flutter-app
```

## API Integration

```dart
// lib/services/api_client.dart
import 'package:http/http.dart' as http;

class ApiClient {
  final String baseUrl;
  final String? accessToken;

  Future<Map<String, dynamic>> get(String path) async {
    final response = await http.get(
      Uri.parse('$baseUrl$path'),
      headers: {
        'Content-Type': 'application/json',
        if (accessToken != null) 'Authorization': 'Bearer $accessToken',
      },
    );
    if (response.statusCode >= 400) throw ApiException.fromResponse(response);
    return jsonDecode(response.body);
  }
}
```

## Verified Sources

- Flutter Web Docs — https://docs.flutter.dev/platform-integration/web
- Flutter HTTP Package — https://pub.dev/packages/http


---
*Enterprise AI-First Development Standard - [Return to Index](INDEX.md)*

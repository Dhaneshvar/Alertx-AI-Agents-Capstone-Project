# Alertx AI - A Gen AI-powered visual intelligence and location-based reasoning

## Overview
Alertx AI is an intelligent environmental monitoring and incident reporting platform by Team FDRK, powered Google Gemini. It helps communities track and respond to environmental issues through AI-powered features including smart live maps, eco-routing, trip sequencing, AI chat agents, carbon dashboards, and incident reporting. The platform integrates streaming video analysis for real-time environmental hazard detection and emergency response.

## User Preferences
I prefer detailed explanations.
Ask before making major changes.
I want iterative development.
I prefer simple language.

## System Architecture

### UI/UX Decisions
- Light green scanning animation (#10b981) for map interactions.
- Chat input box fixed at the absolute bottom of the screen.
- Sidebar chat is optimized for scrolling and full height utilization.
- Agent accordions are defaultly open, with enhanced animations including spinning loaders, pulsing indicators, and bouncing dots.
- Gradient backgrounds with a blue-purple theme are used for agent cards.
- Agent 4 confirmation uses orange/red gradient styling with a pulsing phone icon.
- Full-screen chat view with video upload support and video previews in messages.
- Simplified interface with a single unified chat accessible via a sidebar toggle (Filters ↔ Chat).
- **Eco Route Plan Button**: Emerald-to-green gradient with pulsing animation when categories are selected, loading spinner during route calculation.
- **Route Labels**: Animated floating labels showing "🌱 Eco route 1 • 2.5 km • 0.45 kg CO₂" directly on map paths.
- **Location Display**: Human-readable place names via reverse geocoding instead of lat/long coordinates.
- **Current Location Marker**: Distinct blue 📍 icon (40x40px) differentiated from numbered destination markers.

### Technical Implementations
- **Frontend**: React 18, TypeScript, Vite 5, shadcn/ui, Radix UI, Tailwind CSS v4, Leaflet, TanStack Query, Wouter.
- **Backend**: Flask (Python 3.11) for streaming video analysis.
- **Database**: PostgreSQL (Neon) with Drizzle ORM.
- **Gen AI**: Google Gemini 2.5 Flash for video and text analysis.
- **Telephony**: Twilio for voice calls and emergency alerts.
- **File Uploads**: Multer with validation and size limits.
- **Streaming System**: Server-Sent Events (SSE) handled by Flask and proxied via Express, with proper Web ReadableStream handling.
- **Dual Backend Architecture**:
    - **Flask Backend (Port 8000)**: Dedicated to `/analyze_video` endpoint, streams SSE, and orchestrates 4 AI agents for video analysis, location intelligence, emergency recommendations, and Twilio voice call triggers.
    - **Express Backend (Port 5000)**: Main application server, proxies Flask endpoint, handles SSE forwarding, and serves the frontend.

### Feature Specifications
- **Live Map Planner Enhancements**: 
  - Multi-category selection with numbered badges
  - **Eco Route Plan System** (renamed from Auto-Plan):
    - Button requires at least one category to be selected
    - Gradient emerald-green styling with pulse animation
    - Loading state with spinner and "Planning Routes..." text
  - **Sequential routing with labeled route segments**: 
    - START marker at origin (green rounded rectangle)
    - Numbered destination markers (1, 2, 3) for each stop
    - Route labels showing metrics directly: "🌱 Eco route 1 • 2.5 km • 0.45 kg CO₂"
    - Heavy route labels: "🏭 Heavy route 1 • 3.2 km • 1.20 kg CO₂"
    - Floating animation on all route labels
    - Interactive labels: clicking highlights and zooms to specific segment
    - Detailed popups showing distance and CO₂ metrics for each leg
  - Visual differentiation between Eco routes (solid green) and Heavy CO₂ routes (dashed orange)
  - **Place Name Display**: Location input shows "Koramangala, Bengaluru" instead of "12.93574, 77.62408"
- **AI Video Analysis**:
    - **Agent 1**: Gemini 2.0 Flash for environmental hazard detection.
    - **Agent 2**: Location intelligence using Google Gemini with lat/lon context.
    - **Agent 3**: Emergency recommendations and response strategies.
    - **Agent 4**: Twilio voice emergency calls to authorities, with user confirmation.
- **Agent 4 Confirmation System**: Yes/No buttons appear directly in chat after Agent 3 completes. "Yes" triggers a Twilio call, "No" cancels the alert.
- **Map Animations**: Light green scanning animation starts at Agent 2, continues through Agent 3, and stops after 9 seconds or when Agent 3 completes, with proper interval cleanup.
- **Database Schema**: Production-ready schema including `user_profiles`, `places`, `trips`, `trip_routes`, `dashboard_metrics`, `incidents`, and `community_posts` tables, with enforced unique constraints, foreign keys, and indexes.

## External Dependencies
- **Google Gemini 2.5 Flash**: For AI video and text analysis.
- **Twilio**: For emergency voice calls.
- **Neon (PostgreSQL)**: Serverless database.
- **Leaflet**: For interactive mapping.
- **Nominatim (OpenStreetMap)**: For geocoding and reverse geocoding (place name lookups).
- **Vite**: Frontend build tool.
- **Express.js**: Backend framework.
- **Flask**: Python web framework for video streaming.
- **Multer**: For handling file uploads.

## Recent Changes (Nov 9, 2025)
- **Landing Page**: Replaced "Intelligent Trip Sequencer" with "Carbon Saved Optimized Path" feature card
- **Landing Page**: Enhanced feature descriptions highlighting real capabilities (4-agent AI system, Twilio emergency calls)
- **Landing Page**: Added YouTube product demo video embed in hero section (side-by-side layout)
- **Route Planning**: Renamed "Auto-Plan" to "Eco Route Plan" with new branding
- **Route Labels**: Added km and CO₂ metrics directly on map labels (" Eco route 1 • 2.5 km • 0.45 kg CO₂")
- **Animations**: Added floating animation to route labels, pulsing to Eco Route Plan button
- **Location Display**: Implemented reverse geocoding for human-readable place names
- **Current Location**: Distinct 📍 blue marker (40x40px) separate from route numbers
- **Toggle Behavior**: Confirmed data persistence - map routes and categories remain when switching between Filters/Chat views
# MarketMind AI

MarketMind AI is an intelligent marketing analytics and campaign management platform designed to help businesses understand advertising performance, generate high-quality marketing content, detect campaign problems, and make better budget decisions.

The platform combines campaign management, real-time analytics, artificial intelligence, reporting, content generation, data ingestion, platform integrations, billing, and secure account management in one unified workspace.

---

## Table of Contents

- [Overview](#overview)
- [Core Features](#core-features)
  - [Unified Marketing Dashboard](#1-unified-marketing-dashboard)
  - [Campaign Management Hub](#2-campaign-management-hub)
  - [AI Insights and Alerts](#3-ai-insights-and-alerts)
  - [AI Advisor Chat](#4-ai-advisor-chat)
  - [Content Generation Studio](#5-content-generation-studio)
  - [Campaign Simulator](#6-campaign-simulator)
  - [Data Ingestion Engine](#7-data-ingestion-engine)
  - [AI Reports Export](#8-ai-reports-export)
  - [Advertising Platform Integrations](#9-advertising-platform-integrations)
  - [Authentication and Security](#10-authentication-and-security)
  - [Profile and Session Management](#11-profile-and-session-management)
  - [Billing and Payments](#12-billing-and-payments)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Requirements](#requirements)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [API Overview](#api-overview)
- [Typical User Workflow](#typical-user-workflow)
- [Security Considerations](#security-considerations)
- [Background Jobs](#background-jobs)
- [Current Platform Status](#current-platform-status)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Digital advertising data is often distributed across multiple platforms, dashboards, spreadsheets, and reporting tools. This makes it difficult for marketing teams to understand what is working, why performance is changing, and what action should be taken next.

MarketMind AI solves this problem by providing a centralized marketing intelligence workspace where users can:

- Monitor campaign performance across multiple advertising platforms.
- Track spend, revenue, ROAS, CTR, CPA, conversions, and other KPIs.
- Manage campaigns, ad sets, ads, budgets, and statuses.
- Upload historical campaign data through CSV files.
- Ask questions about campaign performance using natural language.
- Receive AI-powered recommendations and anomaly alerts.
- Generate platform-specific marketing content.
- Simulate campaign budget changes before applying them.
- Create downloadable AI-powered PDF reports.
- Manage connected advertising accounts.
- Securely manage authentication, passwords, two-factor authentication, and active sessions.

---

# Core Features

## 1. Unified Marketing Dashboard

The Overview Canvas provides a complete high-level view of marketing performance.

### Key performance indicators

The dashboard displays important marketing KPIs, including:

- Total ad spend.
- Attributed revenue.
- Average ROAS.
- Portfolio CTR.
- Total conversions.
- Average CPA.
- Number of active campaigns.
- Best-performing advertising platform.

Each KPI includes performance comparisons and visual indicators to help users quickly understand whether performance is improving or declining.

### Revenue and spend analysis

The revenue and spend chart allows users to compare:

- Advertising spend.
- Revenue generated.
- ROAS trends.

Users can switch between revenue and ROAS views to analyze campaign efficiency from different perspectives.

### Platform attribution

MarketMind AI breaks down performance by advertising platform, including:

- Google Ads.
- Meta Ads.
- Snapchat Ads.

The platform attribution view helps users understand where their budget is being spent and which channel is responsible for attributed sales.

### Platform efficiency comparison

The dashboard compares advertising spend and revenue across platforms, allowing users to identify:

- The most efficient platform.
- Platforms with high spend but low revenue.
- Platforms with strong revenue contribution.
- Opportunities for budget reallocation.

### CPA trend monitoring

The CPA trend chart displays changes in cost per acquisition over time. This helps marketing teams identify:

- Increasing acquisition costs.
- Improvements in campaign efficiency.
- Sudden performance changes.
- Potential audience saturation or creative fatigue.

---

## 2. Campaign Management Hub

The Campaign Hub is the central area for managing campaigns and their related advertising entities.

### Campaign management

Users can:

- Create campaigns.
- Edit campaign details.
- Delete campaigns.
- Enable or disable campaigns.
- Search campaigns.
- Filter campaigns by advertising platform.
- View campaign status.
- View synchronization status.
- Open detailed campaign views.

Campaign listings include important information such as:

- Campaign name.
- Platform.
- Campaign status.
- Daily spend.
- Revenue.
- ROAS.
- CTR.

### Ad set management

Each campaign can contain multiple ad sets. Users can:

- Create ad sets.
- Edit ad sets.
- Delete ad sets.
- Toggle ad set status.
- Configure targeting settings.
- View related ads.

### Ad management

Users can manage individual advertisements by:

- Creating ads.
- Editing ads.
- Deleting ads.
- Enabling or disabling ads.
- Resubmitting ads.
- Recording ad-level performance metrics.
- Viewing platform-specific creative information.

The system supports platform-specific ad structures for Google, Meta, and Snapchat.

### Daily campaign logs

Campaign managers can record daily performance logs, update existing logs, and remove outdated records. Daily logs provide a historical view of campaign activity and make it easier to track changes over time.

### Campaign search and filtering

The Campaign Hub includes:

- Search by campaign name.
- Filter by platform.
- Status badges.
- Synchronization indicators.
- Detailed campaign navigation.
- Confirmation dialogs for destructive actions.

---

## 3. AI Insights and Alerts

The AI Insights module detects unusual campaign behavior and provides actionable recommendations.

### Automated anomaly detection

The system analyzes campaign data to detect:

- Sudden drops in ROAS.
- Unusual increases in CPA.
- Unexpected changes in spend.
- Declining CTR.
- Performance instability.
- Campaigns operating outside expected ranges.

### Alert severity levels

Alerts are organized into severity levels:

- Critical.
- Warning.
- Informational.

This allows users to prioritize the most important problems first.

### AI recommendations

Where available, each alert includes an AI-generated recommendation describing:

- What happened.
- Which campaign is affected.
- Why the issue may have occurred.
- What action should be considered.
- The category of the recommended action.

### Filtering and refresh

Users can:

- View all alerts.
- Filter alerts by severity.
- Refresh the analysis engine.
- Review the last analysis time.
- Open an alert directly in the AI Advisor for deeper investigation.

---

## 4. AI Advisor Chat

The AI Advisor provides a conversational interface for analyzing marketing performance.

Users can ask natural-language questions such as:

- Why did my ROAS drop last week?
- Which campaign should I pause?
- Which platform is performing best?
- Summarize this month's performance.
- How can I reduce CPA?
- Why are conversions declining?
- Which campaigns deserve more budget?

### Main capabilities

The AI Advisor supports:

- Natural-language campaign questions.
- Campaign performance analysis.
- Cross-channel comparisons.
- Root-cause investigation.
- Recommendation requests.
- Imported campaign analysis.
- Conversation history.
- Restoring previous chat sessions.
- Starting a new conversation.

The advisor is connected to campaign context and is designed to provide answers without requiring users to write SQL queries or manually interpret complex spreadsheets.

### Conversation history

Users can:

- View previous conversations.
- Restore an earlier chat session.
- Start a new chat.
- Continue discussions using existing campaign context.

---

## 5. Content Generation Studio

The Content Generation Studio helps marketers create complete advertising packages from a product image and campaign requirements.

### Five-step generation workflow

The studio uses a guided workflow:

1. Upload a product image.
2. Analyze the image with AI.
3. Select the target advertising platform.
4. Answer campaign-specific questions.
5. Generate the final content package.

### Image analysis

The system analyzes uploaded product images and extracts information such as:

- Product name.
- Product category.
- Image quality.
- Visual style or vibe.
- Dominant colors.
- Potential target audience.

### Platform-specific content

Generated content can be tailored for platforms such as:

- Meta Ads.
- Google Ads.
- Snapchat Ads.
- Email marketing.

### Generated content types

The studio can generate:

- Advertisement copy.
- Campaign hooks.
- Social media captions.
- Video hooks.
- Video scripts.
- Email subject line variations.
- Keywords.
- Platform-specific creative suggestions.
- Image banners and layouts.

### Content library

Users can save generated content to a personal library and:

- Review previous generations.
- Reuse successful content.
- Delete outdated generations.
- Compare generated variations.

### Campaign-aware generation

The Content Studio can be opened in the context of a specific campaign, allowing generated content to be associated with that campaign and platform.

---

## 6. Campaign Simulator

The Campaign Simulator allows users to test marketing decisions before applying them to active campaigns.

### Simulation use cases

Users can evaluate possible changes such as:

- Increasing or decreasing a campaign budget.
- Testing campaign strategy changes.
- Comparing possible campaign scenarios.
- Estimating future revenue.
- Estimating future ROAS.
- Reviewing potential spend changes.

### Projection results

After running a simulation, the system displays:

- Historical performance.
- Projected performance.
- Projected spend.
- Projected ROAS.
- Projected revenue.
- Confidence ranges.
- Comparison statistics.

### AI explanation

The simulator provides an explanation of the expected result in plain English. It can describe:

- Budget saturation.
- Historical campaign behavior.
- Expected changes in efficiency.
- Potential revenue impact.
- Risks associated with the proposed change.
- Whether a smaller test may be preferable.

### Scenario management

Users can:

- Save scenarios.
- Compare one scenario with another.
- Review scenario history.
- Delete saved scenarios.
- Apply a proposed change after confirmation.

The simulator is designed to support safer decision-making by allowing users to evaluate changes before modifying live campaign settings.

---

## 7. Data Ingestion Engine

The Data Ingestion Engine allows users to import historical advertising data from CSV files.

### Supported platforms

CSV files can be uploaded for:

- Google Ads.
- Meta Ads.
- Snapchat Ads.

### Upload methods

Users can:

- Drag and drop a file.
- Browse for a file.
- Select the target advertising platform.
- Upload CSV or TXT data files.
- Review processing results.

### Validation and processing

The ingestion engine validates uploaded files and reports missing required headers when the file format is invalid.

After successful processing, the system displays:

- Number of campaigns imported.
- Number of ad sets imported.
- Number of analytics rows processed.
- Upload status.
- Processing history.

### Imported campaign analytics

Imported campaigns can be reviewed using:

- Total spend.
- Average ROAS.
- Total clicks.
- Total conversions.
- Campaign date range.
- Platform information.

Users can send imported campaign context directly to the AI Advisor for analysis and recommendations.

### Upload history

The upload history table records:

- Original file name.
- Advertising platform.
- Upload status.
- Number of processed rows.
- Upload date and time.

---

## 8. AI Reports Export

The Reports Export module creates professional PDF reports from campaign data.

### Available report types

#### Performance Summary

Designed for executives and clients. Includes:

- KPI scorecard.
- Total spend.
- Conversions.
- CPA.
- ROAS.
- AI-generated executive commentary.

#### AI Insights Report

Designed for CMOs and marketing strategists. Includes:

- Aggregated campaign data.
- Executive narrative.
- Audience behavior insights.
- Creative performance analysis.
- Budget intelligence.
- Consumer behavioral archetypes.

#### Campaign Breakdown

Designed for campaign managers and media buyers. Includes:

- Channel performance tables.
- Audience performance tables.
- Ad set performance tables.
- Ad creative performance tables.
- AI-generated key learnings.
- Action items.

#### Full Analytics Export

A comprehensive report containing:

- Campaign data.
- Performance trends.
- Executive summary.
- Audience behavior insights.
- Creative performance insights.
- Budget intelligence.
- Consumer archetypes.
- Key learnings.
- Strategic recommendations.

### Report generation process

Report generation runs through a background job workflow:

1. Select a report type.
2. Select a campaign.
3. Review the report sections.
4. Start report generation.
5. Monitor progress.
6. Review completed sections.
7. Download the generated PDF.

### Report history

Previously generated reports can be:

- Viewed in report history.
- Downloaded again.
- Reviewed by campaign.
- Identified by report type and creation date.
- Checked for file size and generation status.

---

## 9. Advertising Platform Integrations

MarketMind AI provides a centralized integration area for managing advertising accounts.

### Supported platforms

The application includes integration support for:

- Google Ads.
- Meta Ads.
- Snapchat Ads.

### Account connection

Users can connect advertising accounts by providing platform-specific credentials and configuration information.

Depending on the platform, the integration may require:

- Account name.
- Developer token.
- Application ID.
- Application secret.
- Access token.
- Advertising account ID.
- Client ID.

### Connection management

Users can:

- View connected accounts.
- Add an advertising account.
- Review account identifiers.
- Disconnect an account.
- Manage sandbox or API configuration.

When an account is disconnected, campaign synchronization and publishing capabilities for that account are disabled.

---

## 10. Authentication and Security

MarketMind AI includes a complete authentication system for protecting user accounts.

### Authentication features

The platform supports:

- User registration.
- User login.
- User logout.
- Email verification.
- Password reset.
- Two-factor authentication.
- Two-factor challenge verification.
- Protected API routes.
- Session-based authentication.
- Sanctum authentication.

### Email verification

New accounts can be required to verify their email address before accessing protected functionality.

### Password recovery

Users can request a password reset and complete the reset process using a secure reset flow.

### Two-factor authentication

Users can enable two-factor authentication using an authenticator application such as Google Authenticator.

The system supports:

- Enabling two-factor authentication.
- Generating setup information.
- Verifying authentication codes.
- Completing two-factor login challenges.
- Disabling two-factor authentication.

---

## 11. Profile and Session Management

The profile area provides tools for managing account identity and security settings.

### Profile management

Users can update their profile information and manage account details.

### Password management

Users can:

- Change their password.
- Update password credentials.
- Receive validation feedback.
- Protect sensitive session operations with password confirmation.

### Active sessions

Users can:

- View active sessions.
- Identify connected devices.
- Log out a specific device.
- Log out other devices.
- Review account activity.

This helps users maintain control over their account across multiple browsers and devices.

---

## 12. Billing and Payments

MarketMind AI includes subscription and payment functionality powered by Stripe.

### Billing features

Users can:

- View available plans.
- Select a paid plan.
- Start a secure checkout flow.
- Enter payment details using Stripe Elements.
- Receive payment status feedback.
- View successful payment confirmation.

### Payment workflow

The billing process works as follows:

1. User selects a plan.
2. The backend creates a Stripe PaymentIntent.
3. The frontend receives the client secret.
4. Stripe Elements renders the secure checkout form.
5. Stripe processes the payment.
6. The application displays the payment result.

Payment details are handled through Stripe rather than stored directly by the application.

---

# Technology Stack

## Frontend

- React 19.
- Vite.
- React Router.
- Axios.
- Tailwind CSS.
- Framer Motion.
- Recharts.
- Heroicons.
- Stripe React SDK.
- jsPDF.
- jsPDF AutoTable.
- React Datepicker.
- Inter font.

## Backend

- PHP 8.3.
- Laravel 13.
- Laravel Sanctum.
- Laravel Fortify.
- Laravel Socialite.
- Laravel Horizon.
- Laravel Queue.
- Laravel Tinker.
- Stripe PHP SDK.
- DomPDF.
- PHPUnit.

## Data and infrastructure

- SQLite for local development by default.
- MySQL-compatible database support.
- Database-backed queues.
- Database-backed sessions.
- Database-backed cache.
- Laravel Horizon for queue monitoring.
- Pinecone integration for campaign context and semantic search.
- Google, Meta, and Snapchat advertising platform adapters.

---

# System Architecture

MarketMind AI is organized into a modern frontend and backend architecture.

```text
Frontend
  React + Vite
      |
      | Axios API requests
      v
Backend
  Laravel API
      |
      +-- Authentication and user management
      +-- Campaign management
      +-- Data ingestion
      +-- AI insights
      +-- AI advisor
      +-- Content generation
      +-- Reports and PDF generation
      +-- Platform integrations
      +-- Billing and Stripe
      +-- Queue jobs
      |
      +-- Database
      +-- Pinecone context storage
      +-- Advertising platform APIs
      +-- Stripe

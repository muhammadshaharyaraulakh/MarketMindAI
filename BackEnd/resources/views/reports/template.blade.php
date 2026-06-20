<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Report - {{ $reportType }}</title>
    <style>
        @page { margin: 40px 40px; }
        body { 
            font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif; 
            color: #1E293B; 
            margin: 0; 
            padding: 0; 
            font-size: 14px;
        }
        .header { 
            text-align: center; 
            margin-bottom: 40px; 
            padding-bottom: 20px;
            border-bottom: 2px solid #E2E8F0;
        }
        .header h1 { 
            color: #FF2D20; 
            margin: 0 0 10px 0; 
            font-size: 28px; 
            font-weight: 800;
            letter-spacing: -0.5px;
        }
        .header h3 { 
            color: #64748B; 
            margin: 0 0 5px 0; 
            font-size: 18px; 
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .header .meta {
            color: #94A3B8;
            font-size: 12px;
            margin-top: 10px;
        }
        .section { 
            margin-bottom: 40px; 
            page-break-inside: avoid; 
        }
        .section h2 { 
            color: #0F172A; 
            border-left: 4px solid #FF2D20; 
            padding-left: 12px; 
            margin-bottom: 20px; 
            font-size: 20px;
            font-weight: 700;
        }
        
        /* Modern KPI Cards */
        .kpi-wrapper {
            width: 100%;
            margin-bottom: 20px;
        }
        .kpi-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 10px 10px;
            margin-left: -10px;
            margin-right: -10px;
        }
        .kpi-card { 
            background: #F8FAFC; 
            border: 1px solid #E2E8F0; 
            border-radius: 8px;
            padding: 20px; 
            text-align: left;
            width: 25%;
        }
        .kpi-value { 
            font-size: 24px; 
            font-weight: 800; 
            color: #FF2D20; 
            margin-bottom: 5px;
        }
        .kpi-label { 
            font-size: 11px; 
            color: #64748B; 
            text-transform: uppercase; 
            font-weight: 700;
            letter-spacing: 0.5px;
        }

        /* Prose Content */
        p { 
            line-height: 1.7; 
            margin-bottom: 16px; 
            color: #334155;
            text-align: justify;
        }

        /* Modern Tables */
        .data-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 20px; 
            font-size: 13px;
        }
        .data-table th, .data-table td { 
            padding: 12px 15px; 
            text-align: left; 
            border-bottom: 1px solid #E2E8F0;
        }
        .data-table th { 
            background-color: #F1F5F9; 
            color: #475569; 
            font-weight: 700; 
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 0.5px;
        }
        .data-table tr:nth-child(even) {
            background-color: #F8FAFC;
        }
        .data-table tr:last-child td {
            border-bottom: 2px solid #CBD5E1;
        }

        /* Helpers */
        .page-break { page-break-after: always; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        
        .footer {
            position: fixed;
            bottom: -20px;
            left: 0;
            right: 0;
            height: 30px;
            text-align: center;
            font-size: 10px;
            color: #94A3B8;
            border-top: 1px solid #E2E8F0;
            padding-top: 10px;
        }
    </style>
</head>
<body>

    <div class="header">
        <h1>MarketMind AI</h1>
        <h3>{{ ucwords(str_replace('_', ' ', $reportType)) }}</h3>
        <div class="meta">
            Campaign: <strong>{{ $reportData['data']['overview']['name'] ?? 'N/A' }}</strong> &nbsp;|&nbsp; 
            Platform: <strong>{{ ucfirst($reportData['data']['overview']['platform'] ?? 'N/A') }}</strong> &nbsp;|&nbsp; 
            Date: <strong>{{ date('M j, Y') }}</strong>
        </div>
    </div>

    @if(isset($reportData['data']['kpi_scorecard']))
    <div class="section">
        <h2>Headline KPIs</h2>
        <div class="kpi-wrapper">
            <table class="kpi-table">
                <tr>
                    <td class="kpi-card">
                        <div class="kpi-value">${{ number_format($reportData['data']['kpi_scorecard']['total_spend'] ?? 0, 2) }}</div>
                        <div class="kpi-label">Total Spend</div>
                    </td>
                    <td class="kpi-card">
                        <div class="kpi-value">${{ number_format($reportData['data']['kpi_scorecard']['total_revenue'] ?? 0, 2) }}</div>
                        <div class="kpi-label">Total Revenue</div>
                    </td>
                    <td class="kpi-card">
                        <div class="kpi-value">{{ number_format($reportData['data']['kpi_scorecard']['total_conversions'] ?? 0) }}</div>
                        <div class="kpi-label">Conversions</div>
                    </td>
                    <td class="kpi-card">
                        <div class="kpi-value">${{ number_format($reportData['data']['kpi_scorecard']['average_cpa'] ?? 0, 2) }}</div>
                        <div class="kpi-label">Avg CPA</div>
                    </td>
                </tr>
                <tr>
                    <td class="kpi-card">
                        <div class="kpi-value">{{ $reportData['data']['kpi_scorecard']['average_roas'] ?? 0 }}x</div>
                        <div class="kpi-label">ROAS</div>
                    </td>
                    <td class="kpi-card">
                        <div class="kpi-value">{{ number_format($reportData['data']['kpi_scorecard']['total_clicks'] ?? 0) }}</div>
                        <div class="kpi-label">Total Clicks</div>
                    </td>
                    <td class="kpi-card">
                        <div class="kpi-value">{{ number_format($reportData['data']['kpi_scorecard']['total_impressions'] ?? 0) }}</div>
                        <div class="kpi-label">Impressions</div>
                    </td>
                    <td class="kpi-card">
                        <div class="kpi-value">{{ $reportData['data']['kpi_scorecard']['average_ctr'] ?? 0 }}%</div>
                        <div class="kpi-label">Avg CTR</div>
                    </td>
                </tr>
            </table>
        </div>
    </div>
    @endif

    @if(isset($reportData['ai']['executive_summary']))
    <div class="page-break"></div>
    <div class="section">
        <h2>Executive Summary</h2>
        {!! nl2br(e($reportData['ai']['executive_summary'])) !!}
    </div>
    @endif

    @if(isset($reportData['ai']['insight_narrative']))
    <div class="page-break"></div>
    <div class="section">
        <h2>Executive Narrative</h2>
        {!! nl2br(e($reportData['ai']['insight_narrative'])) !!}
    </div>
    @endif

    @if(isset($reportData['ai']['insight_audience']))
    <div class="page-break"></div>
    <div class="section">
        <h2>Audience Intelligence</h2>
        {!! nl2br(e($reportData['ai']['insight_audience'])) !!}
    </div>
    @endif

    @if(isset($reportData['ai']['insight_creative']))
    <div class="page-break"></div>
    <div class="section">
        <h2>Creative Performance Analysis</h2>
        {!! nl2br(e($reportData['ai']['insight_creative'])) !!}
    </div>
    @endif

    @if(isset($reportData['ai']['insight_budget']))
    <div class="page-break"></div>
    <div class="section">
        <h2>Budget Allocation Insights</h2>
        {!! nl2br(e($reportData['ai']['insight_budget'])) !!}
    </div>
    @endif

    @if(isset($reportData['ai']['personas']))
    <div class="page-break"></div>
    <div class="section">
        <h2>Consumer Personas</h2>
        {!! nl2br(e($reportData['ai']['personas'])) !!}
    </div>
    @endif

    @if(isset($reportData['data']['ad_set_breakdown']) && !empty($reportData['data']['ad_set_breakdown']))
    <div class="page-break"></div>
    <div class="section">
        <h2>Ad Set Performance Breakdown</h2>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Ad Set Name</th>
                    <th class="text-right">Spend</th>
                    <th class="text-right">Conversions</th>
                    <th class="text-right">ROAS</th>
                    <th class="text-right">CPA</th>
                </tr>
            </thead>
            <tbody>
                @foreach($reportData['data']['ad_set_breakdown'] as $adSet)
                <tr>
                    <td><strong>{{ $adSet['name'] }}</strong></td>
                    <td class="text-right">${{ number_format($adSet['spend'], 2) }}</td>
                    <td class="text-right">{{ number_format($adSet['conversions']) }}</td>
                    <td class="text-right">{{ number_format($adSet['roas'], 2) }}x</td>
                    <td class="text-right">${{ number_format($adSet['cpa'], 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @endif

    @if(isset($reportData['data']['ad_creative_breakdown']) && !empty($reportData['data']['ad_creative_breakdown']))
    <div class="section">
        <h2>Top Creative Performance</h2>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Creative Variant</th>
                    <th>Format</th>
                    <th class="text-right">CTR</th>
                    <th class="text-right">CPA</th>
                    <th class="text-right">Conversions</th>
                </tr>
            </thead>
            <tbody>
                @foreach($reportData['data']['ad_creative_breakdown'] as $ad)
                <tr>
                    <td>
                        <strong>{{ $ad['name'] }}</strong><br>
                        <span style="color: #64748B; font-size: 11px;">{{ $ad['headline'] }}</span>
                    </td>
                    <td>{{ ucfirst($ad['format']) }}</td>
                    <td class="text-right">{{ number_format($ad['ctr'], 2) }}%</td>
                    <td class="text-right">${{ number_format($ad['cpa'], 2) }}</td>
                    <td class="text-right">{{ number_format($ad['conversions']) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @endif

    @if(isset($reportData['ai']['key_learnings']))
    <div class="page-break"></div>
    <div class="section">
        <h2>Key Learnings</h2>
        {!! nl2br(e($reportData['ai']['key_learnings'])) !!}
    </div>
    @endif

    @if(isset($reportData['ai']['final_recommendations']))
    <div class="page-break"></div>
    <div class="section">
        <h2>Strategic Recommendations</h2>
        {!! nl2br(e($reportData['ai']['final_recommendations'])) !!}
    </div>
    @endif

    <div class="footer">
        Generated securely by MarketMind AI &bull; Proprietary & Confidential
    </div>

</body>
</html>

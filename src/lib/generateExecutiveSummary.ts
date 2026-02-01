import mockData from '@/data/mock_dashboard.json';

interface ExecutiveSummaryOptions {
    appName?: string;
    includeRisks?: boolean;
    includeRecommendations?: boolean;
}

export function generateExecutiveSummary(options: ExecutiveSummaryOptions = {}) {
    const { includeRisks = true, includeRecommendations = true } = options;

    // Get data
    const { stats, applications } = mockData;
    const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    // Calculate overview stats
    const totalThreats = applications.reduce((sum, app) => sum + app.totalThreats, 0);
    const criticalCount = applications.reduce((sum, app) => {
        const latestAssessment = app.assessments[0];
        return sum + (latestAssessment?.threats?.critical || 0);
    }, 0);
    const highCount = applications.reduce((sum, app) => {
        const latestAssessment = app.assessments[0];
        return sum + (latestAssessment?.threats?.high || 0);
    }, 0);

    // Determine overall posture
    const getPosture = () => {
        if (criticalCount > 2) return { level: 'Critical', color: '#ef4444' };
        if (criticalCount > 0 || highCount > 5) return { level: 'High Risk', color: '#f97316' };
        if (highCount > 0) return { level: 'Moderate', color: '#f59e0b' };
        return { level: 'Good', color: '#10b981' };
    };
    const posture = getPosture();

    // Build HTML content
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Virantis Executive Security Summary - ${date}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #fff;
      color: #1a1a2e;
      line-height: 1.6;
    }
    .container { max-width: 800px; margin: 0 auto; padding: 40px; }
    
    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #0a0a14;
      padding-bottom: 24px;
      margin-bottom: 40px;
    }
    .logo { display: flex; align-items: center; gap: 12px; }
    .logo-icon { width: 40px; height: 40px; background: linear-gradient(135deg, #00d4ff, #8b5cf6); border-radius: 8px; }
    .logo-text { font-size: 24px; font-weight: 700; color: #0a0a14; }
    .date { color: #71717a; font-size: 14px; }
    
    /* Title Section */
    .title-section { text-align: center; margin-bottom: 48px; }
    .title { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
    .subtitle { color: #71717a; font-size: 16px; }
    
    /* Posture Card */
    .posture-card {
      background: linear-gradient(135deg, #f8fafc, #f1f5f9);
      border-radius: 16px;
      padding: 32px;
      text-align: center;
      margin-bottom: 40px;
      border: 1px solid #e2e8f0;
    }
    .posture-label { font-size: 14px; color: #71717a; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
    .posture-value { font-size: 36px; font-weight: 700; }
    
    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 40px;
    }
    .stat-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 20px;
      text-align: center;
    }
    .stat-value { font-size: 28px; font-weight: 700; margin-bottom: 4px; }
    .stat-label { font-size: 12px; color: #71717a; text-transform: uppercase; }
    
    /* Section */
    .section { margin-bottom: 40px; }
    .section-title { font-size: 18px; font-weight: 600; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid #e2e8f0; }
    
    /* Risk Table */
    .risk-table { width: 100%; border-collapse: collapse; }
    .risk-table th, .risk-table td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
    .risk-table th { font-size: 12px; color: #71717a; text-transform: uppercase; font-weight: 600; }
    .risk-table td { font-size: 14px; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
    .badge-critical { background: #fef2f2; color: #dc2626; }
    .badge-high { background: #fff7ed; color: #ea580c; }
    .badge-medium { background: #fefce8; color: #ca8a04; }
    
    /* Recommendations */
    .rec-list { list-style: none; }
    .rec-item { padding: 16px; background: #f8fafc; border-radius: 8px; margin-bottom: 12px; border-left: 4px solid #00d4ff; }
    .rec-priority { font-size: 11px; font-weight: 600; color: #71717a; text-transform: uppercase; margin-bottom: 4px; }
    .rec-text { font-size: 14px; color: #1a1a2e; }
    
    /* Footer */
    .footer { margin-top: 60px; padding-top: 24px; border-top: 1px solid #e2e8f0; text-align: center; color: #a1a1aa; font-size: 12px; }
    
    @media print {
      body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
      .container { padding: 20px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <header class="header">
      <div class="logo">
        <div class="logo-icon"></div>
        <span class="logo-text">Virantis</span>
      </div>
      <div class="date">${date}</div>
    </header>
    
    <!-- Title -->
    <div class="title-section">
      <h1 class="title">Executive Security Summary</h1>
      <p class="subtitle">Threat Modeling & Risk Assessment Overview</p>
    </div>
    
    <!-- Overall Posture -->
    <div class="posture-card">
      <div class="posture-label">Overall Security Posture</div>
      <div class="posture-value" style="color: ${posture.color}">${posture.level}</div>
    </div>
    
    <!-- Stats Grid -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">${stats.totalApps}</div>
        <div class="stat-label">Applications</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${totalThreats}</div>
        <div class="stat-label">Total Threats</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color: #ef4444">${criticalCount}</div>
        <div class="stat-label">Critical</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color: #f97316">${highCount}</div>
        <div class="stat-label">High</div>
      </div>
    </div>
    
    ${includeRisks ? `
    <!-- Top Risks -->
    <div class="section">
      <h2 class="section-title">Top Priority Risks</h2>
      <table class="risk-table">
        <thead>
          <tr>
            <th>Application</th>
            <th>Risk</th>
            <th>Severity</th>
            <th>Business Impact</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>FinTravel AI Agent</td>
            <td>Memory Poisoning Attack</td>
            <td><span class="badge badge-critical">Critical</span></td>
            <td>Data manipulation, unauthorized transactions</td>
          </tr>
          <tr>
            <td>FinTravel AI Agent</td>
            <td>Indirect Prompt Injection</td>
            <td><span class="badge badge-critical">Critical</span></td>
            <td>Complete agent compromise via email content</td>
          </tr>
          <tr>
            <td>PaymentGateway API</td>
            <td>SQL Injection</td>
            <td><span class="badge badge-high">High</span></td>
            <td>Database breach, financial data exposure</td>
          </tr>
        </tbody>
      </table>
    </div>
    ` : ''}
    
    ${includeRecommendations ? `
    <!-- Recommendations -->
    <div class="section">
      <h2 class="section-title">Key Recommendations</h2>
      <ul class="rec-list">
        <li class="rec-item">
          <div class="rec-priority">Immediate Action Required</div>
          <div class="rec-text">Implement memory validation and sanitization for the AI agent context store. Use cryptographic signatures for stored context to prevent poisoning attacks.</div>
        </li>
        <li class="rec-item">
          <div class="rec-priority">High Priority</div>
          <div class="rec-text">Deploy input sanitization layer for all external content ingested by the AI agent, including email bodies and attachments.</div>
        </li>
        <li class="rec-item">
          <div class="rec-priority">Medium Priority</div>
          <div class="rec-text">Migrate all database queries to parameterized prepared statements. Implement a Web Application Firewall (WAF) with SQL injection rules.</div>
        </li>
      </ul>
    </div>
    ` : ''}
    
    <!-- Footer -->
    <footer class="footer">
      <p>Generated by Virantis Threat Modeling Platform</p>
      <p>Confidential - For internal use only</p>
    </footer>
  </div>
</body>
</html>
  `;

    // Create and open print window
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        setTimeout(() => {
            printWindow.print();
        }, 250);
    }
}

import threatModelData from '@/data/dummy_threat_model.json';

export function generateReport() {
    const { application, threats, summary, components, attackPath } = threatModelData;
    const now = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const getComponentName = (componentId: string) => {
        const component = components.find((c) => c.id === componentId);
        return component?.name || componentId;
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return '#ef4444';
            case 'high': return '#f97316';
            case 'medium': return '#f59e0b';
            case 'low': return '#22c55e';
            default: return '#71717a';
        }
    };

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Virantis Threat Model Report - ${application.name}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #1a1a2e;
      background: #ffffff;
      padding: 40px;
    }
    
    .container {
      max-width: 800px;
      margin: 0 auto;
    }
    
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 30px;
      border-bottom: 2px solid #e5e5e5;
    }
    
    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin-bottom: 20px;
    }
    
    .logo-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #00d4ff 0%, #8b5cf6 100%);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 18px;
    }
    
    .logo-text {
      font-size: 24px;
      font-weight: 600;
      color: #1a1a2e;
    }
    
    h1 {
      font-size: 28px;
      margin-bottom: 10px;
      color: #0a0a14;
    }
    
    h2 {
      font-size: 20px;
      margin-top: 30px;
      margin-bottom: 15px;
      color: #0a0a14;
      border-bottom: 1px solid #e5e5e5;
      padding-bottom: 8px;
    }
    
    h3 {
      font-size: 16px;
      margin-top: 20px;
      margin-bottom: 10px;
      color: #1a1a2e;
    }
    
    .meta {
      color: #71717a;
      font-size: 14px;
    }
    
    .executive-summary {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
      margin-bottom: 30px;
    }
    
    .stat-card {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }
    
    .stat-value {
      font-size: 32px;
      font-weight: 600;
    }
    
    .stat-label {
      font-size: 12px;
      color: #71717a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .threat-card {
      border: 1px solid #e5e5e5;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
    }
    
    .threat-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 15px;
    }
    
    .severity-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      color: white;
    }
    
    .threat-title {
      font-size: 16px;
      font-weight: 600;
    }
    
    .threat-meta {
      font-size: 13px;
      color: #71717a;
      margin-bottom: 10px;
    }
    
    .threat-description {
      color: #4a4a4a;
      font-size: 14px;
      margin-bottom: 15px;
    }
    
    .mitigation {
      background: #f0fdf4;
      border-left: 3px solid #22c55e;
      padding: 12px 15px;
      font-size: 14px;
      color: #166534;
    }
    
    .dread-table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
      font-size: 14px;
    }
    
    .dread-table th,
    .dread-table td {
      padding: 8px 12px;
      text-align: left;
      border-bottom: 1px solid #e5e5e5;
    }
    
    .dread-table th {
      background: #f8f9fa;
      font-weight: 500;
    }
    
    .attack-path {
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 30px;
    }
    
    .attack-path h3 {
      color: #dc2626;
      margin-top: 0;
    }
    
    .attack-stages {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 15px;
      flex-wrap: wrap;
    }
    
    .attack-stage {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .stage-node {
      background: #dc2626;
      color: white;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
    }
    
    .stage-arrow {
      color: #dc2626;
      font-size: 20px;
    }
    
    .recommendations {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 8px;
      padding: 20px;
    }
    
    .recommendations h3 {
      color: #1e40af;
      margin-top: 0;
    }
    
    .recommendations ul {
      margin-left: 20px;
      color: #1e40af;
    }
    
    .recommendations li {
      margin-bottom: 8px;
    }
    
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e5e5;
      text-align: center;
      color: #71717a;
      font-size: 12px;
    }
    
    @media print {
      body {
        padding: 20px;
      }
      
      .threat-card {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">
        <div class="logo-icon">V</div>
        <span class="logo-text">Virantis</span>
      </div>
      <h1>Threat Model Report</h1>
      <p class="meta">${application.name} | Generated ${now}</p>
    </div>
    
    <div class="executive-summary">
      <h2 style="margin-top: 0; border: none;">Executive Summary</h2>
      <p>${application.description}</p>
      <p style="margin-top: 10px;">
        This automated threat analysis identified <strong>${summary.totalThreats} security threats</strong>, 
        including <strong style="color: #ef4444">${summary.critical} critical</strong> and 
        <strong style="color: #f97316">${summary.high} high</strong> severity issues requiring immediate attention.
      </p>
    </div>
    
    <h2>Threat Statistics</h2>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value" style="color: #1a1a2e">${summary.totalThreats}</div>
        <div class="stat-label">Total Threats</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color: #ef4444">${summary.critical}</div>
        <div class="stat-label">Critical</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color: #f97316">${summary.high}</div>
        <div class="stat-label">High</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color: #f59e0b">${summary.medium}</div>
        <div class="stat-label">Medium</div>
      </div>
    </div>
    
    <h2>Attack Path Analysis</h2>
    <div class="attack-path">
      <h3>⚠️ ${attackPath.name}</h3>
      <p style="color: #7f1d1d; font-size: 14px;">${attackPath.description}</p>
      <div class="attack-stages">
        ${attackPath.stages.map((stage, i) => `
          <div class="attack-stage">
            <div class="stage-node">${stage.source === 'Internet' ? 'Internet' : getComponentName(stage.source)}</div>
            ${i < attackPath.stages.length - 1 ? '<span class="stage-arrow">→</span>' : ''}
          </div>
        `).join('')}
        <div class="attack-stage">
          <span class="stage-arrow">→</span>
          <div class="stage-node">${getComponentName(attackPath.stages[attackPath.stages.length - 1].target)}</div>
        </div>
      </div>
    </div>
    
    <h2>Detailed Threat Analysis</h2>
    ${threats.map(threat => `
      <div class="threat-card">
        <div class="threat-header">
          <span class="severity-badge" style="background-color: ${getSeverityColor(threat.severity)}">
            ${threat.severity}
          </span>
          <span class="threat-title">${threat.name}</span>
        </div>
        <div class="threat-meta">
          ${threat.category} | ${threat.source} | Affects: ${getComponentName(threat.affectedComponent)}
        </div>
        <p class="threat-description">${threat.description}</p>
        
        <table class="dread-table">
          <tr>
            <th>DREAD Metric</th>
            <th>Score</th>
          </tr>
          <tr><td>Damage</td><td>${threat.dread.damage}/10</td></tr>
          <tr><td>Reproducibility</td><td>${threat.dread.reproducibility}/10</td></tr>
          <tr><td>Exploitability</td><td>${threat.dread.exploitability}/10</td></tr>
          <tr><td>Affected Users</td><td>${threat.dread.affectedUsers}/10</td></tr>
          <tr><td>Discoverability</td><td>${threat.dread.discoverability}/10</td></tr>
          <tr style="font-weight: 600"><td>Total Score</td><td>${threat.dread.total}/50</td></tr>
        </table>
        
        <div class="mitigation">
          <strong>Recommended Mitigation:</strong> ${threat.mitigation}
        </div>
      </div>
    `).join('')}
    
    <h2>Recommendations</h2>
    <div class="recommendations">
      <h3>🔒 Key Security Recommendations</h3>
      <ul>
        ${summary.recommendations.map(rec => `<li>${rec}</li>`).join('')}
      </ul>
    </div>
    
    <div class="footer">
      <p>Generated by Virantis Threat Modeling Platform</p>
      <p>Report Date: ${now}</p>
    </div>
  </div>
  
  <script>
    // Auto-trigger print dialog when opened
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>
  `.trim();

    // Open in new window and trigger print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
    }
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Table, Calendar, Filter, CheckCircle2 } from 'lucide-react';
import { routingDecisions, teamBudgets, costHistory } from '../data/mockData';

type ExportType = 'routing' | 'teams' | 'costs';
type ExportFormat = 'csv' | 'json';

export default function ExportPanel() {
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState<ExportType | null>(null);

  const handleExport = async (type: ExportType, format: ExportFormat) => {
    setExporting(true);
    
    // Simulate export processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let data: any[] = [];
    let filename = '';

    switch (type) {
      case 'routing':
        data = routingDecisions.map(r => ({
          id: r.id,
          timestamp: r.timestamp.toISOString(),
          request_preview: r.requestPreview,
          complexity: r.complexity,
          routed_to: r.routedTo,
          tokens: r.tokens,
          cost: r.cost,
          latency: r.latency,
          quality_score: r.qualityScore,
          saved: r.saved,
        }));
        filename = `routing_decisions_${new Date().toISOString().split('T')[0]}`;
        break;

      case 'teams':
        data = teamBudgets.map(t => ({
          id: t.id,
          name: t.name,
          monthly_budget: t.monthlyBudget,
          spent: t.spent,
          requests: t.requests,
          avg_cost_per_request: t.avgCostPerRequest,
          savings: t.savings,
          utilization_pct: ((t.spent / t.monthlyBudget) * 100).toFixed(1),
        }));
        filename = `team_budgets_${new Date().toISOString().split('T')[0]}`;
        break;

      case 'costs':
        data = costHistory.map(c => ({
          date: c.date,
          autopilot_cost: c.autopilot,
          baseline_cost: c.baseline,
          savings: c.savings,
          savings_pct: ((c.savings / c.baseline) * 100).toFixed(1),
        }));
        filename = `cost_analysis_${new Date().toISOString().split('T')[0]}`;
        break;
    }

    // Generate file
    let content = '';
    let mimeType = '';

    if (format === 'csv') {
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(row => Object.values(row).join(','));
      content = [headers, ...rows].join('\n');
      mimeType = 'text/csv';
      filename += '.csv';
    } else {
      content = JSON.stringify(data, null, 2);
      mimeType = 'application/json';
      filename += '.json';
    }

    // Download file
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExporting(false);
    setExported(type);
    setTimeout(() => setExported(null), 2000);
  };

  const exportOptions = [
    {
      type: 'routing' as ExportType,
      title: 'Routing Decisions',
      description: 'Export all routing decisions with costs and quality scores',
      icon: Table,
      count: routingDecisions.length,
    },
    {
      type: 'teams' as ExportType,
      title: 'Team Budgets',
      description: 'Export team budget utilization and spend data',
      icon: FileText,
      count: teamBudgets.length,
    },
    {
      type: 'costs' as ExportType,
      title: 'Cost Analysis',
      description: 'Export historical cost data and savings metrics',
      icon: Calendar,
      count: costHistory.length,
    },
  ];

  return (
    <div className="bg-[#12141c] border border-white/5 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Download className="w-4 h-4 text-violet-400" />
            Export Reports
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">Download data in CSV or JSON format</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {exportOptions.map((option) => (
          <motion.div
            key={option.type}
            whileHover={{ y: -2 }}
            className="bg-white/[0.02] border border-white/5 rounded-xl p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <option.icon className="w-5 h-5 text-violet-400" />
                <div>
                  <p className="text-xs font-medium">{option.title}</p>
                  <p className="text-[10px] text-gray-500">{option.count} records</p>
                </div>
              </div>
              {exported === option.type && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              )}
            </div>

            <p className="text-[10px] text-gray-500 mb-3">{option.description}</p>

            <div className="flex gap-2">
              <button
                onClick={() => handleExport(option.type, 'csv')}
                disabled={exporting}
                className="flex-1 px-3 py-1.5 bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/30 rounded-lg text-[10px] font-medium text-violet-400 transition-all disabled:opacity-50"
              >
                CSV
              </button>
              <button
                onClick={() => handleExport(option.type, 'json')}
                disabled={exporting}
                className="flex-1 px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-lg text-[10px] font-medium text-cyan-400 transition-all disabled:opacity-50"
              >
                JSON
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {exporting && (
        <div className="mt-4 p-3 bg-violet-500/10 border border-violet-500/20 rounded-lg flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-violet-400">Generating export...</span>
        </div>
      )}
    </div>
  );
}

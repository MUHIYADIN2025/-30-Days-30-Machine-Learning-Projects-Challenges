import React from 'react';
import { Activity, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function ConfusionMatrixGrid({ metrics }) {
  if (!metrics) return null;

  const [tn, fp, fn, tp] = metrics.confusion_matrix.flat ? metrics.confusion_matrix.flat() : [0, 0, 0, 0];

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg text-white mb-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Activity className="text-blue-400" /> Model Performance Metrics
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
          <p className="text-sm text-gray-400">Accuracy</p>
          <p className="text-2xl font-bold text-green-400">{(metrics.accuracy * 100).toFixed(2)}%</p>
        </div>
        <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
          <p className="text-sm text-gray-400">Total Transactions</p>
          <p className="text-2xl font-bold text-blue-400">{metrics.total_transactions}</p>
        </div>
        <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
          <p className="text-sm text-gray-400">Detected Frauds</p>
          <p className="text-2xl font-bold text-red-400">{metrics.fraud_count}</p>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-3">Confusion Matrix</h3>
      <div className="grid grid-cols-2 gap-3 max-w-md mx-auto text-center font-mono">
        <div className="bg-emerald-950/60 p-4 rounded border border-emerald-700">
          <span className="block text-xs text-emerald-400">True Normal</span>
          <span className="text-xl font-bold">{tn}</span>
        </div>
        <div className="bg-red-950/60 p-4 rounded border border-red-700">
          <span className="block text-xs text-red-400">False Fraud</span>
          <span className="text-xl font-bold">{fp}</span>
        </div>
        <div className="bg-red-950/60 p-4 rounded border border-red-700">
          <span className="block text-xs text-red-400">False Normal</span>
          <span className="text-xl font-bold">{fn}</span>
        </div>
        <div className="bg-emerald-950/60 p-4 rounded border border-emerald-700">
          <span className="block text-xs text-emerald-400">True Fraud</span>
          <span className="text-xl font-bold">{tp}</span>
        </div>
      </div>
    </div>
  );
}
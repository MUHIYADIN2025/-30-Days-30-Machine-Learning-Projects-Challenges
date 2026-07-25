import React, { useState } from 'react';
import { Search, ShieldAlert, ShieldCheck } from 'lucide-react';
import { predictTransaction } from './api';

export default function TransactionInput({ featureColumns }) {
  const [inputs, setInputs] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: parseFloat(e.target.value) || 0 });
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    // Hubi inay dhammaan features-ku buuxaan
    const fullFeatures = {};
    (featureColumns || ['Time', ...Array.from({ length: 28 }, (_, i) => `V${i + 1}`), 'Amount']).forEach(col => {
      fullFeatures[col] = inputs[col] || 0.0;
    });

    try {
      const res = await predictTransaction(fullFeatures);
      setResult(res);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error connecting to FastAPI backend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg text-white">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Search className="text-indigo-400" /> Predict Transaction Fraud
      </h2>

      <form onSubmit={handlePredict} className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-60 overflow-y-auto p-2 bg-slate-900 rounded border border-slate-700">
          {(featureColumns || ['Time', 'V1', 'V2', 'V3', 'Amount']).map((col) => (
            <div key={col}>
              <label className="block text-xs text-gray-400">{col}</label>
              <input
                type="number"
                step="any"
                name={col}
                onChange={handleChange}
                placeholder="0.0"
                className="w-full bg-slate-800 border border-slate-600 rounded p-1 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 font-semibold py-2 rounded transition"
        >
          {loading ? 'Analyzing...' : 'Check Transaction'}
        </button>
      </form>

      {error && <div className="mt-4 p-3 bg-red-900/50 border border-red-700 text-red-300 rounded text-sm">{error}</div>}

      {result && (
        <div className={`mt-4 p-4 rounded-lg flex items-center gap-3 border ${result.is_fraud ? 'bg-red-950 border-red-700 text-red-200' : 'bg-emerald-950 border-emerald-700 text-emerald-200'}`}>
          {result.is_fraud ? <ShieldAlert className="w-8 h-8 text-red-400" /> : <ShieldCheck className="w-8 h-8 text-emerald-400" />}
          <div>
            <h4 className="font-bold text-lg">{result.label} Detected</h4>
            <p className="text-sm opacity-80">
              {result.is_fraud ? 'Warning: This transaction shows suspicious patterns!' : 'Safe: This transaction appears normal.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
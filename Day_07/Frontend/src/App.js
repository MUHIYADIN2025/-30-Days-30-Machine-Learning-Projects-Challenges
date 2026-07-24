import React, { useState } from 'react';
import axios from 'axios';
import { 
  AlertTriangle, 
  CheckCircle, 
  CreditCard, 
  TrendingUp, 
  User, 
  BarChart2, 
  History 
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export default function App() {
  const [formData, setFormData] = useState({
    LIMIT_BAL: 50000,
    SEX: 2,
    EDUCATION: 2,
    MARRIAGE: 1,
    AGE: 30,
    PAY_0: 0,
    PAY_2: 0,
    PAY_3: 0,
    PAY_4: 0,
    BILL_AMT1: 15000,
    BILL_AMT2: 14000,
    BILL_AMT3: 13000,
    BILL_AMT4: 12000,
    BILL_AMT5: 11000,
    BILL_AMT6: 10000,
    PAY_AMT1: 2000,
    PAY_AMT2: 2000,
    PAY_AMT3: 2000,
    PAY_AMT4: 1500,
    PAY_AMT5: 1500,
    PAY_AMT6: 1500,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handlePredict = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/predict', formData);
      const resData = response.data;
      setResult(resData);

      setHistory((prev) => [
        {
          id: Date.now(),
          age: formData.AGE,
          limit: formData.LIMIT_BAL,
          prob: resData.default_probability,
          status: resData.status,
        },
        ...prev.slice(0, 4),
      ]);
    } catch (error) {
      console.error('Error fetching prediction:', error);
      alert('Could not connect to model API. Make sure FastAPI server is running!');
    } finally {
      setLoading(false);
    }
  };

  const billData = [
    { month: 'M1', Bill: formData.BILL_AMT1, Paid: formData.PAY_AMT1 },
    { month: 'M2', Bill: formData.BILL_AMT2, Paid: formData.PAY_AMT2 },
    { month: 'M3', Bill: formData.BILL_AMT3, Paid: formData.PAY_AMT3 },
    { month: 'M4', Bill: formData.BILL_AMT4, Paid: formData.PAY_AMT4 },
    { month: 'M5', Bill: formData.BILL_AMT5, Paid: formData.PAY_AMT5 },
    { month: 'M6', Bill: formData.BILL_AMT6, Paid: formData.PAY_AMT6 },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 font-sans">
      <header className="max-w-7xl mx-auto flex justify-between items-center pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <CreditCard className="w-8 h-8 text-blue-500" />
          <h1 className="text-2xl font-bold tracking-tight">Credit Card Default Intelligence</h1>
        </div>
        <span className="text-xs bg-slate-800 border border-slate-700 text-slate-400 px-3 py-1 rounded-full">
          Random Forest Model v1.0
        </span>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700/60 rounded-xl p-6 shadow-xl space-y-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-200">
            <User className="w-5 h-5 text-blue-400" /> Client Demographics & Credit Profile
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400">Credit Limit (NT$)</label>
              <input
                type="number"
                name="LIMIT_BAL"
                value={formData.LIMIT_BAL}
                onChange={handleInputChange}
                className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400">Age</label>
              <input
                type="number"
                name="AGE"
                value={formData.AGE}
                onChange={handleInputChange}
                className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400">Education Level</label>
              <select
                name="EDUCATION"
                value={formData.EDUCATION}
                onChange={handleInputChange}
                className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
              >
                <option value={1}>Graduate School</option>
                <option value={2}>University</option>
                <option value={3}>High School</option>
                <option value={4}>Others</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400">Repayment Status (Last Month)</label>
              <select
                name="PAY_0"
                value={formData.PAY_0}
                onChange={handleInputChange}
                className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
              >
                <option value={-1}>Paid Duly (-1)</option>
                <option value={0}>Use Revolving Credit (0)</option>
                <option value={1}>Delay 1 Month (+1)</option>
                <option value={2}>Delay 2 Months (+2)</option>
                <option value={3}>Delay 3+ Months (+3)</option>
              </select>
            </div>
          </div>

          <hr className="border-slate-700/50" />

          <h3 className="text-md font-semibold flex items-center gap-2 text-slate-300">
            <TrendingUp className="w-4 h-4 text-emerald-400" /> Recent Billing & Payment Activity
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-slate-400">Recent Bill (M1)</label>
              <input
                type="number"
                name="BILL_AMT1"
                value={formData.BILL_AMT1}
                onChange={handleInputChange}
                className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-slate-100"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400">Recent Paid (M1)</label>
              <input
                type="number"
                name="PAY_AMT1"
                value={formData.PAY_AMT1}
                onChange={handleInputChange}
                className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-slate-100"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handlePredict}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
              >
                {loading ? 'Evaluating...' : 'Predict Default Risk'}
              </button>
            </div>
          </div>

          <div className="pt-4">
            <span className="text-xs text-slate-400 mb-2 block">Bill vs Payment Trend (Past 6 Months)</span>
            <div className="h-44 w-full bg-slate-900/50 p-2 rounded-lg border border-slate-800">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={billData}>
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                  <Bar dataKey="Bill" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Paid" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-800 border border-slate-700/60 rounded-xl p-6 shadow-xl text-center flex flex-col items-center justify-center min-h-[260px]">
            {result ? (
              <>
                <div className="p-3 rounded-full bg-slate-900/80 mb-3">
                  {result.prediction === 1 ? (
                    <AlertTriangle className="w-12 h-12 text-rose-500 animate-pulse" />
                  ) : (
                    <CheckCircle className="w-12 h-12 text-emerald-500" />
                  )}
                </div>
                <h3 className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Predicted Status</h3>
                <p className={`text-2xl font-extrabold mt-1 ${result.prediction === 1 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {result.status}
                </p>

                <div className="w-full bg-slate-900 rounded-full h-3 mt-6 border border-slate-700 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      result.default_probability > 50 ? 'bg-rose-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${result.default_probability}%` }}
                  ></div>
                </div>
                <span className="text-xs text-slate-400 mt-2">
                  Default Probability: <strong className="text-slate-200">{result.default_probability}%</strong>
                </span>
              </>
            ) : (
              <div className="text-slate-500 text-sm flex flex-col items-center gap-2">
                <BarChart2 className="w-8 h-8 text-slate-600" />
                Run a prediction to view risk assessment.
              </div>
            )}
          </div>

          <div className="bg-slate-800 border border-slate-700/60 rounded-xl p-5 shadow-xl">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-slate-300 mb-3">
              <History className="w-4 h-4 text-blue-400" /> Session History
            </h3>
            {history.length === 0 ? (
              <p className="text-xs text-slate-500">No predictions made in this session.</p>
            ) : (
              <div className="space-y-2">
                {history.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-xs p-2 bg-slate-900/60 rounded border border-slate-700/40">
                    <div>
                      <span className="text-slate-300">Age: {item.age}</span> | <span className="text-slate-400">Limit: ${item.limit.toLocaleString()}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded font-medium ${item.status === 'High Risk' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {item.prob}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
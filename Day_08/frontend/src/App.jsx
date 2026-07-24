import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  ShieldAlert, 
  BarChart2, 
  Database, 
  CheckCircle2, 
  XCircle, 
  RefreshCw,
  Search
} from "lucide-react";

export default function App() {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/metrics")
      .then((res) => res.json())
      .then((data) => setMetrics(data))
      .catch((err) => console.error("Error fetching metrics:", err));
  }, []);

  const handleClassify = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error making prediction:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex justify-between items-center bg-slate-800/80 backdrop-blur border border-slate-700 p-6 rounded-2xl shadow-xl">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="text-blue-400" />
              Fake News Detection Dashboard
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Powered by PassiveAggressive Classifier & TF-IDF Vectorizer
            </p>
          </div>
          {metrics && (
            <div className="flex items-center gap-4 bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-700/50">
              <BarChart2 className="text-green-400 w-5 h-5" />
              <div>
                <p className="text-xs text-slate-400">Model Accuracy</p>
                <p className="text-lg font-bold text-green-400">{metrics.accuracy}%</p>
              </div>
            </div>
          )}
        </header>

        {/* Metric Cards */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Total Articles</p>
                <p className="text-2xl font-semibold text-white">
                  {metrics.dataset_info.total_articles.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Real News Samples</p>
                <p className="text-2xl font-semibold text-white">
                  {metrics.dataset_info.real_articles.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl flex items-center gap-4">
              <div className="p-3 bg-rose-500/10 text-rose-400 rounded-lg">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Fake News Samples</p>
                <p className="text-2xl font-semibold text-white">
                  {metrics.dataset_info.fake_articles.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-800 border border-slate-700 p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-400" />
                Analyze News Content
              </h2>
              <form onSubmit={handleClassify} className="space-y-4">
                <textarea
                  rows="8"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste article text or body here..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500 resize-none"
                />
                <button
                  type="submit"
                  disabled={loading || !inputText.trim()}
                  className="w-full py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed font-medium text-white transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Classify News Article"
                  )}
                </button>
              </form>
            </div>

            {/* Result Display */}
            {result && (
              <div
                className={`mt-6 p-5 rounded-xl border flex items-center justify-between ${
                  result.is_real
                    ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-200"
                    : "bg-rose-950/40 border-rose-500/50 text-rose-200"
                }`}
              >
                <div className="flex items-center gap-4">
                  {result.is_real ? (
                    <ShieldCheck className="w-10 h-10 text-emerald-400" />
                  ) : (
                    <ShieldAlert className="w-10 h-10 text-rose-400" />
                  )}
                  <div>
                    <h3 className="font-bold text-lg">
                      Prediction: {result.prediction} NEWS
                    </h3>
                    <p className="text-sm opacity-80">
                      Classifier Decision Score: {result.score}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Metrics Panel */}
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl space-y-6">
            <h2 className="text-lg font-semibold text-white">Model Metrics</h2>

            {metrics ? (
              <div className="space-y-6 text-sm">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Confusion Matrix
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-center font-mono">
                    <div className="bg-slate-900 border border-slate-700/60 p-3 rounded-lg">
                      <p className="text-xs text-slate-500">True Fake</p>
                      <p className="text-base font-bold text-slate-200">{metrics.confusion_matrix[0][0]}</p>
                    </div>
                    <div className="bg-slate-900 border border-slate-700/60 p-3 rounded-lg">
                      <p className="text-xs text-slate-500">False Real</p>
                      <p className="text-base font-bold text-rose-400">{metrics.confusion_matrix[0][1]}</p>
                    </div>
                    <div className="bg-slate-900 border border-slate-700/60 p-3 rounded-lg">
                      <p className="text-xs text-slate-500">False Fake</p>
                      <p className="text-base font-bold text-rose-400">{metrics.confusion_matrix[1][0]}</p>
                    </div>
                    <div className="bg-slate-900 border border-slate-700/60 p-3 rounded-lg">
                      <p className="text-xs text-slate-500">True Real</p>
                      <p className="text-base font-bold text-slate-200">{metrics.confusion_matrix[1][1]}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    Detailed Metrics
                  </p>
                  <div className="space-y-3">
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-700/50">
                      <p className="font-medium text-slate-300 mb-1">Fake News Class</p>
                      <div className="grid grid-cols-3 gap-1 text-xs text-slate-400">
                        <span>Prec: <strong className="text-slate-200">{metrics.classification_report.fake.precision}</strong></span>
                        <span>Rec: <strong className="text-slate-200">{metrics.classification_report.fake.recall}</strong></span>
                        <span>F1: <strong className="text-slate-200">{metrics.classification_report.fake.f1}</strong></span>
                      </div>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-700/50">
                      <p className="font-medium text-slate-300 mb-1">Real News Class</p>
                      <div className="grid grid-cols-3 gap-1 text-xs text-slate-400">
                        <span>Prec: <strong className="text-slate-200">{metrics.classification_report.real.precision}</strong></span>
                        <span>Rec: <strong className="text-slate-200">{metrics.classification_report.real.recall}</strong></span>
                        <span>F1: <strong className="text-slate-200">{metrics.classification_report.real.f1}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">Loading backend metrics...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
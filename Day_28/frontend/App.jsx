import React, { useState } from 'react';

export default function App() {
  const [text, setText] = useState('');
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to extract entities from backend.');
      }

      const data = await response.json();
      setEntities(data.entities);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>Biomedical NER Extractor</h2>
      
      <textarea
        rows={5}
        style={{ width: '100%', padding: '10px', fontSize: '14px', borderRadius: '6px' }}
        placeholder="Enter medical text (e.g., 'Patient was prescribed Aspirin 100mg for headache.')"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={handleAnalyze}
        disabled={loading}
        style={{
          marginTop: '10px',
          padding: '10px 20px',
          backgroundColor: '#0070f3',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Analyzing...' : 'Extract Entities'}
      </button>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      <div style={{ marginTop: '20px' }}>
        <h3>Extracted Entities</h3>
        {entities.length === 0 ? (
          <p style={{ color: '#666' }}>No entities extracted yet.</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {entities.map((item, index) => (
              <div
                key={index}
                style={{
                  border: '1px solid #ccc',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  backgroundColor: '#f4f4f5'
                }}
              >
                <strong>{item.word}</strong>
                <span
                  style={{
                    marginLeft: '8px',
                    fontSize: '12px',
                    backgroundColor: '#0070f3',
                    color: '#fff',
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}
                >
                  {item.entity}
                </span>
                <div style={{ fontSize: '11px', color: '#777', marginTop: '4px' }}>
                  Score: {(item.score * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
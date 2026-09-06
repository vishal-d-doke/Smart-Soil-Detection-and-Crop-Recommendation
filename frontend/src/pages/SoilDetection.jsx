import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import { analyzeSoil } from '../api';
import './Form.css';

const defaultForm = {
  nitrogen: 120,
  phosphorus: 80,
  potassium: 90,
  ph: 6.7,
  temperature: 28,
  humidity: 58,
  rainfall: 140,
};

export default function SoilDetection() {
  const [form, setForm] = useState(defaultForm);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: Number(value) }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await analyzeSoil(form);
      setResult(response);
    } catch (submitError) {
      setError(submitError.message || 'Soil analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page form-page">
      <section className="page-header">
        <p className="eyebrow">Soil detection</p>
        <h1>Analyze field conditions</h1>
      </section>

      <div className="form-grid">
        <Card title="Field input" eyebrow="Soil diagnostics">
          <form className="stack-form" onSubmit={handleSubmit}>
            <label>
              pH level
              <input type="number" step="0.1" name="ph" value={form.ph} onChange={handleChange} />
            </label>
            <label>
              Moisture (%)
              <input type="number" name="humidity" value={form.humidity} onChange={handleChange} />
            </label>
            <label>
              Nitrogen (kg/ha)
              <input type="number" name="nitrogen" value={form.nitrogen} onChange={handleChange} />
            </label>
            <label>
              Phosphorus (kg/ha)
              <input type="number" name="phosphorus" value={form.phosphorus} onChange={handleChange} />
            </label>
            <label>
              Potassium (kg/ha)
              <input type="number" name="potassium" value={form.potassium} onChange={handleChange} />
            </label>
            <label>
              Temperature (°C)
              <input type="number" name="temperature" value={form.temperature} onChange={handleChange} />
            </label>
            <label>
              Rainfall (mm)
              <input type="number" name="rainfall" value={form.rainfall} onChange={handleChange} />
            </label>
            {error && <p className="form-error">{error}</p>}
            <Button type="submit" disabled={loading}>{loading ? 'Analyzing...' : 'Analyze soil'}</Button>
          </form>
        </Card>

        <Card title="Field status" eyebrow="Latest result">
          <div className="result-panel">
            {result ? (
              <>
                <div>
                  <span className="result-label">Soil type</span>
                  <strong>{result.soil_type}</strong>
                </div>
                <div>
                  <span className="result-label">Health score</span>
                  <strong>{result.health_score}/100</strong>
                </div>
                <div>
                  <span className="result-label">Recommendation</span>
                  <strong>{result.recommendation}</strong>
                </div>
                <div style={{ marginTop: '1.25rem' }}>
                  <Link to="/app/history" className="button button-secondary" style={{ width: '100%', textAlign: 'center', display: 'block' }}>
                    View all past evaluations
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div>
                  <span className="result-label">Soil health</span>
                  <strong>Healthy</strong>
                </div>
                <div>
                  <span className="result-label">Risk level</span>
                  <strong>Low</strong>
                </div>
                <div>
                  <span className="result-label">Recommendation</span>
                  <strong>Maintain current irrigation rhythm and test organic matter in 2 weeks.</strong>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

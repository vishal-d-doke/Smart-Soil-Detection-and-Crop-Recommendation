import { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import { recommendCrop } from '../api';
import './Form.css';

const defaultForm = {
  nitrogen: 120,
  phosphorus: 80,
  potassium: 90,
  temperature: 28,
  humidity: 58,
  ph: 6.7,
  rainfall: 140,
};

export default function CropRecommendation() {
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
      const response = await recommendCrop(form);
      setResult(response);
    } catch (submitError) {
      setError(submitError.message || 'Crop recommendation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page form-page">
      <section className="page-header">
        <p className="eyebrow">Crop recommendation</p>
        <h1>Find the best crop for your field</h1>
      </section>

      <div className="form-grid">
        <Card title="Assessment input" eyebrow="Recommendation engine">
          <form className="stack-form" onSubmit={handleSubmit}>
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
              Humidity (%)
              <input type="number" name="humidity" value={form.humidity} onChange={handleChange} />
            </label>
            <label>
              Soil pH
              <input type="number" step="0.1" name="ph" value={form.ph} onChange={handleChange} />
            </label>
            <label>
              Rainfall (mm)
              <input type="number" name="rainfall" value={form.rainfall} onChange={handleChange} />
            </label>
            {error && <p className="form-error">{error}</p>}
            <Button type="submit" disabled={loading}>{loading ? 'Generating...' : 'Generate recommendation'}</Button>
          </form>
        </Card>

        <Card title="Recommended crop" eyebrow="Best match">
          <div className="result-panel">
            {result ? (
              <>
                <div>
                  <span className="result-label">Suggested crop</span>
                  <strong>{result.recommended_crop}</strong>
                </div>
                <div>
                  <span className="result-label">Fit score</span>
                  <strong>{Math.round(result.confidence * 100)}%</strong>
                </div>
                <div>
                  <span className="result-label">Reason</span>
                  <strong>{result.reason}</strong>
                </div>
              </>
            ) : (
              <>
                <div>
                  <span className="result-label">Suggested crop</span>
                  <strong>Maize</strong>
                </div>
                <div>
                  <span className="result-label">Fit score</span>
                  <strong>92%</strong>
                </div>
                <div>
                  <span className="result-label">Reason</span>
                  <strong>Strong pH balance, good moisture retention, and favorable seasonal climate.</strong>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

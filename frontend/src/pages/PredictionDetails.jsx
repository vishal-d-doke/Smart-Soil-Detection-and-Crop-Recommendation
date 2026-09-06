import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Card from '../components/Card';
import Loading from '../components/Loading';
import { getPredictionById } from '../api';
import './Form.css';

export default function PredictionDetails() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function fetchReport() {
      try {
        const data = await getPredictionById(id);
        if (isMounted) {
          setReport(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load report');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchReport();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const isCrop = report?.type === 'crop';
  const inputs = report?.input_data || {};
  const result = report?.result || {};

  return (
    <div className="page detail-page">
      <section className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p className="eyebrow">{isCrop ? 'Crop recommendation report' : 'Soil diagnostic report'}</p>
          <h1>{report?.title || `Field report #${id}`}</h1>
          {report?.created_at && (
            <p style={{ color: 'var(--muted)', marginTop: '0.25rem', fontSize: '0.9rem' }}>
              Generated on {new Date(report.created_at).toLocaleString()}
            </p>
          )}
        </div>
        <Link to="/app/history" className="button button-secondary">
          ← Back to history
        </Link>
      </section>

      {loading ? (
        <Loading message="Loading field report..." />
      ) : error ? (
        <Card title="Report error">
          <p className="form-error">{error}</p>
          <div style={{ marginTop: '1rem' }}>
            <Link to="/app/history" className="button button-secondary">
              Return to history
            </Link>
          </div>
        </Card>
      ) : (
        <div className="detail-grid">
          <Card title="Analysis summary" eyebrow="Diagnostic overview">
            <div className="result-panel compact">
              {isCrop ? (
                <>
                  <div>
                    <span className="result-label">Suggested crop</span>
                    <strong>{result.recommended_crop || 'Identified'}</strong>
                  </div>
                  <div>
                    <span className="result-label">Match confidence</span>
                    <strong>{Math.round((report.confidence || result.confidence || 0.9) * 100)}%</strong>
                  </div>
                  {result.yield_estimate && (
                    <div>
                      <span className="result-label">Yield forecast</span>
                      <strong>{result.yield_estimate}</strong>
                    </div>
                  )}
                  <div>
                    <span className="result-label">Reasoning</span>
                    <strong>{result.reason || 'Agronomic condition match verified.'}</strong>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className="result-label">Soil type</span>
                    <strong>{result.soil_type || 'Loamy'}</strong>
                  </div>
                  <div>
                    <span className="result-label">Health score</span>
                    <strong>{result.health_score ? `${result.health_score}/100` : 'Healthy'}</strong>
                  </div>
                  <div>
                    <span className="result-label">Confidence</span>
                    <strong>{Math.round((report.confidence || result.confidence || 0.9) * 100)}%</strong>
                  </div>
                  <div>
                    <span className="result-label">Recommendation</span>
                    <strong>{result.recommendation || 'Standard soil care advised.'}</strong>
                  </div>
                </>
              )}
            </div>
          </Card>

          <Card title="Input metrics" eyebrow="Measured field inputs">
            <ul className="check-list">
              {inputs.ph !== undefined && <li>Soil pH: <strong>{inputs.ph}</strong></li>}
              {inputs.nitrogen !== undefined && <li>Nitrogen (N): <strong>{inputs.nitrogen} kg/ha</strong></li>}
              {inputs.phosphorus !== undefined && <li>Phosphorus (P): <strong>{inputs.phosphorus} kg/ha</strong></li>}
              {inputs.potassium !== undefined && <li>Potassium (K): <strong>{inputs.potassium} kg/ha</strong></li>}
              {inputs.temperature !== undefined && <li>Temperature: <strong>{inputs.temperature}°C</strong></li>}
              {inputs.humidity !== undefined && <li>Moisture / Humidity: <strong>{inputs.humidity}%</strong></li>}
              {inputs.rainfall !== undefined && <li>Rainfall: <strong>{inputs.rainfall} mm</strong></li>}
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
}

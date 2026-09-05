import { useParams } from 'react-router-dom';
import Card from '../components/Card';
import './Form.css';

export default function PredictionDetails() {
  const { id } = useParams();

  return (
    <div className="page detail-page">
      <section className="page-header">
        <p className="eyebrow">Prediction details</p>
        <h1>Field report #{id}</h1>
      </section>

      <div className="detail-grid">
        <Card title="Analysis summary" eyebrow="Overview">
          <div className="result-panel compact">
            <div>
              <span className="result-label">Crop fit</span>
              <strong>92%</strong>
            </div>
            <div>
              <span className="result-label">Soil health</span>
              <strong>Healthy</strong>
            </div>
            <div>
              <span className="result-label">Recommendation</span>
              <strong>Continue with maize planning and monitor water retention in the next 14 days.</strong>
            </div>
          </div>
        </Card>

        <Card title="Input metrics" eyebrow="Measured values">
          <ul className="check-list">
            <li>pH: 6.7</li>
            <li>Moisture: 58%</li>
            <li>Nitrogen: 120 kg/ha</li>
            <li>Temperature: 28°C</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import { getHistory, getMarketPrices, getWeatherTemperature } from '../api';
import './Dashboard.css';

const stats = [
  { label: 'Fields monitored', value: '18', tone: 'green' },
  { label: 'Soil alerts', value: '4', tone: 'amber' },
  { label: 'Crop fit rate', value: '89%', tone: 'blue' },
];

export default function Dashboard() {
  const [temperature, setTemperature] = useState({ value: 29.4, trend: '+1.2°' });
  const [marketPrices, setMarketPrices] = useState([]);
  const [history, setHistory] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [weather, market, predictionHistory] = await Promise.all([
          getWeatherTemperature(),
          getMarketPrices(),
          getHistory(),
        ]);

        setTemperature({
          value: Number(weather.temperature_c ?? 29.4),
          trend: `${weather.temperature_c >= 30 ? '+' : '-'}${Math.abs((weather.temperature_c ?? 29.4) - 29.4).toFixed(1)}°`,
        });

        setMarketPrices(
          market.map((item) => ({
            crop: item.crop,
            price: Number(item.price),
            unit: '/qt',
            change: item.price >= 30 ? '+1.2%' : '-0.6%',
          })),
        );

        setHistory(
          predictionHistory.slice(0, 3).map((item) => ({
            id: item.id,
            name: item.title,
            status: item.type === 'crop' ? 'Crop fit' : 'Soil scan',
            date: new Date(item.created_at).toLocaleDateString(),
          })),
        );
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setLastUpdated(new Date());
      }
    };

    loadDashboard();
    const timer = setInterval(loadDashboard, 20000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="page dashboard-page">
      <section className="page-header dashboard-header">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Field overview</h1>
        </div>
        <Link to="/app/soil-detection" className="button button-primary">
          Run soil scan
        </Link>
      </section>

      <div className="stat-grid">
        {stats.map((stat) => (
          <div key={stat.label} className={`stat-tile ${stat.tone}`}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </div>
        ))}
      </div>

      <div className="live-grid">
        <Card title="Live temperature" eyebrow="Weather monitor">
          <div className="live-metric">
            <div>
              <span className="result-label">Current</span>
              <strong>{temperature.value.toFixed(1)}°C</strong>
            </div>
            <span className="live-pill">{temperature.trend}</span>
          </div>
          <p className="live-note">Updated at {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </Card>

        <Card title="Crop market prices" eyebrow="Live market">
          <ul className="market-list">
            {marketPrices.map((item) => (
              <li key={item.crop}>
                <div>
                  <strong>{item.crop}</strong>
                  <small>{item.unit}</small>
                </div>
                <div className="market-price">
                  <span>₹{item.price}</span>
                  <em className={item.change.startsWith('+') ? 'positive' : 'negative'}>{item.change}</em>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="dashboard-grid">
        <Card title="Recent predictions" eyebrow="Monitoring">
          <ul className="list-panel">
            {history.length > 0 ? history.map((item) => (
              <li key={item.id}>
                <div>
                  <Link to={`/app/prediction/${item.id}`} style={{ color: 'inherit' }}>
                    <strong>{item.name}</strong>
                  </Link>
                  <small>{item.date}</small>
                </div>
                <Link to={`/app/prediction/${item.id}`} className="tag" style={{ textDecoration: 'none' }}>
                  {item.status}
                </Link>
              </li>
            )) : (
              <li>
                <div>
                  <strong>No recent predictions</strong>
                  <small>Run a soil or crop analysis to start</small>
                </div>
              </li>
            )}
          </ul>
        </Card>

        <Card title="Action plan" eyebrow="Recommended next steps">
          <ul className="check-list">
            <li>Apply nitrogen balance adjustment</li>
            <li>Increase soil moisture monitoring weekly</li>
            <li>Rotate crop selection for high-yield fields</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

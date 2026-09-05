import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import { getAuthToken, getMarketPrices, getWeatherTemperature } from '../api';
import './Home.css';

const featureCards = [
  {
    title: 'Soil health analysis',
    text: 'Assess moisture, pH, and nutrient levels to spot what the field is missing.',
  },
  {
    title: 'Crop fit scoring',
    text: 'Match crops to local conditions and field performance with data-backed guidance.',
  },
  {
    title: 'Actionable advice',
    text: 'Get farm-friendly recommendations about planting, irrigation, and crop rotation.',
  },
];

const metrics = [
  { label: 'Fields tracked', value: '2.4K+' },
  { label: 'Success rate', value: '91%' },
  { label: 'Time saved', value: '40%' },
];

export default function Home() {
  const isAuthenticated = Boolean(getAuthToken());
  const [temperature, setTemperature] = useState({ value: 29.4, trend: '+1.2°' });
  const [marketPrices, setMarketPrices] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const loadLiveData = async () => {
      try {
        const [weather, market] = await Promise.all([getWeatherTemperature(), getMarketPrices()]);

        setTemperature({
          value: Number(weather.temperature_c ?? 29.4),
          trend: `${weather.temperature_c >= 30 ? '+' : '-'}${Math.abs((weather.temperature_c ?? 29.4) - 29.4).toFixed(1)}°`,
        });

        const transformedMarket = market.map((item) => ({
          crop: item.crop,
          price: Number(item.price),
          change: item.price >= 30 ? '+1.2%' : '-0.6%',
        }));

        setMarketPrices(transformedMarket);
      } catch (error) {
        console.error('Failed to load live weather/market data', error);
      } finally {
        setLastUpdated(new Date());
      }
    };

    loadLiveData();
    const timer = setInterval(loadLiveData, 15000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="page home-page">
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Then grow smarter</p>
          <h1>Detect soil conditions and recommend the right crop.</h1>
          <p className="subtext">
            Smart Soil helps farmers and agronomists monitor field health, identify soil issues,
            and choose high-potential crops for stronger harvest outcomes.
          </p>
          <div className="cta-group">
            <Button to="/register">Start free</Button>
            {isAuthenticated && <Button to="/app" variant="secondary">View dashboard</Button>}
          </div>
        </div>

        <div className="hero-panel">
          <div className="metric-card large">
            <span>Current field score</span>
            <strong>86/100</strong>
            <small>Healthy crop potential</small>
          </div>

          <div className="mini-stat-row">
            <div className="metric-card">
              <span>pH</span>
              <strong>6.7</strong>
            </div>
            <div className="metric-card">
              <span>Moisture</span>
              <strong>58%</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="metrics-strip">
        {metrics.map((metric) => (
          <div key={metric.label} className="metric-box">
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </div>
        ))}
      </section>

      <section className="live-data-section">
        <div className="live-item">
          <div className="live-header">
            <span>Live temperature</span>
            <span className="live-badge">{temperature.trend}</span>
          </div>
          <strong>{temperature.value.toFixed(1)}°C</strong>
          <small>Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
        </div>

        <div className="market-panel">
          <div className="live-header">
            <span>Crop market prices</span>
            <span className="live-badge muted">Live</span>
          </div>
          <ul className="market-list-home">
            {marketPrices.map((item) => (
              <li key={item.crop}>
                <span>{item.crop}</span>
                <div className="market-right">
                  <strong>₹{item.price}</strong>
                  <em className={item.change.startsWith('+') ? 'positive' : 'negative'}>{item.change}</em>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="feature-section">
        <div className="section-heading">
          <p className="eyebrow">Why growers choose us</p>
          <h2>Everything you need for smarter field decisions</h2>
        </div>

        <div className="feature-grid">
          {featureCards.map((feature) => (
            <Card key={feature.title} title={feature.title}>
              <p>{feature.text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="cta-banner">
        <div>
          <p className="eyebrow">Ready to plan your next sowing season?</p>
          <h3>Turn field data into confident crop recommendations.</h3>
        </div>
        <Link to="/login" className="button button-primary">
          Open app
        </Link>
      </section>
    </div>
  );
}

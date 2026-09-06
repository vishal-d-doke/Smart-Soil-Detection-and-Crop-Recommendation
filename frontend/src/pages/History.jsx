import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Loading from '../components/Loading';
import { getHistory } from '../api';
import './History.css';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function fetchHistory() {
      try {
        const data = await getHistory();
        if (isMounted) {
          setHistory(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load analysis history');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchHistory();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="page history-page">
      <section className="page-header">
        <p className="eyebrow">History</p>
        <h1>Recent analysis records</h1>
      </section>

      <Card title="Past evaluations">
        {loading ? (
          <Loading message="Loading analysis records..." />
        ) : error ? (
          <div className="empty-state">
            <h4>Unable to load records</h4>
            <p>{error}</p>
          </div>
        ) : history.length === 0 ? (
          <div className="empty-state">
            <h4>No analysis records yet</h4>
            <p>Run your first soil diagnostic or crop recommendation to build your field history.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/app/soil-detection" className="button button-primary">
                Run soil scan
              </Link>
              <Link to="/app/crop-recommendation" className="button button-secondary">
                Recommend crop
              </Link>
            </div>
          </div>
        ) : (
          <ul className="history-list">
            {history.map((item) => {
              const formattedDate = item.created_at
                ? new Date(item.created_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : 'Recent';

              const score = item.confidence
                ? `${Math.round(item.confidence * 100)}% fit`
                : item.result?.health_score
                ? `${item.result.health_score}/100 health`
                : 'Completed';

              return (
                <li key={item.id}>
                  <div>
                    <strong>{item.title}</strong>
                    <small>
                      {item.type === 'crop' ? 'Crop recommendation' : 'Soil diagnostic'} · {formattedDate}
                    </small>
                  </div>
                  <div className="history-meta">
                    <span>{score}</span>
                    <Link to={`/app/prediction/${item.id}`} className="button button-secondary" style={{ padding: '0.35rem 0.8rem', fontSize: '0.875rem' }}>
                      View
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}

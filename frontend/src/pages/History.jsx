import { Link } from 'react-router-dom';
import Card from '../components/Card';
import './History.css';

const history = [
  { id: 1, name: 'Maize block A', type: 'Soil scan', date: 'May 12, 2026', score: '92%' },
  { id: 2, name: 'Rice valley', type: 'Crop match', date: 'May 2, 2026', score: '84%' },
  { id: 3, name: 'Tomato field', type: 'Health review', date: 'Apr 27, 2026', score: '88%' },
];

export default function History() {
  return (
    <div className="page history-page">
      <section className="page-header">
        <p className="eyebrow">History</p>
        <h1>Recent analysis records</h1>
      </section>

      <Card title="Past evaluations">
        <ul className="history-list">
          {history.map((item) => (
            <li key={item.id}>
              <div>
                <strong>{item.name}</strong>
                <small>
                  {item.type} · {item.date}
                </small>
              </div>
              <div className="history-meta">
                <span>{item.score}</span>
                <Link to={`/app/prediction/${item.id}`}>View</Link>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

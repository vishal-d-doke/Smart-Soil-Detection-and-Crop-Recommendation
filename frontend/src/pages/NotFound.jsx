import { Link } from 'react-router-dom';
import './Auth.css';

export default function NotFound() {
  return (
    <div className="page not-found-page">
      <div className="not-found-card">
        <p className="eyebrow">404</p>
        <h1>Page not found</h1>
        <p>The page you are looking for does not exist or may have moved.</p>
        <Link to="/" className="button button-primary">
          Return home
        </Link>
      </div>
    </div>
  );
}

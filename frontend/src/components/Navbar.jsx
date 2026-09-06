import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { logoutUser } from '../api';

const publicLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Login', to: '/login' },
  { label: 'Register', to: '/register' },
];

const dashboardLinks = [
  { label: 'Overview', to: '/app' },
  { label: 'Soil Scan', to: '/app/soil-detection' },
  { label: 'Crop Match', to: '/app/crop-recommendation' },
  { label: 'History', to: '/app/history' },
  { label: 'Profile', to: '/app/profile' },
];

export default function Navbar({ mode = 'public' }) {
  const navigate = useNavigate();
  const links = mode === 'dashboard' ? dashboardLinks : publicLinks;

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <header className="topbar">
      <div className="nav-inner">
        <NavLink to={mode === 'dashboard' ? '/app' : '/'} className="brand" end>
          <img src={logo} alt="Smart Soil logo" className="brand-logo" />
          <span>Smart Soil</span>
        </NavLink>

        <nav className="nav-links" aria-label="Main navigation">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/' || link.to === '/app'}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-actions">
          {mode === 'dashboard' ? (
            <button type="button" className="button button-secondary" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <>
              <NavLink to="/login" className="button button-secondary">
                Login
              </NavLink>
              <NavLink to="/register" className="button button-primary">
                Get started
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

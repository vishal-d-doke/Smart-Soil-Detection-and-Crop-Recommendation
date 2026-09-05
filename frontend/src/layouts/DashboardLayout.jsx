import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function DashboardLayout() {
  return (
    <div className="app-shell app-shell-dashboard">
      <Navbar mode="dashboard" />
      <main className="page-content page-content-dashboard">
        <Outlet />
      </main>
    </div>
  );
}

import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PublicLayout() {
  return (
    <div className="app-shell app-shell-public">
      <Navbar mode="public" />
      <main className="page-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

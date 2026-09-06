import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SoilDetection from './pages/SoilDetection';
import CropRecommendation from './pages/CropRecommendation';
import History from './pages/History';
import PredictionDetails from './pages/PredictionDetails';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="app" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="soil-detection" element={<SoilDetection />} />
            <Route path="crop-recommendation" element={<CropRecommendation />} />
            <Route path="history" element={<History />} />
            <Route path="prediction/:id" element={<PredictionDetails />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

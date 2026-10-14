import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import CropsPage from './pages/CropsPage.jsx';
import CropDetailsPage from './pages/CropDetailsPage.jsx';
import WeatherPage from './pages/WeatherPage.jsx';
import MarketPricesPage from './pages/MarketPricesPage.jsx';
import FarmerDiaryPage from './pages/FarmerDiaryPage.jsx';
import AIAssistantPage from './pages/AIAssistantPage.jsx';
import StorageMonitoringPage from './pages/StorageMonitoringPage.jsx';
import AdminPortalPage from './pages/AdminPortalPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/crops" element={<CropsPage />} />
        <Route path="/crops/:cropId" element={<CropDetailsPage />} />
        <Route path="/storage" element={<StorageMonitoringPage />} />
        <Route path="/weather" element={<WeatherPage />} />
        <Route path="/market-prices" element={<MarketPricesPage />} />
        <Route path="/farmer-diary" element={<FarmerDiaryPage />} />
        <Route path="/ai-assistant" element={<AIAssistantPage />} />
        <Route path="/admin" element={<AdminPortalPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

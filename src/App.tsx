import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './components/home/HomePage';
import { RecordsPage } from './components/records/RecordsPage';
import { VisionPage } from './components/vision/VisionPage';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';
import { ToastContainer } from './components/ui/Toast';

const AppContent: React.FC = () => {
  const { activeTab, isAuthenticated } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 transition-colors duration-200">
      <Navbar />

      <div className="flex-1 flex flex-col">
        {activeTab === 'home' && <HomePage />}
        {activeTab === 'records' && <RecordsPage />}
        {activeTab === 'vision' && <VisionPage />}
        {activeTab === 'admin' && (isAuthenticated ? <AdminLayout /> : <AdminLogin />)}
      </div>

      <Footer />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

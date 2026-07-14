import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UtensilsCrossed, AlertCircle, RefreshCw } from 'lucide-react';
import { FoodHubData, WeeklyMenuItem, CanteenItem, SpecialItem } from './types';

// Import Modular Components
import NoticeBanner from './components/NoticeBanner';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MealTimings from './components/MealTimings';
import TodayMenu from './components/TodayMenu';
import WeeklyMenu from './components/WeeklyMenu';
import CanteenSection from './components/CanteenSection';
import SpecialItemCard from './components/SpecialItemCard';
import Statistics from './components/Statistics';
import ContactSection from './components/ContactSection';
import AdminPanel from './components/AdminPanel';
import Logo from './components/Logo';

export default function App() {
  const [data, setData] = useState<FoodHubData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);

  const fetchData = async () => {
    try {
      setError(null);
      const response = await fetch('/api/data');
      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        throw new Error('Failed to fetch real-time canteen data');
      }
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError('Could not connect to the real-time canteen database. Please check your server.');
    } finally {
      // Small artificial delay to guarantee a premium visual loading experience
      setTimeout(() => setIsLoading(false), 900);
    }
  };

  useEffect(() => {
    fetchData();

    // Check query params to see if admin panel was requested
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true' || params.get('edit') === 'true') {
      setIsAdminOpen(true);
    }
  }, []);

  const handleUnlockAdmin = () => {
    setIsAdminOpen(true);
  };

  const handleLockAdmin = () => {
    setIsAdminUnlocked(false);
    setIsAdminOpen(false);
    // Remove query parameters from URL for security/visual purity
    const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.history.pushState({ path: newurl }, '', newurl);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          {/* Glowing Animated Utensils Logo */}
          <div className="relative flex items-center justify-center w-24 h-24 mx-auto">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
              className="absolute inset-0 border-4 border-t-nmims-red border-r-transparent border-b-red-100 border-l-transparent rounded-full"
            />
            <div className="bg-white p-2 rounded-2xl shadow-xl border border-gray-100 w-16 h-16 flex items-center justify-center overflow-hidden">
              <Logo className="w-full h-full object-contain animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display text-gray-900 tracking-tight">
              NMIMS <span className="text-nmims-red">FoodHub</span>
            </h1>
            <p className="text-xs text-gray-400 font-medium tracking-widest uppercase mt-1">
              Loading Live Canteen Status...
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Handle Error with Retry State
  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl max-w-md w-full text-center space-y-6">
          <div className="bg-red-50 text-nmims-red p-4 rounded-full w-max mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 font-display">Connection Error</h2>
            <p className="text-gray-500 text-sm mt-1.5 leading-relaxed">
              {error || 'Unable to load real-time food menus and stocks.'}
            </p>
          </div>
          <button
            onClick={() => {
              setIsLoading(true);
              fetchData();
            }}
            className="w-full bg-nmims-red hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-nmims-red/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 animate-spin-reverse" />
            <span>Try Reconnecting</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      {/* Notice Ticker Announcement Banner */}
      <NoticeBanner notices={data.notices} />

      {/* Navigation Header */}
      <Navbar
        onUnlockAdmin={handleUnlockAdmin}
        isAdminUnlocked={isAdminUnlocked}
        onLockAdmin={handleLockAdmin}
      />

      {/* Hero Welcome Display */}
      <Hero />

      {/* Meal Timings Overview Grid */}
      <MealTimings />

      {/* Today's Automatic Live Menu Section */}
      <TodayMenu menuItems={data.weeklyMenu} />

      {/* Statistics counters */}
      <Statistics canteenItems={data.canteenItems} menuItems={data.weeklyMenu} />

      {/* Sliding Weekly Catering Menu Tabs */}
      <WeeklyMenu menuItems={data.weeklyMenu} />

      {/* Canteen live stock levels section */}
      <CanteenSection canteenItems={data.canteenItems} />

      {/* Chef Recommended Today's Special Dish */}
      <SpecialItemCard specialItem={data.specialItem} />

      {/* Contact campus canteen */}
      <ContactSection onOpenAdmin={handleUnlockAdmin} />

      {/* Premium Footer */}
      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-gray-800 pb-8 mb-8">
            <div className="flex items-center gap-3 group">
              <div className="bg-white p-1 rounded-lg shrink-0 w-10 h-10 overflow-hidden flex items-center justify-center">
                <Logo className="w-full h-full object-contain" />
              </div>
              <span className="text-lg font-bold font-display tracking-tight">
                NMIMS <span className="text-nmims-red">FoodHub</span>
              </span>
            </div>
            <div className="text-gray-400 text-xs">
              Designed for NMIMS Hyderabad Campus (Jadcherla)
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <div>
              &copy; {new Date().getFullYear()} NMIMS Hyderabad. All rights reserved.
            </div>
            <div className="flex gap-4">
              <span>Hygienic Catering</span>
              <span>•</span>
              <span>Live Stock Tracking</span>
              <span>•</span>
              <button
                onClick={handleUnlockAdmin}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Canteen Login
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Administrator Control Panel Dialog Overlay */}
      <AnimatePresence>
        {isAdminOpen && (
          <AdminPanel
            weeklyMenu={data.weeklyMenu}
            canteenItems={data.canteenItems}
            specialItem={data.specialItem}
            notices={data.notices}
            onRefreshData={fetchData}
            onClose={() => setIsAdminOpen(false)}
            unlockedWithPasscode={isAdminUnlocked}
            onSuccessUnlock={() => setIsAdminUnlocked(true)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

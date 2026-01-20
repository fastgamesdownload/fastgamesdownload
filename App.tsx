import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { StoreProvider } from './context/StoreContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import GameDetails from './pages/GameDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Library from './pages/Library';
import Subscription from './pages/Subscription';
import AdminProducts from './pages/AdminProducts';
import AdminClients from './pages/AdminClients';
import AdminSettings from './pages/AdminSettings';
import AdminPayments from './pages/AdminPayments';
import AdminBackup from './pages/AdminBackup';
import PlatformGallery from './pages/PlatformGallery';
import Contact from './pages/Contact';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <StoreProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-black text-zinc-100 font-sans flex flex-col">
          <Navbar />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/game/:id" element={<GameDetails />} />
              <Route path="/platform/:platformName" element={<PlatformGallery />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/library" element={<Library />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/contact" element={<Contact />} />
              {/* Admin Routes */}
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/clients" element={<AdminClients />} />
              <Route path="/admin/payments" element={<AdminPayments />} />
              <Route path="/admin/backup" element={<AdminBackup />} />
            </Routes>
          </div>
          <Footer />
          <Analytics />
        </div>
      </Router>
    </StoreProvider>
  );
};

export default App;
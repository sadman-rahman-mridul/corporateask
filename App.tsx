
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedIn from './components/FeaturedIn';
import ProblemSolution from './components/ProblemSolution';
import Stats from './components/Stats';
import Testimonials from './components/Testimonials';
import Process from './components/Process';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import BookingModal from './components/BookingModal';
import LoginModal from './components/LoginModal';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  // User State
  const [user, setUser] = useState<{ role: string; username: string } | null>(null);

  const openBooking = () => setIsBookingOpen(true);
  const closeBooking = () => setIsBookingOpen(false);

  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  const handleLoginSuccess = (userData: { role: string; username: string }) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  // If Admin Logged In, Show Dashboard
  if (user?.role === 'admin') {
    return <AdminDashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans overflow-x-hidden">
      <Navbar 
        onBookNow={openBooking} 
        onSignIn={openLogin}
        user={user}
        onSignOut={handleLogout}
      />
      <main className="flex-grow">
        <Hero onBookNow={openBooking} />
        <FeaturedIn />
        <ProblemSolution />
        <Stats />
        <Testimonials />
        <Process onBookNow={openBooking} />
      </main>
      <Footer />
      <ChatWidget />
      <BookingModal isOpen={isBookingOpen} onClose={closeBooking} />
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={closeLogin} 
        onLoginSuccess={handleLoginSuccess} 
      />
    </div>
  );
}

export default App;
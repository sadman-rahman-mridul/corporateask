import React, { useState } from 'react';
import { Menu, X, UserCircle } from 'lucide-react';
import Logo from './Logo';

interface NavbarProps {
  onBookNow: () => void;
  onSignIn: () => void;
  user?: { role: string; username: string } | null;
  onSignOut?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onBookNow, onSignIn, user, onSignOut }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            {/* New Logo Component */}
            <a href="#" className="flex-shrink-0 flex items-center cursor-pointer">
               <Logo />
            </a>
            
            <div className="hidden md:ml-12 md:flex md:space-x-8">
              <a href="#" className="text-gray-900 hover:text-brand-red px-1 pt-1 text-base font-medium transition-colors">About</a>
              <a href="#" className="text-gray-500 hover:text-brand-red px-1 pt-1 text-base font-medium transition-colors">Product & Service</a>
              <a href="#" className="text-gray-500 hover:text-brand-red px-1 pt-1 text-base font-medium transition-colors">E-Books</a>
              <a href="#" className="text-gray-500 hover:text-brand-red px-1 pt-1 text-base font-medium transition-colors">Contact Us</a>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            {user ? (
               <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <UserCircle size={18} /> {user.username} ({user.role})
                  </span>
                  <button 
                    onClick={onSignOut}
                    className="text-gray-500 hover:text-brand-red text-sm font-medium"
                  >
                    Sign Out
                  </button>
               </div>
            ) : (
              <button 
                onClick={onSignIn}
                className="text-gray-700 hover:text-brand-red px-4 py-2 rounded-md text-sm font-bold border border-gray-200 hover:border-brand-red transition-all"
              >
                Sign In
              </button>
            )}

            <button 
              onClick={onBookNow}
              className="bg-brand-red hover:bg-brand-redHover text-white px-6 py-2.5 rounded-md text-sm font-bold shadow-md transition-all hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Book My Service
            </button>
          </div>

          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b">
          <div className="pt-2 pb-3 space-y-1">
            <a href="#" className="bg-red-50 border-l-4 border-brand-red text-brand-red block pl-3 pr-4 py-2 text-base font-medium">About</a>
            <a href="#" className="border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 block pl-3 pr-4 py-2 text-base font-medium">Product & Service</a>
            <a href="#" className="border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 block pl-3 pr-4 py-2 text-base font-medium">E-Books</a>
            <a href="#" className="border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 block pl-3 pr-4 py-2 text-base font-medium">Contact Us</a>
          </div>
          <div className="pt-4 pb-4 border-t border-gray-200 p-4 space-y-3">
             {user ? (
               <button onClick={onSignOut} className="w-full text-center text-gray-600 font-medium py-2 border rounded-md">
                 Sign Out ({user.username})
               </button>
             ) : (
               <button onClick={() => { setIsOpen(false); onSignIn(); }} className="w-full text-center text-brand-red font-bold py-2 border border-brand-red rounded-md">
                 Sign In
               </button>
             )}
             
             <button onClick={() => { setIsOpen(false); onBookNow(); }} className="w-full bg-brand-red text-white py-3 rounded-md font-bold shadow">
               Book My Service
             </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
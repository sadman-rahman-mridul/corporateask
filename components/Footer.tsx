import React from 'react';
import { Facebook, Linkedin, Youtube, Mail, Phone, Users } from 'lucide-react';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="mb-6">
                <Logo className="h-10 text-white filter brightness-0 invert" /> 
                {/* Applied CSS filter to make logo white for footer */}
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              আমরা কাজ করি আপনার ক্যারিয়ার সল্যুশন নিয়ে। একটি সঠিক সিভি বদলে দিতে পারে আপনার আগামী দিনের পথচলা।
            </p>
            <div className="flex gap-4">
               <a href="#" className="bg-gray-800 p-2 rounded-full text-gray-400 hover:text-white hover:bg-brand-red transition-all"><Facebook size={18} /></a>
               <a href="#" className="bg-gray-800 p-2 rounded-full text-gray-400 hover:text-white hover:bg-brand-red transition-all"><Linkedin size={18} /></a>
               <a href="#" className="bg-gray-800 p-2 rounded-full text-gray-400 hover:text-white hover:bg-brand-red transition-all"><Youtube size={18} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-brand-red transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-gray-500 rounded-full"></span>Home</a></li>
              <li><a href="#" className="hover:text-brand-red transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-gray-500 rounded-full"></span>Services</a></li>
              <li><a href="#" className="hover:text-brand-red transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-gray-500 rounded-full"></span>Success Stories</a></li>
              <li><a href="#" className="hover:text-brand-red transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-gray-500 rounded-full"></span>Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Services</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="hover:text-white transition-colors">Resume Writing</li>
              <li className="hover:text-white transition-colors">Cover Letter Design</li>
              <li className="hover:text-white transition-colors">LinkedIn Optimization</li>
              <li className="hover:text-white transition-colors">Career Consultation</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Contact Us</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-center gap-3 group cursor-pointer">
                <div className="bg-gray-800 p-2 rounded group-hover:bg-brand-red transition-colors text-brand-red group-hover:text-white">
                    <Phone size={16} />
                </div>
                <span className="group-hover:text-white transition-colors">+880 1XXX-XXXXXX</span>
              </li>
              <li className="flex items-center gap-3 group cursor-pointer">
                <div className="bg-gray-800 p-2 rounded group-hover:bg-brand-red transition-colors text-brand-red group-hover:text-white">
                    <Mail size={16} />
                </div>
                <span className="group-hover:text-white transition-colors">support@corporateask.com</span>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="bg-gray-800 p-2 rounded mt-1 text-brand-red group-hover:bg-brand-red group-hover:text-white transition-colors">
                    <Users size={16} />
                </div>
                <span className="group-hover:text-white transition-colors">Banani, Dhaka-1213, Bangladesh</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Corporate Ask. All rights reserved.</p>
          <div className="flex gap-6">
             <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
             <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
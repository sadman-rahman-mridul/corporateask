import React from 'react';
import Button from './Button';
import Section from './Section';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroProps {
  onBookNow: () => void;
}

const Hero: React.FC<HeroProps> = ({ onBookNow }) => {
  return (
    <Section className="bg-brand-cream relative overflow-hidden !py-12 md:!py-20">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-x-1/2 translate-y-1/2"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-left"
            >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.15] mb-6">
                  আপনার অভিজ্ঞতা আছে, <br />
                  <span className="text-brand-red">কিন্তু সিভি কি কথা বলছে?</span>
                </h1>

                <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-lg">
                  কর্পোরেট জগতের চাহিদা অনুযায়ী আপনার সিভিকে সাজিয়ে নিন। একটি পারফেক্ট সিভিই হতে পারে আপনার ড্রিম জবের চাবিকাঠি।
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button onClick={onBookNow} className="text-lg px-8 py-4 rounded-full shadow-red-300/50">
                    এখনই সার্ভিস বুক করুন
                  </Button>
                </div>
                
                <p className="mt-6 text-sm text-gray-500 font-medium flex items-center gap-2">
                    <span className="text-yellow-400 text-lg">⭐⭐⭐⭐⭐</span> ৭০,০০০+ প্রফেশনালদের বিশ্বস্ত চয়েস
                </p>
            </motion.div>

            {/* Video Placeholder - Right Column */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full relative"
            >
                <div className="w-full aspect-video bg-white rounded-2xl shadow-2xl border-4 border-white relative overflow-hidden group cursor-pointer transform transition-transform hover:scale-[1.02]">
                    {/* Simulated Youtube Embed */}
                    <img 
                        src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop" 
                        alt="Resume Writing Success" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                        <div className="w-20 h-20 bg-brand-red rounded-full flex items-center justify-center shadow-lg animate-pulse hover:scale-110 transition-transform">
                            <Play fill="white" className="text-white ml-2" size={32} />
                        </div>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white font-medium text-sm bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm">
                        🎥 আমাদের সাকসেস স্টোরি দেখুন
                    </div>
                </div>
                
                {/* Decorative dots grid behind video */}
                <div className="absolute -z-10 -bottom-6 -right-6 w-32 h-32 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
            </motion.div>
        </div>
    </Section>
  );
};

export default Hero;
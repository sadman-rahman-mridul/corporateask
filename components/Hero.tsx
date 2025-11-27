
import React from 'react';
import Button from './Button';
import Section from './Section';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

interface HeroProps {
  onBookNow: () => void;
}

const Hero: React.FC<HeroProps> = ({ onBookNow }) => {
  const handleVideoClick = () => {
    // Error 153 means embedding is blocked by the video owner.
    // Opening in a new tab ensures the user can still watch it.
    window.open("https://www.youtube.com/watch?v=xqZP04y3mTU", "_blank");
  };

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

            {/* Video Player - Right Column */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full relative"
            >
                <div 
                    className="w-full aspect-video bg-black rounded-2xl shadow-2xl border-4 border-white relative overflow-hidden group cursor-pointer"
                    onClick={handleVideoClick}
                >
                    <img 
                        src="https://img.youtube.com/vi/xqZP04y3mTU/maxresdefault.jpg" 
                        alt="Video Thumbnail" 
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative">
                            {/* Pulse Effect */}
                            <div className="absolute inset-0 bg-brand-red rounded-full animate-ping opacity-75"></div>
                            
                            {/* Button */}
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-brand-red text-white rounded-full flex items-center justify-center shadow-lg shadow-red-500/50 transform group-hover:scale-110 transition-transform duration-300 relative z-10">
                                <Play className="w-8 h-8 md:w-10 md:h-10 ml-1 fill-current" />
                            </div>
                        </div>
                    </div>

                    {/* Text Hint */}
                    <div className="absolute bottom-4 left-0 right-0 text-center">
                        <span className="bg-black/50 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                            Click to watch on YouTube
                        </span>
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

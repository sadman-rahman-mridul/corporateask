import React from 'react';
import Section from './Section';

const SuccessStories: React.FC = () => {
  return (
    <Section className="bg-brand-cream border-t border-orange-100">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900">সফলতার গল্প</h2>
        <p className="text-gray-600 mt-2">আমাদের ক্লায়েন্টদের পাঠানো কিছু স্ক্রিনশট</p>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="break-inside-avoid rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
             <img 
               src={`https://picsum.photos/seed/${i + 50}/400/${300 + (i % 3) * 100}`} 
               alt="Client Screenshot" 
               className="w-full h-auto object-cover"
             />
             <div className="bg-white p-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 font-medium">WhatsApp Feedback</p>
             </div>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default SuccessStories;
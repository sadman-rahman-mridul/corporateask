import React from 'react';

const Stats: React.FC = () => {
  return (
    <div className="bg-brand-red py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-red-400/30">
          <div className="p-4">
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">৭০,০০০+</div>
            <div className="text-red-100 font-medium text-lg">সিভি রিভিউ ও রাইটিং সম্পন্ন</div>
          </div>
          <div className="p-4">
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">৯৮%</div>
            <div className="text-red-100 font-medium text-lg">ক্লায়েন্ট স্যাটিসফ্যাকশন</div>
          </div>
          <div className="p-4">
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">৫০০০+</div>
            <div className="text-red-100 font-medium text-lg">সফল ক্যারিয়ার প্লেসমেন্ট</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
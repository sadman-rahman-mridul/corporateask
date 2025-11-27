import React from 'react';
import Section from './Section';
import Button from './Button';
import { FileText, Users, Cpu, Send } from 'lucide-react';

const steps = [
  {
    icon: <FileText size={28} />,
    title: "বুকিং কনফার্মেশন",
    desc: "পেমেন্ট সম্পন্ন করে আপনার বর্তমান সিভি এবং প্রয়োজনীয় তথ্য আমাদের সাথে শেয়ার করুন।"
  },
  {
    icon: <Users size={28} />,
    title: "১-অন-১ কনসালটেশন",
    desc: "আমাদের এক্সপার্ট রাইটারের সাথে সরাসরি কথা বলে আপনার ক্যারিয়ার গোল এবং অভিজ্ঞতার বিস্তারিত জানান।"
  },
  {
    icon: <Cpu size={28} />,
    title: "এটিএস (ATS) ফ্রেন্ডলি",
    desc: "মডার্ন রিক্রুটমেন্ট সফটওয়্যার (ATS) যেন আপনার সিভি রিজেক্ট না করে, সেভাবেই কি-ওয়ার্ড অপটিমাইজ করা হয়।"
  },
  {
    icon: <Send size={28} />,
    title: "ক্রাফটিং ও ডেলিভারি",
    desc: "সব তথ্য বিশ্লেষণ করে একটি প্রফেশনাল, আকর্ষণীয় এবং ইন্টারভিউ-উইনিং সিভি তৈরি করে আপনাকে ডেলিভার করা হবে।"
  }
];

interface ProcessProps {
  onBookNow: () => void;
}

const Process: React.FC<ProcessProps> = ({ onBookNow }) => {
  return (
    <Section className="bg-white">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">সার্ভিসটি বুক করার পর আমরা যেভাবে কাজ করি</h2>
        <div className="w-24 h-1 bg-brand-red mx-auto mt-4"></div>
      </div>

      <div className="relative">
        {/* Connector Line for Desktop */}
        <div className="hidden lg:block absolute top-8 left-0 w-full h-0.5 bg-gray-200 -z-10"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center text-center bg-white p-4">
              <div className="w-16 h-16 rounded-full bg-brand-red text-white flex items-center justify-center mb-6 shadow-lg shadow-red-200 border-4 border-white relative">
                 {step.icon}
                 <div className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
                    {idx + 1}
                 </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 text-center">
        <Button onClick={onBookNow} className="text-xl px-10 py-4 rounded-full animate-bounce">
          আমার সিভি প্রফেশনাল করতে চাই
        </Button>
      </div>
    </Section>
  );
};

export default Process;
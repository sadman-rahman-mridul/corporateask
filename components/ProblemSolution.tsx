import React from 'react';
import Section from './Section';
import { SearchX, Clock, TrendingUp } from 'lucide-react';

const Card: React.FC<{ icon: React.ReactNode, title: string, text: string }> = ({ icon, title, text }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 flex flex-col items-start h-full group">
    <div className="p-4 bg-red-50 text-brand-red rounded-lg mb-6 group-hover:bg-brand-red group-hover:text-white transition-colors duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed text-sm md:text-base">
      {text}
    </p>
  </div>
);

const ProblemSolution: React.FC = () => {
  return (
    <Section className="bg-white">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Resume Writing সার্ভিসটি কি আপনার জন্য?</h2>
        <div className="inline-block bg-brand-light px-4 py-1 rounded-full">
            <p className="text-brand-red font-semibold">হ্যাঁ, যদি আপনি...</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card 
          icon={<SearchX size={32} />}
          title="বারবার অ্যাপ্লাই করছেন কিন্তু কল পাচ্ছেন না"
          text="শত শত জায়গায় সিভি ড্রপ করার পরেও ইন্টারভিউ কল না পাওয়া মানে আপনার সিভিতে কিছু মিসিং আছে।"
        />
        <Card 
          icon={<Clock size={32} />}
          title="ক্যারিয়ার গ্যাপ বা ট্র্যাক চেঞ্জ"
          text="পড়াশোনা বা চাকরির মাঝে বিরতি আছে অথবা ইন্ডাস্ট্রি পরিবর্তন করতে চাচ্ছেন কিন্তু সিভিতে সেটা ফুটিয়ে তুলতে পারছেন না।"
        />
        <Card 
          icon={<TrendingUp size={32} />}
          title="লেভেল আপ করতে চান"
          text="বর্তমান পজিশন থেকে প্রমোশন বা বেটার স্যালারির জবের জন্য নিজেকে যোগ্য প্রার্থী হিসেবে উপস্থাপন করতে চান।"
        />
      </div>
    </Section>
  );
};

export default ProblemSolution;
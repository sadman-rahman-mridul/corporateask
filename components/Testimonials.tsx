import React from 'react';
import Section from './Section';
import { Quote, ThumbsUp, MessageCircle, Share2 } from 'lucide-react';

const TestimonialCard: React.FC<{ name: string, role: string, text: string, img: string }> = ({ name, role, text, img }) => (
  <div className="bg-white rounded-xl shadow border border-gray-200 p-6 flex flex-col h-full">
    <div className="flex items-start gap-4 mb-4">
      <img src={img} alt={name} className="w-12 h-12 rounded-full object-cover border border-gray-100" />
      <div>
        <h4 className="font-bold text-gray-900 text-sm">{name}</h4>
        <p className="text-xs text-gray-500">{role}</p>
        <div className="flex text-xs text-gray-400 mt-1">
          <span>2d • </span>
          <span className="ml-1">Edited</span>
        </div>
      </div>
      <div className="ml-auto text-brand-red">
        <div className="bg-blue-50 p-1 rounded">
             <svg className="w-4 h-4 text-[#0077b5]" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
        </div>
      </div>
    </div>
    <div className="mb-4 relative">
       {/* <Quote className="absolute -top-2 -left-2 text-gray-100 w-12 h-12 -z-10" /> */}
       <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{text}</p>
    </div>
    
    <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between text-gray-500">
        <div className="flex items-center gap-1 text-xs cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition">
            <ThumbsUp size={14} /> Like
        </div>
        <div className="flex items-center gap-1 text-xs cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition">
            <MessageCircle size={14} /> Comment
        </div>
        <div className="flex items-center gap-1 text-xs cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition">
            <Share2 size={14} /> Repost
        </div>
    </div>
  </div>
);

const Testimonials: React.FC = () => {
  return (
    <Section className="bg-gray-50">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900">কর্পোরেট প্রফেশনালরা যা বলছেন</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TestimonialCard 
          name="Tanvir Ahmed"
          role="Senior HR Manager at MNC"
          img="https://picsum.photos/id/1005/200/200"
          text={`Corporate Ask এর সার্ভিস নিয়ে আমি খুবই সন্তুষ্ট। তাদের রাইটাররা জানে ঠিক কি পয়েন্টগুলো হাইলাইট করলে রিক্রুটারদের নজর কাড়া যায়। \n\nআমার সিভিটা একদম প্রফেশনাল লুকে চেঞ্জ করে দিয়েছে!`}
        />
        <TestimonialCard 
          name="Farhana Islam"
          role="Software Engineer"
          img="https://picsum.photos/id/1011/200/200"
          text={`আমার অনেক দিনের গ্যাপ ছিল জবে। ভাবছিলাম কিভাবে সেটা কভার করবো। \n\nCorporate Ask এর কনসালটেন্ট আমাকে দারুণ গাইডলাইন দিয়েছেন এবং সিভিতে গ্যাপটা পজিটিভলি উপস্থাপন করেছেন। এখন আমি নতুন জবে জয়েন করেছি!`}
        />
        <TestimonialCard 
          name="Rafiqul Islam"
          role="Marketing Specialist"
          img="https://picsum.photos/id/1025/200/200"
          text={`সোজাসাপ্টা কথা - টাকা উসুল সার্ভিস। আমি ৩ মাস ধরে চেষ্টা করেও ইন্টারভিউ পাচ্ছিলাম না। এদের সার্ভিস নেয়ার ২ সপ্তাহের মধ্যে ৩টা ইন্টারভিউ কল পেয়েছি। \n\nHighly Recommended!`}
        />
      </div>
    </Section>
  );
};

export default Testimonials;
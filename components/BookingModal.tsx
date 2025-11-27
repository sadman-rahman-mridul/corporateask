import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calculator, ArrowRight, CheckCircle, CreditCard, Send, Loader2 } from 'lucide-react';
import Button from './Button';
import { supabase } from '../lib/supabaseClient';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
  // Step 1: Info, Step 2: Price, Step 3: Payment Form, Step 4: Success
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    experience: ''
  });
  const [paymentData, setPaymentData] = useState({
    senderNumber: '',
    transId: ''
  });
  const [error, setError] = useState('');
  const [finalPrice, setFinalPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handlePaymentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateBangladeshiPhone = (phone: string) => {
    // Regex for BD phone: Starts with +8801 or 01, followed by 3-9, then 8 digits
    const bdPhoneRegex = /^(?:\+88|88)?(01[3-9]\d{8})$/;
    return bdPhoneRegex.test(phone);
  };

  const normalizePhone = (phone: string) => {
    // Remove all non-digit chars
    const digits = phone.replace(/\D/g, '');
    // If starts with 8801, take last 11
    if (digits.startsWith('8801') && digits.length === 13) {
      return digits.substring(2);
    }
    // If starts with 01, keep it (assuming 11 digits)
    if (digits.startsWith('01') && digits.length === 11) {
      return digits;
    }
    return digits; // Fallback
  };

  const handleGeneratePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      setError('আপনার নাম লিখুন (Enter your name)');
      return;
    }

    if (!validateBangladeshiPhone(formData.phone)) {
      setError('সঠিক বাংলাদেশি মোবাইল নম্বর দিন (Enter valid BD number: 01xxxxxxxxx)');
      return;
    }

    const exp = parseInt(formData.experience);
    if (isNaN(exp) || exp < 0) {
      setError('কাজের অভিজ্ঞতা সংখ্যায় লিখুন (Enter valid years of experience)');
      return;
    }

    // Calculation: 3000 + 100 * Years
    const calculatedPrice = 3000 + (100 * exp);
    setFinalPrice(calculatedPrice);
    
    const normalizedPhone = normalizePhone(formData.phone);

    // DB: Save to Hot Leads
    setLoading(true);
    try {
      const { error: dbError } = await supabase
        .from('hot_leads')
        .insert({
          name: formData.name,
          phone: normalizedPhone,
          experience: exp,
          price: calculatedPrice,
          created_at: new Date().toISOString()
        });

      if (dbError) {
        console.error('Error saving lead:', dbError);
        // We generally proceed even if tracking fails so the user can see the price
      }
      setStep(2);
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToPayment = () => {
    setStep(3);
    setError('');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateBangladeshiPhone(paymentData.senderNumber)) {
      setError('সঠিক সেন্ডার নম্বর দিন (Enter valid sender number)');
      return;
    }
    if (!paymentData.transId.trim()) {
      setError('ট্রানজেকশন আইডি দিন (Enter Transaction ID)');
      return;
    }

    setLoading(true);
    try {
      // DB: Save to Paid Customer
      const exp = parseInt(formData.experience);
      const normalizedPhone = normalizePhone(formData.phone);
      const normalizedSender = normalizePhone(paymentData.senderNumber);

      const { error: dbError } = await supabase
        .from('paidcustomer')
        .insert({
          name: formData.name,
          phone: normalizedPhone,
          experience: exp,
          price: finalPrice,
          sender_number: normalizedSender,
          trans_id: paymentData.transId,
          created_at: new Date().toISOString()
        });

      if (dbError) {
        console.error('Error saving payment:', dbError);
        setError('ডাটা সেভ করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
        setLoading(false);
        return;
      }
      
      // Success
      setStep(4);
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setStep(1);
    setFormData({ name: '', phone: '', experience: '' });
    setPaymentData({ senderNumber: '', transId: '' });
    setError('');
    onClose();
  };

  // Helper for input classes to ensure light bg with !important to override any dark mode defaults
  const inputClasses = "w-full px-4 py-3 rounded-lg border border-gray-300 !bg-white !text-gray-900 focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition-all placeholder-gray-400";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetModal}
            className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[90vh]">
              
              {/* Header */}
              <div className="bg-brand-red p-6 flex justify-between items-center text-white">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  {step === 1 && <><Calculator size={24} /> সার্ভিস বুক করুন</>}
                  {step === 2 && <><Calculator size={24} /> আপনার প্রাইসিং</>}
                  {step === 3 && <><CreditCard size={24} /> পেমেন্ট কনফার্মেশন</>}
                  {step === 4 && <><CheckCircle size={24} /> সফল!</>}
                </h2>
                <button onClick={resetModal} className="hover:bg-white/20 p-1.5 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 md:p-8 overflow-y-auto">
                {step === 1 && (
                  <form onSubmit={handleGeneratePrice} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">আপনার নাম (Name)</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={inputClasses}
                        placeholder="আপনার পূর্ণ নাম"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">মোবাইল নম্বর (Phone)</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={inputClasses}
                        placeholder="01xxxxxxxxx"
                      />
                      <p className="text-xs text-gray-500 mt-1">শুধুমাত্র বাংলাদেশি নম্বর</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">কাজের অভিজ্ঞতা (Years of Experience)</label>
                      <input
                        type="number"
                        name="experience"
                        min="0"
                        value={formData.experience}
                        onChange={handleInputChange}
                        className={inputClasses}
                        placeholder="যেমন: 2"
                      />
                    </div>

                    {error && (
                      <div className="bg-red-50 text-brand-red text-sm p-3 rounded-lg border border-red-100">
                        ⚠️ {error}
                      </div>
                    )}

                    <Button type="submit" fullWidth disabled={loading} className="mt-4 font-bold text-lg disabled:opacity-70">
                      {loading ? (
                        <><Loader2 className="animate-spin mr-2" size={20} /> Processing...</>
                      ) : (
                        <>Generate My Price <ArrowRight size={20} className="ml-2" /></>
                      )}
                    </Button>
                  </form>
                )}

                {step === 2 && (
                  <div className="text-center space-y-6">
                    <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                      <p className="text-gray-600 mb-2 font-medium">আপনার জন্য নির্ধারিত সার্ভিস চার্জ</p>
                      <div className="text-5xl font-bold text-brand-red">
                        ৳ {finalPrice.toLocaleString()}
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        Calculation: 3000 + (100 × {formData.experience} Years)
                      </p>
                    </div>

                    <div className="space-y-3 text-left bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-gray-500">Name:</span>
                        <span className="font-medium text-gray-900">{formData.name}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-gray-500">Phone:</span>
                        <span className="font-medium text-gray-900">{formData.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Experience:</span>
                        <span className="font-medium text-gray-900">{formData.experience} Years</span>
                      </div>
                    </div>

                    <Button 
                      fullWidth 
                      onClick={handleProceedToPayment} 
                      className="text-lg py-4 shadow-xl"
                    >
                      Proceed to Payment
                    </Button>
                    
                    <button 
                      onClick={() => setStep(1)} 
                      className="text-sm text-gray-500 hover:text-brand-red underline"
                    >
                      Back to details
                    </button>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-center">
                        <p className="text-gray-900 font-bold text-lg mb-1">01681742043</p>
                        <p className="text-gray-700 text-sm">
                            এই নম্বরে বিকাশ/নগদে Send Money করুন, <br/>
                            <span className="font-bold text-brand-red text-base">{finalPrice.toLocaleString()} টাকা!</span>
                        </p>
                    </div>

                    <form onSubmit={handlePaymentSubmit} className="space-y-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">কোন নম্বর থেকে সেন্ড মানি করেছেন?</label>
                          <input
                            type="tel"
                            name="senderNumber"
                            value={paymentData.senderNumber}
                            onChange={handlePaymentInputChange}
                            className={inputClasses}
                            placeholder="01xxxxxxxxx"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Trans ID (Transaction ID)</label>
                          <input
                            type="text"
                            name="transId"
                            value={paymentData.transId}
                            onChange={handlePaymentInputChange}
                            className={inputClasses}
                            placeholder="Example: 8J7D6G5H"
                          />
                        </div>

                        {error && (
                          <div className="bg-red-50 text-brand-red text-sm p-3 rounded-lg border border-red-100">
                            ⚠️ {error}
                          </div>
                        )}

                        <Button type="submit" fullWidth disabled={loading} className="mt-2 font-bold text-lg disabled:opacity-70">
                          {loading ? (
                            <><Loader2 className="animate-spin mr-2" size={20} /> Submitting...</>
                          ) : (
                            <>Submit <Send size={18} className="ml-2" /></>
                          )}
                        </Button>
                        
                        <div className="text-center">
                            <button 
                              type="button"
                              onClick={() => setStep(2)} 
                              className="text-sm text-gray-500 hover:text-brand-red underline"
                            >
                              Back
                            </button>
                        </div>
                    </form>
                  </div>
                )}

                {step === 4 && (
                  <div className="text-center py-8">
                     <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
                     >
                        <CheckCircle size={40} />
                     </motion.div>
                     
                     <h3 className="text-2xl font-bold text-gray-900 mb-3">ধন্যবাদ!</h3>
                     <p className="text-gray-600 text-lg">
                        Our Client Team will reach out to you soon.
                     </p>

                     <Button onClick={resetModal} variant="outline" className="mt-8">
                        Close Window
                     </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;
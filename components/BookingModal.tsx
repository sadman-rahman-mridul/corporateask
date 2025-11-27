import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calculator, ArrowRight, CheckCircle, CreditCard, Send, Loader2, Tag } from 'lucide-react';
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
    experience: '',
    coupon: ''
  });
  const [paymentData, setPaymentData] = useState({
    senderNumber: '',
    transId: ''
  });
  const [error, setError] = useState('');
  const [finalPrice, setFinalPrice] = useState(0);
  const [basePrice, setBasePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
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
    const bdPhoneRegex = /^(?:\+88|88)?(01[3-9]\d{8})$/;
    return bdPhoneRegex.test(phone);
  };

  const normalizePhone = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    if (digits.startsWith('8801') && digits.length === 13) {
      return digits.substring(2);
    }
    if (digits.startsWith('01') && digits.length === 11) {
      return digits;
    }
    return digits;
  };

  const handleGeneratePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedCoupon(null);
    setDiscount(0);
    
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

    setLoading(true);

    // Coupon Validation
    let couponDiscount = 0;
    let couponData = null;

    if (formData.coupon.trim()) {
        const { data, error: couponError } = await supabase
            .from('coupons')
            .select('*')
            .eq('code', formData.coupon.trim().toUpperCase())
            .single();
        
        if (couponError || !data) {
            setError('Coupon is invalid (কুপনটি সঠিক নয়)');
            setLoading(false);
            return;
        }

        // Check if expired
        if (new Date(data.expiry_date) < new Date()) {
            setError('Coupon is invalid (expired)');
            setLoading(false);
            return;
        }

        // Check limit
        if (data.usage_count >= data.usage_limit) {
            setError('Coupon limit reached (কুপনটির মেয়াদ শেষ)');
            setLoading(false);
            return;
        }

        couponData = data;
        couponDiscount = Number(data.discount_amount);
    }

    // Calculation: 3000 + 100 * Years
    const calculatedBasePrice = 3000 + (100 * exp);
    const priceAfterDiscount = Math.max(0, calculatedBasePrice - couponDiscount);
    
    setBasePrice(calculatedBasePrice);
    setFinalPrice(priceAfterDiscount);
    setDiscount(couponDiscount);
    setAppliedCoupon(couponData);
    
    const normalizedPhone = normalizePhone(formData.phone);

    // DB: Save to Hot Leads
    try {
      const { error: dbError } = await supabase
        .from('hot_leads')
        .insert({
          name: formData.name,
          phone: normalizedPhone,
          experience: exp,
          price: priceAfterDiscount,
          created_at: new Date().toISOString()
        });

      if (dbError) {
        console.error('Error saving lead:', dbError);
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
      const exp = parseInt(formData.experience);
      const normalizedPhone = normalizePhone(formData.phone);
      const normalizedSender = normalizePhone(paymentData.senderNumber);

      // 1. Insert into Paid Customer
      const { error: dbError } = await supabase
        .from('paidcustomer')
        .insert({
          name: formData.name,
          phone: normalizedPhone,
          experience: exp,
          price: finalPrice,
          sender_number: normalizedSender,
          trans_id: paymentData.transId,
          coupon_code: appliedCoupon ? appliedCoupon.code : null,
          created_at: new Date().toISOString()
        });

      if (dbError) throw dbError;

      // 2. Increment Coupon Usage
      if (appliedCoupon) {
          await supabase.rpc('increment_coupon_usage', { coupon_id: appliedCoupon.id })
          // If RPC doesn't exist (likely), fallback to manual update
          // This is a bit race-condition prone but ok for small scale
          const { data: currentCoupon } = await supabase.from('coupons').select('usage_count').eq('id', appliedCoupon.id).single();
          if (currentCoupon) {
              await supabase.from('coupons').update({ usage_count: currentCoupon.usage_count + 1 }).eq('id', appliedCoupon.id);
          }
      }

      // 3. Remove from Hot Leads (as they are now paid)
      await supabase.from('hot_leads').delete().eq('phone', normalizedPhone);
      
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
    setFormData({ name: '', phone: '', experience: '', coupon: '' });
    setPaymentData({ senderNumber: '', transId: '' });
    setError('');
    onClose();
  };

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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">কুপন কোড (যদি থাকে)</label>
                        <div className="relative">
                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                name="coupon"
                                value={formData.coupon}
                                onChange={handleInputChange}
                                className={`${inputClasses} pl-10`}
                                placeholder="COUPON123"
                            />
                        </div>
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
                    <div className="bg-green-50 p-6 rounded-xl border border-green-100 relative overflow-hidden">
                      {discount > 0 && (
                          <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                              COUPON APPLIED
                          </div>
                      )}
                      
                      <p className="text-gray-600 mb-2 font-medium">আপনার জন্য নির্ধারিত সার্ভিস চার্জ</p>
                      
                      {discount > 0 ? (
                          <div className="flex flex-col items-center">
                              <span className="text-gray-400 line-through text-lg">৳ {basePrice.toLocaleString()}</span>
                              <div className="text-5xl font-bold text-brand-red">
                                ৳ {finalPrice.toLocaleString()}
                              </div>
                              <span className="text-green-600 font-bold text-sm mt-1">You saved ৳ {discount.toLocaleString()}!</span>
                          </div>
                      ) : (
                          <div className="text-5xl font-bold text-brand-red">
                            ৳ {finalPrice.toLocaleString()}
                          </div>
                      )}
                      
                      <p className="text-xs text-gray-400 mt-2">
                        Calculation: 3000 + (100 × {formData.experience} Years) {discount > 0 ? `- ৳${discount} Coupon` : ''}
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
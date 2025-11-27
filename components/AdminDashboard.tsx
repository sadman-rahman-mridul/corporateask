import React, { useState, useEffect } from 'react';
import { 
  Users, DollarSign, FileText, Settings, Download, Search, 
  CheckCircle, Clock, XCircle, MoreHorizontal, UserPlus, Calendar,
  TrendingUp, Lock, Menu, X, Ticket, Trash2, Filter
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import Button from './Button';

interface AdminDashboardProps {
  user: { role: string; username: string };
  onLogout: () => void;
}

type TimeFilter = 'all' | 'year' | 'month' | 'week' | 'today';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'hot_leads' | 'paid_customers' | 'users' | 'add_admin' | 'coupons'>('hot_leads');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newAdminData, setNewAdminData] = useState({ username: '', password: '' });
  
  // Coupon State
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount_amount: '',
    discount_type: 'fixed', // 'fixed' | 'percentage'
    usage_limit: '',
    expiry_date: '',
    applicable_service: 'Resume Writing' // Default
  });
  
  // Mobile Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Sorting & Filtering
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  // Consistent Input Styling matching BookingModal
  const inputClasses = "w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition-all placeholder-gray-400";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

  // Fetch data when tab changes
  useEffect(() => {
    if (activeTab === 'add_admin') return;
    fetchData();
    // Close sidebar on mobile when tab changes
    setIsSidebarOpen(false);
    setSearchTerm('');
    setSortConfig(null);
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    let tableName = '';
    if (activeTab === 'hot_leads') tableName = 'hot_leads';
    if (activeTab === 'paid_customers') tableName = 'paidcustomer';
    if (activeTab === 'users') tableName = 'users';
    if (activeTab === 'coupons') tableName = 'coupons';

    if (tableName) {
      const { data: result, error } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && result) {
        setData(result);
      }
    }
    setLoading(false);
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getFilteredAndSortedData = () => {
    let processedData = [...data];

    // 1. Time Filtering (mainly for paid customers)
    if (activeTab === 'paid_customers' && timeFilter !== 'all') {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      processedData = processedData.filter(item => {
        const itemDate = new Date(item.created_at);
        if (timeFilter === 'today') return itemDate >= startOfDay;
        if (timeFilter === 'week') {
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - 7);
            return itemDate >= startOfWeek;
        }
        if (timeFilter === 'month') {
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            return itemDate >= startOfMonth;
        }
        if (timeFilter === 'year') {
            const startOfYear = new Date(now.getFullYear(), 0, 1);
            return itemDate >= startOfYear;
        }
        return true;
      });
    }

    // 2. Search Filtering
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      processedData = processedData.filter(item => 
        Object.values(item).some(val => 
          String(val).toLowerCase().includes(lowerTerm)
        )
      );
    }

    // 3. Sorting
    if (sortConfig) {
      processedData.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return processedData;
  };

  const filteredData = getFilteredAndSortedData();

  const calculateTotalSales = () => {
    return filteredData.reduce((total, item) => total + (Number(item.price) || 0), 0);
  };

  const handleExportCSV = () => {
    if (filteredData.length === 0) return;
    const headers = Object.keys(filteredData[0]);
    const csvContent = [
      headers.join(','),
      ...filteredData.map(row => headers.map(fieldName => 
        JSON.stringify(row[fieldName], (key, value) => value === null ? '' : value)
      ).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${activeTab}_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStatusUpdate = async (id: number, field: string, value: any) => {
    setData(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
    await supabase.from('paidcustomer').update({ [field]: value }).eq('id', id);
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('users').insert({
      username: newAdminData.username,
      password: newAdminData.password,
      role: 'admin'
    });
    setLoading(false);
    if (!error) {
      alert('Admin added successfully!');
      setNewAdminData({ username: '', password: '' });
    } else {
      alert('Error adding admin');
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Basic validation
    if (!newCoupon.code || !newCoupon.discount_amount || !newCoupon.expiry_date) {
        alert("Please fill all required fields");
        setLoading(false);
        return;
    }

    const { error } = await supabase.from('coupons').insert({
        code: newCoupon.code.toUpperCase(),
        discount_amount: Number(newCoupon.discount_amount),
        usage_limit: Number(newCoupon.usage_limit),
        expiry_date: new Date(newCoupon.expiry_date).toISOString(),
        is_active: true
    });

    if (error) {
        console.error(error);
        alert('Error creating coupon: ' + error.message);
    } else {
        alert('Coupon created successfully!');
        setNewCoupon({
            code: '',
            discount_amount: '',
            discount_type: 'fixed',
            usage_limit: '',
            expiry_date: '',
            applicable_service: 'Resume Writing'
        });
        fetchData(); // Refresh list
    }
    setLoading(false);
  };

  const handleDeleteCoupon = async (id: number) => {
      if(!confirm("Are you sure you want to delete this coupon?")) return;
      
      const { error } = await supabase.from('coupons').delete().eq('id', id);
      if (!error) {
          setData(prev => prev.filter(item => item.id !== id));
      } else {
          alert("Failed to delete coupon: " + (error?.message || "Unknown error"));
      }
  };

  const renderSidebarItem = (id: typeof activeTab, icon: React.ReactNode, label: string) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
        activeTab === id 
          ? 'bg-brand-red text-white shadow-md' 
          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  const SortIcon = ({ column }: { column: string }) => {
    if (sortConfig?.key !== column) return <div className="w-4 h-4 opacity-0 group-hover:opacity-30 ml-1 inline-block">↕</div>;
    return <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans relative overflow-hidden">
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        absolute md:static inset-y-0 left-0 z-30
        w-64 bg-gray-900 text-white flex flex-col flex-shrink-0
        transform transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
           <div>
              <h2 className="text-xl font-bold tracking-tight">Admin<span className="text-brand-red">Panel</span></h2>
              <p className="text-xs text-gray-500 mt-1">Welcome, {user.username}</p>
           </div>
           <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
             <X size={20} />
           </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {renderSidebarItem('hot_leads', <FileText size={18} />, 'Hot Leads')}
          {renderSidebarItem('paid_customers', <DollarSign size={18} />, 'Paid Customers')}
          {renderSidebarItem('coupons', <Ticket size={18} />, 'Coupons')}
          {renderSidebarItem('users', <Users size={18} />, 'Registered Users')}
          {renderSidebarItem('add_admin', <Settings size={18} />, 'Add Admin')}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-2 justify-center px-4 py-2 border border-gray-700 rounded-md text-sm hover:bg-gray-800 transition"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Top Header */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 md:px-8 z-10 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-4">
             <button 
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
             >
                <Menu size={24} />
             </button>

             <h1 className="text-lg md:text-xl font-bold text-gray-800 capitalize flex items-center gap-2">
                {activeTab.replace('_', ' ')}
                <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs">
                   {filteredData.length}
                </span>
             </h1>
          </div>

          <div className="flex items-center gap-3">
              {activeTab !== 'add_admin' && (
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 w-48 lg:w-64"
                    />
                </div>
              )}
              {activeTab !== 'add_admin' && (
                 <button 
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 text-sm text-green-700 bg-green-50 hover:bg-green-100 px-3 py-2 md:px-4 md:py-2 rounded-md transition border border-green-200"
                 >
                    <Download size={16} /> <span className="hidden md:inline">Export CSV</span>
                 </button>
              )}
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-auto p-4 md:p-8 bg-gray-50 w-full">
          
          {/* Total Sales Section */}
          {activeTab === 'paid_customers' && (
            <div className="mb-8">
               <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-end mb-6">
                  {/* Sales Card */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 w-full xl:w-auto min-w-[300px]">
                      <div className="flex justify-between items-start mb-2">
                         <div>
                            <p className="text-sm font-medium text-gray-500">Total Sales Revenue</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-1">
                               ৳ {calculateTotalSales().toLocaleString()}
                            </h3>
                         </div>
                         <div className="p-2 bg-green-50 rounded-lg text-green-600">
                            <TrendingUp size={24} />
                         </div>
                      </div>
                  </div>

                  {/* Timeline Bar */}
                  <div className="bg-white p-1.5 rounded-lg border border-gray-200 shadow-sm flex flex-wrap items-center gap-1 w-full xl:w-auto overflow-x-auto">
                      {(['all', 'year', 'month', 'week', 'today'] as TimeFilter[]).map((filter) => (
                         <button
                           key={filter}
                           onClick={() => setTimeFilter(filter)}
                           className={`px-3 py-2 md:px-4 md:py-2 rounded-md text-sm font-medium capitalize transition-all whitespace-nowrap flex-1 md:flex-none ${
                              timeFilter === filter 
                                ? 'bg-brand-red text-white shadow-sm' 
                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                           }`}
                         >
                            {filter === 'all' ? 'All Time' : filter}
                         </button>
                      ))}
                  </div>
               </div>
            </div>
          )}

          {loading && activeTab !== 'add_admin' && (
             <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
             </div>
          )}

          {!loading && activeTab === 'coupons' && (
             <div className="space-y-8">
                {/* Create Coupon Form */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                   <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                       <Ticket size={24} className="text-brand-red" /> Create New Coupon
                   </h3>
                   <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       <div>
                           <label className={labelClasses}>Coupon Code</label>
                           <input 
                              type="text" 
                              required
                              placeholder="e.g., SUMMER25"
                              value={newCoupon.code}
                              onChange={e => setNewCoupon({...newCoupon, code: e.target.value})}
                              className={inputClasses}
                           />
                       </div>
                       <div>
                           <label className={labelClasses}>Discount Amount</label>
                           <input 
                              type="number" 
                              required
                              placeholder="Amount (e.g., 500)"
                              value={newCoupon.discount_amount}
                              onChange={e => setNewCoupon({...newCoupon, discount_amount: e.target.value})}
                              className={inputClasses}
                           />
                       </div>
                       <div>
                           <label className={labelClasses}>Discount Type</label>
                           <select 
                              className={inputClasses}
                              value={newCoupon.discount_type}
                              onChange={e => setNewCoupon({...newCoupon, discount_type: e.target.value})}
                           >
                               <option value="fixed">Fixed Amount (৳)</option>
                               {/* <option value="percentage">Percentage (%)</option> */}
                           </select>
                       </div>
                       <div>
                           <label className={labelClasses}>Usage Limit (Users)</label>
                           <input 
                              type="number" 
                              required
                              placeholder="e.g., 100"
                              value={newCoupon.usage_limit}
                              onChange={e => setNewCoupon({...newCoupon, usage_limit: e.target.value})}
                              className={inputClasses}
                           />
                       </div>
                       <div>
                           <label className={labelClasses}>Expiry Date</label>
                           <input 
                              type="date" 
                              required
                              value={newCoupon.expiry_date}
                              onChange={e => setNewCoupon({...newCoupon, expiry_date: e.target.value})}
                              className={inputClasses}
                           />
                       </div>
                       <div>
                           <label className={labelClasses}>Service</label>
                           <select 
                              className={inputClasses}
                              value={newCoupon.applicable_service}
                              onChange={e => setNewCoupon({...newCoupon, applicable_service: e.target.value})}
                           >
                               <option>Resume Writing</option>
                           </select>
                       </div>
                       <div className="md:col-span-2 lg:col-span-3 pt-2">
                           <Button type="submit" disabled={loading} className="w-full md:w-auto font-bold px-8 shadow-md">
                             Create Coupon
                           </Button>
                       </div>
                   </form>
                </div>

                {/* Coupons List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <h3 className="font-bold text-gray-800">Active Coupons</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3">Code</th>
                                    <th className="px-6 py-3">Discount</th>
                                    <th className="px-6 py-3">Usage</th>
                                    <th className="px-6 py-3">Expiry</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map(coupon => (
                                    <tr key={coupon.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-bold text-gray-900">{coupon.code}</td>
                                        <td className="px-6 py-4 text-brand-red font-medium">৳ {coupon.discount_amount}</td>
                                        <td className="px-6 py-4">
                                            <span className={`${coupon.usage_count >= coupon.usage_limit ? 'text-red-500 font-bold' : 'text-gray-600'}`}>
                                                {coupon.usage_count} / {coupon.usage_limit}
                                            </span>
                                            <span className="text-xs text-gray-400 block">Redemptions</span>
                                        </td>
                                        <td className="px-6 py-4">{new Date(coupon.expiry_date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            {new Date(coupon.expiry_date) < new Date() ? (
                                                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Expired</span>
                                            ) : coupon.usage_count >= coupon.usage_limit ? (
                                                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Limit Reached</span>
                                            ) : (
                                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Active</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => handleDeleteCoupon(coupon.id)}
                                                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition"
                                                title="Delete Coupon"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredData.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-400">No coupons found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
             </div>
          )}

          {!loading && activeTab !== 'add_admin' && activeTab !== 'coupons' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-4 min-w-[120px] cursor-pointer hover:text-gray-900 group" onClick={() => handleSort('created_at')}>
                          <div className="flex items-center">Date <SortIcon column="created_at" /></div>
                      </th>
                      <th className="px-6 py-4 min-w-[150px] cursor-pointer hover:text-gray-900 group" onClick={() => handleSort(activeTab === 'users' ? 'username' : 'name')}>
                          <div className="flex items-center">Name <SortIcon column={activeTab === 'users' ? 'username' : 'name'} /></div>
                      </th>
                      {activeTab !== 'users' && <th className="px-6 py-4 min-w-[140px]">Phone</th>}
                      {activeTab === 'users' && <th className="px-6 py-4">Username</th>}
                      {activeTab === 'users' && <th className="px-6 py-4">Password</th>}
                      {activeTab === 'users' && <th className="px-6 py-4">Role</th>}
                      {activeTab !== 'users' && <th className="px-6 py-4 min-w-[100px] cursor-pointer hover:text-gray-900 group" onClick={() => handleSort('price')}>
                          <div className="flex items-center">Price <SortIcon column="price" /></div>
                      </th>}
                      {activeTab === 'paid_customers' && (
                         <>
                           <th className="px-6 py-4 min-w-[140px]">Coupon</th>
                           <th className="px-6 py-4 min-w-[140px]">Sender Number</th>
                           <th className="px-6 py-4 min-w-[140px]">Trans ID</th>
                           <th className="px-6 py-4 min-w-[140px]">Verification</th>
                           <th className="px-6 py-4 min-w-[180px]">Work Status</th>
                         </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="px-6 py-12 text-center text-gray-400">
                           <div className="flex flex-col items-center gap-2">
                              <Search size={32} className="opacity-20" />
                              <p>No data found matching your filters</p>
                           </div>
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((item) => (
                        <tr key={item.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                               <Calendar size={14} className="text-gray-400" />
                               {new Date(item.created_at).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-400 pl-6">
                               {new Date(item.created_at).toLocaleTimeString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-900">
                            {item.name || item.username}
                          </td>
                          {activeTab !== 'users' && (
                            <td className="px-6 py-4 font-mono whitespace-nowrap">{item.phone}</td>
                          )}
                          {activeTab === 'users' && (
                            <td className="px-6 py-4">{item.username}</td>
                          )}
                          {activeTab === 'users' && (
                             <td className="px-6 py-4">
                                <div className="flex items-center gap-2 text-gray-600 bg-gray-100 px-2 py-1 rounded w-fit">
                                  <Lock size={12} />
                                  <span className="font-mono text-xs">{item.password}</span>
                                </div>
                             </td>
                          )}
                          {activeTab === 'users' && (
                             <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${item.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                   {item.role}
                                </span>
                             </td>
                          )}
                          {activeTab !== 'users' && (
                            <td className="px-6 py-4 font-bold text-brand-red whitespace-nowrap">৳ {item.price}</td>
                          )}
                          
                          {activeTab === 'paid_customers' && (
                            <>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {item.coupon_code ? (
                                    <span className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded text-xs font-bold border border-yellow-100">
                                        {item.coupon_code}
                                    </span>
                                ) : (
                                    <span className="text-gray-400 text-xs">-</span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="font-bold bg-gray-100 px-2 py-1 rounded-md w-fit text-xs text-gray-700">
                                  {item.sender_number}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-gray-600 font-mono text-xs border border-gray-200 px-2 py-1 rounded bg-white w-fit">
                                  {item.trans_id}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <button
                                  onClick={() => handleStatusUpdate(item.id, 'payment_verified', !item.payment_verified)}
                                  className={`w-full md:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold border transition-all shadow-sm active:scale-95 ${
                                    item.payment_verified 
                                      ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' 
                                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                  }`}
                                >
                                  {item.payment_verified ? <CheckCircle size={14}/> : <Clock size={14}/>}
                                  {item.payment_verified ? 'Verified' : 'Verify Now'}
                                </button>
                              </td>
                              <td className="px-6 py-4">
                                <select 
                                  value={item.work_status || 'Pending'}
                                  onChange={(e) => handleStatusUpdate(item.id, 'work_status', e.target.value)}
                                  className={`border text-xs rounded-lg block w-full px-3 py-2 outline-none focus:ring-2 focus:ring-brand-red/20 cursor-pointer shadow-sm transition-colors ${
                                    item.work_status === 'Delivery Done' ? 'bg-green-50 border-green-200 text-green-700 font-bold' :
                                    item.work_status === 'Pending' ? 'bg-gray-50 border-gray-300 text-gray-600' : 'bg-white border-gray-300 text-gray-900'
                                  }`}
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Meeting Done">Meeting Done</option>
                                  <option value="Conversion Done">Conversion Done</option>
                                  <option value="Delivery Done">Delivery Done</option>
                                </select>
                              </td>
                            </>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'add_admin' && (
            <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100 mt-10">
               <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                 <UserPlus size={24} className="text-brand-red" />
                 Add New Admin
               </h3>
               <form onSubmit={handleAddAdmin} className="space-y-6">
                  <div>
                    <label className={labelClasses}>Username</label>
                    <input 
                      type="text" 
                      className={inputClasses}
                      value={newAdminData.username}
                      onChange={e => setNewAdminData({...newAdminData, username: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>Password</label>
                    <input 
                      type="password" 
                      className={inputClasses}
                      value={newAdminData.password}
                      onChange={e => setNewAdminData({...newAdminData, password: e.target.value})}
                      required
                    />
                  </div>
                  <Button type="submit" fullWidth disabled={loading} className="mt-4 font-bold shadow-md">
                     {loading ? 'Adding...' : 'Add Admin'}
                  </Button>
               </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
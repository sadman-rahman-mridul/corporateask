import React, { useState, useEffect } from 'react';
import { 
  Users, DollarSign, FileText, Settings, Download, Search, 
  CheckCircle, Clock, XCircle, MoreHorizontal, UserPlus, Calendar,
  TrendingUp, Lock
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import Button from './Button';

interface AdminDashboardProps {
  user: { role: string; username: string };
  onLogout: () => void;
}

type TimeFilter = 'all' | 'year' | 'month' | 'week' | 'today';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'hot_leads' | 'paid_customers' | 'users' | 'add_admin'>('hot_leads');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newAdminData, setNewAdminData] = useState({ username: '', password: '' });
  
  // Paid Customers Filters
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');

  // Fetch data when tab changes
  useEffect(() => {
    if (activeTab === 'add_admin') return;
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    let tableName = '';
    if (activeTab === 'hot_leads') tableName = 'hot_leads';
    if (activeTab === 'paid_customers') tableName = 'paidcustomer';
    if (activeTab === 'users') tableName = 'users';

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

  const getFilteredData = () => {
    if (activeTab !== 'paid_customers' || timeFilter === 'all') return data;

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return data.filter(item => {
      const itemDate = new Date(item.created_at);
      
      if (timeFilter === 'today') {
        return itemDate >= startOfDay;
      }
      if (timeFilter === 'week') {
        const startOfWeek = new Date(now.setDate(now.getDate() - 7));
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
  };

  const filteredData = getFilteredData();

  const calculateTotalSales = () => {
    return filteredData.reduce((total, item) => total + (Number(item.price) || 0), 0);
  };

  const handleExportCSV = () => {
    if (filteredData.length === 0) return;
    
    // Get headers
    const headers = Object.keys(filteredData[0]);
    
    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...filteredData.map(row => headers.map(fieldName => 
        JSON.stringify(row[fieldName], (key, value) => value === null ? '' : value)
      ).join(','))
    ].join('\n');

    // Create download link
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
    // Optimistic update
    setData(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));

    await supabase
      .from('paidcustomer')
      .update({ [field]: value })
      .eq('id', id);
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

  // Render Helpers
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

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-gray-800">
           <h2 className="text-xl font-bold tracking-tight">Admin<span className="text-brand-red">Panel</span></h2>
           <p className="text-xs text-gray-500 mt-1">Welcome, {user.username}</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {renderSidebarItem('hot_leads', <FileText size={18} />, 'Hot Leads')}
          {renderSidebarItem('paid_customers', <DollarSign size={18} />, 'Paid Customers')}
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
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8 z-10 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800 capitalize flex items-center gap-2">
            {activeTab.replace('_', ' ')}
            <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs">
               {activeTab === 'paid_customers' ? filteredData.length : data.length}
            </span>
          </h1>
          {activeTab !== 'add_admin' && (
             <button 
                onClick={handleExportCSV}
                className="flex items-center gap-2 text-sm text-green-700 bg-green-50 hover:bg-green-100 px-4 py-2 rounded-md transition border border-green-200"
             >
                <Download size={16} /> Export CSV
             </button>
          )}
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-auto p-8 bg-gray-50">
          
          {/* Total Sales Section */}
          {activeTab === 'paid_customers' && (
            <div className="mb-8">
               <div className="flex flex-col md:flex-row gap-6 items-start md:items-end mb-6">
                  {/* Sales Card */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 min-w-[300px]">
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
                      <p className="text-xs text-gray-400">Based on verified and pending payments</p>
                  </div>

                  {/* Timeline Bar */}
                  <div className="bg-white p-1.5 rounded-lg border border-gray-200 shadow-sm flex items-center">
                      {(['all', 'year', 'month', 'week', 'today'] as TimeFilter[]).map((filter) => (
                         <button
                           key={filter}
                           onClick={() => setTimeFilter(filter)}
                           className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-all ${
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

          {!loading && activeTab !== 'add_admin' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Name</th>
                      {activeTab !== 'users' && <th className="px-6 py-4">Phone</th>}
                      {activeTab === 'users' && <th className="px-6 py-4">Username</th>}
                      {activeTab === 'users' && <th className="px-6 py-4">Password</th>}
                      {activeTab === 'users' && <th className="px-6 py-4">Role</th>}
                      {activeTab !== 'users' && <th className="px-6 py-4">Price</th>}
                      {activeTab === 'paid_customers' && (
                         <>
                           <th className="px-6 py-4">Sender / TransID</th>
                           <th className="px-6 py-4">Verification</th>
                           <th className="px-6 py-4">Work Status</th>
                         </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                           <div className="flex flex-col items-center gap-2">
                              <Search size={32} className="opacity-20" />
                              <p>No data found for this period</p>
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
                            <td className="px-6 py-4 font-mono">{item.phone}</td>
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
                            <td className="px-6 py-4 font-bold text-brand-red">৳ {item.price}</td>
                          )}
                          
                          {activeTab === 'paid_customers' && (
                            <>
                              <td className="px-6 py-4">
                                <div className="text-xs space-y-1">
                                  <div className="font-bold bg-gray-100 px-2 py-0.5 rounded w-fit">{item.sender_number}</div>
                                  <div className="text-gray-500 font-mono">TRX: {item.trans_id}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <button
                                  onClick={() => handleStatusUpdate(item.id, 'payment_verified', !item.payment_verified)}
                                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                                    item.payment_verified 
                                      ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' 
                                      : 'bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100'
                                  }`}
                                >
                                  {item.payment_verified ? <CheckCircle size={14}/> : <Clock size={14}/>}
                                  {item.payment_verified ? 'Verified' : 'Pending'}
                                </button>
                              </td>
                              <td className="px-6 py-4">
                                <select 
                                  value={item.work_status || 'Pending'}
                                  onChange={(e) => handleStatusUpdate(item.id, 'work_status', e.target.value)}
                                  className={`border text-xs rounded-lg block w-full p-2 outline-none focus:ring-2 focus:ring-brand-red/20 ${
                                    item.work_status === 'Delivery Done' ? 'bg-green-50 border-green-200 text-green-700 font-bold' :
                                    item.work_status === 'Pending' ? 'bg-gray-50 border-gray-300' : 'bg-white border-gray-300'
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
               <form onSubmit={handleAddAdmin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none"
                      value={newAdminData.username}
                      onChange={e => setNewAdminData({...newAdminData, username: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input 
                      type="password" 
                      className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none"
                      value={newAdminData.password}
                      onChange={e => setNewAdminData({...newAdminData, password: e.target.value})}
                      required
                    />
                  </div>
                  <Button type="submit" fullWidth disabled={loading} className="mt-4">
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
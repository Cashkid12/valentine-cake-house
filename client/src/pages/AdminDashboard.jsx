import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import AddCakeForm from '../components/AddCakeForm.jsx';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [customRequests, setCustomRequests] = useState([]);
  const [cakes, setCakes] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user, token, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // API call function with authentication
  const apiCall = async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers,
        },
      });

      if (response.status === 401) {
        logout();
        navigate('/admin/login');
        throw new Error('Unauthorized');
      }

      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('API Call Error:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    fetchStats();
    fetchRecentActivity();
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'custom') fetchCustomRequests();
    if (activeTab === 'cakes') fetchCakes();
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await apiCall('https://valentine-cake-house.onrender.com/api/admin/stats');
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      // Fetch recent orders and custom requests for activity feed
      const [ordersData, requestsData] = await Promise.all([
        apiCall('https://valentine-cake-house.onrender.com/api/admin/orders?limit=5'),
        apiCall('https://valentine-cake-house.onrender.com/api/admin/custom-requests?limit=5')
      ]);

      const activities = [
        ...(ordersData.orders || []).map(order => ({
          type: 'order',
          id: order._id,
          title: `New order from ${order.customerName}`,
          description: `Order #${order._id?.slice(-6)} - KSh ${order.totalAmount?.toLocaleString()}`,
          status: order.status,
          timestamp: order.createdAt,
          icon: '📦'
        })),
        ...(requestsData.requests || []).map(request => ({
          type: 'custom_request',
          id: request._id,
          title: `Custom cake request from ${request.customerName}`,
          description: `${request.occasion} cake - ${request.cakeSize}`,
          status: request.status,
          timestamp: request.createdAt,
          icon: '🎨'
        }))
      ];

      // Sort by timestamp and take latest 5
      activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setRecentActivity(activities.slice(0, 5));
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      setDataLoading(true);
      const data = await apiCall('https://valentine-cake-house.onrender.com/api/admin/orders');
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setDataLoading(false);
    }
  };

  const fetchCustomRequests = async () => {
    try {
      setDataLoading(true);
      const data = await apiCall('https://valentine-cake-house.onrender.com/api/admin/custom-requests');
      setCustomRequests(data.requests || []);
    } catch (error) {
      console.error('Error fetching custom requests:', error);
      setCustomRequests([]);
    } finally {
      setDataLoading(false);
    }
  };

  const fetchCakes = async () => {
    try {
      setDataLoading(true);
      const data = await apiCall('https://valentine-cake-house.onrender.com/api/admin/cakes');
      setCakes(data.cakes || []);
    } catch (error) {
      console.error('Error fetching cakes:', error);
      setCakes([]);
    } finally {
      setDataLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await apiCall(`https://valentine-cake-house.onrender.com/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      fetchOrders();
      fetchStats();
      fetchRecentActivity();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const updateRequestStatus = async (requestId, status) => {
    try {
      await apiCall(`https://valentine-cake-house.onrender.com/api/admin/custom-requests/${requestId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      fetchCustomRequests();
      fetchStats();
      fetchRecentActivity();
    } catch (error) {
      console.error('Error updating request status:', error);
    }
  };

  const handleCakeAdded = (newCake) => {
    setCakes(prev => [newCake, ...prev]);
    fetchStats();
    fetchRecentActivity();
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-purple-100 text-purple-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'quoted': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen section-sweet flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-berry-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-2xl text-white">V</span>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen section-sweet pb-20 md:pb-0">
      {/* Floating decorative elements */}
      <div className="fixed top-20 left-10 w-6 h-6 bg-gradient-to-r from-primary-400 to-berry-400 rounded-full opacity-20 animate-float hidden md:block"></div>
      <div className="fixed top-40 right-20 w-8 h-8 bg-gradient-to-r from-gold-300 to-gold-400 rounded-full opacity-30 animate-float hidden md:block" style={{animationDelay: '1s'}}></div>

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-sm relative z-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-primary-500 to-berry-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <div>
                <h1 className="cursive text-xl md:text-2xl text-primary-700">Admin Dashboard</h1>
                <p className="text-gray-600 text-xs md:text-sm font-medium">
                  Welcome, {user?.username} <span className="text-primary-600">({user?.role})</span>
                </p>
              </div>
            </div>
            
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <Link 
                to="/" 
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors hover-lift px-4 py-2 rounded-xl bg-white/50 backdrop-blur-sm border border-white/20"
                target="_blank"
              >
                🌐 View Website
              </Link>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-berry-500 text-white px-4 md:px-6 py-2 rounded-xl hover:scale-105 transition-all duration-300 font-medium shadow-lg hover-lift text-sm md:text-base"
              >
                Logout
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-white/50 backdrop-blur-sm border border-white/20 text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-md border-b border-white/20 shadow-lg animate-slideInDown">
              <div className="px-4 py-4 space-y-3">
                <Link 
                  to="/" 
                  className="block text-center text-primary-600 font-medium py-3 rounded-xl bg-white/50 border border-white/20"
                  target="_blank"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  🌐 View Website
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-red-500 to-berry-500 text-white py-3 rounded-xl font-medium shadow-lg text-center"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs - Mobile Friendly */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-white/20 relative z-10 sticky top-0 md:static">
        <div className="max-w-7xl mx-auto px-2 md:px-4">
          <div className="flex space-x-1 overflow-x-auto py-2 md:py-0">
            {[
              { id: 'overview', name: 'Overview', icon: '📊' },
              { id: 'orders', name: 'Orders', icon: '📦' },
              { id: 'custom', name: 'Custom', icon: '🎨' },
              { id: 'cakes', name: 'Cakes', icon: '🎂' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex-shrink-0 py-3 px-3 md:px-6 font-semibold transition-all duration-300 flex items-center space-x-2 rounded-xl mx-1 ${
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/40'
                }`}
              >
                <span className="text-sm md:text-base">{tab.icon}</span>
                <span className="text-xs md:text-sm whitespace-nowrap">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-3 md:px-4 py-4 md:py-8">
        {activeTab === 'overview' && (
          <div className="animate-fadeInUp">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h2>
            <p className="text-gray-600 mb-6 md:mb-8 font-medium text-sm md:text-base">Welcome to your cake business management dashboard</p>
            
            {/* Stats Grid - Mobile Responsive */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
              {[
                { 
                  label: 'Total Cakes', 
                  value: stats?.totalCakes || 0, 
                  icon: '🎂', 
                  color: 'from-primary-500 to-berry-500',
                  bg: 'bg-gradient-to-br from-primary-50 to-berry-50'
                },
                { 
                  label: 'Total Orders', 
                  value: stats?.totalOrders || 0, 
                  icon: '📦', 
                  color: 'from-blue-500 to-cyan-500',
                  bg: 'bg-gradient-to-br from-blue-50 to-cyan-50'
                },
                { 
                  label: 'Pending', 
                  value: stats?.pendingOrders || 0, 
                  icon: '⏳', 
                  color: 'from-yellow-500 to-orange-500',
                  bg: 'bg-gradient-to-br from-yellow-50 to-orange-50'
                },
                { 
                  label: 'Revenue', 
                  value: `KSh ${stats?.totalRevenue?.toLocaleString() || 0}`, 
                  icon: '💰', 
                  color: 'from-green-500 to-emerald-500',
                  bg: 'bg-gradient-to-br from-green-50 to-emerald-50'
                }
              ].map((stat, index) => (
                <div 
                  key={index} 
                  className={`${stat.bg} backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-lg border border-white/20 hover-lift transition-all duration-300`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 font-medium mb-1 text-xs md:text-sm">{stat.label}</p>
                      <p className={`text-xl md:text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${stat.color}`}>
                        {stat.value}
                      </p>
                    </div>
                    <div className={`w-10 h-10 md:w-14 md:h-14 bg-gradient-to-r ${stat.color} rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg`}>
                      <span className="text-lg md:text-2xl text-white">{stat.icon}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions & Recent Activity - Mobile Stack */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
              {/* Quick Actions */}
              <div className="lg:col-span-1">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-lg border border-white/20">
                  <h3 className="font-semibold text-gray-800 mb-4 text-lg">Quick Actions</h3>
                  <div className="space-y-2 md:space-y-3">
                    {[
                      { icon: '📦', label: 'View Orders', action: () => setActiveTab('orders'), color: 'bg-blue-50 hover:bg-blue-100 text-blue-700' },
                      { icon: '🎨', label: 'Custom Requests', action: () => setActiveTab('custom'), color: 'bg-purple-50 hover:bg-purple-100 text-purple-700' },
                      { icon: '🎂', label: 'Manage Cakes', action: () => setActiveTab('cakes'), color: 'bg-primary-50 hover:bg-primary-100 text-primary-700' },
                      { icon: '➕', label: 'Add New Cake', action: () => setShowAddForm(true), color: 'bg-green-50 hover:bg-green-100 text-green-700' }
                    ].map((action, index) => (
                      <button 
                        key={index}
                        onClick={action.action}
                        className={`w-full text-left p-3 md:p-4 rounded-xl md:rounded-2xl transition-all duration-300 hover-lift font-medium flex items-center space-x-3 text-sm md:text-base ${action.color}`}
                      >
                        <span className="text-lg">{action.icon}</span>
                        <span>{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-lg border border-white/20">
                  <div className="flex items-center justify-between mb-4 md:mb-6">
                    <h3 className="font-semibold text-gray-800 text-lg">Recent Activity</h3>
                    <button 
                      onClick={fetchRecentActivity}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      Refresh
                    </button>
                  </div>
                  <div className="space-y-3 md:space-y-4">
                    {recentActivity.length > 0 ? (
                      recentActivity.map((activity, index) => (
                        <div 
                          key={activity.id} 
                          className="flex items-start space-x-3 md:space-x-4 p-3 md:p-4 bg-gray-50/50 rounded-xl md:rounded-2xl hover-lift transition-all duration-300 group"
                        >
                          <div className="w-8 h-8 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform flex-shrink-0">
                            <span className="text-base md:text-xl">{activity.icon}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-gray-800 text-sm md:text-base truncate">{activity.title}</h4>
                              <span className={`px-2 py-1 text-xs rounded-full font-medium ml-2 flex-shrink-0 ${getStatusColor(activity.status)}`}>
                                {activity.status}
                              </span>
                            </div>
                            <p className="text-gray-600 text-xs md:text-sm mb-2 truncate">{activity.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500 font-medium">
                                {formatTimeAgo(activity.timestamp)}
                              </span>
                              <button 
                                onClick={() => setActiveTab(activity.type === 'order' ? 'orders' : 'custom')}
                                className="text-primary-600 hover:text-primary-700 text-xs font-medium flex-shrink-0"
                              >
                                View →
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 md:py-8">
                        <div className="text-3xl md:text-4xl mb-3">📊</div>
                        <p className="text-gray-600 font-medium">No recent activity</p>
                        <p className="text-gray-500 text-xs md:text-sm">Activity will appear here as customers place orders</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="animate-fadeInUp">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 md:mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 sm:mb-0">Order Management</h2>
              <button 
                onClick={fetchOrders}
                className="bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-700 transition-colors text-sm font-medium"
              >
                🔄 Refresh
              </button>
            </div>
            
            {dataLoading ? (
              <div className="text-center py-8 md:py-12">
                <div className="animate-spin rounded-full h-8 md:h-12 w-8 md:w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 font-medium">Loading orders...</p>
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-lg border border-white/20 overflow-hidden">
                {orders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                          <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                          <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {orders.map(order => (
                          <tr key={order._id} className="hover:bg-gray-50">
                            <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              #{order._id?.slice(-6) || 'N/A'}
                            </td>
                            <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div>
                                <p className="font-medium">{order.customerName || 'N/A'}</p>
                                <p className="text-gray-500">{order.phone || 'N/A'}</p>
                              </div>
                            </td>
                            <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              KSh {order.totalAmount?.toLocaleString() || '0'}
                            </td>
                            <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {order.status || 'pending'}
                              </span>
                            </td>
                            <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <select
                                value={order.status || 'pending'}
                                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                className="text-xs md:text-sm border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full max-w-32"
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="preparing">Preparing</option>
                                <option value="ready">Ready</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 md:py-16">
                    <div className="text-4xl md:text-6xl mb-4">📦</div>
                    <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">No Orders Yet</h3>
                    <p className="text-gray-600 mb-6">Orders will appear here when customers place them.</p>
                    <Link 
                      to="/" 
                      className="btn-primary inline-block"
                      target="_blank"
                    >
                      Visit Your Shop
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'custom' && (
          <div className="animate-fadeInUp">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 md:mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 sm:mb-0">Custom Cake Requests</h2>
              <button 
                onClick={fetchCustomRequests}
                className="bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-700 transition-colors text-sm font-medium"
              >
                🔄 Refresh
              </button>
            </div>
            
            {dataLoading ? (
              <div className="text-center py-8 md:py-12">
                <div className="animate-spin rounded-full h-8 md:h-12 w-8 md:w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 font-medium">Loading requests...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:gap-6">
                {customRequests.length > 0 ? (
                  customRequests.map(request => (
                    <div key={request._id} className="bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-lg border border-white/20 hover-lift transition-all duration-300">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-800">{request.customerName || 'N/A'}</h3>
                          <p className="text-gray-600 text-sm">{request.phone || 'N/A'} • {request.occasion || 'N/A'}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                            {request.status || 'pending'}
                          </span>
                          <select
                            value={request.status || 'pending'}
                            onChange={(e) => updateRequestStatus(request._id, e.target.value)}
                            className="text-xs md:text-sm border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          >
                            <option value="pending">Pending</option>
                            <option value="quoted">Quoted</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 text-sm">
                        <div>
                          <span className="font-medium">Size:</span> {request.cakeSize || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Flavor:</span> {request.flavor || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Icing:</span> {request.icing || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Budget:</span> {request.budget ? `KSh ${request.budget}` : 'Not specified'}
                        </div>
                      </div>

                      {request.designDescription && (
                        <div className="mb-3">
                          <span className="font-medium">Design:</span>
                          <p className="text-gray-700 mt-1 text-sm">{request.designDescription}</p>
                        </div>
                      )}

                      {request.message && (
                        <div className="mb-3">
                          <span className="font-medium">Cake Message:</span>
                          <p className="text-gray-700 mt-1 text-sm">"{request.message}"</p>
                        </div>
                      )}

                      <div className="text-sm text-gray-500">
                        Submitted: {request.createdAt ? new Date(request.createdAt).toLocaleString() : 'N/A'}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 md:py-16 bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-lg border border-white/20">
                    <div className="text-4xl md:text-6xl mb-4">🎨</div>
                    <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">No Custom Requests Yet</h3>
                    <p className="text-gray-600 mb-6">Custom cake requests will appear here when customers submit them.</p>
                    <Link 
                      to="/custom-cake" 
                      className="btn-primary inline-block"
                      target="_blank"
                    >
                      View Custom Cake Page
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'cakes' && (
          <div className="animate-fadeInUp">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 md:mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 sm:mb-0">Cake Management</h2>
              <div className="flex space-x-2">
                <button 
                  onClick={fetchCakes}
                  className="bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-700 transition-colors text-sm font-medium"
                >
                  🔄 Refresh
                </button>
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="btn-primary text-sm"
                >
                  + Add Cake
                </button>
              </div>
            </div>
            
            {dataLoading ? (
              <div className="text-center py-8 md:py-12">
                <div className="animate-spin rounded-full h-8 md:h-12 w-8 md:w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 font-medium">Loading cakes...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {cakes.length > 0 ? (
                    cakes.map(cake => (
                      <div key={cake._id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-white/20 hover-lift transition-all duration-300">
                        <div className="h-32 md:h-48 bg-gradient-to-br from-primary-100 to-berry-100 flex items-center justify-center relative overflow-hidden">
                          {cake.images && cake.images.length > 0 ? (
                            <img 
                              src={cake.images[0]} 
                              alt={cake.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-3xl md:text-5xl">🎂</span>
                          )}
                          {cake.featured && (
                            <div className="absolute top-2 left-2 bg-gradient-to-r from-gold-400 to-gold-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
                              Featured
                            </div>
                          )}
                          <div className="absolute top-2 right-2 flex space-x-1">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              cake.available ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                            }`}>
                              {cake.available ? 'Available' : 'Sold Out'}
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-1 text-sm md:text-base">{cake.name}</h3>
                          <p className="text-gray-600 text-xs md:text-sm mb-3 line-clamp-2">{cake.description}</p>
                          
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-lg md:text-xl font-bold text-primary-600">KSh {cake.price?.toLocaleString()}</span>
                            <div className="flex items-center space-x-1">
                              <span className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded-full">
                                {cake.flavor}
                              </span>
                              <span className="text-xs text-primary-600 capitalize bg-primary-50 px-2 py-1 rounded-full">
                                {cake.category}
                              </span>
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <button className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors text-xs md:text-sm font-medium">
                              Edit
                            </button>
                            <button className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors text-xs md:text-sm font-medium">
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8 md:py-16 bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-lg border border-white/20">
                      <div className="text-4xl md:text-6xl mb-4">🎂</div>
                      <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">No Cakes Yet</h3>
                      <p className="text-gray-600 mb-6">Get started by adding your first cake to the collection!</p>
                      <button 
                        onClick={() => setShowAddForm(true)}
                        className="btn-primary"
                      >
                        + Add Your First Cake
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Add Cake Form Modal */}
            {showAddForm && (
              <AddCakeForm 
                onClose={() => setShowAddForm(false)}
                onCakeAdded={handleCakeAdded}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

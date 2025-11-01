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

  const { user, token, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // API call function with authentication
  const apiCall = async (url, options = {}) => {
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
      const data = await apiCall('http://localhost:5000/api/admin/stats');
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
        apiCall('http://localhost:5000/api/admin/orders?limit=5'),
        apiCall('http://localhost:5000/api/admin/custom-requests?limit=5')
      ]);

      const activities = [
        ...ordersData.orders.map(order => ({
          type: 'order',
          id: order._id,
          title: `New order from ${order.customerName}`,
          description: `Order #${order._id.slice(-6)} - KSh ${order.totalAmount?.toLocaleString()}`,
          status: order.status,
          timestamp: order.createdAt,
          icon: '📦'
        })),
        ...requestsData.requests.map(request => ({
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
      const data = await apiCall('http://localhost:5000/api/admin/orders');
      setOrders(data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const fetchCustomRequests = async () => {
    try {
      setDataLoading(true);
      const data = await apiCall('http://localhost:5000/api/admin/custom-requests');
      setCustomRequests(data.requests);
    } catch (error) {
      console.error('Error fetching custom requests:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const fetchCakes = async () => {
    try {
      setDataLoading(true);
      const data = await apiCall('http://localhost:5000/api/admin/cakes');
      setCakes(data.cakes);
    } catch (error) {
      console.error('Error fetching cakes:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await apiCall(`http://localhost:5000/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      fetchOrders();
      fetchStats();
      fetchRecentActivity(); // Refresh activity feed
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const updateRequestStatus = async (requestId, status) => {
    try {
      await apiCall(`http://localhost:5000/api/admin/custom-requests/${requestId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      fetchCustomRequests();
      fetchStats();
      fetchRecentActivity(); // Refresh activity feed
    } catch (error) {
      console.error('Error updating request status:', error);
    }
  };

  const handleCakeAdded = (newCake) => {
    setCakes(prev => [newCake, ...prev]);
    fetchStats();
    fetchRecentActivity(); // Refresh activity feed
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
    <div className="min-h-screen section-sweet">
      {/* Floating decorative elements */}
      <div className="fixed top-20 left-10 w-6 h-6 bg-gradient-to-r from-primary-400 to-berry-400 rounded-full opacity-20 animate-float"></div>
      <div className="fixed top-40 right-20 w-8 h-8 bg-gradient-to-r from-gold-300 to-gold-400 rounded-full opacity-30 animate-float" style={{animationDelay: '1s'}}></div>

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-berry-500 rounded-2xl flex items-center justify-center shadow-lg hover-lift transition-all duration-300">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <div>
                <h1 className="cursive text-2xl text-primary-700">Admin Dashboard</h1>
                <p className="text-gray-600 text-sm font-medium">
                  Welcome back, {user?.username} <span className="text-primary-600">({user?.role})</span>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors hover-lift px-4 py-2 rounded-xl bg-white/50 backdrop-blur-sm border border-white/20"
                target="_blank"
              >
                🌐 View Website
              </Link>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-berry-500 text-white px-6 py-2 rounded-xl hover:scale-105 transition-all duration-300 font-medium shadow-lg hover-lift"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-white/20 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1">
            {[
              { id: 'overview', name: 'Overview', icon: '📊' },
              { id: 'orders', name: 'Orders', icon: '📦' },
              { id: 'custom', name: 'Custom Requests', icon: '🎨' },
              { id: 'cakes', name: 'Cake Management', icon: '🎂' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-6 font-semibold transition-all duration-300 flex items-center space-x-2 rounded-t-2xl border-b-2 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 bg-white/80 backdrop-blur-sm'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-white/40'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="animate-fadeInUp">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h2>
            <p className="text-gray-600 mb-8 font-medium">Welcome to your cake business management dashboard</p>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                  label: 'Pending Orders', 
                  value: stats?.pendingOrders || 0, 
                  icon: '⏳', 
                  color: 'from-yellow-500 to-orange-500',
                  bg: 'bg-gradient-to-br from-yellow-50 to-orange-50'
                },
                { 
                  label: 'Total Revenue', 
                  value: `KSh ${stats?.totalRevenue?.toLocaleString() || 0}`, 
                  icon: '💰', 
                  color: 'from-green-500 to-emerald-500',
                  bg: 'bg-gradient-to-br from-green-50 to-emerald-50'
                }
              ].map((stat, index) => (
                <div 
                  key={index} 
                  className={`${stat.bg} backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20 hover-lift transition-all duration-300`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 font-medium mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${stat.color}">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`w-14 h-14 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <span className="text-2xl text-white">{stat.icon}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Quick Actions */}
              <div className="lg:col-span-1">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20">
                  <h3 className="font-semibold text-gray-800 mb-4 text-lg">Quick Actions</h3>
                  <div className="space-y-3">
                    {[
                      { icon: '📦', label: 'View All Orders', action: () => setActiveTab('orders'), color: 'bg-blue-50 hover:bg-blue-100 text-blue-700' },
                      { icon: '🎨', label: 'Custom Requests', action: () => setActiveTab('custom'), color: 'bg-purple-50 hover:bg-purple-100 text-purple-700' },
                      { icon: '🎂', label: 'Manage Cakes', action: () => setActiveTab('cakes'), color: 'bg-primary-50 hover:bg-primary-100 text-primary-700' },
                      { icon: '➕', label: 'Add New Cake', action: () => setShowAddForm(true), color: 'bg-green-50 hover:bg-green-100 text-green-700' }
                    ].map((action, index) => (
                      <button 
                        key={index}
                        onClick={action.action}
                        className={`w-full text-left p-4 rounded-2xl transition-all duration-300 hover-lift font-medium flex items-center space-x-3 ${action.color}`}
                      >
                        <span className="text-xl">{action.icon}</span>
                        <span>{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-gray-800 text-lg">Recent Activity</h3>
                    <button 
                      onClick={fetchRecentActivity}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      Refresh
                    </button>
                  </div>
                  <div className="space-y-4">
                    {recentActivity.length > 0 ? (
                      recentActivity.map((activity, index) => (
                        <div 
                          key={activity.id} 
                          className="flex items-start space-x-4 p-4 bg-gray-50/50 rounded-2xl hover-lift transition-all duration-300 group"
                        >
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                            <span className="text-xl">{activity.icon}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-gray-800">{activity.title}</h4>
                              <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(activity.status)}`}>
                                {activity.status}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{activity.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500 font-medium">
                                {formatTimeAgo(activity.timestamp)}
                              </span>
                              <button 
                                onClick={() => setActiveTab(activity.type === 'order' ? 'orders' : 'custom')}
                                className="text-primary-600 hover:text-primary-700 text-xs font-medium"
                              >
                                View Details →
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-3">📊</div>
                        <p className="text-gray-600 font-medium">No recent activity</p>
                        <p className="text-gray-500 text-sm">Activity will appear here as customers place orders</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rest of the tabs (Orders, Custom Requests, Cakes) remain the same but with enhanced design */}
        {/* ... (keeping your existing code for other tabs but applying the same design principles) ... */}
        
      </div>

      {/* Add Cake Form Modal */}
      {showAddForm && (
        <AddCakeForm 
          onClose={() => setShowAddForm(false)}
          onCakeAdded={handleCakeAdded}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
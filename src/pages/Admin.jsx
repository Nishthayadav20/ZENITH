import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  updateOrderStatus, 
  addProduct, 
  editProduct, 
  deleteProduct, 
  addCoupon, 
  deleteCoupon, 
  moderateReview,
  selectCurrentCurrency,
  formatPrice,
  logoutUser,
  fetchBlogs,
  addBlog,
  deleteBlog,
  updateBlog,
  fetchOrders
} from '../store/slices/watchSlice';
import { 
  BarChart3, Plus, Edit, Trash2, Check, X, Tag, Star, 
  Package, AlertTriangle, ShieldAlert, ArrowLeft, ArrowUpRight,
  CheckCircle2, LogOut, Newspaper, BookOpen
} from 'lucide-react';

const PRESET_STRAPS = [
  { name: 'Tan Leather', image: '/assets/strap_leather_tan.jpg' },
  { name: 'Diamond Silver Link', image: '/assets/strap_silver_diamond.jpg' },
  { name: 'Classic Gold Chain', image: '/assets/strap_gold_chain.jpg' },
  { name: 'Forest Green Rubber', image: '/assets/strap_rubber_green.jpg' },
  { name: 'Brushed Steel Link', image: '/assets/strap_steel_link.jpg' }
];

const DIAL_COLOR_PRESETS = [
  { name: 'Midnight Black', hex: '#0a0a0f' },
  { name: 'Pearl White', hex: '#f5f0e8' },
  { name: 'Navy Blue', hex: '#1a2a4a' },
  { name: 'Forest Green', hex: '#1c3a2a' },
  { name: 'Champagne Gold', hex: '#c8a96a' },
  { name: 'Crimson Red', hex: '#6b1515' },
  { name: 'Beige Dial', hex: '#f5f5dc' }
];

export default function Admin({ onPageChange }) {
  const dispatch = useDispatch();
  const products = useSelector(state => state.watch.products);
  const orders = useSelector(state => state.watch.orders);
  const coupons = useSelector(state => state.watch.coupons);
  const currentUser = useSelector(state => state.watch.currentUser);
  const currentCurrency = useSelector(selectCurrentCurrency);
  const blogs = useSelector(state => state.watch.blogs || []);

  // Active Admin Sub-Tab
  const [activeTab, setActiveTab] = useState('analytics'); // analytics | products | orders | coupons | reviews | updates | blogs

  // Add Product Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    stock: '',
    category: 'Khronomaster',
    gender: 'unisex',
    description: '',
    image: '/assets/media__1782899491225.jpg', // default copy
    specs: {
      movement: 'Automatic Chronometer',
      case: 'Stainless Steel (40mm)',
      strap: 'Leather strap',
      waterResistance: '50m',
      glass: 'Sapphire Crystal'
    },
    customizable: true,
    allowStrapCustomization: true,
    allowCaseCustomization: true,
    allowDialCustomization: true,
    customizationOptions: {
      dialColors: [],
      strapMaterials: [],
      customStrapName: '',
      customStrapImage: '',
      customCaseName: '',
      customCaseColor: '#ffffff'
    }
  });

  // Edit Product Form State
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);

  // Add Coupon Form State
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('');
  const [newCouponDesc, setNewCouponDesc] = useState('');

  // --- BRAND UPDATES ADMIN STATES & OPERATIONS ---
  const [adminUpdates, setAdminUpdates] = useState([]);
  const [showAddUpdateForm, setShowAddUpdateForm] = useState(false);
  const [newUpdate, setNewUpdate] = useState({ title: '', detail: '', approved: true });
  const [editingUpdateId, setEditingUpdateId] = useState(null);
  const [editUpdateForm, setEditUpdateForm] = useState(null);

  // --- BLOGS ADMIN STATES & OPERATIONS ---
  const [showAddBlogForm, setShowAddBlogForm] = useState(false);
  const [newBlog, setNewBlog] = useState({ title: '', category: 'Horology', image: '', content: '', author: '' });
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [editBlogForm, setEditBlogForm] = useState(null);

  const handleStrapImageChange = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEdit) {
          setEditForm(prev => ({
            ...prev,
            customizationOptions: {
              ...prev.customizationOptions,
              customStrapImage: reader.result
            }
          }));
        } else {
          setNewProduct(prev => ({
            ...prev,
            customizationOptions: {
              ...prev.customizationOptions,
              customStrapImage: reader.result
            }
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStrapCheckboxChange = (strapName, isEdit = false) => {
    const target = isEdit ? editForm : newProduct;
    const currentStraps = target.customizationOptions?.strapMaterials || [];
    let updatedStraps;
    if (currentStraps.includes(strapName)) {
      updatedStraps = currentStraps.filter(s => s !== strapName);
    } else {
      updatedStraps = [...currentStraps, strapName];
    }
    
    if (isEdit) {
      setEditForm({
        ...editForm,
        customizationOptions: {
          ...editForm.customizationOptions,
          strapMaterials: updatedStraps
        }
      });
    } else {
      setNewProduct({
        ...newProduct,
        customizationOptions: {
          ...newProduct.customizationOptions,
          strapMaterials: updatedStraps
        }
      });
    }
  };

  const handleDialColorCheckboxChange = (colorHex, isEdit = false) => {
    const target = isEdit ? editForm : newProduct;
    const currentColors = target.customizationOptions?.dialColors || [];
    let updatedColors;
    if (currentColors.includes(colorHex)) {
      updatedColors = currentColors.filter(c => c !== colorHex);
    } else {
      updatedColors = [...currentColors, colorHex];
    }
    
    if (isEdit) {
      setEditForm({
        ...editForm,
        customizationOptions: {
          ...editForm.customizationOptions,
          dialColors: updatedColors
        }
      });
    } else {
      setNewProduct({
        ...newProduct,
        customizationOptions: {
          ...newProduct.customizationOptions,
          dialColors: updatedColors
        }
      });
    }
  };

  const fetchAdminUpdates = async () => {
    try {
      const token = localStorage.getItem('khroniq_token');
      const res = await fetch('/api/brand-updates/admin', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      const data = await res.json();
      if (data && data.success) {
        setAdminUpdates(data.updates);
      }
    } catch (err) {
      console.error('Error fetching admin updates:', err);
    }
  };

  useEffect(() => {
    if (currentUser && currentUser.role === 'admin') {
      dispatch(fetchOrders());
      if (activeTab === 'updates') {
        fetchAdminUpdates();
      } else if (activeTab === 'blogs') {
        dispatch(fetchBlogs());
      }
    }
  }, [activeTab, currentUser, dispatch]);

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    if (!newBlog.title || !newBlog.content) {
      alert('Please fill out both Title and Content.');
      return;
    }
    const res = await dispatch(addBlog(newBlog));
    if (res?.success) {
      setNewBlog({ title: '', category: 'Horology', image: '', content: '', author: '' });
      setShowAddBlogForm(false);
    } else {
      alert(res?.message || 'Failed to create blog post.');
    }
  };

  const handleDeleteBlog = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      const res = await dispatch(deleteBlog(blogId));
      if (!res?.success) {
        alert(res?.message || 'Failed to delete blog post.');
      }
    }
  };

  const handleEditBlogInit = (blog) => {
    setEditingBlogId(blog.id || blog._id);
    setEditBlogForm({
      title: blog.title,
      category: blog.category,
      author: blog.author,
      image: blog.image,
      content: blog.content
    });
    setShowAddBlogForm(false);
  };

  const handleUpdateBlogSubmit = async (e) => {
    e.preventDefault();
    if (!editBlogForm.title || !editBlogForm.content) {
      alert('Please fill out both Title and Content.');
      return;
    }
    const res = await dispatch(updateBlog(editingBlogId, editBlogForm));
    if (res?.success) {
      setEditingBlogId(null);
      setEditBlogForm(null);
    } else {
      alert(res?.message || 'Failed to update blog post.');
    }
  };

  const handleCreateUpdate = async (e) => {
    e.preventDefault();
    if (!newUpdate.title || !newUpdate.detail) {
      alert('Please fill out both Title and Details.');
      return;
    }
    try {
      const token = localStorage.getItem('khroniq_token');
      const res = await fetch('/api/brand-updates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(newUpdate)
      });
      const data = await res.json();
      if (data.success) {
        alert('Brand update created successfully!');
        setShowAddUpdateForm(false);
        setNewUpdate({ title: '', detail: '', approved: true });
        fetchAdminUpdates();
      } else {
        alert(data.message || 'Failed to create update.');
      }
    } catch (err) {
      console.error('Create update error:', err);
    }
  };

  const handleToggleUpdateApproval = async (id, currentApproved) => {
    try {
      const token = localStorage.getItem('khroniq_token');
      const res = await fetch(`/api/brand-updates/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ approved: !currentApproved })
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminUpdates();
      } else {
        alert(data.message || 'Failed to toggle approval.');
      }
    } catch (err) {
      console.error('Toggle approval error:', err);
    }
  };

  const handleEditUpdateInit = (update) => {
    setEditingUpdateId(update.id || update._id);
    setEditUpdateForm({ ...update });
  };

  const handleUpdateUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('khroniq_token');
      const res = await fetch(`/api/brand-updates/${editingUpdateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(editUpdateForm)
      });
      const data = await res.json();
      if (data.success) {
        alert('Brand update edited successfully!');
        setEditingUpdateId(null);
        setEditUpdateForm(null);
        fetchAdminUpdates();
      } else {
        alert(data.message || 'Failed to edit update.');
      }
    } catch (err) {
      console.error('Edit update error:', err);
    }
  };

  const handleDeleteUpdate = async (id) => {
    if (!window.confirm('Delete this brand update permanently?')) return;
    try {
      const token = localStorage.getItem('khroniq_token');
      const res = await fetch(`/api/brand-updates/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      const data = await res.json();
      if (data.success) {
        alert('Brand update removed!');
        fetchAdminUpdates();
      } else {
        alert(data.message || 'Failed to remove update.');
      }
    } catch (err) {
      console.error('Delete update error:', err);
    }
  };

  // Validation checking for security
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto text-center py-20 bg-luxury-gray border border-white/5 rounded p-8 space-y-6">
        <ShieldAlert className="mx-auto text-luxury-red animate-bounce" size={48} />
        <div className="space-y-2">
          <h1 className="text-lg font-bold text-white uppercase tracking-widest">Unauthorized Access</h1>
          <p className="text-xs text-gray-400">Your account credentials do not grant administrator permissions to modify system states.</p>
        </div>
        <button
          onClick={() => onPageChange('login')}
          className="px-6 py-2.5 bg-luxury-gold text-luxury-dark text-xs font-bold uppercase tracking-widest hover:bg-luxury-gold-dark transition"
        >
          Authenticate Admin Account
        </button>
      </div>
    );
  }

  // --- ANALYTICS CALCULATIONS ---
  const totalSales = orders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = orders.length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;
  const totalSubscribersMock = 148;

  // Calculate dynamic category sales
  const categories = ['Khronomaster', 'Defy', 'Heritage', 'Elite'];
  const categorySales = {
    Khronomaster: 0,
    Defy: 0,
    Heritage: 0,
    Elite: 0
  };

  orders.filter(o => o.status !== 'Cancelled').forEach(o => {
    o.items?.forEach(item => {
      const prod = products.find(p => p.id === item.productId || p._id === item.productId);
      const cat = prod?.category || 'Heritage';
      const itemPrice = Number(item.price) || 0;
      const itemQty = Number(item.quantity) || 1;
      if (categorySales[cat] !== undefined) {
        categorySales[cat] += itemPrice * itemQty;
      } else {
        categorySales[cat] = itemPrice * itemQty;
      }
    });
  });

  // Default fallback mock values if zero real sales exist, keeping layout clean
  const hasAnySales = Object.values(categorySales).some(v => v > 0);
  const displaySales = { ...categorySales };
  if (!hasAnySales) {
    displaySales.Khronomaster = 12500;
    displaySales.Defy = 8500;
    displaySales.Heritage = 5000;
    displaySales.Elite = 2500;
  }

  const maxVal = Math.max(...Object.values(displaySales), 1000);

  // Compile all active (approved) reviews for management
  const activeReviews = [];
  products.forEach(p => {
    p.reviews?.forEach(r => {
      if (r.status === 'approved') {
        activeReviews.push({
          productId: p.id,
          productName: p.name,
          review: r
        });
      }
    });
  });

  // --- ACTIONS HANDLERS ---
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      alert('Please fill out Name, Price and Stock.');
      return;
    }
    // Auto append custom fields
    let customOpts = { ...(newProduct.customizationOptions || {}) };
    if (customOpts.customStrapName && !customOpts.strapMaterials?.includes(customOpts.customStrapName)) {
      customOpts.strapMaterials = [...(customOpts.strapMaterials || []), customOpts.customStrapName];
    }
    const finalProduct = {
      ...newProduct,
      customizationOptions: customOpts
    };
    const res = await dispatch(addProduct(finalProduct));
    if (res && res.success) {
      alert('Product created successfully!');
      setShowAddForm(false);
      setNewProduct({
        name: '', price: '', stock: '', category: 'Khronomaster', description: '',
        image: '/assets/media__1782899491225.jpg',
        specs: { movement: 'Automatic', case: '40mm', strap: 'Leather', waterResistance: '50m', glass: 'Sapphire' },
        customizable: true,
        allowStrapCustomization: true,
        allowCaseCustomization: true,
        customizationOptions: {
          dialColors: [],
          strapMaterials: [],
          customStrapName: '',
          customStrapImage: '',
          customCaseName: '',
          customCaseColor: '#ffffff'
        }
      });
    } else {
      alert(res?.message || 'Failed to create product.');
    }
  };

  const handleEditProductInit = (product) => {
    setEditingId(product.id);
    setEditForm({ 
      ...product, 
      customizable: product.customizable ?? false,
      allowStrapCustomization: product.allowStrapCustomization ?? true,
      allowCaseCustomization: product.allowCaseCustomization ?? true,
      customizationOptions: {
        dialColors: product.customizationOptions?.dialColors || [],
        strapMaterials: product.customizationOptions?.strapMaterials || [],
        customStrapName: product.customizationOptions?.customStrapName || '',
        customStrapImage: product.customizationOptions?.customStrapImage || '',
        customCaseName: product.customizationOptions?.customCaseName || '',
        customCaseColor: product.customizationOptions?.customCaseColor || '#ffffff'
      }
    });
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    let customOpts = { ...(editForm.customizationOptions || {}) };
    if (customOpts.customStrapName && !customOpts.strapMaterials?.includes(customOpts.customStrapName)) {
      customOpts.strapMaterials = [...(customOpts.strapMaterials || []), customOpts.customStrapName];
    }
    const finalProduct = {
      ...editForm,
      customizationOptions: customOpts
    };
    const res = await dispatch(editProduct(editingId, finalProduct));
    if (res && res.success) {
      alert('Product edited successfully!');
      setEditingId(null);
      setEditForm(null);
    } else {
      alert(res?.message || 'Failed to update product.');
    }
  };

  const handleDeleteProductClick = (id) => {
    if (window.confirm('Delete this timepiece from store inventory?')) {
      dispatch(deleteProduct(id));
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!newCouponCode || !newCouponDiscount) return;
    const res = await dispatch(addCoupon(newCouponCode, newCouponDiscount, newCouponDesc));
    if (res && res.success) {
      alert('Coupon code activated!');
      setNewCouponCode('');
      setNewCouponDiscount('');
      setNewCouponDesc('');
    } else {
      alert(res?.message || 'Failed to add coupon.');
    }
  };

  const handleReviewStatus = (productId, reviewId, status) => {
    dispatch(moderateReview(productId, reviewId, status));
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Dashboard Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold uppercase text-white tracking-widest">Admin Control Center</h1>
          <p className="text-gray-400 text-xs mt-1">Configure Khroniq store parameters, monitor sales trends, and verify stock thresholds.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => onPageChange('home')}
            className="px-4 py-2 border border-white/10 text-gray-300 hover:text-white text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5 transition cursor-pointer"
          >
            <ArrowLeft size={12} />
            <span>Exit Dashboard</span>
          </button>
          
          <button
            onClick={() => {
              dispatch(logoutUser());
              onPageChange('home');
            }}
            className="px-4 py-2 bg-luxury-red hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition cursor-pointer rounded-sm"
          >
            <LogOut size={12} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Admin Tab Selectors */}
      <div className="flex flex-wrap gap-2 text-xs border-b border-white/5 pb-4">
        {[
          { key: 'analytics', label: 'Store Analytics', icon: BarChart3 },
          { key: 'products', label: 'Inventory Manager', icon: Package },
          { key: 'orders', label: 'Order Dispatcher', icon: CheckCircle2 },
          { key: 'coupons', label: 'Coupon Builder', icon: Tag },
          { key: 'reviews', label: 'Reviews Manager', icon: Star },
          { key: 'updates', label: 'Brand Updates', icon: Newspaper },
          { key: 'blogs', label: 'Blogs Editorial', icon: BookOpen },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-2.5 px-4 font-bold uppercase tracking-wider cursor-pointer transition flex items-center space-x-1.5 rounded-sm ${
                activeTab === tab.key 
                  ? 'bg-luxury-gold text-luxury-dark font-extrabold' 
                  : 'bg-luxury-gray text-gray-400 hover:text-white hover:bg-luxury-gray/70'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
              {tab.key === 'reviews' && activeReviews.length > 0 && (
                <span className="bg-white/10 text-white text-[9px] px-1.5 py-0.5 rounded-full font-sans font-medium ml-1">
                  {activeReviews.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* --- TAB CONTENT: ANALYTICS --- */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-luxury-gray border border-white/5 p-6 rounded-md space-y-2">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Gross Sales Revenue</span>
              <p className="text-2xl font-extrabold text-luxury-gold">{formatPrice(totalSales, currentCurrency)}</p>
              <span className="text-[9px] text-emerald-400 flex items-center space-x-1 font-medium">
                <ArrowUpRight size={10} />
                <span>+12.4% vs last week</span>
              </span>
            </div>
            
            <div className="bg-luxury-gray border border-white/5 p-6 rounded-md space-y-2">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Total Orders</span>
              <p className="text-2xl font-extrabold text-white">{totalOrdersCount}</p>
              <span className="text-[9px] text-gray-500 font-light">All status types included</span>
            </div>

            <div className="bg-luxury-gray border border-white/5 p-6 rounded-md space-y-2">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Out of Stock Watches</span>
              <p className="text-2xl font-extrabold text-white flex items-center space-x-2">
                <span>{outOfStockCount}</span>
                {outOfStockCount > 0 && <AlertTriangle size={18} className="text-luxury-red animate-pulse" />}
              </p>
              <span className="text-[9px] text-gray-500">Requires production triggers</span>
            </div>

            <div className="bg-luxury-gray border border-white/5 p-6 rounded-md space-y-2">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Star Newsletter Subscriptions</span>
              <p className="text-2xl font-extrabold text-white">{totalSubscribersMock}</p>
              <span className="text-[9px] text-emerald-400 font-medium">Mock marketing reach</span>
            </div>
          </div>

          {/* SVG Chart Panel */}
          <div className="bg-luxury-gray border border-white/5 p-6 sm:p-8 rounded-md space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-white">Sales Performance Curve</h3>
                <p className="text-[10px] text-gray-500 mt-0.5">Calculated relative gross trends by collection category</p>
              </div>
              <span className="bg-white/5 border border-white/10 text-[9px] font-bold text-gray-300 px-2.5 py-1 tracking-widest uppercase rounded">
                Live Data
              </span>
            </div>

            {/* Custom Interactive SVG Graph */}
            <div className="relative pt-4 flex flex-col items-center w-full min-h-[260px]">
              <svg width="100%" height="240" viewBox="0 0 600 240" className="overflow-visible font-sans">
                {/* Horizontal Guide Lines */}
                <line x1="55" y1="40" x2="550" y2="40" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                <line x1="55" y1="90" x2="550" y2="90" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                <line x1="55" y1="140" x2="550" y2="140" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                <line x1="55" y1="190" x2="550" y2="190" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                
                {/* Axes */}
                <line x1="55" y1="190" x2="550" y2="190" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                <line x1="55" y1="40" x2="55" y2="190" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

                {/* Bars - Mocking Category Sales: Khronomaster, Defy, Heritage, Elite */}
                {categories.map((cat, idx) => {
                  const val = displaySales[cat] || 0;
                  const barHeight = (val / maxVal) * 130;
                  const yPos = 190 - barHeight;
                  const xPos = 90 + idx * 120;
                  
                  // Color palette: Gold, Red, White, Bronze
                  const colors = ['#c5a880', '#ef4444', '#f3f4f6', '#a68a60'];
                  const barColor = colors[idx % colors.length];

                  return (
                    <g key={cat} className="group cursor-pointer">
                      {/* Hover value tooltip tag */}
                      <rect 
                        x={xPos - 15} 
                        y={yPos - 22} 
                        width="70" 
                        height="16" 
                        rx="2" 
                        fill="#000000" 
                        stroke="rgba(255,255,255,0.1)"
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      />
                      <text 
                        x={xPos + 20} 
                        y={yPos - 11} 
                        fill="#c5a880" 
                        fontSize="8" 
                        fontWeight="bold"
                        textAnchor="middle" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        {formatPrice(val, currentCurrency)}
                      </text>

                      {/* The Bar */}
                      <rect 
                        x={xPos} 
                        y={yPos} 
                        width="40" 
                        height={barHeight} 
                        fill={barColor} 
                        opacity="0.8" 
                        rx="2" 
                        className="group-hover:opacity-100 transition duration-200"
                      />

                      {/* Display value on top of bar */}
                      <text
                        x={xPos + 20}
                        y={yPos - 6}
                        fill="#ffffff"
                        fontSize="8"
                        textAnchor="middle"
                        className="font-mono font-bold"
                      >
                        {formatPrice(val, currentCurrency)}
                      </text>
                    </g>
                  );
                })}

                {/* Y-axis Labels */}
                <text x="47" y="44" fill="rgba(255,255,255,0.4)" fontSize="8" textAnchor="end">{formatPrice(maxVal, currentCurrency)}</text>
                <text x="47" y="94" fill="rgba(255,255,255,0.4)" fontSize="8" textAnchor="end">{formatPrice(maxVal * 0.66, currentCurrency)}</text>
                <text x="47" y="144" fill="rgba(255,255,255,0.4)" fontSize="8" textAnchor="end">{formatPrice(maxVal * 0.33, currentCurrency)}</text>
                <text x="47" y="194" fill="rgba(255,255,255,0.4)" fontSize="8" textAnchor="end">{formatPrice(0, currentCurrency)}</text>

                {/* X-axis Labels */}
                {categories.map((cat, idx) => (
                  <text 
                    key={cat}
                    x={110 + idx * 120} 
                    y="210" 
                    fill="rgba(255,255,255,0.6)" 
                    fontSize="9" 
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {cat.toUpperCase()}
                  </text>
                ))}
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB CONTENT: INVENTORY MANAGER (CRUD) --- */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          
          {/* Header & Add Button */}
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white">Watch Database</h3>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-white hover:bg-luxury-gold text-luxury-dark text-xs font-bold uppercase tracking-widest transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Timepiece</span>
            </button>
          </div>

          {/* Add Form Drawer */}
          {showAddForm && (
            <div className="bg-luxury-gray border border-white/5 p-6 rounded-md space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-white border-b border-white/5 pb-2">New Timepiece Profile</h4>
              
              <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Watch Name</label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full bg-luxury-dark border border-white/10 rounded text-white text-xs p-2.5 focus:outline-none"
                    placeholder="Khroniq Khronomaster Sport"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Price ($)</label>
                    <input
                      type="number"
                      required
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="w-full bg-luxury-dark border border-white/10 rounded text-white text-xs p-2.5 focus:outline-none"
                      placeholder="4500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Stock Count</label>
                    <input
                      type="number"
                      required
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                      className="w-full bg-luxury-dark border border-white/10 rounded text-white text-xs p-2.5 focus:outline-none"
                      placeholder="8"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Collection / Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full bg-luxury-dark border border-white/10 rounded text-white text-xs p-2.5 focus:outline-none"
                  >
                    <option value="Khronomaster">Khronomaster</option>
                    <option value="Defy">Defy</option>
                    <option value="Heritage">Heritage</option>
                    <option value="Elite">Elite</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Target Gender</label>
                  <select
                    value={newProduct.gender}
                    onChange={(e) => setNewProduct({ ...newProduct, gender: e.target.value })}
                    className="w-full bg-luxury-dark border border-white/10 rounded text-white text-xs p-2.5 focus:outline-none"
                  >
                    <option value="men">Men's watches</option>
                    <option value="women">Women's watches</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Image Path</label>
                  <select
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                    className="w-full bg-luxury-dark border border-white/10 rounded text-white text-xs p-2.5 focus:outline-none"
                  >
                    <option value="/assets/media__1782899491225.jpg">Rose Gold Watch (Asset 1)</option>
                    <option value="/assets/media__1782899491297.jpg">Black Chronograph (Asset 2)</option>
                    <option value="/assets/media__1782899491320.jpg">Minimalist Leather (Asset 3)</option>
                    <option value="/assets/media__1782899491366.jpg">Defy Steel (Asset 4)</option>
                  </select>
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Product Description</label>
                  <textarea
                    rows="3"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full bg-luxury-dark border border-white/10 rounded text-white text-xs p-2.5 focus:outline-none"
                    placeholder="Enter full descriptive paragraphs..."
                  />
                </div>

                {/* Customizable Toggle for New Product */}
                <div className="md:col-span-2 flex flex-col bg-luxury-dark border border-white/10 rounded p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white">Customizable</p>
                      <p className="text-[9px] text-gray-500 mt-0.5">Show in Bespoke Atelier / Customization tab</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const val = !newProduct.customizable;
                        setNewProduct({ 
                          ...newProduct, 
                          customizable: val,
                          allowStrapCustomization: val ? (newProduct.allowStrapCustomization ?? true) : false,
                          allowCaseCustomization: val ? (newProduct.allowCaseCustomization ?? true) : false,
                          allowDialCustomization: val ? (newProduct.allowDialCustomization ?? true) : false
                        });
                      }}
                      className={`w-12 h-6 rounded-full transition-all duration-300 cursor-pointer relative ${
                        newProduct.customizable ? 'bg-luxury-gold' : 'bg-white/10'
                      }`}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${
                        newProduct.customizable ? 'left-6' : 'left-0.5'
                      }`} />
                    </button>
                  </div>

                  {/* Checkboxes shown ONLY when Customizable is checked */}
                  {newProduct.customizable && (
                    <div className="pt-2 border-t border-white/5 space-y-3">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-luxury-gold mb-1">Tailoring Capabilities</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2.5">
                          <input
                            type="checkbox"
                            id="newAllowStrapCustomization"
                            checked={newProduct.allowStrapCustomization ?? true}
                            onChange={(e) => setNewProduct({ ...newProduct, allowStrapCustomization: e.target.checked })}
                            className="w-4 h-4 accent-luxury-gold cursor-pointer"
                          />
                          <label htmlFor="newAllowStrapCustomization" className="text-xs text-gray-300 cursor-pointer select-none">
                            Allow Strap Customization
                          </label>
                        </div>
                        {newProduct.allowStrapCustomization && (
                          <div className="pl-6 space-y-3 border-l border-white/10 my-2">
                            {/* Preset Straps Selectors (Multiple Checkboxes) */}
                            <div className="space-y-1.5">
                              <label className="text-[8px] text-gray-400 font-bold uppercase tracking-wider block">Enable Preset Straps</label>
                              <div className="grid grid-cols-2 gap-2">
                                {PRESET_STRAPS.map(s => {
                                  const isChecked = (newProduct.customizationOptions?.strapMaterials || []).includes(s.name);
                                  return (
                                    <label key={s.name} className="flex items-center space-x-2 p-1.5 rounded border border-white/5 bg-luxury-dark/85 cursor-pointer hover:border-white/10 select-none">
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => handleStrapCheckboxChange(s.name, false)}
                                        className="w-3.5 h-3.5 accent-luxury-gold cursor-pointer"
                                      />
                                      <img src={s.image} alt={s.name} className="w-6 h-6 object-contain rounded" />
                                      <span className="text-[10px] text-gray-300 font-medium">{s.name}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Custom Name input for another strap */}
                            <div className="space-y-1 pt-2 border-t border-white/5">
                              <label className="text-[8px] text-gray-400 font-bold uppercase tracking-wider block">Add Custom Strap Name (Optional)</label>
                              <input
                                type="text"
                                placeholder="e.g. Alligator Leather"
                                value={newProduct.customizationOptions?.customStrapName || ''}
                                onChange={(e) => setNewProduct({
                                  ...newProduct,
                                  customizationOptions: {
                                    ...newProduct.customizationOptions,
                                    customStrapName: e.target.value
                                  }
                                })}
                                className="w-full bg-luxury-dark border border-white/10 rounded text-white text-xs p-1.5 focus:outline-none"
                              />
                            </div>

                            {/* Image Upload for new straps */}
                            <div className="space-y-1">
                              <label className="text-[8px] text-gray-400 font-bold uppercase tracking-wider block">Upload Custom Strap Image</label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleStrapImageChange(e, false)}
                                className="text-[10px] text-gray-400 file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer"
                              />
                              {newProduct.customizationOptions?.customStrapImage && (
                                <div className="mt-1.5 flex items-center space-x-2 bg-black/20 p-1.5 rounded border border-white/5">
                                  <img
                                    src={newProduct.customizationOptions.customStrapImage}
                                    alt="Strap Preview"
                                    className="w-10 h-10 object-contain rounded border border-white/10 bg-luxury-dark/40"
                                  />
                                  <div>
                                    <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-wider">Custom Strap Loaded</p>
                                    <p className="text-[8px] text-gray-400 truncate max-w-[200px]">
                                      {newProduct.customizationOptions.customStrapName || 'Unnamed'}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2.5">
                          <input
                            type="checkbox"
                            id="newAllowCaseCustomization"
                            checked={newProduct.allowCaseCustomization ?? true}
                            onChange={(e) => setNewProduct({ ...newProduct, allowCaseCustomization: e.target.checked })}
                            className="w-4 h-4 accent-luxury-gold cursor-pointer"
                          />
                          <label htmlFor="newAllowCaseCustomization" className="text-xs text-gray-300 cursor-pointer select-none">
                            Allow Case Finish Customization
                          </label>
                        </div>
                        {newProduct.allowCaseCustomization && (
                          <div className="pl-6 space-y-2 border-l border-white/10 my-2">
                            <div className="space-y-1">
                              <label className="text-[8px] text-gray-400 font-bold uppercase tracking-wider block">Custom Case Name</label>
                              <input
                                type="text"
                                placeholder="e.g. Matte Gold"
                                value={newProduct.customizationOptions?.customCaseName || ''}
                                onChange={(e) => setNewProduct({
                                  ...newProduct,
                                  customizationOptions: {
                                    ...newProduct.customizationOptions,
                                    customCaseName: e.target.value
                                  }
                                })}
                                className="w-full bg-luxury-dark border border-white/10 rounded text-white text-xs p-1.5 focus:outline-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[8px] text-gray-400 font-bold uppercase tracking-wider block">Case Color Option</label>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="color"
                                  value={newProduct.customizationOptions?.customCaseColor || '#ffffff'}
                                  onChange={(e) => setNewProduct({
                                    ...newProduct,
                                    customizationOptions: {
                                      ...newProduct.customizationOptions,
                                      customCaseColor: e.target.value
                                    }
                                  })}
                                  className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                                />
                                <span className="text-xs text-gray-300 font-mono">
                                  {newProduct.customizationOptions?.customCaseColor || '#ffffff'}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2.5">
                          <input
                            type="checkbox"
                            id="newAllowDialCustomization"
                            checked={newProduct.allowDialCustomization ?? true}
                            onChange={(e) => setNewProduct({ ...newProduct, allowDialCustomization: e.target.checked })}
                            className="w-4 h-4 accent-luxury-gold cursor-pointer"
                          />
                          <label htmlFor="newAllowDialCustomization" className="text-xs text-gray-300 cursor-pointer select-none">
                            Allow Dial Color Customization
                          </label>
                        </div>
                        {newProduct.allowDialCustomization && (
                          <div className="pl-6 space-y-1.5 border-l border-white/10 my-2">
                            <label className="text-[8px] text-gray-400 font-bold uppercase tracking-wider block font-sans">Available Dial Colors</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {DIAL_COLOR_PRESETS.map(color => {
                                const isChecked = (newProduct.customizationOptions?.dialColors || []).includes(color.hex);
                                return (
                                  <label key={color.hex} className="flex items-center space-x-2 p-1.5 rounded border border-white/5 bg-luxury-dark/80 cursor-pointer hover:border-white/10 select-none">
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => handleDialColorCheckboxChange(color.hex, false)}
                                      className="w-3.5 h-3.5 accent-luxury-gold cursor-pointer"
                                    />
                                    <span className="w-3.5 h-3.5 rounded-full border border-white/10" style={{ backgroundColor: color.hex }} />
                                    <span className="text-[10px] text-gray-300 font-medium">{color.name}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="md:col-span-2 py-3 bg-luxury-gold text-luxury-dark font-bold text-xs tracking-widest uppercase hover:bg-luxury-gold-dark transition"
                >
                  Save Timepiece to Stock
                </button>
              </form>
            </div>
          )}

          {/* Edit Form Modal (Visible only when editingId !== null) */}
          {editingId && editForm && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-luxury-gray border border-white/5 p-6 sm:p-8 rounded-md w-full max-w-xl space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-white">Modify Watch Details</h4>
                  <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-white">
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleUpdateProduct} className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Watch Name</label>
                    <input
                      type="text"
                      required
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full bg-luxury-dark border border-white/10 rounded text-white p-2.5"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Price ($)</label>
                      <input
                        type="number"
                        required
                        value={editForm.price}
                        onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                        className="w-full bg-luxury-dark border border-white/10 rounded text-white p-2.5"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Stock</label>
                      <input
                        type="number"
                        required
                        value={editForm.stock}
                        onChange={(e) => setEditForm({ ...editForm, stock: Number(e.target.value) })}
                        className="w-full bg-luxury-dark border border-white/10 rounded text-white p-2.5"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Collection</label>
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="w-full bg-luxury-dark border border-white/10 rounded text-white p-2.5"
                    >
                      <option value="Khronomaster">Khronomaster</option>
                      <option value="Defy">Defy</option>
                      <option value="Heritage">Heritage</option>
                      <option value="Elite">Elite</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Target Gender</label>
                    <select
                      value={editForm.gender}
                      onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                      className="w-full bg-luxury-dark border border-white/10 rounded text-white p-2.5"
                    >
                      <option value="men">Men's watches</option>
                      <option value="women">Women's watches</option>
                      <option value="unisex">Unisex</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Description</label>
                    <textarea
                      rows="3"
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full bg-luxury-dark border border-white/10 rounded text-white p-2.5"
                    />
                  </div>

                  {/* Customizable Toggle */}
                  <div className="flex flex-col bg-luxury-dark border border-white/10 rounded p-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white">Customizable</p>
                        <p className="text-[9px] text-gray-500 mt-0.5">Show in Bespoke Atelier / Customization tab</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const val = !editForm.customizable;
                          setEditForm({ 
                            ...editForm, 
                            customizable: val,
                            allowStrapCustomization: val ? (editForm.allowStrapCustomization ?? true) : false,
                            allowCaseCustomization: val ? (editForm.allowCaseCustomization ?? true) : false,
                            allowDialCustomization: val ? (editForm.allowDialCustomization ?? true) : false
                          });
                        }}
                        className={`w-12 h-6 rounded-full transition-all duration-300 cursor-pointer relative ${
                          editForm.customizable ? 'bg-luxury-gold' : 'bg-white/10'
                        }`}
                      >
                        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${
                          editForm.customizable ? 'left-6' : 'left-0.5'
                        }`} />
                      </button>
                    </div>

                    {/* Checkboxes shown ONLY when Customizable is checked */}
                    {editForm.customizable && (
                      <div className="pt-2 border-t border-white/5 space-y-3">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-luxury-gold mb-1">Tailoring Capabilities</p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2.5">
                            <input
                              type="checkbox"
                              id="allowStrapCustomization"
                              checked={editForm.allowStrapCustomization ?? true}
                              onChange={(e) => setEditForm({ ...editForm, allowStrapCustomization: e.target.checked })}
                              className="w-4 h-4 accent-luxury-gold cursor-pointer"
                            />
                            <label htmlFor="allowStrapCustomization" className="text-xs text-gray-300 cursor-pointer select-none">
                              Allow Strap Customization
                            </label>
                          </div>
                          {editForm.allowStrapCustomization && (
                            <div className="pl-6 space-y-3 border-l border-white/10 my-2">
                              {/* Preset Straps Selectors (Multiple Checkboxes) */}
                              <div className="space-y-1.5">
                                <label className="text-[8px] text-gray-400 font-bold uppercase tracking-wider block">Enable Preset Straps</label>
                                <div className="grid grid-cols-2 gap-2">
                                  {PRESET_STRAPS.map(s => {
                                    const isChecked = (editForm.customizationOptions?.strapMaterials || []).includes(s.name);
                                    return (
                                      <label key={s.name} className="flex items-center space-x-2 p-1.5 rounded border border-white/5 bg-luxury-dark/85 cursor-pointer hover:border-white/10 select-none">
                                        <input
                                          type="checkbox"
                                          checked={isChecked}
                                          onChange={() => handleStrapCheckboxChange(s.name, true)}
                                          className="w-3.5 h-3.5 accent-luxury-gold cursor-pointer"
                                        />
                                        <img src={s.image} alt={s.name} className="w-6 h-6 object-contain rounded" />
                                        <span className="text-[10px] text-gray-300 font-medium">{s.name}</span>
                                      </label>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Custom Name input for another strap */}
                              <div className="space-y-1 pt-2 border-t border-white/5">
                                <label className="text-[8px] text-gray-400 font-bold uppercase tracking-wider block">Add Custom Strap Name (Optional)</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Alligator Leather"
                                  value={editForm.customizationOptions?.customStrapName || ''}
                                  onChange={(e) => setEditForm({
                                    ...editForm,
                                    customizationOptions: {
                                      ...editForm.customizationOptions,
                                      customStrapName: e.target.value
                                    }
                                  })}
                                  className="w-full bg-luxury-dark border border-white/10 rounded text-white text-xs p-1.5 focus:outline-none"
                                />
                              </div>

                              {/* Image Upload for new straps */}
                              <div className="space-y-1">
                                <label className="text-[8px] text-gray-400 font-bold uppercase tracking-wider block">Upload Custom Strap Image</label>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleStrapImageChange(e, true)}
                                  className="text-[10px] text-gray-400 file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer"
                                />
                                {editForm.customizationOptions?.customStrapImage && (
                                  <div className="mt-1.5 flex items-center space-x-2 bg-black/20 p-1.5 rounded border border-white/5">
                                    <img
                                      src={editForm.customizationOptions.customStrapImage}
                                      alt="Strap Preview"
                                      className="w-10 h-10 object-contain rounded border border-white/10 bg-luxury-dark/40"
                                    />
                                    <div>
                                      <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-wider">Custom Strap Loaded</p>
                                      <p className="text-[8px] text-gray-400 truncate max-w-[200px]">
                                        {editForm.customizationOptions.customStrapName || 'Unnamed'}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2.5">
                            <input
                              type="checkbox"
                              id="allowCaseCustomization"
                              checked={editForm.allowCaseCustomization ?? true}
                              onChange={(e) => setEditForm({ ...editForm, allowCaseCustomization: e.target.checked })}
                              className="w-4 h-4 accent-luxury-gold cursor-pointer"
                            />
                            <label htmlFor="allowCaseCustomization" className="text-xs text-gray-300 cursor-pointer select-none">
                              Allow Case Finish Customization
                            </label>
                          </div>
                          {editForm.allowCaseCustomization && (
                            <div className="pl-6 space-y-2 border-l border-white/10 my-2">
                              <div className="space-y-1">
                                <label className="text-[8px] text-gray-400 font-bold uppercase tracking-wider block">Custom Case Name</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Matte Gold"
                                  value={editForm.customizationOptions?.customCaseName || ''}
                                  onChange={(e) => setEditForm({
                                    ...editForm,
                                    customizationOptions: {
                                      ...editForm.customizationOptions,
                                      customCaseName: e.target.value
                                    }
                                  })}
                                  className="w-full bg-luxury-dark border border-white/10 rounded text-white text-xs p-1.5 focus:outline-none"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[8px] text-gray-400 font-bold uppercase tracking-wider block">Case Color Option</label>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="color"
                                    value={editForm.customizationOptions?.customCaseColor || '#ffffff'}
                                    onChange={(e) => setEditForm({
                                      ...editForm,
                                      customizationOptions: {
                                        ...editForm.customizationOptions,
                                        customCaseColor: e.target.value
                                      }
                                    })}
                                    className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                                  />
                                  <span className="text-xs text-gray-300 font-mono">
                                    {editForm.customizationOptions?.customCaseColor || '#ffffff'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2.5">
                            <input
                              type="checkbox"
                              id="allowDialCustomization"
                              checked={editForm.allowDialCustomization ?? true}
                              onChange={(e) => setEditForm({ ...editForm, allowDialCustomization: e.target.checked })}
                              className="w-4 h-4 accent-luxury-gold cursor-pointer"
                            />
                            <label htmlFor="allowDialCustomization" className="text-xs text-gray-300 cursor-pointer select-none">
                              Allow Dial Color Customization
                            </label>
                          </div>
                          {editForm.allowDialCustomization && (
                            <div className="pl-6 space-y-1.5 border-l border-white/10 my-2">
                              <label className="text-[8px] text-gray-400 font-bold uppercase tracking-wider block font-sans">Available Dial Colors</label>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {DIAL_COLOR_PRESETS.map(color => {
                                  const isChecked = (editForm.customizationOptions?.dialColors || []).includes(color.hex);
                                  return (
                                    <label key={color.hex} className="flex items-center space-x-2 p-1.5 rounded border border-white/5 bg-luxury-dark/80 cursor-pointer hover:border-white/10 select-none">
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => handleDialColorCheckboxChange(color.hex, true)}
                                        className="w-3.5 h-3.5 accent-luxury-gold cursor-pointer"
                                      />
                                      <span className="w-3.5 h-3.5 rounded-full border border-white/10" style={{ backgroundColor: color.hex }} />
                                      <span className="text-[10px] text-gray-300 font-medium">{color.name}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="py-2.5 border border-white/10 text-white font-semibold uppercase hover:bg-white/5 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="py-2.5 bg-luxury-gold text-luxury-dark font-bold uppercase hover:bg-luxury-gold-dark transition"
                    >
                      Save Modifications
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Products Table */}
          <div className="bg-luxury-gray border border-white/5 rounded-md overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-luxury-dark border-b border-white/5 text-gray-400 uppercase tracking-widest text-[9px] font-bold">
                <tr>
                  <th className="p-4">Watch Profile</th>
                  <th className="p-4">Collection</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5 transition">
                    <td className="p-4 flex items-center space-x-3">
                      <div className="h-10 w-10 bg-luxury-dark border border-white/5 p-1 rounded flex items-center justify-center">
                        <img src={p.image} alt={p.name} className="max-h-full max-w-full object-contain" />
                      </div>
                      <div>
                        <span className="font-semibold text-white truncate max-w-xs block">{p.name}</span>
                        {p.customizable && (
                          <span className="text-[8px] text-luxury-gold font-black uppercase tracking-widest border border-luxury-gold/30 px-1.5 py-0.5 rounded-sm">
                            ✦ Customizable
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 uppercase tracking-wider text-[10px] text-gray-400">{p.category}</td>
                    <td className="p-4 font-bold text-white">{formatPrice(p.price, currentCurrency)}</td>
                    <td className="p-4">
                      <span className={`font-semibold ${p.stock === 0 ? 'text-luxury-red font-bold' : 'text-gray-300'}`}>
                        {p.stock === 0 ? 'SOLD OUT' : `${p.stock} units`}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleEditProductInit(p)}
                        className="p-1.5 bg-white/5 border border-white/10 hover:border-luxury-gold hover:text-luxury-gold text-gray-400 rounded transition cursor-pointer"
                        title="Edit watch"
                      >
                        <Edit size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteProductClick(p.id)}
                        className="p-1.5 bg-white/5 border border-white/10 hover:border-luxury-red hover:text-luxury-red text-gray-400 rounded transition cursor-pointer"
                        title="Delete watch"
                      >
                        <Trash2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB CONTENT: ORDER DISPATCHER (MANAGE STATUSES) --- */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-white">Client Invoice Dispatcher</h3>
          
          {orders.length === 0 ? (
            <p className="text-gray-400 text-xs italic p-4 text-center border border-dashed border-white/10 rounded">No order records found in simulated database.</p>
          ) : (
            <div className="bg-luxury-gray border border-white/5 rounded-md overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-luxury-dark border-b border-white/5 text-gray-400 uppercase tracking-widest text-[9px] font-bold">
                  <tr>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Items</th>
                    <th className="p-4">Charged</th>
                    <th className="p-4">Status Dispatch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-white/5 transition">
                      <td className="p-4 font-mono font-bold text-white tracking-wider uppercase">{o.id}</td>
                      <td className="p-4">
                        <p className="text-white font-semibold">{o.userName}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{o.userEmail}</p>
                      </td>
                      <td className="p-4 max-w-xs">
                        <p className="truncate text-gray-300 font-light" title={o.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}>
                          {o.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}
                        </p>
                      </td>
                      <td className="p-4 font-bold text-luxury-gold">{formatPrice(o.total, currentCurrency)}</td>
                      <td className="p-4">
                        <select
                          value={o.status}
                          onChange={(e) => dispatch(updateOrderStatus(o.id, e.target.value))}
                          className={`bg-luxury-dark text-xs border rounded px-2.5 py-1 font-semibold focus:outline-none ${
                            o.status === 'Delivered' 
                              ? 'border-emerald-500 text-emerald-400'
                              : o.status === 'Cancelled'
                              ? 'border-red-500 text-red-400'
                              : o.status === 'Shipped'
                              ? 'border-sky-500 text-sky-400'
                              : o.status === 'Exchange/Refund Requested'
                              ? 'border-purple-500 text-purple-450'
                              : 'border-yellow-500 text-yellow-450'
                          }`}
                        >
                          <option value="Paid">Paid</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                          <option value="Exchange/Refund Requested">Exchange/Refund Requested</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* --- TAB CONTENT: COUPON BUILDER --- */}
      {activeTab === 'coupons' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Create Form */}
          <div className="lg:col-span-5 bg-luxury-gray border border-white/5 p-6 rounded-md space-y-4 h-fit">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white border-b border-white/5 pb-2">Assemble Promo Codes</h4>
            
            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Coupon Name/Code</label>
                <input
                  type="text"
                  required
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  placeholder="GOLDENHOUR"
                  className="w-full bg-luxury-dark border border-white/10 rounded text-white p-2.5 uppercase font-mono tracking-wider"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Discount Amount (%)</label>
                <input
                  type="number"
                  required
                  min="5"
                  max="90"
                  value={newCouponDiscount}
                  onChange={(e) => setNewCouponDiscount(e.target.value)}
                  placeholder="30"
                  className="w-full bg-luxury-dark border border-white/10 rounded text-white p-2.5"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Description Tag</label>
                <input
                  type="text"
                  value={newCouponDesc}
                  onChange={(e) => setNewCouponDesc(e.target.value)}
                  placeholder="30% discount on summer collections"
                  className="w-full bg-luxury-dark border border-white/10 rounded text-white p-2.5"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-white text-luxury-dark font-bold text-xs tracking-widest uppercase hover:bg-luxury-gold hover:text-luxury-dark transition cursor-pointer"
              >
                Activate Coupon
              </button>
            </form>
          </div>

          {/* Right: List active coupons */}
          <div className="lg:col-span-7 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">Active Promo Database</h4>
            
            <div className="bg-luxury-gray border border-white/5 rounded-md divide-y divide-white/5">
              {coupons.map((c) => (
                <div key={c.code} className="flex justify-between items-center p-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-white text-sm font-bold tracking-wider">{c.code}</span>
                      <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded border border-emerald-500/20">
                        {c.discountPercent}% OFF
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500">{c.description || 'No description tag provided'}</p>
                  </div>
                  
                  <button
                    onClick={() => dispatch(deleteCoupon(c.code))}
                    className="p-1.5 text-gray-500 hover:text-luxury-red transition hover:bg-white/5 rounded"
                    title="Revoke code"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- TAB CONTENT: REVIEW MANAGER --- */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-white">Client Review Manager</h3>
          
          {activeReviews.length === 0 ? (
            <p className="text-gray-400 text-xs italic p-4 text-center border border-dashed border-white/10 rounded">No published reviews found.</p>
          ) : (
            <div className="space-y-4">
              {activeReviews.map((item) => (
                <div key={item.review.id} className="bg-luxury-gray border border-white/5 p-5 rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-white text-xs font-semibold">{item.review.userName}</span>
                      <span className="text-[10px] text-gray-500">on {item.productName}</span>
                    </div>
                    
                    <div className="flex text-luxury-gold">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={10} 
                          fill={i < item.review.rating ? "var(--color-luxury-gold)" : "none"} 
                          className="stroke-1"
                        />
                      ))}
                    </div>

                    <p className="text-gray-300 text-xs font-light leading-relaxed max-w-xl">"{item.review.comment}"</p>
                  </div>

                  <div className="flex space-x-2 flex-shrink-0">
                    <button
                      onClick={() => handleReviewStatus(item.productId, item.review.id, 'hidden')}
                      className="px-3 py-1.5 bg-transparent border border-white/10 hover:border-luxury-red hover:text-luxury-red text-[10px] font-bold uppercase tracking-wider rounded flex items-center space-x-1.5 transition cursor-pointer"
                    >
                      <Trash2 size={12} />
                      <span>Remove Review</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- TAB CONTENT: BRAND UPDATES MANAGER --- */}
      {activeTab === 'updates' && (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white">Brand Updates Manager</h3>
            <button
              onClick={() => {
                setShowAddUpdateForm(!showAddUpdateForm);
                setEditingUpdateId(null);
              }}
              className="px-4 py-2 bg-luxury-gold text-luxury-dark text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition hover:bg-luxury-gold-dark cursor-pointer rounded-sm"
            >
              <Plus size={14} />
              <span>{showAddUpdateForm ? 'Cancel Add' : 'Add New Update'}</span>
            </button>
          </div>

          {/* Form to Add New Update */}
          {showAddUpdateForm && (
            <div className="bg-luxury-gray border border-white/5 p-6 rounded-md max-w-xl">
              <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Create Brand Update</h4>
              <form onSubmit={handleCreateUpdate} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Update Title</label>
                  <input
                    type="text"
                    required
                    value={newUpdate.title}
                    onChange={(e) => setNewUpdate({ ...newUpdate, title: e.target.value })}
                    placeholder="e.g. Geneva Flagship Opening"
                    className="w-full bg-luxury-dark border border-white/10 rounded text-white p-2.5"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Update Detail Description</label>
                  <textarea
                    required
                    rows={3}
                    value={newUpdate.detail}
                    onChange={(e) => setNewUpdate({ ...newUpdate, detail: e.target.value })}
                    placeholder="Provide full description of the news milestone..."
                    className="w-full bg-luxury-dark border border-white/10 rounded text-white p-2.5 resize-none"
                  />
                </div>
                <div className="flex items-center space-x-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="newApproved"
                    checked={newUpdate.approved}
                    onChange={(e) => setNewUpdate({ ...newUpdate, approved: e.target.checked })}
                    className="w-4 h-4 accent-luxury-gold cursor-pointer"
                  />
                  <label htmlFor="newApproved" className="text-xs text-gray-300 cursor-pointer select-none">
                    Publish immediately (Approved)
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-white text-luxury-dark font-bold text-xs tracking-widest uppercase hover:bg-luxury-gold transition cursor-pointer"
                >
                  Publish Update
                </button>
              </form>
            </div>
          )}

          {/* Form to Edit Existing Update */}
          {editingUpdateId && editUpdateForm && (
            <div className="bg-luxury-gray border border-luxury-gold/20 p-6 rounded-md max-w-xl">
              <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Edit Brand Update</h4>
              <form onSubmit={handleUpdateUpdate} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Update Title</label>
                  <input
                    type="text"
                    required
                    value={editUpdateForm.title}
                    onChange={(e) => setEditUpdateForm({ ...editUpdateForm, title: e.target.value })}
                    className="w-full bg-luxury-dark border border-white/10 rounded text-white p-2.5"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Update Detail Description</label>
                  <textarea
                    required
                    rows={3}
                    value={editUpdateForm.detail}
                    onChange={(e) => setEditUpdateForm({ ...editUpdateForm, detail: e.target.value })}
                    className="w-full bg-luxury-dark border border-white/10 rounded text-white p-2.5 resize-none"
                  />
                </div>
                <div className="flex items-center space-x-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="editApproved"
                    checked={editUpdateForm.approved}
                    onChange={(e) => setEditUpdateForm({ ...editUpdateForm, approved: e.target.checked })}
                    className="w-4 h-4 accent-luxury-gold cursor-pointer"
                  />
                  <label htmlFor="editApproved" className="text-xs text-gray-300 cursor-pointer select-none">
                    Approved (Visible to clients)
                  </label>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingUpdateId(null);
                      setEditUpdateForm(null);
                    }}
                    className="flex-1 py-3 bg-transparent border border-white/10 text-white font-bold text-xs tracking-widest uppercase hover:bg-white/5 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-luxury-gold text-luxury-dark font-bold text-xs tracking-widest uppercase hover:bg-luxury-gold-dark transition cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List of existing updates */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">Brand Updates Database</h4>
            
            {adminUpdates.length === 0 ? (
              <p className="text-gray-400 text-xs italic p-6 text-center border border-dashed border-white/10 rounded">No brand updates found in database.</p>
            ) : (
              <div className="bg-luxury-gray border border-white/5 rounded-md divide-y divide-white/5">
                {adminUpdates.map((up) => (
                  <div key={up._id || up.id} className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2.5">
                        <span className="text-white text-sm font-bold tracking-wider">{up.title}</span>
                        <button
                          onClick={() => handleToggleUpdateApproval(up._id || up.id, up.approved)}
                          className={`text-[9px] font-bold px-2 py-0.5 rounded border transition cursor-pointer ${
                            up.approved 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                              : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                          }`}
                        >
                          {up.approved ? 'APPROVED & LIVE' : 'UNAPPROVED / HIDDEN'}
                        </button>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed font-light">{up.detail}</p>
                    </div>

                    <div className="flex space-x-2 flex-shrink-0">
                      <button
                        onClick={() => handleEditUpdateInit(up)}
                        className="p-2 text-gray-400 hover:text-white transition hover:bg-white/5 rounded"
                        title="Edit Update"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteUpdate(up._id || up.id)}
                        className="p-2 text-gray-400 hover:text-luxury-red transition hover:bg-white/5 rounded"
                        title="Delete Update"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB CONTENT: BLOGS EDITORIAL --- */}
      {activeTab === 'blogs' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white">Blogs Editorial Manager</h3>
            <button
              onClick={() => setShowAddBlogForm(!showAddBlogForm)}
              className="px-4 py-2 bg-white hover:bg-luxury-gold text-luxury-dark text-xs font-bold uppercase tracking-widest transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus size={14} />
              <span>{showAddBlogForm ? 'Close Form' : 'Write Blog'}</span>
            </button>
          </div>

          {/* Add Blog Form */}
          {showAddBlogForm && (
            <div className="bg-luxury-gray border border-white/5 p-6 rounded-md space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-white border-b border-white/5 pb-2">Publish New Article</h4>
              
              <form onSubmit={handleCreateBlog} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Article Title</label>
                  <input
                    type="text"
                    required
                    value={newBlog.title}
                    onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                    className="w-full bg-luxury-dark border border-white/10 rounded text-white text-xs p-2.5 focus:outline-none"
                    placeholder="The Evolution of Mechanical Movements"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Category</label>
                    <input
                      type="text"
                      required
                      value={newBlog.category}
                      onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
                      className="w-full bg-luxury-dark border border-white/10 rounded text-white text-xs p-2.5 focus:outline-none"
                      placeholder="Horology"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Author</label>
                    <input
                      type="text"
                      value={newBlog.author}
                      onChange={(e) => setNewBlog({ ...newBlog, author: e.target.value })}
                      className="w-full bg-luxury-dark border border-white/10 rounded text-white text-xs p-2.5 focus:outline-none"
                      placeholder="KHRONIQ Editorial"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Featured Image URL / Path</label>
                  <input
                    type="text"
                    value={newBlog.image}
                    onChange={(e) => setNewBlog({ ...newBlog, image: e.target.value })}
                    className="w-full bg-luxury-dark border border-white/10 rounded text-white text-xs p-2.5 focus:outline-none"
                    placeholder="e.g. /assets/gentleman_lifestyle.png"
                  />
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Content</label>
                  <textarea
                    rows="6"
                    required
                    value={newBlog.content}
                    onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                    className="w-full bg-luxury-dark border border-white/10 rounded text-white text-xs p-2.5 focus:outline-none font-sans"
                    placeholder="Write article details here..."
                  />
                </div>

                <button
                  type="submit"
                  className="md:col-span-2 py-3 bg-luxury-gold text-luxury-dark font-bold text-xs tracking-widest uppercase hover:bg-luxury-gold-dark transition"
                >
                  Publish Article
                </button>
              </form>
            </div>
          )}

          {/* Edit Blog Form */}
          {editingBlogId && editBlogForm && (
            <div className="bg-[#1a1a1a] border border-luxury-gold/20 p-6 rounded-md space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-luxury-gold border-b border-white/5 pb-2">Edit Article</h4>
              
              <form onSubmit={handleUpdateBlogSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Article Title</label>
                  <input
                    type="text"
                    required
                    value={editBlogForm.title}
                    onChange={(e) => setEditBlogForm({ ...editBlogForm, title: e.target.value })}
                    className="w-full bg-luxury-dark border border-white/10 rounded text-white text-xs p-2.5 focus:outline-none"
                    placeholder="Article Title"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Category</label>
                    <input
                      type="text"
                      required
                      value={editBlogForm.category}
                      onChange={(e) => setEditBlogForm({ ...editBlogForm, category: e.target.value })}
                      className="w-full bg-luxury-dark border border-white/10 rounded text-white text-xs p-2.5 focus:outline-none"
                      placeholder="Category"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Author</label>
                    <input
                      type="text"
                      value={editBlogForm.author}
                      onChange={(e) => setEditBlogForm({ ...editBlogForm, author: e.target.value })}
                      className="w-full bg-luxury-dark border border-white/10 rounded text-white text-xs p-2.5 focus:outline-none"
                      placeholder="Author"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Featured Image URL / Path</label>
                  <input
                    type="text"
                    value={editBlogForm.image}
                    onChange={(e) => setEditBlogForm({ ...editBlogForm, image: e.target.value })}
                    className="w-full bg-luxury-dark border border-white/10 rounded text-white text-xs p-2.5 focus:outline-none"
                    placeholder="Image URL"
                  />
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Content</label>
                  <textarea
                    rows="6"
                    required
                    value={editBlogForm.content}
                    onChange={(e) => setEditBlogForm({ ...editBlogForm, content: e.target.value })}
                    className="w-full bg-luxury-dark border border-white/10 rounded text-white text-xs p-2.5 focus:outline-none font-sans"
                    placeholder="Write article details here..."
                  />
                </div>

                <div className="md:col-span-2 flex space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingBlogId(null);
                      setEditBlogForm(null);
                    }}
                    className="flex-1 py-3 bg-transparent border border-white/10 text-white font-bold text-xs tracking-widest uppercase hover:bg-white/5 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-luxury-gold text-luxury-dark font-bold text-xs tracking-widest uppercase hover:bg-luxury-gold-dark transition cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Blogs list */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">Articles Database</h4>
            
            {blogs.length === 0 ? (
              <p className="text-gray-400 text-xs italic p-6 text-center border border-dashed border-white/10 rounded">No blog posts found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {blogs.map((blog) => (
                  <div key={blog.id || blog._id} className="bg-luxury-gray border border-white/5 p-4 rounded-md flex gap-4 items-start">
                    <img 
                      src={blog.image || '/assets/media__1782899491225.jpg'} 
                      alt={blog.title} 
                      className="w-20 h-20 object-cover rounded border border-white/10 bg-black flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[9px] font-bold text-luxury-gold uppercase tracking-wider">{blog.category} · By {blog.author}</span>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleEditBlogInit(blog)}
                            className="text-gray-400 hover:text-white transition rounded p-0.5"
                            title="Edit Article"
                          >
                            <Edit size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteBlog(blog.id || blog._id)}
                            className="text-gray-400 hover:text-luxury-red transition rounded p-0.5"
                            title="Delete Article"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                      <h4 className="text-white text-sm font-bold truncate leading-tight">{blog.title}</h4>
                      <p className="text-[11px] text-gray-400 line-clamp-2 leading-normal">{blog.content}</p>
                      <span className="text-[9px] text-gray-500 block pt-1">{blog.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

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
  fetchAnalytics,
  selectCurrentCurrency,
  formatPrice,
  logoutUser
} from '../store/slices/watchSlice';
import { 
  BarChart3, Plus, Edit, Trash2, Check, X, Tag, Star, 
  Package, AlertTriangle, ShieldAlert, ArrowLeft, ArrowUpRight,
  CheckCircle2, LogOut, Newspaper,ImagePlus
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

  // Active Admin Sub-Tab
  const [activeTab, setActiveTab] = useState('analytics'); // analytics | products | orders | coupons | reviews

  // Add Product Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    stock: '',
    warrantyMonths: 6,
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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editForm, setEditForm] = useState(null);

  // Add Coupon Form State
// Add Coupon Form State
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('');
  const [newCouponDesc, setNewCouponDesc] = useState('');


  // Analytics State
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      dispatch(fetchAnalytics()).then((data) => {
        if (data) setAnalytics(data);
      });
    }
  }, [currentUser, dispatch]);

  // --- BRAND UPDATES ADMIN STATES & OPERATIONS ---
  const [adminUpdates, setAdminUpdates] = useState([]);
  const [showAddUpdateForm, setShowAddUpdateForm] = useState(false);
  const [newUpdate, setNewUpdate] = useState({ title: '', detail: '', approved: true });
  const [editingUpdateId, setEditingUpdateId] = useState(null);
  const [editUpdateForm, setEditUpdateForm] = useState(null);

  // --- MEDIA MANAGER STATES ---
  const [mediaSection, setMediaSection] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaList, setMediaList] = useState([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);


  const HOMEPAGE_SECTIONS = [
    { key: 'gender_men', label: "Shop by Gender — Men's Banner" },
    { key: 'gender_women', label: "Shop by Gender — Women's Banner" },
    { key: 'collection_khronomaster', label: 'Collection Tile — Khronomaster' },
    { key: 'collection_defy', label: 'Collection Tile — Defy' },
    { key: 'collection_heritage', label: 'Collection Tile — Elite & Heritage' },
    { key: 'hero_slide1_lifestyle', label: 'Hero Slide 1 — Lifestyle Image' },
    { key: 'hero_slide1_product', label: 'Hero Slide 1 — Product Image' },
    { key: 'hero_slide2_lifestyle', label: 'Hero Slide 2 — Lifestyle Image' },
    { key: 'hero_slide2_product', label: 'Hero Slide 2 — Product Image' },
    { key: 'hero_slide3_lifestyle', label: 'Hero Slide 3 — Lifestyle Image' },
    { key: 'hero_slide3_product', label: 'Hero Slide 3 — Product Image' },
    { key: 'dive_deeper_hero', label: 'Dive Deeper — Hero Background' },
    { key: 'dive_deeper_tile1', label: 'Dive Deeper — Khronomaster El Primero' },
    { key: 'dive_deeper_tile2', label: 'Dive Deeper — Defy Extreme' }
  ];

  useEffect(() => {
    if (currentUser?.role === 'admin' && activeTab === 'media') {
      const token = localStorage.getItem('khroniq_token');
      fetch('/api/admin/media', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            const lookup = {};
            data.media.forEach(doc => {
              if (!lookup[doc.section]) lookup[doc.section] = doc.url; // newest first, already sorted server-side
            });
            setMediaList(lookup);
          }
        })
        .catch(err => console.error('Failed to fetch media:', err));
    }
  }, [currentUser, activeTab]);

  const handleSectionImageUpload = async (e, sectionKey) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingMedia(true);
    const formData = new FormData();
    formData.append('files', file);
    formData.append('section', sectionKey);

    try {
      const token = localStorage.getItem('khroniq_token');
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (data.success && data.media?.[0]) {
        setMediaList(prev => ({ ...prev, [sectionKey]: data.media[0].url }));
      } else {
        alert(data.message || 'Upload failed.');
      }
    } catch (err) {
      console.error('Section image upload error:', err);
      alert('Failed to upload image.');
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleStrapImageChange = async (e, isEdit = false) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('image', file);

  try {
    const token = localStorage.getItem('khroniq_token');
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });
    const data = await res.json();

    if (data.success) {
      if (isEdit) {
        setEditForm(prev => ({
          ...prev,
          customizationOptions: { ...prev.customizationOptions, customStrapImage: data.imageUrl }
        }));
      } else {
        setNewProduct(prev => ({
          ...prev,
          customizationOptions: { ...prev.customizationOptions, customStrapImage: data.imageUrl }
        }));
      }
    } else {
      alert(data.message || 'Strap image upload failed');
    }
  } catch (error) {
    console.error('Strap image upload error:', error);
    alert('Strap image upload failed');
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
    if (currentUser && currentUser.role === 'admin' && activeTab === 'updates') {
      fetchAdminUpdates();
    }
  }, [activeTab, currentUser]);


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
// --- ANALYTICS CALCULATIONS (fallback client-side values, used until backend analytics loads) ---
  const totalSales = orders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = orders.length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

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




const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setUploadingImage(true);
  const formData = new FormData();
  formData.append('image', file);

  try {
    const token = localStorage.getItem('khroniq_token');
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });
    const data = await res.json();
    if (data.success) {
      setNewProduct({ ...newProduct, image: data.imageUrl });
    } else {
      alert(data.message || 'Image upload failed');
    }
  } catch (error) {
    console.error('Upload error:', error);
    alert('Image upload failed');
  } finally {
    setUploadingImage(false);
  }
};



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
        name: '', price: '', stock: '', warrantyMonths: 12, category: 'Khronomaster', description: '',
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
          { key: 'media', label: 'Homepage Media', icon: ImagePlus },
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
<p className="text-2xl font-extrabold text-luxury-gold">{formatPrice(analytics?.totalRevenue ?? totalSales, currentCurrency)}</p>
              <span className="text-[9px] text-gray-500 font-light">Excludes cancelled orders</span>
            </div>
            
            <div className="bg-luxury-gray border border-white/5 p-6 rounded-md space-y-2">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Total Orders</span>
              <p className="text-2xl font-extrabold text-white">{analytics?.totalOrders ?? totalOrdersCount}</p>
              <span className="text-[9px] text-gray-500 font-light">All status types included</span>
            </div>

            <div className="bg-luxury-gray border border-white/5 p-6 rounded-md space-y-2">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Out of Stock Watches</span>
              <p className="text-2xl font-extrabold text-white flex items-center space-x-2">
                <span>{analytics?.outOfStockCount ?? outOfStockCount}</span>
                {(analytics?.outOfStockCount ?? outOfStockCount) > 0 && <AlertTriangle size={18} className="text-luxury-red animate-pulse" />}
              </p>
              <span className="text-[9px] text-gray-500">Requires production triggers</span>
            </div>

            <div className="bg-luxury-gray border border-white/5 p-6 rounded-md space-y-2">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Low Stock Alerts</span>
              <p className="text-2xl font-extrabold text-white">{analytics?.lowStockProducts?.length ?? 0}</p>
              <span className="text-[9px] text-gray-500">Products under 5 units</span>
            </div>
          </div>

          {/* Sales by Category Chart (real data) */}
          <div className="bg-luxury-gray border border-white/5 p-6 sm:p-8 rounded-md space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-white">Sales by Category</h3>
                <p className="text-[10px] text-gray-500 mt-0.5">Real revenue breakdown by watch collection</p>
              </div>
              <span className="bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-400 px-2.5 py-1 tracking-widest uppercase rounded">
                Live Data
              </span>
            </div>

            {!analytics || analytics.salesByCategory.length === 0 ? (
              <p className="text-gray-500 text-xs italic text-center py-8">No sales data yet.</p>
            ) : (
              <div className="space-y-3">
                {analytics.salesByCategory.map((cat) => {
                  const maxRevenue = Math.max(...analytics.salesByCategory.map(c => c.revenue));
                  const widthPct = maxRevenue > 0 ? (cat.revenue / maxRevenue) * 100 : 0;
                  return (
                    <div key={cat._id} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-300 font-semibold uppercase tracking-wide">{cat._id}</span>
                        <span className="text-luxury-gold font-bold">${cat.revenue.toLocaleString()}</span>
                      </div>
                      <div className="h-2.5 bg-luxury-dark rounded-full overflow-hidden">
                        <div
                          className="h-full bg-luxury-gold rounded-full transition-all"
                          style={{ width: `${widthPct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>


          {/* Best Sellers & Low Stock */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-luxury-gray border border-white/5 p-6 rounded-md space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white border-b border-white/5 pb-3">Best Selling Timepieces</h3>
              {!analytics || analytics.bestSellers.length === 0 ? (
                <p className="text-gray-500 text-xs italic">No sales yet.</p>
              ) : (
                <div className="space-y-3">
                  {analytics.bestSellers.map((item, idx) => (
                    <div key={item._id} className="flex justify-between items-center text-xs">
                      <span className="text-gray-300"><span className="text-luxury-gold font-bold mr-2">#{idx + 1}</span>{item.name}</span>
                      <span className="text-white font-semibold">{item.totalQuantity} sold</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-luxury-gray border border-white/5 p-6 rounded-md space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white border-b border-white/5 pb-3">Low Stock Warning</h3>
              {!analytics || analytics.lowStockProducts.length === 0 ? (
                <p className="text-gray-500 text-xs italic">All products sufficiently stocked.</p>
              ) : (
                <div className="space-y-3">
                  {analytics.lowStockProducts.map((item) => (
                    <div key={item._id} className="flex justify-between items-center text-xs">
                      <span className="text-gray-300">{item.name}</span>
                      <span className={`font-bold ${item.stock === 0 ? 'text-luxury-red' : 'text-yellow-400'}`}>
                        {item.stock} left
                      </span>
                    </div>
                  ))}
                </div>
              )}

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

                <div className="grid grid-cols-3 gap-4">
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
                  <div className="space-y-1.5">
  <label className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Warranty Period (Months)</label>
  <input
    type="number"
    required
    min="0"
    value={newProduct.warrantyMonths}
    onChange={(e) => setNewProduct({ ...newProduct, warrantyMonths: e.target.value })}
    className="w-full bg-luxury-dark border border-white/10 rounded text-white text-xs p-2.5 focus:outline-none"
    placeholder="12"
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
  <label className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Watch Image</label>
  <input
    type="file"
    accept="image/*"
    onChange={handleImageUpload}
    className="w-full bg-luxury-dark border border-white/10 rounded text-white text-xs p-2.5 focus:outline-none file:mr-3 file:py-1 file:px-3 file:border-0 file:text-xs file:bg-luxury-gold file:text-luxury-dark file:font-bold file:uppercase file:cursor-pointer"
  />
  {uploadingImage && <p className="text-[10px] text-luxury-gold">Uploading image...</p>}
  {newProduct.image && !uploadingImage && (
    <img src={newProduct.image} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded border border-white/10" />
  )}
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
                          allowCaseCustomization: val ? (newProduct.allowCaseCustomization ?? true) : false
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

                      {/* Available Dial Colors Selector */}
                      <div className="space-y-1.5 pt-2 border-t border-white/5">
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

                  <div className="grid grid-cols-3 gap-4">
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
  <label className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Warranty Period (Months)</label>
  <input
    type="number"
    required
    min="0"
    value={editForm.warrantyMonths}
    onChange={(e) => setEditForm({ ...editForm, warrantyMonths: Number(e.target.value) })}
    className="w-full bg-luxury-dark border border-white/10 rounded text-white p-2.5"
  />
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
                            allowCaseCustomization: val ? (editForm.allowCaseCustomization ?? true) : false
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

                        {/* Available Dial Colors Selector */}
                        <div className="space-y-1.5 pt-2 border-t border-white/5">
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

      {activeTab === 'media' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">Homepage Media</h3>
            <p className="text-gray-400 text-xs mt-1">Upload or replace the image used in each homepage section.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {HOMEPAGE_SECTIONS.map((section) => (
              <div key={section.key} className="bg-luxury-gray border border-white/10 rounded p-3 space-y-2">
                <div className="w-full h-32 bg-luxury-dark rounded overflow-hidden flex items-center justify-center">
                  {mediaList[section.key] ? (
                    <img src={mediaList[section.key]} alt={section.label} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[9px] text-gray-500 uppercase tracking-wider">No custom image set</span>
                  )}
                </div>
                <p className="text-[10px] text-gray-300 font-semibold">{section.label}</p>
                <label className="block w-full text-center py-2 bg-luxury-dark border border-white/10 hover:border-luxury-gold text-[9px] font-bold uppercase tracking-widest text-gray-300 rounded cursor-pointer transition">
                  {uploadingMedia ? 'Uploading...' : 'Upload / Replace'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingMedia}
                    onChange={(e) => handleSectionImageUpload(e, section.key)}
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

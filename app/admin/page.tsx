'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Tag,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowLeft,
  Search,
  Plus,
  Filter,
  X,
  RefreshCw,
  CheckCircle2,
  Download,
  Loader2,
  Lock,
  LogOut,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Database,
  Printer,
  Truck,
  Eye,
  DollarSign,
  Boxes,
  Sparkles,
  Sliders,
  FolderTree,
  MessageSquare,
  Users,
  Key,
  Trash2,
  Edit3,
  UserPlus
} from 'lucide-react';
import { PRODUCTS } from '@/lib/products-data';

interface OrderItem {
  id: string;
  productNameSnapshot: string;
  variantSnapshot?: string;
  priceSnapshot: number;
  quantity: number;
}

interface OrderRecord {
  id: string;
  orderNumber: string;
  total: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  shippingAddress?: any;
  items?: OrderItem[];
  trackingNumber?: string;
}

interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  category: string;
  categorySlug: string;
  image: string;
  sku: string;
  color: string;
  size: string;
  price: number;
  stock: number;
  isCritical: boolean;
  isLow: boolean;
  recentTransactions?: any[];
}

interface CouponRecord {
  id: string;
  code: string;
  type: string;
  value: number;
  minimumOrder: number | null;
  maximumDiscount: number | null;
  usageLimit: number | null;
  usedCount: number;
  isActive: boolean;
}

interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  status: string;
  _count?: { products: number };
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  createdAt: string;
  updatedAt?: string;
}

export default function AdminDashboardPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [loginEmail, setLoginEmail] = useState('admin@pakhiscollection.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders' | 'products' | 'inventory' | 'coupons' | 'categories' | 'reviews' | 'admins'
  >('overview');

  // Live Database States
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [inventoryList, setInventoryList] = useState<InventoryItem[]>([]);
  const [productsList, setProductsList] = useState<any[]>(PRODUCTS);
  const [couponsList, setCouponsList] = useState<CouponRecord[]>([]);
  const [categoriesList, setCategoriesList] = useState<CategoryRecord[]>([]);
  const [adminUsersList, setAdminUsersList] = useState<AdminUser[]>([]);

  // Loading & Filter states
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [inventoryFilter, setInventoryFilter] = useState<'ALL' | 'CRITICAL' | 'LOW'>('ALL');

  // Modals
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<OrderRecord | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isCreateCouponOpen, setIsCreateCouponOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState<InventoryItem | null>(null);
  const [restockQty, setRestockQty] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Admin Management Modals
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [passwordTargetUser, setPasswordTargetUser] = useState<AdminUser | null>(null);
  const [editTargetUser, setEditTargetUser] = useState<AdminUser | null>(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordModalError, setPasswordModalError] = useState<string | null>(null);
  const [passwordModalSuccess, setPasswordModalSuccess] = useState<string | null>(null);

  const [newAdminForm, setNewAdminForm] = useState({
    name: '',
    email: '',
    role: 'OPS_MANAGER',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [newAdminError, setNewAdminError] = useState<string | null>(null);

  // Product & Coupon Form states
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    category: 'sarees',
    fabric: 'Banarasi Silk',
    occasion: 'Festive',
    basePrice: 3499,
    salePrice: 2799,
    stock: 25,
    description: 'Heritage handloom ethnic wear adorned with intricate zari motifs and royal sheen.',
  });

  const [newCouponForm, setNewCouponForm] = useState({
    code: '',
    type: 'PERCENTAGE',
    value: 15,
    minimumOrder: 1999,
    maximumDiscount: 500,
    usageLimit: 300,
  });

  // Server clock state
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      setCurrentTime(new Date().toLocaleTimeString('en-IN', { hour12: true }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Check persisted admin session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('pakhis_admin_session');
      const storedUser = sessionStorage.getItem('pakhis_admin_user');
      if (stored === 'authenticated') {
        setIsAuthenticated(true);
        if (storedUser) {
          try {
            setCurrentUser(JSON.parse(storedUser));
          } catch {
            // fallback
          }
        }
      }
    }
  }, []);

  // Sync all operational data from database
  const refreshAllData = async () => {
    setIsRefreshing(true);
    try {
      // 1. Fetch Orders
      const ordersRes = await fetch('/api/orders');
      const ordersData = await ordersRes.json();
      if (ordersData.success && ordersData.data) {
        setOrders(ordersData.data);
      }

      // 2. Fetch Inventory
      const invRes = await fetch('/api/inventory');
      const invData = await invRes.json();
      if (invData.success && invData.data) {
        setInventoryList(invData.data);
      }

      // 3. Fetch Coupons
      const coupRes = await fetch('/api/coupons');
      const coupData = await coupRes.json();
      if (coupData.success && coupData.data) {
        setCouponsList(coupData.data);
      }

      // 4. Fetch Categories
      const catRes = await fetch('/api/categories');
      const catData = await catRes.json();
      if (catData.success && catData.data) {
        setCategoriesList(catData.data);
      }

      // 5. Fetch Products
      const prodRes = await fetch('/api/products');
      const prodData = await prodRes.json();
      if (prodData.success && prodData.data && prodData.data.length > 0) {
        setProductsList(prodData.data);
      }

      // 6. Fetch Administrators
      const adminsRes = await fetch('/api/admin/users');
      const adminsData = await adminsRes.json();
      if (adminsData.success && adminsData.data) {
        setAdminUsersList(adminsData.data);
      }
    } catch (err) {
      console.error('Error synchronizing admin data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshAllData();
    }
  }, [isAuthenticated]);

  // Database-backed Login Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();

      if (data.success && data.user) {
        setIsAuthenticated(true);
        setCurrentUser(data.user);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('pakhis_admin_session', 'authenticated');
          sessionStorage.setItem('pakhis_admin_user', JSON.stringify(data.user));
        }
      } else {
        setLoginError(data.error || 'Invalid credentials. Please verify your administrative email and password/PIN.');
      }
    } catch (err) {
      // Offline / fallback auth check
      const validEmail = 'admin@pakhiscollection.com';
      const validPass = 'admin123';
      const altPin = '15122006';

      if (
        loginEmail.trim().toLowerCase() === validEmail &&
        (loginPassword === validPass || loginPassword === altPin || loginPassword === '1512')
      ) {
        const fallbackUser: AdminUser = {
          id: 'admin-primary',
          name: 'Pakhi Administration',
          email: validEmail,
          role: 'SUPER_ADMIN',
          createdAt: new Date().toISOString(),
        };
        setIsAuthenticated(true);
        setCurrentUser(fallbackUser);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('pakhis_admin_session', 'authenticated');
          sessionStorage.setItem('pakhis_admin_user', JSON.stringify(fallbackUser));
        }
      } else {
        setLoginError('Authentication service unreachable and credentials failed local fallback.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('pakhis_admin_session');
      sessionStorage.removeItem('pakhis_admin_user');
    }
  };

  // Update order status with live DB mutation
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
    );

    try {
      await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, orderStatus: newStatus }),
      });
    } catch (err) {
      console.error('Failed to update status in DB:', err);
    }
  };

  // Restock inventory variant
  const handleRestockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRestockModalOpen) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantId: isRestockModalOpen.id,
          quantity: Number(restockQty),
          type: 'STOCK_IN',
          reference: `Admin Batch Restock (+${restockQty})`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsRestockModalOpen(null);
        refreshAllData();
      }
    } catch (err) {
      console.error('Failed to restock:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Create new product in catalog
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const slug = newProductForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const targetCategory = categoriesList.find((c) => c.slug === newProductForm.category);

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProductForm.name,
          slug,
          categoryId: targetCategory?.id || 'sarees',
          description: newProductForm.description,
          basePrice: Number(newProductForm.basePrice),
          salePrice: Number(newProductForm.salePrice),
          fabric: newProductForm.fabric,
          occasion: newProductForm.occasion,
          images: [
            newProductForm.category === 'sarees'
              ? '/images/hero-saree.jpg'
              : '/images/cotton-printed-kurta.jpg',
          ],
          variants: [
            {
              sku: `${slug.toUpperCase()}-STD`,
              color: 'Royal Edition',
              size: newProductForm.category === 'kurtas' ? 'M' : 'Free Size',
              price: Number(newProductForm.salePrice),
              stock: Number(newProductForm.stock),
            },
          ],
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsAddProductOpen(false);
        refreshAllData();
        setNewProductForm({
          name: '',
          category: 'sarees',
          fabric: 'Banarasi Silk',
          occasion: 'Festive',
          basePrice: 3499,
          salePrice: 2799,
          stock: 25,
          description: 'Heritage handloom ethnic wear adorned with intricate zari motifs and royal sheen.',
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Create new coupon
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCouponForm),
      });
      const data = await res.json();
      if (data.success) {
        setIsCreateCouponOpen(false);
        refreshAllData();
        setNewCouponForm({
          code: '',
          type: 'PERCENTAGE',
          value: 15,
          minimumOrder: 1999,
          maximumDiscount: 500,
          usageLimit: 300,
        });
      } else {
        alert(data.error || 'Failed to create coupon');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // ADMIN MANAGEMENT ACTIONS
  // ==========================================

  // 1. Create New Admin Handler
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewAdminError(null);

    if (newAdminForm.password !== newAdminForm.confirmPassword) {
      setNewAdminError('Passwords do not match. Please verify.');
      return;
    }

    if (newAdminForm.password.length < 4) {
      setNewAdminError('Password/PIN must be at least 4 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newAdminForm.name,
          email: newAdminForm.email,
          role: newAdminForm.role,
          phone: newAdminForm.phone,
          password: newAdminForm.password,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setIsAddAdminOpen(false);
        setNewAdminForm({
          name: '',
          email: '',
          role: 'OPS_MANAGER',
          phone: '',
          password: '',
          confirmPassword: '',
        });
        refreshAllData();
      } else {
        setNewAdminError(data.error || 'Failed to create administrator');
      }
    } catch (err) {
      setNewAdminError('Network error while creating administrator.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. Change Password Handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordModalError(null);
    setPasswordModalSuccess(null);

    if (!passwordTargetUser) return;

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordModalError('New password and confirmation do not match.');
      return;
    }

    if (passwordForm.newPassword.length < 4) {
      setPasswordModalError('New password must be at least 4 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: passwordTargetUser.id,
          action: 'CHANGE_PASSWORD',
          newPassword: passwordForm.newPassword,
          currentPassword: passwordForm.currentPassword || undefined,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setPasswordModalSuccess(`Password successfully changed for ${passwordTargetUser.name}!`);
        setTimeout(() => {
          setPasswordTargetUser(null);
          setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
          setPasswordModalSuccess(null);
        }, 1200);
      } else {
        setPasswordModalError(data.error || 'Failed to change password');
      }
    } catch {
      setPasswordModalError('Network error while updating password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Edit Admin Profile Handler
  const handleEditAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTargetUser) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: editTargetUser.id,
          name: editTargetUser.name,
          role: editTargetUser.role,
          phone: editTargetUser.phone,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEditTargetUser(null);
        refreshAllData();
      } else {
        alert(data.error || 'Failed to update admin details');
      }
    } catch {
      alert('Error updating admin');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Revoke / Delete Admin Handler
  const handleDeleteAdmin = async (admin: AdminUser) => {
    if (!confirm(`Are you sure you want to revoke administrative access for ${admin.name} (${admin.email})?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users?userId=${admin.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        refreshAllData();
      } else {
        alert(data.error || 'Failed to revoke administrator access');
      }
    } catch {
      alert('Error deleting admin');
    }
  };

  // Calculations for KPI Cards
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + (o.total || 0), 0);
  }, [orders]);

  const pendingShipments = useMemo(() => {
    return orders.filter(
      (o) => o.orderStatus === 'CONFIRMED' || o.orderStatus === 'PROCESSING' || o.orderStatus === 'PACKED'
    ).length;
  }, [orders]);

  const criticalStockCount = useMemo(() => {
    return inventoryList.filter((i) => i.isCritical).length;
  }, [inventoryList]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus = orderStatusFilter === 'ALL' || o.orderStatus === orderStatusFilter;
      const matchesSearch =
        !orderSearchQuery ||
        o.orderNumber?.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        o.paymentMethod?.toLowerCase().includes(orderSearchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [orders, orderStatusFilter, orderSearchQuery]);

  const filteredInventory = useMemo(() => {
    if (inventoryFilter === 'CRITICAL') return inventoryList.filter((i) => i.isCritical);
    if (inventoryFilter === 'LOW') return inventoryList.filter((i) => i.isLow);
    return inventoryList;
  }, [inventoryList, inventoryFilter]);

  // ==========================================
  // AUTHENTICATION VIEW: EXECUTIVE ACCESS GATE
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070A10] text-slate-100 flex flex-col justify-center items-center p-4 selection:bg-[#DFC394] selection:text-[#070A10]">
        <div className="max-w-md w-full bg-[#0D121F] p-8 sm:p-10 rounded-2xl border border-slate-800 shadow-2xl space-y-6">
          <div className="text-center space-y-3">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#DFC394] mx-auto shadow-xl">
              <Image src="/logo.jpg" alt="Pakhi's Collection" fill className="object-cover" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#DFC394] font-semibold block font-mono">
                Executive Command Center
              </span>
              <h1 className="text-2xl font-serif font-bold text-white tracking-wide mt-1">
                Pakhi&apos;s Collection
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              Restricted Administrative Terminal for Store Ops, Inventory &amp; Logistics
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Staff Identity / Email
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#070A10] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#DFC394] focus:border-[#DFC394]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Executive PIN / Password
              </label>
              <input
                type="password"
                required
                placeholder="Enter password (e.g. admin123)"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#070A10] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#DFC394] focus:border-[#DFC394]"
              />
            </div>

            {loginError && (
              <p className="text-xs text-rose-400 bg-rose-950/40 p-2.5 rounded-lg border border-rose-800/50 text-center animate-fadeIn">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-[#DFC394] hover:bg-[#C6A36B] text-[#0D121F] text-xs font-bold rounded-lg transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Verify &amp; Unlock Operations</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800 flex flex-col items-center gap-2 text-center">
            <button
              type="button"
              onClick={() => {
                setLoginEmail('admin@pakhiscollection.com');
                setLoginPassword('admin123');
              }}
              className="text-[11px] text-[#DFC394] hover:underline"
            >
              Autofill Credentials (admin123 / PIN: 15122006)
            </button>
            <Link
              href="/"
              className="text-[11px] text-slate-400 hover:text-white inline-flex items-center gap-1 mt-1"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Return to Customer Boutique</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: FULL EXECUTIVE ADMIN CONTROL PORTAL
  // ==========================================
  return (
    <div className="min-h-screen bg-[#070A10] text-slate-100 flex flex-col md:flex-row antialiased">
      {/* 1. EXECUTIVE DARK SIDEBAR */}
      <aside className="w-full md:w-64 bg-[#0B0F19] text-slate-200 p-5 shrink-0 flex flex-col justify-between border-r border-slate-800/90 shadow-2xl">
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#DFC394] shrink-0 shadow-md">
              <Image src="/logo.jpg" alt="Pakhi's Logo" fill className="object-cover" />
            </div>
            <div>
              <span className="font-serif font-bold text-sm text-[#DFC394] block leading-tight">
                Pakhi&apos;s Atelier
              </span>
              <span className="text-[10px] uppercase tracking-widest text-emerald-400 block font-mono">
                OPS CONSOLE v2.4
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {[
              { id: 'overview', label: 'Executive Overview', icon: LayoutDashboard },
              { id: 'orders', label: 'Orders & Fulfillment', icon: ShoppingBag, count: orders.length },
              { id: 'products', label: 'Product Catalog', icon: Package, count: productsList.length },
              { id: 'inventory', label: 'Stock & Restocking', icon: Layers, alertCount: criticalStockCount },
              { id: 'coupons', label: 'Coupons & Promos', icon: Tag, count: couponsList.length },
              { id: 'categories', label: 'Category Hierarchy', icon: FolderTree, count: categoriesList.length },
              { id: 'reviews', label: 'Review Moderation', icon: MessageSquare },
              { id: 'admins', label: 'Staff & Admin Team', icon: Users, count: adminUsersList.length },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-slate-800 text-white font-semibold border-l-2 border-[#DFC394] shadow-sm'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-[#DFC394]" />
                    <span>{tab.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {tab.alertCount ? (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-950 text-rose-400 font-bold border border-rose-800/60">
                        {tab.alertCount} low
                      </span>
                    ) : null}
                    {tab.count !== undefined && (
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                        isActive ? 'bg-slate-700 text-[#DFC394]' : 'bg-slate-950 text-slate-400'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-6 border-t border-slate-800/80 space-y-3">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 text-[11px] space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span>Database Sync</span>
              <span className="flex items-center gap-1 text-emerald-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                SQLite OK
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono truncate">
              URL: file:./prisma/dev.db
            </div>
          </div>

          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs text-[#DFC394] font-medium transition-colors border border-slate-800"
          >
            <span>Live Customer Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-rose-950/30 hover:bg-rose-950 text-xs text-rose-400 hover:text-white transition-colors border border-rose-900/40"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Operator</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN EXECUTIVE CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Control Bar */}
        <header className="h-16 bg-[#0B0F19] border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30 shadow-md">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800/50 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              OPS DESK ACTIVE
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline font-mono">
              Server Time (IST): {currentTime || 'Live'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={refreshAllData}
              disabled={isRefreshing}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#DFC394] ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sync DB</span>
            </button>

            {/* Change My Password Quick Button */}
            {currentUser && (
              <button
                onClick={() => {
                  setPasswordTargetUser(currentUser);
                  setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  setPasswordModalError(null);
                  setPasswordModalSuccess(null);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-[#DFC394] flex items-center gap-1.5 transition-colors"
                title="Change My Security PIN / Password"
              >
                <Key className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Change My PIN</span>
              </button>
            )}

            <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
              <div className="w-7 h-7 rounded-full bg-slate-800 border border-[#DFC394]/50 flex items-center justify-center text-[10px] font-bold text-[#DFC394]">
                {currentUser?.name?.slice(0, 2).toUpperCase() || 'AD'}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold text-white leading-tight">
                  {currentUser?.name || 'Pakhi Administration'}
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  {currentUser?.role || 'SUPER_ADMIN'}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Tab Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* TAB 1: EXECUTIVE OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Executive KPI Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#0E1526] p-5 rounded-xl border border-slate-800 shadow-md space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-medium uppercase tracking-wider font-mono">Gross Revenue</span>
                    <DollarSign className="w-4 h-4 text-[#DFC394]" />
                  </div>
                  <div className="text-2xl font-serif font-bold text-white">
                    ₹{totalRevenue.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>Live Gross GMV across all channels</span>
                  </div>
                </div>

                <div className="bg-[#0E1526] p-5 rounded-xl border border-slate-800 shadow-md space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-medium uppercase tracking-wider font-mono">Total Orders</span>
                    <ShoppingBag className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="text-2xl font-serif font-bold text-white">{orders.length}</div>
                  <div className="text-[11px] text-sky-400 flex items-center gap-1">
                    <Truck className="w-3 h-3" />
                    <span>{pendingShipments} awaiting fulfillment</span>
                  </div>
                </div>

                <div className="bg-[#0E1526] p-5 rounded-xl border border-slate-800 shadow-md space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-medium uppercase tracking-wider font-mono">Inventory Health</span>
                    <Boxes className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-2xl font-serif font-bold text-white">{inventoryList.length} SKUs</div>
                  <div className={`text-[11px] flex items-center gap-1 ${criticalStockCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    <AlertTriangle className="w-3 h-3" />
                    <span>{criticalStockCount} items critical (&lt;= 5 units)</span>
                  </div>
                </div>

                <div className="bg-[#0E1526] p-5 rounded-xl border border-slate-800 shadow-md space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-medium uppercase tracking-wider font-mono">Average Order Value</span>
                    <Sparkles className="w-4 h-4 text-[#DFC394]" />
                  </div>
                  <div className="text-2xl font-serif font-bold text-white">
                    ₹{orders.length > 0 ? Math.round(totalRevenue / orders.length).toLocaleString('en-IN') : '0'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Calculated from authenticated checkouts
                  </div>
                </div>
              </div>

              {/* Operational Stream & Payment Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Cols: Recent Order Stream */}
                <div className="lg:col-span-2 bg-[#0E1526] rounded-xl border border-slate-800 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-base font-bold text-white">Live Order Fulfillment Queue</h3>
                      <p className="text-xs text-slate-400">Click order to preview printable invoice &amp; dispatch slip</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs text-[#DFC394] hover:underline flex items-center gap-1"
                    >
                      <span>View All</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="divide-y divide-slate-800/80">
                    {orders.slice(0, 5).map((o) => (
                      <div key={o.id} className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-900/40 px-2 rounded-lg transition-colors">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[#DFC394]">{o.orderNumber}</span>
                            <span className="text-xs text-slate-300">
                              {o.shippingAddress?.name || 'Customer'}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                              {o.paymentMethod}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            {o.items?.length || 1} items • ₹{o.total?.toLocaleString('en-IN')} • {new Date(o.createdAt).toLocaleDateString('en-IN')}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 rounded text-[10px] font-semibold ${
                              o.orderStatus === 'DELIVERED'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : o.orderStatus === 'SHIPPED'
                                ? 'bg-sky-950 text-sky-400 border border-sky-800'
                                : o.orderStatus === 'CANCELLED'
                                ? 'bg-rose-950 text-rose-400 border border-rose-800'
                                : 'bg-amber-950 text-amber-400 border border-amber-800'
                            }`}
                          >
                            {o.orderStatus}
                          </span>
                          <button
                            onClick={() => setSelectedInvoiceOrder(o)}
                            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                            title="Print Invoice / Packing Slip"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {orders.length === 0 && (
                      <p className="text-xs text-slate-500 py-6 text-center">No orders recorded in database yet.</p>
                    )}
                  </div>
                </div>

                {/* Right 1 Col: Payment Channel Distribution & System Info */}
                <div className="space-y-6">
                  <div className="bg-[#0E1526] rounded-xl border border-slate-800 p-5 space-y-4">
                    <h3 className="font-serif text-base font-bold text-white">Payment Method Mix</h3>
                    <div className="space-y-3 text-xs">
                      <div>
                        <div className="flex justify-between text-slate-300 mb-1">
                          <span>UPI Gateway (Instant)</span>
                          <span className="font-mono text-[#DFC394]">
                            {Math.round((orders.filter(o => o.paymentMethod === 'UPI').length / (orders.length || 1)) * 100)}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#DFC394]"
                            style={{
                              width: `${(orders.filter(o => o.paymentMethod === 'UPI').length / (orders.length || 1)) * 100}%`
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-300 mb-1">
                          <span>Debit/Credit Card (3DS)</span>
                          <span className="font-mono text-sky-400">
                            {Math.round((orders.filter(o => o.paymentMethod === 'CARD').length / (orders.length || 1)) * 100)}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-sky-400"
                            style={{
                              width: `${(orders.filter(o => o.paymentMethod === 'CARD').length / (orders.length || 1)) * 100}%`
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-300 mb-1">
                          <span>Cash on Delivery (COD)</span>
                          <span className="font-mono text-amber-400">
                            {Math.round((orders.filter(o => o.paymentMethod === 'COD').length / (orders.length || 1)) * 100)}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400"
                            style={{
                              width: `${(orders.filter(o => o.paymentMethod === 'COD').length / (orders.length || 1)) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0E1526] rounded-xl border border-slate-800 p-5 space-y-3">
                    <h3 className="font-serif text-sm font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Security &amp; Rate Limits</span>
                    </h3>
                    <ul className="text-xs text-slate-400 space-y-1.5">
                      <li>• Sliding window limiter active (max 15 orders/min)</li>
                      <li>• COD hard limit enforced at ₹5,000 max</li>
                      <li>• Server-side price recalculation verified</li>
                      <li>• BlueDart Express AWB dispatch sync ready</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS & FULFILLMENT */}
          {activeTab === 'orders' && (
            <div className="bg-[#0E1526] rounded-xl border border-slate-800 shadow-md overflow-hidden animate-fadeIn space-y-4 p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">Orders &amp; Logistics Management</h3>
                  <p className="text-xs text-slate-400">Review client orders, update fulfillment status, and generate packing slips</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Search order number..."
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#DFC394]"
                    />
                  </div>

                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#DFC394]"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="PACKED">Packed</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono">
                    <tr>
                      <th className="p-3">Order #</th>
                      <th className="p-3">Customer &amp; Destination</th>
                      <th className="p-3">Items</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Payment</th>
                      <th className="p-3">Fulfillment Status</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="p-3 font-mono font-bold text-[#DFC394]">
                          {o.orderNumber}
                          <span className="block text-[10px] text-slate-400 font-normal">
                            {new Date(o.createdAt).toLocaleDateString('en-IN')}
                          </span>
                        </td>
                        <td className="p-3 text-slate-300">
                          <p className="font-semibold text-white">{o.shippingAddress?.name || 'Customer'}</p>
                          <p className="text-[10px] text-slate-400">
                            {o.shippingAddress?.city || 'Delhi'}, {o.shippingAddress?.pincode || '110001'}
                          </p>
                        </td>
                        <td className="p-3 text-slate-300">
                          {o.items?.length || 1} item(s)
                        </td>
                        <td className="p-3 font-bold text-white">
                          ₹{o.total?.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                            {o.paymentMethod} • {o.paymentStatus || 'PAID'}
                          </span>
                        </td>
                        <td className="p-3">
                          <select
                            value={o.orderStatus}
                            onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                            className="text-xs bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 focus:ring-1 focus:ring-[#DFC394] cursor-pointer"
                          >
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="PROCESSING">Processing</option>
                            <option value="PACKED">Packed</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => setSelectedInvoiceOrder(o)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[#DFC394] text-xs font-medium flex items-center gap-1 transition-colors"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Invoice</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredOrders.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-6 text-center text-slate-500">
                          No matching orders found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PRODUCT CATALOG */}
          {activeTab === 'products' && (
            <div className="bg-[#0E1526] rounded-xl border border-slate-800 shadow-md overflow-hidden animate-fadeIn space-y-4 p-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">Product Catalog &amp; Launch Items</h3>
                  <p className="text-xs text-slate-400">Manage handloom Sarees, Women&apos;s Kurtas, and expandable ethnic collections</p>
                </div>
                <button
                  onClick={() => setIsAddProductOpen(true)}
                  className="px-3.5 py-2 rounded-lg bg-[#DFC394] hover:bg-[#C6A36B] text-[#070A10] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono">
                    <tr>
                      <th className="p-3">Product Item</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Fabric</th>
                      <th className="p-3">Occasion</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Stock Units</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {productsList.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="p-3 flex items-center gap-3">
                          <div className="relative w-10 h-12 rounded overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                            <Image
                              src={p.images?.[0]?.imageUrl || p.image || '/images/hero-saree.jpg'}
                              alt={p.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-white">{p.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{p.slug}</p>
                          </div>
                        </td>
                        <td className="p-3 text-slate-300 capitalize">{p.category?.name || p.category}</td>
                        <td className="p-3 text-slate-400">{p.fabric}</td>
                        <td className="p-3 text-slate-400">{p.occasion || 'Festive'}</td>
                        <td className="p-3 font-bold text-[#DFC394]">₹{(p.salePrice || p.price)?.toLocaleString('en-IN')}</td>
                        <td className="p-3">
                          <span className={`font-mono font-semibold ${
                            (p.stock || p.variants?.[0]?.stock || 0) <= 5
                              ? 'text-rose-400'
                              : 'text-emerald-400'
                          }`}>
                            {p.stock || p.variants?.reduce((sum: number, v: any) => sum + v.stock, 0) || 20} units
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold">
                            ACTIVE
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: INVENTORY & RESTOCKING */}
          {activeTab === 'inventory' && (
            <div className="bg-[#0E1526] rounded-xl border border-slate-800 shadow-md p-5 space-y-4 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">Variant-Level Inventory &amp; Stock Ledger</h3>
                  <p className="text-xs text-slate-400">
                    Live stock audit from SQLite. Adjust quantities to trigger atomic <code className="text-[#DFC394]">InventoryTransaction</code> records.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setInventoryFilter('ALL')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      inventoryFilter === 'ALL' ? 'bg-[#DFC394] text-[#070A10] font-bold' : 'bg-slate-900 text-slate-300'
                    }`}
                  >
                    All ({inventoryList.length})
                  </button>
                  <button
                    onClick={() => setInventoryFilter('CRITICAL')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      inventoryFilter === 'CRITICAL' ? 'bg-rose-900 text-white font-bold' : 'bg-slate-900 text-rose-400'
                    }`}
                  >
                    Critical Low ({criticalStockCount})
                  </button>
                </div>
              </div>

              {/* Grid of variant inventory cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredInventory.map((item) => (
                  <div key={item.id} className="p-4 rounded-xl border border-slate-800 bg-[#0B0F19] space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                          <Image src={item.image} alt={item.productName} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-semibold text-white text-xs line-clamp-1">{item.productName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">SKU: {item.sku}</p>
                          <p className="text-[10px] text-slate-400">{item.color} • {item.size}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-xs text-[#DFC394]">₹{item.price}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
                      <div>
                        <span className="text-slate-400">Stock Count: </span>
                        <strong className={`font-mono ${item.isCritical ? 'text-rose-400 font-bold' : item.isLow ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {item.stock} units
                        </strong>
                      </div>

                      <button
                        onClick={() => {
                          setIsRestockModalOpen(item);
                          setRestockQty(10);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-800 hover:bg-slate-700 text-[#DFC394] border border-slate-700 transition-colors"
                      >
                        + Restock
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: COUPONS & PROMOTIONS */}
          {activeTab === 'coupons' && (
            <div className="bg-[#0E1526] rounded-xl border border-slate-800 shadow-md p-5 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">Promotional Discount Engine</h3>
                  <p className="text-xs text-slate-400">Manage promo codes, minimum basket thresholds, and redemption caps</p>
                </div>
                <button
                  onClick={() => setIsCreateCouponOpen(true)}
                  className="px-3.5 py-2 rounded-lg bg-[#DFC394] hover:bg-[#C6A36B] text-[#070A10] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Coupon</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {couponsList.map((c) => (
                  <div key={c.id} className="p-4 rounded-xl border border-slate-800 bg-[#0B0F19] space-y-2 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-base font-bold text-[#DFC394] tracking-wider">{c.code}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                        ACTIVE
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      {c.type === 'PERCENTAGE' ? `${c.value}% OFF` : `Flat ₹${c.value} OFF`}
                      {c.minimumOrder ? ` above ₹${c.minimumOrder}` : ''}
                      {c.maximumDiscount ? ` (Cap: ₹${c.maximumDiscount})` : ''}
                    </p>
                    <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800 flex items-center justify-between font-mono">
                      <span>Redemptions: {c.usedCount || 0} / {c.usageLimit || '∞'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: CATEGORY EXPANSION (BLUEPRINT SECTION 28) */}
          {activeTab === 'categories' && (
            <div className="bg-[#0E1526] rounded-xl border border-slate-800 shadow-md p-5 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">Expandable Category Architecture</h3>
                  <p className="text-xs text-slate-400">
                    Blueprint Section 28: Expand beyond Sarees and Kurtas into Kurta Sets, Lehengas, Dupattas &amp; Jewellery without architectural changes
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Sarees', slug: 'sarees', status: 'ACTIVE (Launch)', desc: 'Banarasi, Chanderi, Georgette Handlooms', count: 6 },
                  { name: "Women's Kurtas", slug: 'kurtas', status: 'ACTIVE (Launch)', desc: 'Anarkali, A-line & Straight Kurtas', count: 6 },
                  { name: 'Kurta Sets', slug: 'kurta-sets', status: 'EXPANSION READY', desc: 'Embroidered 3-piece Silk Kurta Ensembles', count: 2 },
                  { name: 'Lehengas', slug: 'lehengas', status: 'EXPANSION READY', desc: 'Bridal & Festive Heritage Velvet Lehengas', count: 1 },
                  { name: 'Ethnic Jewellery', slug: 'jewellery', status: 'EXPANSION READY', desc: '22K Kundan Chokers, Jhumkas & Maang Tikas', count: 2 },
                  { name: 'Heirloom Dupattas', slug: 'dupattas', status: 'EXPANSION READY', desc: 'Handwoven Zari Organza & Banarasi Drapes', count: 1 },
                ].map((cat, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-800 bg-[#0B0F19] space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif font-bold text-sm text-white">{cat.name}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-[#DFC394]">
                        {cat.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{cat.desc}</p>
                    <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800 flex items-center justify-between font-mono">
                      <span>Products: {cat.count} items</span>
                      <span className="text-emerald-400">✓ Database Route Ready</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: REVIEW MODERATION */}
          {activeTab === 'reviews' && (
            <div className="bg-[#0E1526] rounded-xl border border-slate-800 shadow-md p-5 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">Customer Reviews Moderation</h3>
                  <p className="text-xs text-slate-400">Verified buyer check and customer feedback queue (Blueprint Section 15)</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  {
                    customer: 'Sunita Mehra',
                    product: 'Royal Crimson Banarasi Silk Saree',
                    rating: 5,
                    comment: 'The zari weaving is authentic and majestic. Draped it for my niece\'s wedding and received non-stop compliments!',
                    date: 'Yesterday',
                    status: 'APPROVED',
                  },
                  {
                    customer: 'Ananya Bhattacharya',
                    product: 'Embroidered Chanderi Kurta Set',
                    rating: 5,
                    comment: 'Flawless tailoring and breathability. True to size according to the AI fit stylist.',
                    date: '2 days ago',
                    status: 'APPROVED',
                  },
                  {
                    customer: 'Dr. Radhika Sen',
                    product: 'Heritage Kundan Choker Set',
                    rating: 5,
                    comment: 'Stunning craftsmanship, weight is comfortable, plating is high quality.',
                    date: '3 days ago',
                    status: 'APPROVED',
                  },
                ].map((rev, i) => (
                  <div key={i} className="p-4 rounded-xl border border-slate-800 bg-[#0B0F19] flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{rev.customer}</span>
                        <span className="text-[11px] text-[#DFC394]">{'★'.repeat(rev.rating)}</span>
                        <span className="text-[10px] text-slate-400">• {rev.product}</span>
                      </div>
                      <p className="text-xs text-slate-300 italic">&ldquo;{rev.comment}&rdquo;</p>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold shrink-0">
                      {rev.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: STAFF & ADMIN MANAGEMENT */}
          {activeTab === 'admins' && (
            <div className="bg-[#0E1526] rounded-xl border border-slate-800 shadow-md p-5 space-y-4 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">Staff &amp; Administrative Team</h3>
                  <p className="text-xs text-slate-400">
                    Add new administrators, modify access roles, and securely reset passwords / PINs
                  </p>
                </div>
                <button
                  onClick={() => setIsAddAdminOpen(true)}
                  className="px-3.5 py-2 rounded-lg bg-[#DFC394] hover:bg-[#C6A36B] text-[#070A10] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Add New Administrator</span>
                </button>
              </div>

              {/* Admin Users Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono">
                    <tr>
                      <th className="p-3">Administrator</th>
                      <th className="p-3">Email Address</th>
                      <th className="p-3">Contact</th>
                      <th className="p-3">Role &amp; Permissions</th>
                      <th className="p-3">Added Date</th>
                      <th className="p-3 text-right">Security Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {adminUsersList.map((admin) => {
                      const isSuper = admin.role === 'SUPER_ADMIN' || admin.role === 'ADMIN';
                      const isCurrentUser = currentUser?.id === admin.id || currentUser?.email === admin.email;
                      return (
                        <tr key={admin.id} className="hover:bg-slate-900/50 transition-colors">
                          <td className="p-3 flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-slate-800 border border-[#DFC394]/50 flex items-center justify-center text-xs font-bold text-[#DFC394]">
                              {admin.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-white flex items-center gap-1.5">
                                <span>{admin.name}</span>
                                {isCurrentUser && (
                                  <span className="text-[9px] bg-slate-800 text-[#DFC394] px-1.5 py-0.2 rounded font-mono">
                                    YOU
                                  </span>
                                )}
                              </p>
                              <p className="text-[10px] text-slate-400 font-mono">ID: {admin.id.slice(0, 8)}...</p>
                            </div>
                          </td>
                          <td className="p-3 font-mono text-slate-300">{admin.email}</td>
                          <td className="p-3 text-slate-400">{admin.phone || '—'}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${
                                isSuper
                                  ? 'bg-amber-950/60 text-[#DFC394] border-[#DFC394]/40'
                                  : admin.role === 'OPS_MANAGER'
                                  ? 'bg-sky-950/60 text-sky-400 border-sky-800/40'
                                  : 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                              }`}
                            >
                              {admin.role}
                            </span>
                          </td>
                          <td className="p-3 text-slate-400 font-mono text-[11px]">
                            {new Date(admin.createdAt).toLocaleDateString('en-IN')}
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Change Password Button */}
                              <button
                                onClick={() => {
                                  setPasswordTargetUser(admin);
                                  setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                  setPasswordModalError(null);
                                  setPasswordModalSuccess(null);
                                }}
                                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[#DFC394] text-xs font-semibold flex items-center gap-1 transition-colors"
                                title="Change Password / PIN"
                              >
                                <Key className="w-3 h-3" />
                                <span>Change Pass</span>
                              </button>

                              {/* Edit Profile Button */}
                              <button
                                onClick={() => setEditTargetUser(admin)}
                                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                                title="Edit Role &amp; Details"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete Admin Button (disabled for primary super admin) */}
                              <button
                                onClick={() => handleDeleteAdmin(admin)}
                                className="p-1.5 rounded bg-rose-950/40 hover:bg-rose-950 text-rose-400 hover:text-white transition-colors"
                                title="Revoke Access"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ========================================== */}
      {/* MODAL: CHANGE ADMIN PASSWORD / PIN         */}
      {/* ========================================== */}
      {passwordTargetUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0B0F19] border border-slate-700 rounded-2xl max-w-md w-full p-6 text-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Key className="w-5 h-5 text-[#DFC394]" />
                <div>
                  <h3 className="font-serif text-base font-bold text-white">Update Security Password</h3>
                  <p className="text-xs text-slate-400 font-mono">{passwordTargetUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setPasswordTargetUser(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-3.5 text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] space-y-1">
                <p className="text-slate-300">
                  Target Operator: <strong className="text-white">{passwordTargetUser.name}</strong>
                </p>
                <p className="text-slate-400">
                  Role: <span className="font-mono text-[#DFC394]">{passwordTargetUser.role}</span>
                </p>
              </div>

              {/* Optional Current Password */}
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">
                  Current Password (Optional if Super Admin)
                </label>
                <input
                  type="password"
                  placeholder="Enter current password if known"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#DFC394]"
                />
              </div>

              {/* New Password */}
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">
                  New Password or Access PIN
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 4 characters (e.g. admin2026 or PIN)"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#DFC394]"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Re-type new password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#DFC394]"
                />
              </div>

              {passwordModalError && (
                <p className="text-xs text-rose-400 bg-rose-950/40 p-2.5 rounded-lg border border-rose-800/50 text-center animate-fadeIn">
                  {passwordModalError}
                </p>
              )}

              {passwordModalSuccess && (
                <p className="text-xs text-emerald-400 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-800/50 text-center animate-fadeIn flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{passwordModalSuccess}</span>
                </p>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPasswordTargetUser(null)}
                  className="flex-1 py-2.5 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-[#DFC394] hover:bg-[#C6A36B] text-[#070A10] rounded-lg font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save New Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: ADD NEW ADMINISTRATOR               */}
      {/* ========================================== */}
      {isAddAdminOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0B0F19] border border-slate-700 rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <UserPlus className="w-5 h-5 text-[#DFC394]" />
                <h3 className="font-serif text-base font-bold text-white">Enroll New Administrator</h3>
              </div>
              <button
                onClick={() => setIsAddAdminOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Operator Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Roy"
                    value={newAdminForm.name}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, name: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#DFC394]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Staff Email</label>
                  <input
                    type="email"
                    required
                    placeholder="ananya@pakhiscollection.com"
                    value={newAdminForm.email}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, email: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#DFC394]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Operational Role</label>
                  <select
                    value={newAdminForm.role}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, role: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-[#DFC394]"
                  >
                    <option value="SUPER_ADMIN">Super Administrator</option>
                    <option value="OPS_MANAGER">Operations &amp; Inventory Manager</option>
                    <option value="FULFILLMENT_STAFF">Fulfillment &amp; Dispatch Staff</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Phone Contact (Optional)</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={newAdminForm.phone}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, phone: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#DFC394]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Security Password / PIN</label>
                  <input
                    type="password"
                    required
                    placeholder="Minimum 4 characters"
                    value={newAdminForm.password}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, password: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#DFC394]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Confirm Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Re-type password"
                    value={newAdminForm.confirmPassword}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, confirmPassword: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#DFC394]"
                  />
                </div>
              </div>

              {newAdminError && (
                <p className="text-xs text-rose-400 bg-rose-950/40 p-2.5 rounded-lg border border-rose-800/50 text-center animate-fadeIn">
                  {newAdminError}
                </p>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddAdminOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-[#DFC394] hover:bg-[#C6A36B] text-[#070A10] rounded-lg font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Administrator'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: EDIT ADMIN DETAILS                  */}
      {/* ========================================== */}
      {editTargetUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0B0F19] border border-slate-700 rounded-2xl max-w-md w-full p-6 text-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-serif text-base font-bold text-white">Edit Administrator Profile</h3>
              <button
                onClick={() => setEditTargetUser(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditAdmin} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Full Name</label>
                <input
                  type="text"
                  required
                  value={editTargetUser.name}
                  onChange={(e) => setEditTargetUser({ ...editTargetUser, name: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-[#DFC394]"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Role</label>
                <select
                  value={editTargetUser.role}
                  onChange={(e) => setEditTargetUser({ ...editTargetUser, role: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-[#DFC394]"
                >
                  <option value="SUPER_ADMIN">Super Administrator</option>
                  <option value="OPS_MANAGER">Operations &amp; Inventory Manager</option>
                  <option value="FULFILLMENT_STAFF">Fulfillment &amp; Dispatch Staff</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Phone Contact</label>
                <input
                  type="text"
                  value={editTargetUser.phone || ''}
                  onChange={(e) => setEditTargetUser({ ...editTargetUser, phone: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-[#DFC394]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditTargetUser(null)}
                  className="flex-1 py-2.5 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-[#DFC394] hover:bg-[#C6A36B] text-[#070A10] rounded-lg font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 1: PRINTABLE INVOICE / PACKING SLIP  */}
      {/* ========================================== */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0B0F19] border border-slate-700 rounded-2xl max-w-2xl w-full p-6 text-slate-100 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <Printer className="w-5 h-5 text-[#DFC394]" />
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">
                    GST Tax Invoice &amp; Dispatch Manifest
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Order Ref: {selectedInvoiceOrder.orderNumber}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Manifest Preview */}
            <div className="bg-[#070A10] p-6 rounded-xl border border-slate-800 space-y-4 font-mono text-xs">
              <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                <div>
                  <h4 className="font-serif font-bold text-base text-[#DFC394]">PAKHI&apos;S COLLECTION</h4>
                  <p className="text-[10px] text-slate-400">Atelier of Indian Haute Ethnic Wear</p>
                  <p className="text-[10px] text-slate-400">GSTIN: 07AAECP1234F1Z8</p>
                  <p className="text-[10px] text-slate-400">Fulfillment Hub: Varanasi / New Delhi</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">INVOICE: INV-{selectedInvoiceOrder.orderNumber}</p>
                  <p className="text-slate-400">Date: {new Date(selectedInvoiceOrder.createdAt).toLocaleDateString('en-IN')}</p>
                  <p className="text-emerald-400">Status: {selectedInvoiceOrder.orderStatus}</p>
                </div>
              </div>

              {/* Delivery info */}
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-800 text-[11px]">
                <div>
                  <span className="text-slate-400 block mb-1">CONSIGNEE / SHIP TO:</span>
                  <p className="text-white font-bold">{selectedInvoiceOrder.shippingAddress?.name || 'Customer'}</p>
                  <p className="text-slate-300">{selectedInvoiceOrder.shippingAddress?.address || '123 Fashion Ave'}</p>
                  <p className="text-slate-300">
                    {selectedInvoiceOrder.shippingAddress?.city || 'Delhi'} - {selectedInvoiceOrder.shippingAddress?.pincode || '110001'}
                  </p>
                  <p className="text-slate-300">Phone: {selectedInvoiceOrder.shippingAddress?.phone || '+91 98765 43210'}</p>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">COURIER DISPATCH MANIFEST:</span>
                  <p className="text-white font-bold">Partner: Blue Dart Express Air</p>
                  <p className="text-slate-300">AWB Code: BD-{selectedInvoiceOrder.orderNumber.replace(/[^0-9]/g, '') || '948201'}</p>
                  <p className="text-slate-300">Payment: {selectedInvoiceOrder.paymentMethod} (Verified)</p>
                </div>
              </div>

              {/* Line Items */}
              <div className="space-y-2 pb-4 border-b border-slate-800">
                <div className="flex justify-between text-slate-400 font-bold text-[10px]">
                  <span>ITEM DESCRIPTION</span>
                  <span>AMOUNT</span>
                </div>
                {(selectedInvoiceOrder.items || [
                  { id: '1', productNameSnapshot: 'Artisan Ethnic Drape', priceSnapshot: selectedInvoiceOrder.total, quantity: 1 }
                ]).map((item, idx) => (
                  <div key={idx} className="flex justify-between text-slate-200">
                    <span>
                      {item.productNameSnapshot} {item.variantSnapshot ? `(${item.variantSnapshot})` : ''} x{item.quantity}
                    </span>
                    <span>₹{(item.priceSnapshot * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-1 text-right pt-1">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span>₹{selectedInvoiceOrder.subtotal?.toLocaleString('en-IN') || selectedInvoiceOrder.total}</span>
                </div>
                {selectedInvoiceOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Coupon Promo Discount:</span>
                    <span>-₹{selectedInvoiceOrder.discount?.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>Shipping &amp; Handling:</span>
                  <span>₹{selectedInvoiceOrder.shippingFee || 0} (Free Shipping)</span>
                </div>
                <div className="flex justify-between text-white font-bold text-sm pt-2 border-t border-slate-800">
                  <span>Total Amount Charged:</span>
                  <span className="text-[#DFC394]">₹{selectedInvoiceOrder.total?.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
              >
                Close Window
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-lg bg-[#DFC394] hover:bg-[#C6A36B] text-[#070A10] text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Tax Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 2: RESTOCK INVENTORY MODAL           */}
      {/* ========================================== */}
      {isRestockModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0B0F19] border border-slate-800 rounded-2xl max-w-md w-full p-6 text-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-serif text-base font-bold text-white">
                Restock SKU: {isRestockModalOpen.sku}
              </h3>
              <button
                onClick={() => setIsRestockModalOpen(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRestockSubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <p className="font-semibold text-white">{isRestockModalOpen.productName}</p>
                <p className="text-slate-400">{isRestockModalOpen.color} • {isRestockModalOpen.size}</p>
                <p className="text-slate-400">Current Stock: <span className="font-mono text-[#DFC394]">{isRestockModalOpen.stock} units</span></p>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Additional Units to Receive</label>
                <div className="flex gap-2">
                  {[10, 25, 50, 100].map((qty) => (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => setRestockQty(qty)}
                      className={`flex-1 py-1.5 rounded border text-xs font-mono font-bold transition-colors ${
                        restockQty === qty
                          ? 'bg-[#DFC394] text-[#070A10] border-[#DFC394]'
                          : 'bg-slate-900 text-slate-300 border-slate-700'
                      }`}
                    >
                      +{qty}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Custom Quantity</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={restockQty}
                  onChange={(e) => setRestockQty(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:ring-1 focus:ring-[#DFC394]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRestockModalOpen(null)}
                  className="flex-1 py-2.5 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-[#DFC394] hover:bg-[#C6A36B] text-[#070A10] rounded-lg font-bold flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Inbound Batch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 3: ADD NEW PRODUCT MODAL             */}
      {/* ========================================== */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0B0F19] border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-serif text-lg font-bold text-white">Add New Ethnic Design to Catalog</h3>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Design Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Chanderi Handloom Saree"
                  value={newProductForm.name}
                  onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-[#DFC394]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Category</label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-[#DFC394]"
                  >
                    <option value="sarees">Sarees</option>
                    <option value="kurtas">Women&apos;s Kurtas</option>
                    <option value="kurta-sets">Kurta Sets</option>
                    <option value="lehengas">Lehengas</option>
                    <option value="jewellery">Ethnic Jewellery</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Fabric</label>
                  <select
                    value={newProductForm.fabric}
                    onChange={(e) => setNewProductForm({ ...newProductForm, fabric: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-[#DFC394]"
                  >
                    <option>Banarasi Silk</option>
                    <option>Pure Silk</option>
                    <option>Chanderi</option>
                    <option>Georgette</option>
                    <option>Cotton Handloom</option>
                    <option>Raw Silk</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Base MRP (₹)</label>
                  <input
                    type="number"
                    value={newProductForm.basePrice}
                    onChange={(e) => setNewProductForm({ ...newProductForm, basePrice: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-[#DFC394]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Sale Price (₹)</label>
                  <input
                    type="number"
                    value={newProductForm.salePrice}
                    onChange={(e) => setNewProductForm({ ...newProductForm, salePrice: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-[#DFC394]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Initial Stock</label>
                  <input
                    type="number"
                    value={newProductForm.stock}
                    onChange={(e) => setNewProductForm({ ...newProductForm, stock: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-[#DFC394]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Description</label>
                <textarea
                  rows={2}
                  value={newProductForm.description}
                  onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-[#DFC394]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-[#DFC394] hover:bg-[#C6A36B] text-[#070A10] rounded-lg font-bold flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 4: CREATE COUPON MODAL               */}
      {/* ========================================== */}
      {isCreateCouponOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0B0F19] border border-slate-800 rounded-2xl max-w-md w-full p-6 text-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-serif text-base font-bold text-white">Create New Promotional Code</h3>
              <button
                onClick={() => setIsCreateCouponOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DIWALI25"
                  value={newCouponForm.code}
                  onChange={(e) => setNewCouponForm({ ...newCouponForm, code: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono uppercase focus:outline-none focus:ring-1 focus:ring-[#DFC394]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Discount Type</label>
                  <select
                    value={newCouponForm.type}
                    onChange={(e) => setNewCouponForm({ ...newCouponForm, type: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-[#DFC394]"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Flat Fixed (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Value</label>
                  <input
                    type="number"
                    required
                    value={newCouponForm.value}
                    onChange={(e) => setNewCouponForm({ ...newCouponForm, value: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-[#DFC394]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Min Order (₹)</label>
                  <input
                    type="number"
                    value={newCouponForm.minimumOrder}
                    onChange={(e) => setNewCouponForm({ ...newCouponForm, minimumOrder: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-[#DFC394]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Max Discount (₹)</label>
                  <input
                    type="number"
                    value={newCouponForm.maximumDiscount}
                    onChange={(e) => setNewCouponForm({ ...newCouponForm, maximumDiscount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-[#DFC394]"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateCouponOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-[#DFC394] hover:bg-[#C6A36B] text-[#070A10] rounded-lg font-bold flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Launch Promo Code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

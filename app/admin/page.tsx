'use client';

import React, { useState } from 'react';
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
  Filter
} from 'lucide-react';
import { PRODUCTS } from '@/lib/products-data';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'inventory' | 'coupons'>('overview');

  // Realistic mock operational data for the dashboard
  const [orders, setOrders] = useState([
    {
      id: 'ord-1',
      orderNumber: 'PK-842913',
      customer: 'Priya Sharma',
      itemsCount: 2,
      total: 2698,
      paymentMethod: 'UPI',
      paymentStatus: 'PAID',
      status: 'CONFIRMED',
      date: 'Oct 02, 2026',
    },
    {
      id: 'ord-2',
      orderNumber: 'PK-791024',
      customer: 'Ananya Roy',
      itemsCount: 1,
      total: 2499,
      paymentMethod: 'CARD',
      paymentStatus: 'PAID',
      status: 'PROCESSING',
      date: 'Oct 02, 2026',
    },
    {
      id: 'ord-3',
      orderNumber: 'PK-632198',
      customer: 'Meera Iyer',
      itemsCount: 3,
      total: 5197,
      paymentMethod: 'COD',
      paymentStatus: 'PENDING',
      status: 'SHIPPED',
      date: 'Oct 01, 2026',
    },
    {
      id: 'ord-4',
      orderNumber: 'PK-551982',
      customer: 'Kavita Sen',
      itemsCount: 1,
      total: 1999,
      paymentMethod: 'UPI',
      paymentStatus: 'PAID',
      status: 'DELIVERED',
      date: 'Sep 30, 2026',
    },
  ]);

  const [productsList, setProductsList] = useState(PRODUCTS);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="min-h-screen bg-[#F5EBDD] flex flex-col font-sans">
      {/* Admin Top Navigation */}
      <header className="bg-[#722F3D] text-[#F8F3EC] px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-[#DFC394] hover:text-[#FFFFFF] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Storefront</span>
          </Link>
          <div className="h-4 w-[1px] bg-[#DFC394]/40" />
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#DFC394]">
              <Image src="/logo.jpg" alt="Logo" fill className="object-cover" />
            </div>
            <span className="font-serif text-lg font-bold tracking-wide">
              Pakhi&apos;s Administration
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="px-2.5 py-1 bg-[#541F28] rounded-full border border-[#DFC394]/30 text-[#DFC394] font-medium">
            Live Production Dashboard
          </span>
          <span className="text-[#DFC394]">admin@pakhiscollection.com</span>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E8DCCF] pb-4 mb-6 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'orders', label: 'Orders & Fulfilment', icon: ShoppingBag, count: orders.length },
            { id: 'products', label: 'Catalog & Products', icon: Package, count: productsList.length },
            { id: 'inventory', label: 'Inventory & Stock', icon: Layers },
            { id: 'coupons', label: 'Coupons & Promos', icon: Tag },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#722F3D] text-[#FFFFFF] shadow-sm'
                    : 'bg-[#FFFFFF] text-[#241816] hover:bg-[#F8F3EC] border border-[#E8DCCF]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    isActive ? 'bg-[#541F28] text-[#DFC394]' : 'bg-[#F8F3EC] text-[#6E5C57]'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 4 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#E8DCCF] shadow-sm">
                <div className="flex items-center justify-between text-[#6E5C57] text-xs mb-1">
                  <span>Gross Sales</span>
                  <TrendingUp className="w-4 h-4 text-[#2D6A4F]" />
                </div>
                <p className="font-serif text-2xl font-bold text-[#722F3D]">
                  ₹{(totalRevenue * 14).toLocaleString('en-IN')}
                </p>
                <span className="text-[11px] text-[#2D6A4F] font-medium">+18.4% from last week</span>
              </div>

              <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#E8DCCF] shadow-sm">
                <div className="flex items-center justify-between text-[#6E5C57] text-xs mb-1">
                  <span>Total Orders</span>
                  <ShoppingBag className="w-4 h-4 text-[#722F3D]" />
                </div>
                <p className="font-serif text-2xl font-bold text-[#241816]">
                  {orders.length * 9}
                </p>
                <span className="text-[11px] text-[#6E5C57]">Average Order Value: ₹2,410</span>
              </div>

              <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#E8DCCF] shadow-sm">
                <div className="flex items-center justify-between text-[#6E5C57] text-xs mb-1">
                  <span>Active Catalog</span>
                  <Package className="w-4 h-4 text-[#C6A36B]" />
                </div>
                <p className="font-serif text-2xl font-bold text-[#241816]">
                  {productsList.length} Designs
                </p>
                <span className="text-[11px] text-[#6E5C57]">Sarees &amp; Kurtas</span>
              </div>

              <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#E8DCCF] shadow-sm">
                <div className="flex items-center justify-between text-[#6E5C57] text-xs mb-1">
                  <span>Stock Alerts</span>
                  <AlertTriangle className="w-4 h-4 text-[#D97706]" />
                </div>
                <p className="font-serif text-2xl font-bold text-[#D97706]">
                  1 Low Stock
                </p>
                <span className="text-[11px] text-[#D97706] font-medium">Royal Blue Banarasi Saree</span>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-[#FFFFFF] rounded-xl border border-[#E8DCCF] shadow-sm overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-[#E8DCCF] flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-base font-bold text-[#241816]">Recent Orders</h3>
                  <p className="text-xs text-[#6E5C57]">Latest orders placed across India</p>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-[#722F3D] font-semibold hover:underline"
                >
                  View All Orders →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8F3EC] text-[#6E5C57] border-b border-[#E8DCCF]">
                    <tr>
                      <th className="p-3.5">Order ID</th>
                      <th className="p-3.5">Customer</th>
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5">Payment</th>
                      <th className="p-3.5">Total</th>
                      <th className="p-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DCCF]/60">
                    {orders.slice(0, 4).map((o) => (
                      <tr key={o.id} className="hover:bg-[#F8F3EC]/50 transition-colors">
                        <td className="p-3.5 font-semibold text-[#722F3D]">{o.orderNumber}</td>
                        <td className="p-3.5 font-medium text-[#241816]">{o.customer}</td>
                        <td className="p-3.5 text-[#6E5C57]">{o.date}</td>
                        <td className="p-3.5">
                          <span className="font-medium text-[#241816]">{o.paymentMethod}</span>
                          <span className={`ml-1.5 px-1.5 py-0.5 rounded text-[10px] ${
                            o.paymentStatus === 'PAID' ? 'bg-[#2D6A4F]/10 text-[#2D6A4F]' : 'bg-[#D97706]/10 text-[#D97706]'
                          }`}>
                            {o.paymentStatus}
                          </span>
                        </td>
                        <td className="p-3.5 font-semibold text-[#241816]">₹{o.total.toLocaleString('en-IN')}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FAF2F3] text-[#722F3D] border border-[#722F3D]/20">
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: ORDERS & FULFILMENT */}
        {activeTab === 'orders' && (
          <div className="bg-[#FFFFFF] rounded-xl border border-[#E8DCCF] shadow-sm overflow-hidden space-y-4 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#241816]">Order Management &amp; Fulfilment</h3>
                <p className="text-xs text-[#6E5C57]">Manage lifecycle transitions: Confirmed → Processing → Shipped → Delivered</p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#6E5C57]">Filter:</span>
                {['ALL', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                      statusFilter === st
                        ? 'bg-[#722F3D] text-[#FFFFFF]'
                        : 'bg-[#F8F3EC] text-[#241816] hover:bg-[#E8DCCF]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8F3EC] text-[#6E5C57] border-b border-[#E8DCCF]">
                  <tr>
                    <th className="p-3.5">Order Number</th>
                    <th className="p-3.5">Customer</th>
                    <th className="p-3.5">Items</th>
                    <th className="p-3.5">Payment</th>
                    <th className="p-3.5">Total Amount</th>
                    <th className="p-3.5">Current Status</th>
                    <th className="p-3.5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DCCF]/60">
                  {orders
                    .filter((o) => statusFilter === 'ALL' || o.status === statusFilter)
                    .map((o) => (
                      <tr key={o.id} className="hover:bg-[#F8F3EC]/50">
                        <td className="p-3.5 font-bold text-[#722F3D]">{o.orderNumber}</td>
                        <td className="p-3.5 font-medium text-[#241816]">{o.customer}</td>
                        <td className="p-3.5 text-[#6E5C57]">{o.itemsCount} piece(s)</td>
                        <td className="p-3.5">
                          <span className="font-medium text-[#241816]">{o.paymentMethod}</span>
                          <span className="ml-1 text-[10px] text-[#2D6A4F]">({o.paymentStatus})</span>
                        </td>
                        <td className="p-3.5 font-bold text-[#241816]">₹{o.total.toLocaleString('en-IN')}</td>
                        <td className="p-3.5">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#FAF2F3] text-[#722F3D] border border-[#722F3D]/20">
                            {o.status}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <select
                            value={o.status}
                            onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                            className="bg-[#F8F3EC] border border-[#E8DCCF] rounded px-2 py-1 text-xs text-[#241816] focus:outline-none focus:border-[#722F3D]"
                          >
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="PROCESSING">PROCESSING</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: CATALOG & PRODUCTS */}
        {activeTab === 'products' && (
          <div className="bg-[#FFFFFF] rounded-xl border border-[#E8DCCF] shadow-sm overflow-hidden p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#241816]">Catalog &amp; Product Registry</h3>
                <p className="text-xs text-[#6E5C57]">Manage sarees and kurtas, pricing, and category placement</p>
              </div>
              <button
                onClick={() => alert("Product Creation Drawer ready. Wire with /api/products")}
                className="px-4 py-2 bg-[#722F3D] text-[#F8F3EC] rounded-md text-xs font-semibold flex items-center gap-1.5 hover:bg-[#541F28]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Product</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8F3EC] text-[#6E5C57] border-b border-[#E8DCCF]">
                  <tr>
                    <th className="p-3.5">Product</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Fabric</th>
                    <th className="p-3.5">Occasion</th>
                    <th className="p-3.5">Sale Price</th>
                    <th className="p-3.5">Stock</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DCCF]/60">
                  {productsList.map((p) => (
                    <tr key={p.id} className="hover:bg-[#F8F3EC]/50">
                      <td className="p-3.5 flex items-center gap-3">
                        <div className="relative w-10 h-12 rounded overflow-hidden bg-[#F5EBDD] border border-[#E8DCCF]">
                          <Image src={p.image} alt={p.name} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#241816]">{p.name}</p>
                          <p className="text-[10px] text-[#6E5C57]">{p.subcategory}</p>
                        </div>
                      </td>
                      <td className="p-3.5 capitalize font-medium text-[#241816]">{p.category}</td>
                      <td className="p-3.5 text-[#6E5C57]">{p.fabric}</td>
                      <td className="p-3.5 text-[#6E5C57]">{p.occasion}</td>
                      <td className="p-3.5 font-bold text-[#722F3D]">₹{p.price.toLocaleString('en-IN')}</td>
                      <td className="p-3.5">
                        <span className={`font-semibold ${p.stock <= 12 ? 'text-[#D97706]' : 'text-[#2D6A4F]'}`}>
                          {p.stock} units
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-[#2D6A4F]/10 text-[#2D6A4F] font-semibold">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: INVENTORY */}
        {activeTab === 'inventory' && (
          <div className="bg-[#FFFFFF] rounded-xl border border-[#E8DCCF] shadow-sm p-5 space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#241816]">Variant-Level Inventory &amp; Stock Control</h3>
            <p className="text-xs text-[#6E5C57]">Real-time stock audit tracking as specified in Blueprint Section 12</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {productsList.map((p) => (
                <div key={p.id} className="p-4 rounded-lg border border-[#E8DCCF] bg-[#F8F3EC] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-sm text-[#241816] line-clamp-1">{p.name}</span>
                    <span className="text-xs font-bold text-[#722F3D]">₹{p.price}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#6E5C57]">
                    <span>Total Stock:</span>
                    <strong className="text-[#241816]">{p.stock} units</strong>
                  </div>
                  <div className="pt-2 border-t border-[#E8DCCF]/60 flex items-center justify-between">
                    <span className="text-[11px] text-[#6E5C57]">SKU: {p.slug.toUpperCase()}</span>
                    <button
                      onClick={() => alert(`Restock alert triggered for ${p.name}`)}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-[#FFFFFF] border border-[#722F3D] text-[#722F3D] rounded hover:bg-[#722F3D] hover:text-[#FFFFFF] transition-colors"
                    >
                      + Restock
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: COUPONS */}
        {activeTab === 'coupons' && (
          <div className="bg-[#FFFFFF] rounded-xl border border-[#E8DCCF] shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#241816]">Promotional Coupon Codes</h3>
                <p className="text-xs text-[#6E5C57]">Manage discount limits and minimum order thresholds</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl border-2 border-dashed border-[#722F3D]/40 bg-[#FAF2F3] space-y-2">
                <span className="font-mono text-base font-bold text-[#722F3D]">ELEGANCE10</span>
                <p className="text-xs text-[#6E5C57]">10% off on orders above ₹1,999 (Max ₹500)</p>
                <div className="text-[10px] text-[#2D6A4F] font-semibold">Active • 500 redemptions limit</div>
              </div>

              <div className="p-4 rounded-xl border-2 border-dashed border-[#722F3D]/40 bg-[#FAF2F3] space-y-2">
                <span className="font-mono text-base font-bold text-[#722F3D]">FESTIVE200</span>
                <p className="text-xs text-[#6E5C57]">Flat ₹200 off on orders above ₹2,000</p>
                <div className="text-[10px] text-[#2D6A4F] font-semibold">Active • 1,000 redemptions limit</div>
              </div>

              <div className="p-4 rounded-xl border-2 border-dashed border-[#722F3D]/40 bg-[#FAF2F3] space-y-2">
                <span className="font-mono text-base font-bold text-[#722F3D]">ROYAL500</span>
                <p className="text-xs text-[#6E5C57]">Flat ₹500 off on bridal &amp; wedding orders above ₹4,999</p>
                <div className="text-[10px] text-[#2D6A4F] font-semibold">Active • 250 redemptions limit</div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

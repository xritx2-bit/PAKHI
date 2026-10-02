'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Filter,
  X,
  ChevronDown,
  Star,
  Heart,
  Eye,
  ShoppingBag,
  SlidersHorizontal,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import { PRODUCTS } from '@/lib/products-data';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/cart-context';

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || 'all';

  const { isInWishlist, toggleWishlist, openProductModal, addToCart, setIsSearchOpen } = useCart();

  // Filters state
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<'all' | 'under-1500' | '1500-2500' | 'above-2500'>('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Available options
  const fabricOptions = ['Pure Silk', 'Banarasi Silk', 'Georgette', 'Chanderi', 'Cotton'];
  const occasionOptions = ['Wedding', 'Festive', 'Casual', 'Party', 'Office'];

  // Category Title & Metadata
  const categoryMeta = useMemo(() => {
    switch (slug) {
      case 'sarees':
        return {
          title: 'Handcrafted Sarees',
          tagline: 'Grace in Every Drape',
          desc: 'Woven with pure silk threads, antique zari brocades, and vibrant celebratory motifs. From Banarasi handlooms to featherlight festive georgettes.',
          image: '/images/category-saree.jpg',
        };
      case 'kurtas':
        return {
          title: "Women's Designer Kurtas",
          tagline: 'Comfort in Every Step',
          desc: 'Breathable pure cotton prints, embroidered yoke anarkalis, and elegant festive tunics tailored for modern grace and day-long poise.',
          image: '/images/category-kurta.jpg',
        };
      default:
        return {
          title: 'All Ethnic Collections',
          tagline: 'Elegance in Every Thread',
          desc: 'Discover our complete launch catalog of pure silk Sarees, contemporary designer Kurtas, and celebratory festive ensembles.',
          image: '/images/hero-saree.jpg',
        };
    }
  }, [slug]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let list = PRODUCTS.filter((item) => {
      // Category slug match
      if (slug !== 'all' && item.category !== slug) {
        return false;
      }
      // Fabric filter
      if (selectedFabrics.length > 0 && !selectedFabrics.includes(item.fabric)) {
        return false;
      }
      // Occasion filter
      if (selectedOccasions.length > 0 && !selectedOccasions.includes(item.occasion)) {
        return false;
      }
      // Price range
      if (priceRange === 'under-1500' && item.price >= 1500) return false;
      if (priceRange === '1500-2500' && (item.price < 1500 || item.price > 2500)) return false;
      if (priceRange === 'above-2500' && item.price <= 2500) return false;
      // In-stock
      if (inStockOnly && item.stock <= 0) return false;

      return true;
    });

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        list = [...list].sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0));
        break;
    }

    return list;
  }, [slug, selectedFabrics, selectedOccasions, priceRange, inStockOnly, sortBy]);

  const toggleFabric = (fabric: string) => {
    setSelectedFabrics((prev) =>
      prev.includes(fabric) ? prev.filter((f) => f !== fabric) : [...prev, fabric]
    );
  };

  const toggleOccasion = (occ: string) => {
    setSelectedOccasions((prev) =>
      prev.includes(occ) ? prev.filter((o) => o !== occ) : [...prev, occ]
    );
  };

  const resetFilters = () => {
    setSelectedFabrics([]);
    setSelectedOccasions([]);
    setPriceRange('all');
    setInStockOnly(false);
    setSortBy('featured');
  };

  const hasActiveFilters =
    selectedFabrics.length > 0 ||
    selectedOccasions.length > 0 ||
    priceRange !== 'all' ||
    inStockOnly;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F3EC]">
      {/* Navbar */}
      <Navbar onSearchClick={() => setIsSearchOpen(true)} />

      {/* Hero Category Header */}
      <div className="relative bg-[#722F3D] text-[#F8F3EC] py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <Image
            src={categoryMeta.image}
            alt={categoryMeta.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#722F3D] via-[#722F3D]/90 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-[#DFC394] mb-4">
            <Link href="/" className="hover:underline">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#DFC394]/60" />
            <span className="capitalize text-[#F8F3EC]">{slug}</span>
          </nav>

          <span className="text-xs uppercase tracking-[0.25em] text-[#DFC394] font-semibold block mb-2">
            {categoryMeta.tagline}
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight mb-3">
            {categoryMeta.title}
          </h1>
          <p className="max-w-2xl text-sm sm:text-base text-[#F8F3EC]/85 leading-relaxed font-light">
            {categoryMeta.desc}
          </p>

          {/* Category Switch Pills */}
          <div className="flex flex-wrap gap-2 mt-6">
            <Link
              href="/category/all"
              className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
                slug === 'all'
                  ? 'bg-[#DFC394] text-[#241816] border-[#DFC394] font-semibold'
                  : 'bg-[#722F3D]/40 text-[#F8F3EC] border-[#DFC394]/40 hover:bg-[#722F3D]'
              }`}
            >
              All Items ({PRODUCTS.length})
            </Link>
            <Link
              href="/category/sarees"
              className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
                slug === 'sarees'
                  ? 'bg-[#DFC394] text-[#241816] border-[#DFC394] font-semibold'
                  : 'bg-[#722F3D]/40 text-[#F8F3EC] border-[#DFC394]/40 hover:bg-[#722F3D]'
              }`}
            >
              Sarees ({PRODUCTS.filter((p) => p.category === 'sarees').length})
            </Link>
            <Link
              href="/category/kurtas"
              className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
                slug === 'kurtas'
                  ? 'bg-[#DFC394] text-[#241816] border-[#DFC394] font-semibold'
                  : 'bg-[#722F3D]/40 text-[#F8F3EC] border-[#DFC394]/40 hover:bg-[#722F3D]'
              }`}
            >
              Women&apos;s Kurtas ({PRODUCTS.filter((p) => p.category === 'kurtas').length})
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#E8DCCF]">
          <div className="flex items-center gap-3">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#FFFFFF] border border-[#E8DCCF] text-xs font-medium text-[#241816] shadow-xs hover:bg-[#F5EBDD]"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#722F3D]" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-[#722F3D]" />
              )}
            </button>

            <p className="text-xs text-[#6E5C57]">
              Showing <strong className="text-[#241816]">{filteredProducts.length}</strong> luxurious designs
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs text-[#6E5C57] font-medium hidden sm:inline">Sort by:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort products by"
                className="appearance-none bg-[#FFFFFF] border border-[#E8DCCF] text-xs font-medium text-[#241816] py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#722F3D] cursor-pointer shadow-xs"
              >
                <option value="featured">Featured &amp; Trending</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Customer Rating</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#6E5C57] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 2-Column Layout: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-6 bg-[#FFFFFF] p-6 rounded-xl border border-[#E8DCCF] shadow-xs self-start sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DCCF]">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#722F3D]" />
                <h3 className="font-serif font-bold text-sm text-[#241816]">Refine Selection</h3>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-[11px] text-[#722F3D] hover:underline inline-flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Fabric Filter */}
            <div>
              <h4 className="text-xs uppercase tracking-wider font-semibold text-[#241816] mb-3">
                Fabric
              </h4>
              <div className="space-y-2">
                {fabricOptions.map((f) => (
                  <label key={f} className="flex items-center gap-2.5 text-xs text-[#6E5C57] hover:text-[#241816] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFabrics.includes(f)}
                      onChange={() => toggleFabric(f)}
                      className="rounded border-[#E8DCCF] text-[#722F3D] focus:ring-[#722F3D]"
                    />
                    <span>{f}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Occasion Filter */}
            <div className="pt-4 border-t border-[#E8DCCF]/60">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-[#241816] mb-3">
                Occasion
              </h4>
              <div className="space-y-2">
                {occasionOptions.map((occ) => (
                  <label key={occ} className="flex items-center gap-2.5 text-xs text-[#6E5C57] hover:text-[#241816] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedOccasions.includes(occ)}
                      onChange={() => toggleOccasion(occ)}
                      className="rounded border-[#E8DCCF] text-[#722F3D] focus:ring-[#722F3D]"
                    />
                    <span>{occ}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="pt-4 border-t border-[#E8DCCF]/60">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-[#241816] mb-3">
                Price Range
              </h4>
              <div className="space-y-2 text-xs text-[#6E5C57]">
                {[
                  { id: 'all', label: 'All Prices' },
                  { id: 'under-1500', label: 'Under ₹1,500' },
                  { id: '1500-2500', label: '₹1,500 – ₹2,500' },
                  { id: 'above-2500', label: 'Above ₹2,500' },
                ].map((tier) => (
                  <label key={tier.id} className="flex items-center gap-2.5 cursor-pointer hover:text-[#241816]">
                    <input
                      type="radio"
                      name="price-tier"
                      checked={priceRange === tier.id}
                      onChange={() => setPriceRange(tier.id as any)}
                      className="text-[#722F3D] focus:ring-[#722F3D]"
                    />
                    <span>{tier.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="pt-4 border-t border-[#E8DCCF]/60">
              <label className="flex items-center justify-between cursor-pointer text-xs text-[#241816] font-medium">
                <span>In-Stock Only</span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-[#E8DCCF] text-[#722F3D] focus:ring-[#722F3D]"
                />
              </label>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="bg-[#FFFFFF] rounded-xl p-12 text-center border border-[#E8DCCF] shadow-xs space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#FAF2F3] text-[#722F3D] flex items-center justify-center mx-auto">
                  <Filter className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#241816]">No Matching Designs Found</h3>
                <p className="text-xs text-[#6E5C57] max-w-sm mx-auto">
                  Try unchecking some filters or resetting your selection to explore our full collection.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2 rounded-md bg-[#722F3D] text-[#F8F3EC] text-xs font-semibold hover:bg-[#541F28] transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const isWish = isInWishlist(product.id);
                  return (
                    <div
                      key={product.id}
                      className="group bg-[#FFFFFF] rounded-xl overflow-hidden border border-[#E8DCCF] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
                    >
                      {/* Image Area */}
                      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5EBDD]">
                        <Link href={`/products/${product.slug}`} className="block w-full h-full">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                          />
                        </Link>

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
                          {product.isNew && (
                            <span className="bg-[#722F3D] text-[#F8F3EC] text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase shadow-xs">
                              New
                            </span>
                          )}
                          {product.discountPercent > 0 && (
                            <span className="bg-[#C6A36B] text-[#241816] text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase shadow-xs">
                              {product.discountPercent}% OFF
                            </span>
                          )}
                        </div>

                        {/* Wishlist Button */}
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          aria-label={isWish ? 'Remove from wishlist' : 'Add to wishlist'}
                          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-[#FFFFFF]/80 backdrop-blur-xs text-[#241816] hover:bg-[#FFFFFF] hover:text-[#722F3D] shadow-sm transition-transform active:scale-90"
                        >
                          <Heart
                            className={`w-4 h-4 ${isWish ? 'fill-[#722F3D] text-[#722F3D]' : ''}`}
                          />
                        </button>

                        {/* Quick View Overlay Button */}
                        <button
                          onClick={() => openProductModal(product)}
                          className="absolute bottom-3 inset-x-3 py-2 bg-[#241816]/90 hover:bg-[#722F3D] text-[#F8F3EC] text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-1.5 shadow-md"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Quick View</span>
                        </button>
                      </div>

                      {/* Details Area */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-[#6E5C57] mb-1">
                            <span className="uppercase tracking-wider font-medium text-[#C6A36B]">
                              {product.fabric}
                            </span>
                            <div className="flex items-center gap-1 text-[#241816]">
                              <Star className="w-3 h-3 fill-[#C6A36B] text-[#C6A36B]" />
                              <span>{product.rating}</span>
                              <span className="text-[#6E5C57]">({product.reviewCount})</span>
                            </div>
                          </div>

                          <Link href={`/products/${product.slug}`}>
                            <h3 className="font-serif text-base font-bold text-[#241816] group-hover:text-[#722F3D] transition-colors line-clamp-1">
                              {product.name}
                            </h3>
                          </Link>
                          <p className="text-xs text-[#6E5C57] line-clamp-2 mt-1 font-light leading-relaxed">
                            {product.description}
                          </p>
                        </div>

                        {/* Pricing & Add to Cart */}
                        <div className="pt-3 mt-3 border-t border-[#E8DCCF]/60 flex items-center justify-between">
                          <div>
                            <span className="font-serif text-base font-bold text-[#722F3D]">
                              ₹{product.price.toLocaleString('en-IN')}
                            </span>
                            {product.originalPrice > product.price && (
                              <span className="text-xs text-[#6E5C57] line-through ml-2">
                                ₹{product.originalPrice.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => addToCart(product)}
                            className="p-2 rounded-full bg-[#FAF2F3] text-[#722F3D] hover:bg-[#722F3D] hover:text-[#FFFFFF] transition-colors shadow-xs"
                            title="Add to Bag"
                          >
                            <ShoppingBag className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Filters Slide-over Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            className="absolute inset-0 bg-[#241816]/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-[#FFFFFF] shadow-xl flex flex-col p-6 overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-[#E8DCCF]">
                <h3 className="font-serif text-lg font-bold text-[#241816]">Filters &amp; Refinements</h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1 rounded-full text-[#6E5C57] hover:text-[#241816]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Filter Options */}
              <div className="py-6 space-y-6 flex-1">
                {/* Fabric */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-[#241816] mb-3">
                    Fabric
                  </h4>
                  <div className="space-y-2">
                    {fabricOptions.map((f) => (
                      <label key={f} className="flex items-center gap-2.5 text-xs text-[#6E5C57] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedFabrics.includes(f)}
                          onChange={() => toggleFabric(f)}
                          className="rounded border-[#E8DCCF] text-[#722F3D] focus:ring-[#722F3D]"
                        />
                        <span>{f}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Occasion */}
                <div className="pt-4 border-t border-[#E8DCCF]/60">
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-[#241816] mb-3">
                    Occasion
                  </h4>
                  <div className="space-y-2">
                    {occasionOptions.map((occ) => (
                      <label key={occ} className="flex items-center gap-2.5 text-xs text-[#6E5C57] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedOccasions.includes(occ)}
                          onChange={() => toggleOccasion(occ)}
                          className="rounded border-[#E8DCCF] text-[#722F3D] focus:ring-[#722F3D]"
                        />
                        <span>{occ}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="pt-4 border-t border-[#E8DCCF]/60">
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-[#241816] mb-3">
                    Price Range
                  </h4>
                  <div className="space-y-2 text-xs text-[#6E5C57]">
                    {[
                      { id: 'all', label: 'All Prices' },
                      { id: 'under-1500', label: 'Under ₹1,500' },
                      { id: '1500-2500', label: '₹1,500 – ₹2,500' },
                      { id: 'above-2500', label: 'Above ₹2,500' },
                    ].map((tier) => (
                      <label key={tier.id} className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="radio"
                          name="mobile-price-tier"
                          checked={priceRange === tier.id}
                          onChange={() => setPriceRange(tier.id as any)}
                          className="text-[#722F3D] focus:ring-[#722F3D]"
                        />
                        <span>{tier.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer Actions */}
              <div className="pt-4 border-t border-[#E8DCCF] flex gap-3">
                <button
                  onClick={resetFilters}
                  className="flex-1 py-2.5 border border-[#E8DCCF] text-xs font-semibold rounded-lg text-[#241816] hover:bg-[#F8F3EC]"
                >
                  Reset
                </button>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex-1 py-2.5 bg-[#722F3D] text-[#F8F3EC] text-xs font-semibold rounded-lg hover:bg-[#541F28]"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer onSelectCategory={(cat) => router.push(`/category/${cat}`)} />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav onSearchClick={() => setIsSearchOpen(true)} />
    </div>
  );
}

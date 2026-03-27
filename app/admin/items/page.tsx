'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  Search,
  ChevronUp,
  ChevronDown,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Star,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import Badge from '../components/Badge';
import Modal from '../components/Modal';

interface Item {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  category?: { name: string };
  categoryId?: number;
  governorate?: string;
  area?: string;
  avgRating: number;
  totalReviews: number;
  isVerified: boolean;
  isFeatured: boolean;
  isActive: boolean;
  priceLabel?: string;
  website?: string;
  instagram?: string;
  phone?: string;
  tags?: string[];
  createdAt: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

type SortField = 'name' | 'rating' | 'reviews' | 'created' | 'governorate';
type SortOrder = 'asc' | 'desc';

export default function ItemsManagement() {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedGovernorate, setSelectedGovernorate] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');

  const [sortField, setSortField] = useState<SortField>('created');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsRes, categoriesRes] = await Promise.all([
          fetch('/api/admin/items'),
          fetch('/api/categories'),
        ]);

        if (!itemsRes.ok || !categoriesRes.ok) throw new Error('Failed to fetch data');

        const itemsData = await itemsRes.json();
        const categoriesData = await categoriesRes.json();

        setItems(itemsData.data || []);
        setCategories(categoriesData.data || []);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      if (selectedCategory && item.categoryId !== parseInt(selectedCategory)) {
        return false;
      }
      if (selectedGovernorate && item.governorate !== selectedGovernorate) {
        return false;
      }
      if (ratingFilter) {
        const minRating = parseFloat(ratingFilter);
        if (item.avgRating < minRating) return false;
      }
      if (selectedStatus === 'active' && !item.isActive) return false;
      if (selectedStatus === 'inactive' && item.isActive) return false;
      if (selectedStatus === 'verified' && !item.isVerified) return false;
      if (selectedStatus === 'featured' && !item.isFeatured) return false;
      return true;
    });
  }, [items, searchTerm, selectedCategory, selectedGovernorate, ratingFilter, selectedStatus]);

  const sortedItems = useMemo(() => {
    const sorted = [...filteredItems];
    sorted.sort((a, b) => {
      let aVal: any = '';
      let bVal: any = '';

      switch (sortField) {
        case 'name':
          aVal = a.name;
          bVal = b.name;
          break;
        case 'rating':
          aVal = a.avgRating;
          bVal = b.avgRating;
          break;
        case 'reviews':
          aVal = a.totalReviews;
          bVal = b.totalReviews;
          break;
        case 'governorate':
          aVal = a.governorate || '';
          bVal = b.governorate || '';
          break;
        case 'created':
          aVal = new Date(a.createdAt).getTime();
          bVal = new Date(b.createdAt).getTime();
          break;
      }

      if (typeof aVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });
    return sorted;
  }, [filteredItems, sortField, sortOrder]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedItems.slice(start, start + itemsPerPage);
  }, [sortedItems, currentPage]);

  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <div className="w-4 h-4" />;
    return sortOrder === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  const handleToggleItem = (itemId: number) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handleToggleAllItems = (checked: boolean) => {
    setSelectedItems(checked ? paginatedItems.map((item) => item.id) : []);
  };

  const governorates = Array.from(
    new Set(items.filter((item) => item.governorate).map((item) => item.governorate))
  ).sort();

  const stats = {
    total: items.length,
    active: items.filter((i) => i.isActive).length,
    featured: items.filter((i) => i.isFeatured).length,
    verified: items.filter((i) => i.isVerified).length,
    avgRating: items.length > 0 ? (items.reduce((sum, i) => sum + i.avgRating, 0) / items.length).toFixed(2) : '0.00',
  };

  if (loading) {
    return <div className="text-white">Loading items...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 p-4 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg">
        <AlertCircle className="w-5 h-5 text-[#EF4444]" />
        <span className="text-white">{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Items Management</h1>
          <p className="text-white/60 mt-2">Manage all items in the platform</p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 bg-[#E8572A] text-white px-4 py-2 rounded-lg hover:bg-[#E8572A]/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add New Item
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <DashboardCard>
          <p className="text-xs text-white/60 mb-2">Total Items</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </DashboardCard>
        <DashboardCard>
          <p className="text-xs text-white/60 mb-2">Active</p>
          <p className="text-2xl font-bold text-[#4CAF88]">{stats.active}</p>
        </DashboardCard>
        <DashboardCard>
          <p className="text-xs text-white/60 mb-2">Featured</p>
          <p className="text-2xl font-bold text-[#F5C542]">{stats.featured}</p>
        </DashboardCard>
        <DashboardCard>
          <p className="text-xs text-white/60 mb-2">Verified</p>
          <p className="text-2xl font-bold text-[#E8572A]">{stats.verified}</p>
        </DashboardCard>
        <DashboardCard>
          <p className="text-xs text-white/60 mb-2">Avg Rating</p>
          <p className="text-2xl font-bold text-white">{stats.avgRating}</p>
        </DashboardCard>
      </div>

      {/* Filter Bar */}
      <DashboardCard>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#13132B] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#E8572A] transition-colors"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#13132B] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#E8572A] transition-colors"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#13132B] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#E8572A] transition-colors"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="verified">Verified</option>
            <option value="featured">Featured</option>
          </select>

          <select
            value={selectedGovernorate}
            onChange={(e) => {
              setSelectedGovernorate(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#13132B] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#E8572A] transition-colors"
          >
            <option value="">All Governorates</option>
            {governorates.map((gov) => (
              <option key={gov} value={gov}>
                {gov}
              </option>
            ))}
          </select>

          <select
            value={ratingFilter}
            onChange={(e) => {
              setRatingFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#13132B] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#E8572A] transition-colors"
          >
            <option value="">All Ratings</option>
            <option value="4.5">4.5+ stars</option>
            <option value="4">4+ stars</option>
            <option value="3">3+ stars</option>
          </select>
        </div>
      </DashboardCard>

      {/* Bulk Actions Bar */}
      {selectedItems.length > 0 && (
        <DashboardCard className="bg-[#E8572A]/10 border-[#E8572A]/30">
          <div className="flex items-center justify-between">
            <span className="text-white">
              {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 bg-[#4CAF88] text-white rounded hover:bg-[#4CAF88]/90 text-sm transition-colors">
                Activate
              </button>
              <button className="px-3 py-1 bg-[#F5C542] text-white rounded hover:bg-[#F5C542]/90 text-sm transition-colors">
                Feature
              </button>
              <button className="px-3 py-1 bg-[#EF4444] text-white rounded hover:bg-[#EF4444]/90 text-sm transition-colors">
                Delete
              </button>
            </div>
          </div>
        </DashboardCard>
      )}

      {/* Table */}
      <DashboardCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === paginatedItems.length && paginatedItems.length > 0}
                    onChange={(e) => handleToggleAllItems(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-[#13132B]"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white/60">Image</th>
                <th
                  onClick={() => handleSort('name')}
                  className="px-4 py-3 text-left text-xs font-medium text-white/60 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2">
                    Name
                    <SortIcon field="name" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white/60">Category</th>
                <th
                  onClick={() => handleSort('governorate')}
                  className="px-4 py-3 text-left text-xs font-medium text-white/60 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2">
                    Governorate
                    <SortIcon field="governorate" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('rating')}
                  className="px-4 py-3 text-left text-xs font-medium text-white/60 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2">
                    Rating
                    <SortIcon field="rating" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('reviews')}
                  className="px-4 py-3 text-left text-xs font-medium text-white/60 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2">
                    Reviews
                    <SortIcon field="reviews" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white/60">Status</th>
                <th
                  onClick={() => handleSort('created')}
                  className="px-4 py-3 text-left text-xs font-medium text-white/60 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2">
                    Created
                    <SortIcon field="created" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white/60">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-white/5 hover:bg-[#222250] transition-colors"
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleToggleItem(item.id)}
                      className="w-4 h-4 rounded border-white/20 bg-[#13132B]"
                    />
                  </td>
                  <td className="px-4 py-3">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded bg-white/10" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-white truncate">{item.name}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-white/60">{categories.find((c) => c.id === item.categoryId)?.name || '-'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-white/60">{item.governorate || '-'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-[#F5C542]" />
                      <span className="text-sm font-medium text-white">{item.avgRating.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-white/60">{item.totalReviews}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {item.isActive && <Badge variant="success">Active</Badge>}
                      {item.isFeatured && <Badge variant="warning">Featured</Badge>}
                      {item.isVerified && <Badge variant="info">Verified</Badge>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-white/60">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-white/10 rounded transition-colors">
                        <Eye className="w-4 h-4 text-white/60 hover:text-white" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setShowAddModal(true);
                        }}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-white/60 hover:text-white" />
                      </button>
                      <button className="p-1 hover:bg-white/10 rounded transition-colors">
                        <Trash2 className="w-4 h-4 text-[#EF4444]/60 hover:text-[#EF4444]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-4 border-t border-white/5 bg-[#13132B]">
          <span className="text-sm text-white/60">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedItems.length)} of{' '}
            {sortedItems.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1 hover:bg-white/10 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-white/60" />
            </button>
            <span className="text-sm text-white/60">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1 hover:bg-white/10 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-white/60" />
            </button>
          </div>
        </div>
      </DashboardCard>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingItem(null);
        }}
        title={editingItem ? 'Edit Item' : 'Add New Item'}
        size="lg"
        footer={
          <>
            <button
              onClick={() => {
                setShowAddModal(false);
                setEditingItem(null);
              }}
              className="px-4 py-2 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button className="px-4 py-2 bg-[#E8572A] text-white rounded-lg hover:bg-[#E8572A]/90 transition-colors">
              {editingItem ? 'Update Item' : 'Add Item'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Item Name</label>
            <input
              type="text"
              defaultValue={editingItem?.name || ''}
              placeholder="Item name"
              className="w-full bg-[#13132B] border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#E8572A] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Category</label>
            <select
              defaultValue={editingItem?.categoryId || ''}
              className="w-full bg-[#13132B] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#E8572A] transition-colors"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Description</label>
            <textarea
              defaultValue={editingItem?.description || ''}
              placeholder="Item description"
              rows={4}
              className="w-full bg-[#13132B] border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#E8572A] transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Governorate</label>
            <input
              type="text"
              defaultValue={editingItem?.governorate || ''}
              placeholder="Governorate"
              className="w-full bg-[#13132B] border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#E8572A] transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-white cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={editingItem?.isActive}
                  className="w-4 h-4 rounded border-white/20 bg-[#13132B]"
                />
                Active
              </label>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-white cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={editingItem?.isVerified}
                  className="w-4 h-4 rounded border-white/20 bg-[#13132B]"
                />
                Verified
              </label>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-white cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={editingItem?.isFeatured}
                  className="w-4 h-4 rounded border-white/20 bg-[#13132B]"
                />
                Featured
              </label>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

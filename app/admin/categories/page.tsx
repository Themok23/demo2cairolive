'use client';

import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  Edit2,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  Star,
} from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import Badge from '../components/Badge';
import Modal from '../components/Modal';

interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
  description?: string;
  itemCount: number;
  avgRating?: string | number;
}

export default function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    icon: '',
    color: '#E8572A',
    description: '',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/admin/categories');
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data = await res.json();
        setCategories(data.data?.categories || []);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      icon: '',
      color: '#E8572A',
      description: '',
    });
    setShowAddModal(true);
  };

  const handleOpenEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      icon: category.icon || '',
      color: category.color || '#E8572A',
      description: category.description || '',
    });
    setShowAddModal(true);
  };

  const handleGenerateSlug = (name: string) => {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
    setFormData((prev) => ({ ...prev, slug }));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newCategories = [...categories];
    [newCategories[index - 1], newCategories[index]] = [newCategories[index], newCategories[index - 1]];
    setCategories(newCategories);
  };

  const handleMoveDown = (index: number) => {
    if (index === categories.length - 1) return;
    const newCategories = [...categories];
    [newCategories[index], newCategories[index + 1]] = [newCategories[index + 1], newCategories[index]];
    setCategories(newCategories);
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        const res = await fetch(`/api/admin/categories/${categoryId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete');
        setCategories((prev) => prev.filter((c) => c.id !== categoryId));
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) {
    return <div className="text-white">Loading categories...</div>;
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
          <h1 className="text-3xl font-bold text-white">Categories</h1>
          <p className="text-white/60 mt-2">Manage item categories</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-[#E8572A] text-white px-4 py-2 rounded-lg hover:bg-[#E8572A]/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DashboardCard>
          <p className="text-xs text-white/60 mb-2">Total Categories</p>
          <p className="text-2xl font-bold text-white">{categories.length}</p>
        </DashboardCard>
        <DashboardCard>
          <p className="text-xs text-white/60 mb-2">Total Items</p>
          <p className="text-2xl font-bold text-white">
            {categories.reduce((sum, c) => sum + (c.itemCount || 0), 0)}
          </p>
        </DashboardCard>
        <DashboardCard>
          <p className="text-xs text-white/60 mb-2">Avg Items per Category</p>
          <p className="text-2xl font-bold text-white">
            {categories.length > 0
              ? (categories.reduce((sum, c) => sum + (c.itemCount || 0), 0) / categories.length).toFixed(1)
              : '0'}
          </p>
        </DashboardCard>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <DashboardCard key={category.id} interactive>
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {category.icon ? (
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      {category.icon}
                    </div>
                  ) : (
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <div className="text-2xl">#</div>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-white">{category.name}</h3>
                    <p className="text-xs text-white/40 mt-1">{category.slug}</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-white/60 mb-1">Items</p>
                  <p className="text-lg font-bold text-white">{category.itemCount || 0}</p>
                </div>
                {category.avgRating && (
                  <div>
                    <p className="text-xs text-white/60 mb-1">Avg Rating</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-[#F5C542]" />
                      <p className="text-lg font-bold text-white">{parseFloat(String(category.avgRating)).toFixed(1)}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              {category.description && (
                <p className="text-sm text-white/60 line-clamp-2">{category.description}</p>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                <button
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  className="p-2 hover:bg-white/10 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-1"
                  title="Move up"
                  aria-label={`Move category ${category.name} up`}
                >
                  <ArrowUp className="w-4 h-4 text-white/60 mx-auto" />
                </button>
                <button
                  onClick={() => handleMoveDown(index)}
                  disabled={index === categories.length - 1}
                  className="p-2 hover:bg-white/10 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-1"
                  title="Move down"
                  aria-label={`Move category ${category.name} down`}
                >
                  <ArrowDown className="w-4 h-4 text-white/60 mx-auto" />
                </button>
                <button
                  onClick={() => handleOpenEditModal(category)}
                  className="p-2 hover:bg-white/10 rounded transition-colors flex-1"
                  title="Edit"
                  aria-label={`Edit category ${category.name}`}
                >
                  <Edit2 className="w-4 h-4 text-white/60 hover:text-white mx-auto" />
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="p-2 hover:bg-white/10 rounded transition-colors flex-1"
                  title="Delete"
                  aria-label={`Delete category ${category.name}`}
                >
                  <Trash2 className="w-4 h-4 text-[#EF4444]/60 hover:text-[#EF4444] mx-auto" />
                </button>
              </div>
            </div>
          </DashboardCard>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingCategory(null);
        }}
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
        size="md"
        footer={
          <>
            <button
              onClick={() => {
                setShowAddModal(false);
                setEditingCategory(null);
              }}
              className="px-4 py-2 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                if (!formData.name.trim()) {
                  alert('Category name is required');
                  return;
                }

                const url = editingCategory ? `/api/admin/categories/${editingCategory.id}` : '/api/admin/categories';
                const method = editingCategory ? 'PATCH' : 'POST';

                try {
                  const res = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                  });

                  if (!res.ok) throw new Error('Failed to save category');

                  const result = await res.json();

                  if (editingCategory) {
                    setCategories((prev) =>
                      prev.map((c) => (c.id === editingCategory.id ? result.data : c))
                    );
                  } else {
                    setCategories((prev) => [...prev, result.data]);
                  }

                  setShowAddModal(false);
                  setEditingCategory(null);
                } catch (err) {
                  console.error(err);
                  alert('Failed to save category');
                }
              }}
              className="px-4 py-2 bg-[#E8572A] text-white rounded-lg hover:bg-[#E8572A]/90 transition-colors"
            >
              {editingCategory ? 'Update' : 'Create'} Category
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Category Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, name: e.target.value }));
                if (!editingCategory) {
                  handleGenerateSlug(e.target.value);
                }
              }}
              placeholder="e.g., Restaurants"
              className="w-full bg-[#13132B] border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#E8572A] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                }))
              }
              placeholder="e.g., restaurants"
              className="w-full bg-[#13132B] border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#E8572A] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Icon (Emoji or Text)</label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => setFormData((prev) => ({ ...prev, icon: e.target.value }))}
              placeholder="e.g., 🍔 or R"
              maxLength={2}
              className="w-full bg-[#13132B] border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#E8572A] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
                className="w-12 h-10 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
                placeholder="#E8572A"
                className="flex-1 bg-[#13132B] border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#E8572A] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe this category..."
              rows={4}
              className="w-full bg-[#13132B] border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#E8572A] transition-colors resize-none"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

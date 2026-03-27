'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  Search,
  Star,
  AlertCircle,
  Check,
  X,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import Badge from '../components/Badge';

interface Review {
  id: number;
  itemId: number;
  userId: number;
  rating: number;
  title?: string;
  body: string;
  pros?: string;
  cons?: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNote?: string;
  createdAt: string;
  item?: { name: string };
  user?: { name: string; avatarUrl?: string };
}

type StatusFilter = '' | 'pending' | 'approved' | 'rejected';

export default function ReviewsModeration() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReviews, setSelectedReviews] = useState<number[]>([]);
  const [adminNotes, setAdminNotes] = useState<Record<number, string>>({});

  const reviewsPerPage = 5;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/admin/reviews');
        if (!res.ok) throw new Error('Failed to fetch reviews');
        const data = await res.json();
        setReviews(data.data || []);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      if (searchTerm && !review.body.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      if (statusFilter && review.status !== statusFilter) {
        return false;
      }
      if (ratingFilter) {
        const minRating = parseInt(ratingFilter);
        if (review.rating < minRating) return false;
      }
      return true;
    });
  }, [reviews, searchTerm, statusFilter, ratingFilter]);

  const paginatedReviews = useMemo(() => {
    const start = (currentPage - 1) * reviewsPerPage;
    return filteredReviews.slice(start, start + reviewsPerPage);
  }, [filteredReviews, currentPage]);

  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  const stats = {
    total: reviews.length,
    pending: reviews.filter((r) => r.status === 'pending').length,
    approved: reviews.filter((r) => r.status === 'approved').length,
    rejected: reviews.filter((r) => r.status === 'rejected').length,
    approvalRate: reviews.length > 0 ? Math.round((reviews.filter((r) => r.status === 'approved').length / reviews.length) * 100) : 0,
  };

  const handleToggleReview = (reviewId: number) => {
    setSelectedReviews((prev) =>
      prev.includes(reviewId) ? prev.filter((id) => id !== reviewId) : [...prev, reviewId]
    );
  };

  const handleApproveReview = async (reviewId: number) => {
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}/approve`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to approve');
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, status: 'approved' } : r))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectReview = async (reviewId: number) => {
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}/reject`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to reject');
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, status: 'rejected' } : r))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? 'fill-[#F5C542] text-[#F5C542]' : 'text-white/20'
            }`}
          />
        ))}
        <span className="text-sm font-medium text-white ml-2">{rating}/5</span>
      </div>
    );
  };

  if (loading) {
    return <div className="text-white">Loading reviews...</div>;
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
      <div>
        <h1 className="text-3xl font-bold text-white">Reviews Moderation</h1>
        <p className="text-white/60 mt-2">Review and approve pending reviews</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <DashboardCard>
          <p className="text-xs text-white/60 mb-2">Total Reviews</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </DashboardCard>
        <DashboardCard>
          <p className="text-xs text-white/60 mb-2">Pending</p>
          <p className="text-2xl font-bold text-[#F5C542]">{stats.pending}</p>
        </DashboardCard>
        <DashboardCard>
          <p className="text-xs text-white/60 mb-2">Approved</p>
          <p className="text-2xl font-bold text-[#4CAF88]">{stats.approved}</p>
        </DashboardCard>
        <DashboardCard>
          <p className="text-xs text-white/60 mb-2">Rejected</p>
          <p className="text-2xl font-bold text-[#EF4444]">{stats.rejected}</p>
        </DashboardCard>
        <DashboardCard>
          <p className="text-xs text-white/60 mb-2">Approval Rate</p>
          <p className="text-2xl font-bold text-white">{stats.approvalRate}%</p>
        </DashboardCard>
      </div>

      {/* Filter Bar */}
      <DashboardCard>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#13132B] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#E8572A] transition-colors"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as StatusFilter);
              setCurrentPage(1);
            }}
            className="bg-[#13132B] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#E8572A] transition-colors"
          >
            <option value="">All Reviews</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
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
            <option value="1">1 Star</option>
            <option value="2">2 Stars</option>
            <option value="3">3 Stars</option>
            <option value="4">4 Stars</option>
            <option value="5">5 Stars</option>
          </select>
        </div>
      </DashboardCard>

      {/* Bulk Actions Bar */}
      {selectedReviews.length > 0 && (
        <DashboardCard className="bg-[#E8572A]/10 border-[#E8572A]/30">
          <div className="flex items-center justify-between">
            <span className="text-white">
              {selectedReviews.length} review{selectedReviews.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-1 bg-[#4CAF88] text-white rounded hover:bg-[#4CAF88]/90 text-sm transition-colors">
                <Check className="w-4 h-4" />
                Approve All
              </button>
              <button className="flex items-center gap-2 px-3 py-1 bg-[#EF4444] text-white rounded hover:bg-[#EF4444]/90 text-sm transition-colors">
                <X className="w-4 h-4" />
                Reject All
              </button>
            </div>
          </div>
        </DashboardCard>
      )}

      {/* Reviews Cards */}
      <div className="space-y-4">
        {paginatedReviews.map((review) => (
          <DashboardCard key={review.id} interactive>
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <input
                    type="checkbox"
                    checked={selectedReviews.includes(review.id)}
                    onChange={() => handleToggleReview(review.id)}
                    className="w-4 h-4 rounded border-white/20 bg-[#13132B] mt-1"
                  />
                  <div className="flex-1">
                    {review.user?.avatarUrl ? (
                      <img
                        src={review.user.avatarUrl}
                        alt={review.user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-white/10" />
                    )}
                    <p className="text-sm font-medium text-white mt-2">{review.user?.name || 'Anonymous'}</p>
                  </div>
                </div>
                <div className="text-right">
                  {renderStars(review.rating)}
                </div>
              </div>

              {/* Review Content */}
              <div>
                {review.title && <h4 className="font-medium text-white mb-2">{review.title}</h4>}
                <p className="text-sm text-white/80 line-clamp-3">{review.body}</p>
              </div>

              {/* Pros/Cons */}
              {(review.pros || review.cons) && (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {review.pros && (
                    <div>
                      <p className="text-[#4CAF88] font-medium mb-1">Pros</p>
                      <p className="text-white/60">{review.pros}</p>
                    </div>
                  )}
                  {review.cons && (
                    <div>
                      <p className="text-[#EF4444] font-medium mb-1">Cons</p>
                      <p className="text-white/60">{review.cons}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Item and Date */}
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-white/60">
                    Review of <span className="text-white font-medium">{review.item?.name || 'Unknown'}</span>
                  </p>
                  <p className="text-white/40 text-xs mt-1">
                    {new Date(review.createdAt).toLocaleString()}
                  </p>
                </div>
                <Badge
                  variant={
                    review.status === 'approved'
                      ? 'success'
                      : review.status === 'rejected'
                        ? 'error'
                        : 'warning'
                  }
                >
                  {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                </Badge>
              </div>

              {/* Admin Note */}
              <div>
                <label className="block text-xs font-medium text-white/60 mb-2">Admin Note</label>
                <textarea
                  value={adminNotes[review.id] || review.adminNote || ''}
                  onChange={(e) =>
                    setAdminNotes((prev) => ({
                      ...prev,
                      [review.id]: e.target.value,
                    }))
                  }
                  placeholder="Add admin note..."
                  rows={2}
                  className="w-full bg-[#13132B] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#E8572A] transition-colors resize-none"
                />
              </div>

              {/* Actions */}
              {review.status === 'pending' && (
                <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                  <button
                    onClick={() => handleApproveReview(review.id)}
                    className="flex items-center gap-2 flex-1 px-4 py-2 bg-[#4CAF88] text-white rounded-lg hover:bg-[#4CAF88]/90 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleRejectReview(review.id)}
                    className="flex items-center gap-2 flex-1 px-4 py-2 bg-[#EF4444] text-white rounded-lg hover:bg-[#EF4444]/90 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </DashboardCard>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-4">
        <span className="text-sm text-white/60">
          Showing {(currentPage - 1) * reviewsPerPage + 1} to {Math.min(currentPage * reviewsPerPage, filteredReviews.length)} of{' '}
          {filteredReviews.length}
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
    </div>
  );
}

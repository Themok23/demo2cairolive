'use client';

import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  Edit2,
  Trash2,
  Plus,
  Gift,
  Trophy,
  TrendingUp,
  Clock,
} from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import Badge from '../components/Badge';
import Modal from '../components/Modal';

interface MembershipLevel {
  id: number;
  name: string;
  slug: string;
  minReviews: number;
  icon?: string;
  color?: string;
  discount: number;
  perks: string[];
}

interface Reward {
  id: number;
  title: string;
  description: string;
  partner: string;
  discount: number;
  minLevel: string;
  isActive: boolean;
  expiresAt?: string;
  claims?: number;
}

interface RewardClaim {
  id: number;
  userId: number;
  rewardId: number;
  claimedAt: string;
  userName?: string;
  rewardTitle?: string;
}

type TabType = 'levels' | 'rewards' | 'claims';

export default function GamificationManagement() {
  const [activeTab, setActiveTab] = useState<TabType>('levels');
  const [levels, setLevels] = useState<MembershipLevel[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [claims, setClaims] = useState<RewardClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showLevelModal, setShowLevelModal] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [editingLevel, setEditingLevel] = useState<MembershipLevel | null>(null);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);

  const [levelFormData, setLevelFormData] = useState({
    name: '',
    slug: '',
    minReviews: 0,
    icon: '',
    color: '#E8572A',
    discount: 0,
  });

  const [rewardFormData, setRewardFormData] = useState({
    title: '',
    description: '',
    partner: '',
    discount: 0,
    minLevel: 'explorer',
    isActive: true,
    expiresAt: '',
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [levelsRes, rewardsRes, claimsRes] = await Promise.all([
          fetch('/api/admin/gamification/levels'),
          fetch('/api/admin/gamification/rewards'),
          fetch('/api/admin/gamification/claims'),
        ]);

        if (!levelsRes.ok || !rewardsRes.ok || !claimsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const [levelsData, rewardsData, claimsData] = await Promise.all([
          levelsRes.json(),
          rewardsRes.json(),
          claimsRes.json(),
        ]);

        setLevels(levelsData.data || []);
        setRewards(rewardsData.data || []);
        setClaims(claimsData.data || []);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = {
    totalLevels: levels.length,
    totalRewards: rewards.length,
    activeRewards: rewards.filter((r) => r.isActive).length,
    totalClaims: claims.length,
    mostClaimedReward: rewards.length > 0
      ? rewards.reduce((max, r) => (r.claims || 0) > (max.claims || 0) ? r : max)
      : null,
  };

  if (loading) {
    return <div className="text-white">Loading gamification data...</div>;
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
        <h1 className="text-3xl font-bold text-white">Gamification Management</h1>
        <p className="text-white/60 mt-2">Manage user levels, rewards, and claims</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <DashboardCard>
          <p className="text-xs text-white/60 mb-2">Membership Levels</p>
          <p className="text-2xl font-bold text-white">{stats.totalLevels}</p>
        </DashboardCard>
        <DashboardCard>
          <p className="text-xs text-white/60 mb-2">Total Rewards</p>
          <p className="text-2xl font-bold text-white">{stats.totalRewards}</p>
        </DashboardCard>
        <DashboardCard>
          <p className="text-xs text-white/60 mb-2">Active Rewards</p>
          <p className="text-2xl font-bold text-[#4CAF88]">{stats.activeRewards}</p>
        </DashboardCard>
        <DashboardCard>
          <p className="text-xs text-white/60 mb-2">Total Claims</p>
          <p className="text-2xl font-bold text-white">{stats.totalClaims}</p>
        </DashboardCard>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10">
        {['levels', 'rewards', 'claims'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as TabType)}
            className={`px-4 py-3 font-medium transition-colors border-b-2 ${
              activeTab === tab
                ? 'text-white border-[#E8572A]'
                : 'text-white/60 border-transparent hover:text-white'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Membership Levels Tab */}
      {activeTab === 'levels' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Membership Levels</h2>
            <button
              onClick={() => {
                setEditingLevel(null);
                setLevelFormData({
                  name: '',
                  slug: '',
                  minReviews: 0,
                  icon: '',
                  color: '#E8572A',
                  discount: 0,
                });
                setShowLevelModal(true);
              }}
              className="flex items-center gap-2 bg-[#E8572A] text-white px-4 py-2 rounded-lg hover:bg-[#E8572A]/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Level
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {levels.map((level) => (
              <DashboardCard key={level.id} interactive>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    {level.icon ? (
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                        style={{ backgroundColor: `${level.color}20` }}
                      >
                        {level.icon}
                      </div>
                    ) : (
                      <Trophy className="w-8 h-8 text-[#F5C542]" />
                    )}
                    <div>
                      <h3 className="font-semibold text-white">{level.name}</h3>
                      <p className="text-xs text-white/40">{level.slug}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-white/60 mb-1">Min Reviews</p>
                      <p className="text-lg font-bold text-white">{level.minReviews}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/60 mb-1">Discount</p>
                      <p className="text-lg font-bold text-white">{level.discount}%</p>
                    </div>
                  </div>

                  {level.perks && level.perks.length > 0 && (
                    <div>
                      <p className="text-xs text-white/60 mb-2">Perks</p>
                      <div className="space-y-1">
                        {level.perks.map((perk, idx) => (
                          <p key={idx} className="text-xs text-white/60">
                            • {perk}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                    <button
                      onClick={() => {
                        setEditingLevel(level);
                        setLevelFormData({
                          name: level.name,
                          slug: level.slug,
                          minReviews: level.minReviews,
                          icon: level.icon || '',
                          color: level.color || '#E8572A',
                          discount: level.discount,
                        });
                        setShowLevelModal(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 p-2 hover:bg-white/10 rounded transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-white/60" />
                    </button>
                    <button
                      onClick={async () => {
                        if (!confirm('Are you sure you want to delete this level?')) return;
                        try {
                          const res = await fetch(`/api/admin/gamification/levels/${level.id}`, { method: 'DELETE' });
                          if (!res.ok) throw new Error('Failed to delete');
                          setLevels((prev) => prev.filter((l) => l.id !== level.id));
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                      className="flex-1 flex items-center justify-center gap-2 p-2 hover:bg-white/10 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-[#EF4444]/60" />
                    </button>
                  </div>
                </div>
              </DashboardCard>
            ))}
          </div>
        </div>
      )}

      {/* Rewards Tab */}
      {activeTab === 'rewards' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Rewards</h2>
            <button
              onClick={() => {
                setEditingReward(null);
                setRewardFormData({
                  title: '',
                  description: '',
                  partner: '',
                  discount: 0,
                  minLevel: 'explorer',
                  isActive: true,
                  expiresAt: '',
                });
                setShowRewardModal(true);
              }}
              className="flex items-center gap-2 bg-[#E8572A] text-white px-4 py-2 rounded-lg hover:bg-[#E8572A]/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Reward
            </button>
          </div>

          <DashboardCard className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-4 py-3 text-left text-xs font-medium text-white/60">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white/60">Partner</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white/60">Discount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white/60">Min Level</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white/60">Claims</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white/60">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white/60">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rewards.map((reward) => (
                    <tr
                      key={reward.id}
                      className="border-b border-white/5 hover:bg-[#222250] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-white">{reward.title}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-white/60">{reward.partner}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-white">{reward.discount}%</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="info">
                          {reward.minLevel.charAt(0).toUpperCase() + reward.minLevel.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-white/60">{reward.claims || 0}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={reward.isActive ? 'success' : 'neutral'}>
                          {reward.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingReward(reward);
                              setRewardFormData({
                                title: reward.title,
                                description: reward.description,
                                partner: reward.partner,
                                discount: reward.discount,
                                minLevel: reward.minLevel,
                                isActive: reward.isActive,
                                expiresAt: reward.expiresAt || '',
                              });
                              setShowRewardModal(true);
                            }}
                            className="p-1 hover:bg-white/10 rounded transition-colors"
                          >
                            <Edit2 className="w-4 h-4 text-white/60" />
                          </button>
                          <button
                            onClick={async () => {
                              if (!confirm('Are you sure you want to delete this reward?')) return;
                              try {
                                const res = await fetch(`/api/admin/gamification/rewards/${reward.id}`, { method: 'DELETE' });
                                if (!res.ok) throw new Error('Failed to delete');
                                setRewards((prev) => prev.filter((r) => r.id !== reward.id));
                              } catch (err) {
                                console.error(err);
                              }
                            }}
                            className="p-1 hover:bg-white/10 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-[#EF4444]/60" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashboardCard>
        </div>
      )}

      {/* Claims Tab */}
      {activeTab === 'claims' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white">Reward Claims</h2>

          <DashboardCard className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-4 py-3 text-left text-xs font-medium text-white/60">User</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white/60">Reward</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white/60">Claimed Date</th>
                  </tr>
                </thead>
                <tbody>
                  {claims.slice(0, 10).map((claim) => (
                    <tr
                      key={claim.id}
                      className="border-b border-white/5 hover:bg-[#222250] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <p className="text-sm text-white">{claim.userName || 'Unknown'}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-white/60">{claim.rewardTitle || 'Unknown Reward'}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-white/60">
                          {new Date(claim.claimedAt).toLocaleDateString()}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashboardCard>
        </div>
      )}

      {/* Level Modal */}
      <Modal
        isOpen={showLevelModal}
        onClose={() => {
          setShowLevelModal(false);
          setEditingLevel(null);
          setFormError(null);
        }}
        title={editingLevel ? 'Edit Level' : 'Add Membership Level'}
        size="md"
        footer={
          <>
            <button
              onClick={() => {
                setShowLevelModal(false);
                setEditingLevel(null);
                setFormError(null);
              }}
              disabled={formLoading}
              className="px-4 py-2 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                if (!levelFormData.name.trim()) {
                  setFormError('Level name is required');
                  return;
                }

                setFormError(null);
                setFormLoading(true);

                try {
                  const url = editingLevel ? `/api/admin/gamification/levels/${editingLevel.id}` : '/api/admin/gamification/levels';
                  const method = editingLevel ? 'PATCH' : 'POST';

                  const res = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(levelFormData),
                  });

                  if (!res.ok) throw new Error('Failed to save level');

                  const result = await res.json();

                  if (editingLevel) {
                    setLevels((prev) =>
                      prev.map((l) => (l.id === editingLevel.id ? result.data : l))
                    );
                  } else {
                    setLevels((prev) => [...prev, result.data]);
                  }

                  setShowLevelModal(false);
                  setEditingLevel(null);
                } catch (err) {
                  setFormError((err as Error).message);
                } finally {
                  setFormLoading(false);
                }
              }}
              disabled={formLoading}
              className="px-4 py-2 bg-[#E8572A] text-white rounded-lg hover:bg-[#E8572A]/90 transition-colors disabled:opacity-50"
            >
              {formLoading ? 'Saving...' : editingLevel ? 'Update' : 'Create'} Level
            </button>
          </>
        }
      >
        <div className="space-y-4">
          {formError && (
            <div className="flex items-center gap-3 p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg">
              <AlertCircle className="w-4 h-4 text-[#EF4444]" />
              <span className="text-sm text-white">{formError}</span>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Level Name</label>
            <input
              type="text"
              value={levelFormData.name}
              onChange={(e) => setLevelFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Explorer"
              className="w-full bg-[#13132B] border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#E8572A] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Minimum Reviews Required</label>
            <input
              type="number"
              value={levelFormData.minReviews}
              onChange={(e) => setLevelFormData((prev) => ({ ...prev, minReviews: parseInt(e.target.value) }))}
              placeholder="0"
              className="w-full bg-[#13132B] border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#E8572A] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Discount Percent</label>
            <input
              type="number"
              value={levelFormData.discount}
              onChange={(e) => setLevelFormData((prev) => ({ ...prev, discount: parseInt(e.target.value) }))}
              placeholder="0"
              className="w-full bg-[#13132B] border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#E8572A] transition-colors"
            />
          </div>
        </div>
      </Modal>

      {/* Reward Modal */}
      <Modal
        isOpen={showRewardModal}
        onClose={() => {
          setShowRewardModal(false);
          setEditingReward(null);
          setFormError(null);
        }}
        title={editingReward ? 'Edit Reward' : 'Add New Reward'}
        size="md"
        footer={
          <>
            <button
              onClick={() => {
                setShowRewardModal(false);
                setEditingReward(null);
                setFormError(null);
              }}
              disabled={formLoading}
              className="px-4 py-2 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                if (!rewardFormData.title.trim()) {
                  setFormError('Reward title is required');
                  return;
                }

                setFormError(null);
                setFormLoading(true);

                try {
                  const url = editingReward ? `/api/admin/gamification/rewards/${editingReward.id}` : '/api/admin/gamification/rewards';
                  const method = editingReward ? 'PATCH' : 'POST';

                  const res = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(rewardFormData),
                  });

                  if (!res.ok) throw new Error('Failed to save reward');

                  const result = await res.json();

                  if (editingReward) {
                    setRewards((prev) =>
                      prev.map((r) => (r.id === editingReward.id ? result.data : r))
                    );
                  } else {
                    setRewards((prev) => [...prev, result.data]);
                  }

                  setShowRewardModal(false);
                  setEditingReward(null);
                } catch (err) {
                  setFormError((err as Error).message);
                } finally {
                  setFormLoading(false);
                }
              }}
              disabled={formLoading}
              className="px-4 py-2 bg-[#E8572A] text-white rounded-lg hover:bg-[#E8572A]/90 transition-colors disabled:opacity-50"
            >
              {formLoading ? 'Saving...' : editingReward ? 'Update' : 'Create'} Reward
            </button>
          </>
        }
      >
        <div className="space-y-4">
          {formError && (
            <div className="flex items-center gap-3 p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg">
              <AlertCircle className="w-4 h-4 text-[#EF4444]" />
              <span className="text-sm text-white">{formError}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-white mb-2">Reward Title</label>
            <input
              type="text"
              value={rewardFormData.title}
              onChange={(e) => setRewardFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., 20% Off Dinner"
              className="w-full bg-[#13132B] border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#E8572A] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Partner Name</label>
            <input
              type="text"
              value={rewardFormData.partner}
              onChange={(e) => setRewardFormData((prev) => ({ ...prev, partner: e.target.value }))}
              placeholder="e.g., Restaurant Name"
              className="w-full bg-[#13132B] border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#E8572A] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Discount %</label>
            <input
              type="number"
              value={rewardFormData.discount}
              onChange={(e) => setRewardFormData((prev) => ({ ...prev, discount: parseInt(e.target.value) }))}
              placeholder="0"
              className="w-full bg-[#13132B] border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#E8572A] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Minimum Level</label>
            <select
              value={rewardFormData.minLevel}
              onChange={(e) => setRewardFormData((prev) => ({ ...prev, minLevel: e.target.value }))}
              className="w-full bg-[#13132B] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#E8572A] transition-colors"
            >
              <option value="explorer">Explorer</option>
              <option value="contributor">Contributor</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-white cursor-pointer">
              <input
                type="checkbox"
                checked={rewardFormData.isActive}
                onChange={(e) => setRewardFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                className="w-4 h-4 rounded border-white/20 bg-[#13132B]"
              />
              Active
            </label>
          </div>
        </div>
      </Modal>
    </div>
  );
}

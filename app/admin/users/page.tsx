'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  Search,
  Mail,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  UserPlus,
} from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import Badge from '../components/Badge';
import Modal from '../components/Modal';

interface User {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'admin' | 'user' | 'moderator';
  reviewCount: number;
  createdAt: string;
  level?: string;
  approvedReviewCount?: number;
  totalPoints?: number;
}

type SortField = 'name' | 'email' | 'reviews' | 'joined';
type SortOrder = 'asc' | 'desc';

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const [sortField, setSortField] = useState<SortField>('joined');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'user' | 'moderator' | 'admin'>('user');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [roleChangeLoading, setRoleChangeLoading] = useState(false);

  const usersPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/admin/users');
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        setUsers(data.data?.users || []);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        if (!user.name.toLowerCase().includes(search) && !user.email.toLowerCase().includes(search)) {
          return false;
        }
      }
      if (roleFilter && user.role !== roleFilter) {
        return false;
      }
      return true;
    });
  }, [users, searchTerm, roleFilter]);

  const sortedUsers = useMemo(() => {
    const sorted = [...filteredUsers];
    sorted.sort((a, b) => {
      let aVal: any = '';
      let bVal: any = '';

      switch (sortField) {
        case 'name':
          aVal = a.name;
          bVal = b.name;
          break;
        case 'email':
          aVal = a.email;
          bVal = b.email;
          break;
        case 'reviews':
          aVal = a.reviewCount;
          bVal = b.reviewCount;
          break;
        case 'joined':
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
  }, [filteredUsers, sortField, sortOrder]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * usersPerPage;
    return sortedUsers.slice(start, start + usersPerPage);
  }, [sortedUsers, currentPage]);

  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

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

  const stats = {
    total: users.length,
    active: users.filter((u) => new Date(u.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length,
    admins: users.filter((u) => u.role === 'admin').length,
    avgReviews: users.length > 0 ? (users.reduce((sum, u) => sum + u.reviewCount, 0) / users.length).toFixed(1) : '0.0',
  };

  if (loading) {
    return <div className="text-white">Loading users...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 p-4 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg">
        <AlertCircle className="w-5 h-5 text-[#EF4444]" />
        <span className="text-white">{error}</span>
      </div>
    );
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'moderator':
        return 'warning';
      default:
        return 'info';
    }
  };

  const getLevelBadgeVariant = (level?: string) => {
    switch (level) {
      case 'expert':
        return 'success';
      case 'contributor':
        return 'info';
      case 'explorer':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Users</h1>
          <p className="text-white/60 mt-2">Manage platform users and roles</p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 bg-[#E8572A] text-white px-4 py-2 rounded-lg hover:bg-[#E8572A]/90 transition-colors"
        >
          <UserPlus className="w-5 h-5" />
          Invite User
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <DashboardCard>
          <p className="text-xs text-white/60 mb-2">Total Users</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </DashboardCard>
        <DashboardCard>
          <p className="text-xs text-white/60 mb-2">Active (30d)</p>
          <p className="text-2xl font-bold text-[#4CAF88]">{stats.active}</p>
        </DashboardCard>
        <DashboardCard>
          <p className="text-xs text-white/60 mb-2">Admins</p>
          <p className="text-2xl font-bold text-[#E8572A]">{stats.admins}</p>
        </DashboardCard>
        <DashboardCard>
          <p className="text-xs text-white/60 mb-2">Avg Reviews</p>
          <p className="text-2xl font-bold text-white">{stats.avgReviews}</p>
        </DashboardCard>
      </div>

      {/* Filter Bar */}
      <DashboardCard>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#13132B] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#E8572A] transition-colors"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#13132B] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#E8572A] transition-colors"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
            <option value="user">User</option>
          </select>
        </div>
      </DashboardCard>

      {/* Table */}
      <DashboardCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-4 py-3 text-left text-xs font-medium text-white/60">Avatar</th>
                <th
                  onClick={() => handleSort('name')}
                  className="px-4 py-3 text-left text-xs font-medium text-white/60 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2">
                    Name
                    <SortIcon field="name" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('email')}
                  className="px-4 py-3 text-left text-xs font-medium text-white/60 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2">
                    Email
                    <SortIcon field="email" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white/60">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white/60">Level</th>
                <th
                  onClick={() => handleSort('reviews')}
                  className="px-4 py-3 text-left text-xs font-medium text-white/60 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2">
                    Reviews
                    <SortIcon field="reviews" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('joined')}
                  className="px-4 py-3 text-left text-xs font-medium text-white/60 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2">
                    Joined
                    <SortIcon field="joined" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white/60">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-white/5 hover:bg-[#222250] transition-colors"
                >
                  <td className="px-4 py-3">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-white/10" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-white">{user.name}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-white/40" />
                      <p className="text-sm text-white/60 truncate">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={getLevelBadgeVariant(user.level)}>
                      {user.level ? user.level.charAt(0).toUpperCase() + user.level.slice(1) : 'New'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-white/60">{user.reviewCount}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-white/60">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserModal(true);
                        }}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-white/60 hover:text-white" />
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
            Showing {(currentPage - 1) * usersPerPage + 1} to {Math.min(currentPage * usersPerPage, sortedUsers.length)} of{' '}
            {sortedUsers.length}
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

      {/* User Detail Modal */}
      <Modal
        isOpen={showUserModal}
        onClose={() => {
          setShowUserModal(false);
          setSelectedUser(null);
        }}
        title={selectedUser?.name || 'User Details'}
        size="lg"
        footer={
          <>
            <button
              onClick={() => {
                setShowUserModal(false);
                setSelectedUser(null);
              }}
              className="px-4 py-2 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              Close
            </button>
            <button
              onClick={async () => {
                if (!selectedUser) return;
                setRoleChangeLoading(true);
                try {
                  const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ role: selectedRole }),
                  });

                  if (!res.ok) throw new Error('Failed to update role');

                  setUsers((prev) =>
                    prev.map((u) => (u.id === selectedUser.id ? { ...u, role: selectedRole } : u))
                  );

                  setShowUserModal(false);
                  setSelectedUser(null);
                } catch (err) {
                  console.error(err);
                  alert('Failed to change role');
                } finally {
                  setRoleChangeLoading(false);
                }
              }}
              disabled={roleChangeLoading}
              className="px-4 py-2 bg-[#E8572A] text-white rounded-lg hover:bg-[#E8572A]/90 transition-colors disabled:opacity-50"
            >
              {roleChangeLoading ? 'Updating...' : 'Change Role'}
            </button>
          </>
        }
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              {selectedUser.avatarUrl ? (
                <img
                  src={selectedUser.avatarUrl}
                  alt={selectedUser.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-white/10" />
              )}
              <div>
                <p className="text-xl font-semibold text-white">{selectedUser.name}</p>
                <p className="text-sm text-white/60 mt-1">{selectedUser.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-white/60 mb-2">Current Role</p>
                <Badge variant={getRoleBadgeVariant(selectedUser.role)}>
                  {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-white/60 mb-2">Level</p>
                <Badge variant={getLevelBadgeVariant(selectedUser.level)}>
                  {selectedUser.level ? selectedUser.level.charAt(0).toUpperCase() + selectedUser.level.slice(1) : 'New'}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-white/60 mb-2">Reviews</p>
                <p className="text-lg font-semibold text-white">{selectedUser.reviewCount}</p>
              </div>
              <div>
                <p className="text-xs text-white/60 mb-2">Joined</p>
                <p className="text-sm text-white">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="border-t border-white/5 pt-6">
              <label className="block text-sm font-semibold text-white mb-3">Change Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as 'user' | 'moderator' | 'admin')}
                className="w-full bg-[#13132B] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#E8572A] transition-colors"
              >
                <option value="user">User</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="border-t border-white/5 pt-6">
              <h4 className="text-sm font-semibold text-white mb-4">Recent Reviews</h4>
              <div className="space-y-3">
                <div className="p-3 bg-[#13132B] rounded border border-white/5">
                  <p className="text-sm text-white/60">No reviews loaded in this preview</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Invite User Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => {
          setShowInviteModal(false);
          setInviteEmail('');
          setInviteMessage('');
          setSelectedRole('user');
        }}
        title="Invite New User"
        size="md"
        footer={
          <>
            <button
              onClick={() => {
                setShowInviteModal(false);
                setInviteEmail('');
                setInviteMessage('');
                setSelectedRole('user');
              }}
              disabled={inviteLoading}
              className="px-4 py-2 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                if (!inviteEmail.trim()) {
                  alert('Email is required');
                  return;
                }

                setInviteLoading(true);
                try {
                  const res = await fetch('/api/admin/users/invite', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      email: inviteEmail,
                      role: selectedRole,
                      message: inviteMessage,
                    }),
                  });

                  if (!res.ok) throw new Error('Failed to send invite');

                  alert('Invite sent successfully');
                  setShowInviteModal(false);
                  setInviteEmail('');
                  setInviteMessage('');
                  setSelectedRole('user');
                } catch (err) {
                  console.error(err);
                  alert('Failed to send invite');
                } finally {
                  setInviteLoading(false);
                }
              }}
              disabled={inviteLoading}
              className="px-4 py-2 bg-[#E8572A] text-white rounded-lg hover:bg-[#E8572A]/90 transition-colors disabled:opacity-50"
            >
              {inviteLoading ? 'Sending...' : 'Send Invite'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Email Address</label>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full bg-[#13132B] border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#E8572A] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as 'user' | 'moderator' | 'admin')}
              className="w-full bg-[#13132B] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#E8572A] transition-colors"
            >
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Message</label>
            <textarea
              value={inviteMessage}
              onChange={(e) => setInviteMessage(e.target.value)}
              placeholder="Optional message to include in the invite..."
              rows={4}
              className="w-full bg-[#13132B] border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#E8572A] transition-colors resize-none"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

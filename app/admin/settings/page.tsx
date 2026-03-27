'use client';

import React, { useEffect, useState } from 'react';
import {
  Save,
  AlertCircle,
  Download,
  Globe,
  Shield,
  Bell,
} from 'lucide-react';
import DashboardCard from '../components/DashboardCard';

interface Settings {
  siteName: string;
  siteDescription: string;
  defaultLanguage: string;
  autoApproveThreshold: number;
  minReviewLength: number;
  maxReviewLength: number;
  blockedWords: string[];
  emailNotificationsEnabled: boolean;
  newReviewNotifications: boolean;
  weeklyDigestNotifications: boolean;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    siteName: 'Cairo Live',
    siteDescription: 'Community rating platform for Egypt',
    defaultLanguage: 'en',
    autoApproveThreshold: 4,
    minReviewLength: 10,
    maxReviewLength: 5000,
    blockedWords: [],
    emailNotificationsEnabled: true,
    newReviewNotifications: true,
    weeklyDigestNotifications: true,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [newBlockedWord, setNewBlockedWord] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings');
        if (!res.ok) throw new Error('Failed to fetch settings');
        const data = await res.json();
        setSettings(data.data || settings);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSaveSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error('Failed to save settings');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleAddBlockedWord = () => {
    if (newBlockedWord.trim()) {
      setSettings((prev) => ({
        ...prev,
        blockedWords: [...prev.blockedWords, newBlockedWord.trim()],
      }));
      setNewBlockedWord('');
    }
  };

  const handleRemoveBlockedWord = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      blockedWords: prev.blockedWords.filter((_, i) => i !== index),
    }));
  };

  const handleExportData = async (type: 'items' | 'reviews' | 'users') => {
    try {
      const res = await fetch(`/api/admin/export?type=${type}`);
      if (!res.ok) throw new Error('Failed to export');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-white">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-white/60 mt-2">Configure platform settings and preferences</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg">
          <AlertCircle className="w-5 h-5 text-[#EF4444]" />
          <span className="text-white">{error}</span>
        </div>
      )}

      {saved && (
        <div className="flex items-center gap-3 p-4 bg-[#4CAF88]/10 border border-[#4CAF88]/20 rounded-lg">
          <AlertCircle className="w-5 h-5 text-[#4CAF88]" />
          <span className="text-white">Settings saved successfully</span>
        </div>
      )}

      {/* General Settings */}
      <DashboardCard>
        <div className="flex items-center gap-2 mb-6">
          <Globe className="w-5 h-5 text-[#E8572A]" />
          <h2 className="text-lg font-semibold text-white">General Settings</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Site Name</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings((prev) => ({ ...prev, siteName: e.target.value }))}
              className="w-full bg-[#13132B] border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#E8572A] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Site Description</label>
            <textarea
              value={settings.siteDescription}
              onChange={(e) => setSettings((prev) => ({ ...prev, siteDescription: e.target.value }))}
              rows={3}
              className="w-full bg-[#13132B] border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#E8572A] transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Default Language</label>
            <select
              value={settings.defaultLanguage}
              onChange={(e) => setSettings((prev) => ({ ...prev, defaultLanguage: e.target.value }))}
              className="w-full bg-[#13132B] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#E8572A] transition-colors"
            >
              <option value="en">English</option>
              <option value="ar">Arabic</option>
            </select>
          </div>
        </div>
      </DashboardCard>

      {/* Moderation Settings */}
      <DashboardCard>
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-[#E8572A]" />
          <h2 className="text-lg font-semibold text-white">Moderation Settings</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Auto-Approve Threshold (Rating)</label>
            <input
              type="number"
              value={settings.autoApproveThreshold}
              onChange={(e) => setSettings((prev) => ({ ...prev, autoApproveThreshold: parseInt(e.target.value) }))}
              min="0"
              max="5"
              step="0.5"
              className="w-full bg-[#13132B] border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#E8572A] transition-colors"
            />
            <p className="text-xs text-white/40 mt-2">Reviews with ratings above this will be auto-approved</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Min Review Length</label>
              <input
                type="number"
                value={settings.minReviewLength}
                onChange={(e) => setSettings((prev) => ({ ...prev, minReviewLength: parseInt(e.target.value) }))}
                placeholder="10"
                className="w-full bg-[#13132B] border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#E8572A] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Max Review Length</label>
              <input
                type="number"
                value={settings.maxReviewLength}
                onChange={(e) => setSettings((prev) => ({ ...prev, maxReviewLength: parseInt(e.target.value) }))}
                placeholder="5000"
                className="w-full bg-[#13132B] border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#E8572A] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Blocked Words</label>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newBlockedWord}
                  onChange={(e) => setNewBlockedWord(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddBlockedWord();
                    }
                  }}
                  placeholder="Add a blocked word..."
                  className="flex-1 bg-[#13132B] border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#E8572A] transition-colors"
                />
                <button
                  onClick={handleAddBlockedWord}
                  className="px-4 py-2 bg-[#E8572A] text-white rounded-lg hover:bg-[#E8572A]/90 transition-colors"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {settings.blockedWords.map((word, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-1 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-full"
                  >
                    <span className="text-sm text-white">{word}</span>
                    <button
                      onClick={() => handleRemoveBlockedWord(index)}
                      className="text-[#EF4444] hover:text-[#EF4444]/80 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardCard>

      {/* Notification Settings */}
      <DashboardCard>
        <div className="flex items-center gap-2 mb-6">
          <Bell className="w-5 h-5 text-[#E8572A]" />
          <h2 className="text-lg font-semibold text-white">Notification Settings</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-3 text-sm font-medium text-white cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotificationsEnabled}
                onChange={(e) => setSettings((prev) => ({ ...prev, emailNotificationsEnabled: e.target.checked }))}
                className="w-4 h-4 rounded border-white/20 bg-[#13132B]"
              />
              Enable Email Notifications
            </label>
          </div>

          <div>
            <label className="flex items-center gap-3 text-sm font-medium text-white cursor-pointer">
              <input
                type="checkbox"
                checked={settings.newReviewNotifications}
                onChange={(e) => setSettings((prev) => ({ ...prev, newReviewNotifications: e.target.checked }))}
                className="w-4 h-4 rounded border-white/20 bg-[#13132B]"
              />
              Notify on New Reviews
            </label>
          </div>

          <div>
            <label className="flex items-center gap-3 text-sm font-medium text-white cursor-pointer">
              <input
                type="checkbox"
                checked={settings.weeklyDigestNotifications}
                onChange={(e) => setSettings((prev) => ({ ...prev, weeklyDigestNotifications: e.target.checked }))}
                className="w-4 h-4 rounded border-white/20 bg-[#13132B]"
              />
              Send Weekly Digest
            </label>
          </div>
        </div>
      </DashboardCard>

      {/* Export Data */}
      <DashboardCard>
        <div className="flex items-center gap-2 mb-6">
          <Download className="w-5 h-5 text-[#E8572A]" />
          <h2 className="text-lg font-semibold text-white">Export Data</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => handleExportData('items')}
            className="p-4 bg-[#13132B] border border-white/10 rounded-lg hover:border-[#E8572A] transition-colors text-left"
          >
            <p className="text-sm font-medium text-white mb-1">Export Items</p>
            <p className="text-xs text-white/60">Download items as CSV</p>
          </button>

          <button
            onClick={() => handleExportData('reviews')}
            className="p-4 bg-[#13132B] border border-white/10 rounded-lg hover:border-[#E8572A] transition-colors text-left"
          >
            <p className="text-sm font-medium text-white mb-1">Export Reviews</p>
            <p className="text-xs text-white/60">Download reviews as CSV</p>
          </button>

          <button
            onClick={() => handleExportData('users')}
            className="p-4 bg-[#13132B] border border-white/10 rounded-lg hover:border-[#E8572A] transition-colors text-left"
          >
            <p className="text-sm font-medium text-white mb-1">Export Users</p>
            <p className="text-xs text-white/60">Download users as CSV</p>
          </button>
        </div>
      </DashboardCard>

      {/* Save Button */}
      <div className="flex items-center justify-end">
        <button
          onClick={handleSaveSettings}
          className="flex items-center gap-2 bg-[#E8572A] text-white px-6 py-3 rounded-lg hover:bg-[#E8572A]/90 transition-colors font-medium"
        >
          <Save className="w-5 h-5" />
          Save Settings
        </button>
      </div>
    </div>
  );
}

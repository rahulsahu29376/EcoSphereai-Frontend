import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { User, Shield, Target, Coins, KeyRound, Check, Sparkles } from 'lucide-react';

export const Profile = () => {
  const { user, updateUser } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || 'Rahul Sharma',
    avatar: user?.avatar || '',
    carbon_target_monthly: user?.carbon_target_monthly || '320',
    monthly_budget: user?.monthly_budget || '25000'
  });

  const [passwordData, setPasswordData] = useState({
    email: user?.email || '',
    newPassword: '',
    confirmPassword: ''
  });

  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setProfileSaving(true);
      await authAPI.updateProfile(profileData);
      updateUser(profileData);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      setPasswordSaving(true);
      await authAPI.resetPassword({
        email: user?.email || passwordData.email,
        newPassword: passwordData.newPassword
      });
      setPasswordSuccess(true);
      setPasswordData({ email: user?.email || '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update password');
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <User className="w-6 h-6" />
          </span>
          Profile & Target Configuration
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Customize your monthly carbon caps, spending limits, personal avatar and authentication credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Settings (7 cols) */}
        <div className="lg:col-span-7 glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
          <div className="flex items-center gap-4 border-b border-slate-800 pb-5">
            <img
              src={profileData.avatar || user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.name || 'User'}`}
              alt="Avatar"
              className="w-16 h-16 rounded-2xl ring-2 ring-emerald-500/40 object-cover"
            />
            <div>
              <h3 className="font-bold text-lg text-white">{user?.name}</h3>
              <p className="text-xs text-slate-400">{user?.email}</p>
              <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Verified Eco Member
              </span>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Avatar Image URL (or DiceBear Seed)</label>
              <input
                type="text"
                placeholder="https://..."
                value={profileData.avatar}
                onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Monthly Carbon Cap (kg CO₂)</label>
                <input
                  type="number"
                  step="10"
                  required
                  value={profileData.carbon_target_monthly}
                  onChange={(e) => setProfileData({ ...profileData, carbon_target_monthly: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Monthly Expense Budget (₹)</label>
                <input
                  type="number"
                  step="500"
                  required
                  value={profileData.monthly_budget}
                  onChange={(e) => setProfileData({ ...profileData, monthly_budget: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={profileSaving}
              className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
            >
              {profileSuccess ? <Check className="w-4 h-4" /> : null}
              {profileSaving ? 'Saving...' : profileSuccess ? 'Changes Saved!' : 'Update Profile'}
            </button>
          </form>
        </div>

        {/* Password & Security (5 cols) */}
        <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-slate-800 space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-emerald-400" />
              Security & Password
            </h3>
            <p className="text-xs text-slate-400">Update your account password with bcrypt encryption</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">New Password (min 6 chars)</label>
              <input
                type="password"
                required
                minLength={6}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={passwordSaving}
              className="w-full py-2.5 px-4 rounded-xl glass-card hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              {passwordSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : null}
              {passwordSaving ? 'Updating...' : passwordSuccess ? 'Password Updated!' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

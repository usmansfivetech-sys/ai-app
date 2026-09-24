import React, { useState } from 'react';
import { User, Check, Edit2, ChevronDown, ShieldCheck, Mail, LogIn } from 'lucide-react';
import { PRESET_USERS } from '../data/defaultSheets';
import { UserProfile } from '../types/sheet';

interface UserSwitcherProps {
  currentUser: UserProfile;
  onUserChange: (user: UserProfile) => void;
}

export const UserSwitcher: React.FC<UserSwitcherProps> = ({
  currentUser,
  onUserChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditingCustom, setIsEditingCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customEmail.trim()) {
      const email = customEmail.trim().toLowerCase();
      const name = customName.trim() || email.split('@')[0];

      const newUser: UserProfile = {
        id: `email-${email}`,
        name: name,
        email: email,
        role: 'Team Member',
        isAdmin: false,
        avatarColor: 'bg-emerald-600',
      };
      onUserChange(newUser);
      setIsEditingCustom(false);
      setCustomName('');
      setCustomEmail('');
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
        title={`Logged in as ${currentUser.name} (${currentUser.email})`}
      >
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold ${currentUser.avatarColor} relative`}
        >
          {currentUser.name.charAt(0)}
          {currentUser.isAdmin && (
            <span
              className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-amber-400 text-amber-950 rounded-full flex items-center justify-center text-[8px] font-bold border border-white"
              title="Designated Excel Admin"
            >
              ★
            </span>
          )}
        </div>
        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-900 leading-tight">
              {currentUser.name}
            </span>
            {currentUser.isAdmin && (
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded border border-amber-200">
                Admin
              </span>
            )}
          </div>
          <div className="text-[10px] text-slate-500 font-mono leading-tight">
            {currentUser.email}
          </div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setIsOpen(false);
              setIsEditingCustom(false);
            }}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-3">
            <div className="px-2 py-1.5 border-b border-slate-100">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-600" />
                <span>Identity &amp; Email Verification</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Each person&apos;s email represents their identity. When you check a row, your name and email are recorded into the audit timestamp.
              </p>
            </div>

            <div className="py-2 space-y-1.5">
              <div className="text-[10px] uppercase font-bold text-slate-400 px-2 tracking-wider">
                Select Team Member Identity
              </div>
              {PRESET_USERS.map((user) => {
                const isSelected = user.email.toLowerCase() === currentUser.email.toLowerCase();
                return (
                  <button
                    key={user.id}
                    onClick={() => {
                      onUserChange(user);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-colors ${
                      isSelected
                        ? 'bg-emerald-50 text-emerald-900 font-medium ring-1 ring-emerald-200'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0 ${user.avatarColor}`}
                      >
                        {user.name.charAt(0)}
                      </div>
                      <div className="text-left truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-800 truncate">{user.name}</span>
                          {user.isAdmin && (
                            <span className="text-[9px] font-bold uppercase tracking-wider px-1 py-0.2 bg-amber-100 text-amber-800 rounded">
                              Admin
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono truncate">{user.email}</div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100">
              {isEditingCustom ? (
                <form onSubmit={handleCustomSubmit} className="space-y-2 p-1">
                  <div className="text-[11px] font-semibold text-slate-700">
                    Sign in with Custom Email
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-medium">Your Name</label>
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 mt-0.5"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-medium">Your Work Email *</label>
                    <input
                      type="email"
                      required
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      placeholder="e.g. john@company.com"
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 mt-0.5"
                    />
                  </div>

                  <div className="flex gap-1.5 justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => setIsEditingCustom(false)}
                      className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!customEmail.trim()}
                      className="px-3 py-1 text-xs bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-1"
                    >
                      <LogIn className="w-3 h-3" />
                      <span>Set Identity</span>
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditingCustom(true)}
                  className="w-full flex items-center justify-center gap-2 px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors border border-dashed border-slate-300"
                >
                  <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Enter Another Email / Identity</span>
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

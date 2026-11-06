import React, { useState } from 'react';
import {
  User,
  Shield,
  Bell,
  Settings,
  Trash2,
  RotateCcw,
  CheckCircle,
  Award,
  AlertTriangle,
  Mail,
  Home,
  Save,
  Users,
  Plus,
  Edit2,
  X,
  GraduationCap,
  Sparkles,
  IdCard
} from 'lucide-react';
import { UserProfile, TeamMember } from '../../types/foodSafe';

interface ProfileScreenProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onResetAllData: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  userProfile,
  onUpdateProfile,
  onResetAllData,
}) => {
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [householdType, setHouseholdType] = useState(userProfile.householdType);
  const [notificationDays, setNotificationDays] = useState(userProfile.notificationDaysBefore);
  const [enableExpiryPush, setEnableExpiryPush] = useState(userProfile.enableExpiryPush);
  const [enableHygieneReminder, setEnableHygieneReminder] = useState(userProfile.enableHygieneReminder);
  const [dietaryNotes, setDietaryNotes] = useState(userProfile.dietaryNotes);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(userProfile.teamMembers || []);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Modal / Form state for Add/Edit Member
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [memberName, setMemberName] = useState('');
  const [memberRole, setMemberRole] = useState('Frontend & Mobile Developer');
  const [memberStudentId, setMemberStudentId] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberContribution, setMemberContribution] = useState('');
  const [memberError, setMemberError] = useState('');

  const handleOpenAddMember = () => {
    setEditingMemberId(null);
    setMemberName('');
    setMemberRole('Frontend & Mobile Developer');
    setMemberStudentId('');
    setMemberEmail('');
    setMemberContribution('');
    setMemberError('');
    setIsMemberModalOpen(true);
  };

  const handleOpenEditMember = (member: TeamMember) => {
    setEditingMemberId(member.id);
    setMemberName(member.name);
    setMemberRole(member.role);
    setMemberStudentId(member.studentId || '');
    setMemberEmail(member.email || '');
    setMemberContribution(member.contribution || '');
    setMemberError('');
    setIsMemberModalOpen(true);
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim()) {
      setMemberError('Member name is required.');
      return;
    }

    const colors = ['bg-emerald-600', 'bg-teal-600', 'bg-indigo-600', 'bg-amber-600', 'bg-rose-600', 'bg-sky-600'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    let updatedList: TeamMember[];

    if (editingMemberId) {
      updatedList = teamMembers.map((m) =>
        m.id === editingMemberId
          ? {
              ...m,
              name: memberName.trim(),
              role: memberRole.trim(),
              studentId: memberStudentId.trim(),
              email: memberEmail.trim(),
              contribution: memberContribution.trim() || 'Core module design & development',
            }
          : m
      );
    } else {
      const newMember: TeamMember = {
        id: `tm-${Date.now()}`,
        name: memberName.trim(),
        role: memberRole.trim(),
        studentId: memberStudentId.trim() || `21CS0${Math.floor(10 + Math.random() * 89)}`,
        email: memberEmail.trim() || `${memberName.toLowerCase().replace(/\s+/g, '.')}@college.edu`,
        contribution: memberContribution.trim() || 'Core module design & development',
        avatarColor: randomColor,
      };
      updatedList = [...teamMembers, newMember];
    }

    setTeamMembers(updatedList);
    onUpdateProfile({
      ...userProfile,
      teamMembers: updatedList,
    });
    setIsMemberModalOpen(false);
  };

  const handleDeleteMember = (id: string) => {
    const updated = teamMembers.filter((m) => m.id !== id);
    setTeamMembers(updated);
    onUpdateProfile({
      ...userProfile,
      teamMembers: updated,
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...userProfile,
      name,
      email,
      householdType,
      notificationDaysBefore: notificationDays,
      enableExpiryPush,
      enableHygieneReminder,
      dietaryNotes,
      teamMembers,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="p-4 space-y-4 pb-24 animate-fade-in">
      {/* Top Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">User Profile & Project Team</h1>
        <p className="text-xs text-slate-500">Manage student contributors, household parameters, and safety alerts</p>
      </div>

      {/* User Identity Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 flex items-center gap-3.5 shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800 font-bold text-lg shrink-0">
          {name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase() || 'FS'}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 truncate">{name}</h2>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Project Lead
            </span>
          </div>
          <p className="text-xs text-slate-500 truncate mt-0.5">{email}</p>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 mt-1 font-semibold">
            <Award className="w-3.5 h-3.5" />
            <span>FoodSafe Certified System · College Project Group</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 🌟 COLLEGE PROJECT TEAM MEMBERS SECTION */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3.5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Project Team Members ({teamMembers.length})
              </h3>
              <p className="text-[11px] text-slate-500">College group project authors & contributors</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenAddMember}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Member</span>
          </button>
        </div>

        {/* Team Members List */}
        <div className="space-y-2.5">
          {teamMembers.length === 0 ? (
            <div className="p-6 text-center border border-dashed border-slate-200 rounded-xl space-y-2">
              <Users className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500 font-medium">No team members added yet.</p>
              <button
                type="button"
                onClick={handleOpenAddMember}
                className="text-xs font-bold text-emerald-600 hover:underline"
              >
                + Add your first team member
              </button>
            </div>
          ) : (
            teamMembers.map((member) => (
              <div
                key={member.id}
                className="p-3 bg-slate-50 hover:bg-emerald-50/30 rounded-xl border border-slate-200 transition-all space-y-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl ${
                        member.avatarColor || 'bg-emerald-600'
                      } text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs`}
                    >
                      {member.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{member.name}</h4>
                        {member.studentId && (
                          <span className="text-[10px] font-mono text-slate-500 bg-white border border-slate-200 px-1 rounded">
                            {member.studentId}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                        {member.role}
                      </div>
                      {member.email && (
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {member.email}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenEditMember(member)}
                      title="Edit Member"
                      className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-white rounded-lg transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteMember(member.id)}
                      title="Remove Member"
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {member.contribution && (
                  <div className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-100 flex items-start gap-1.5">
                    <span className="font-semibold text-slate-700 shrink-0">Contribution:</span>
                    <span className="leading-relaxed">{member.contribution}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* PROFILE SETTINGS FORM */}
      {/* ======================================================== */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3.5 shadow-xs">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Lead User & Household Information
        </h3>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-emerald-600"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-emerald-600"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Household Demographics</label>
          <select
            value={householdType}
            onChange={(e) => setHouseholdType(e.target.value as any)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-emerald-600"
          >
            <option value="single">Single Individual</option>
            <option value="family_with_kids">Family with Young Children (Strict high-risk rules)</option>
            <option value="elderly">Elderly / Immune-Compromised</option>
            <option value="general">General Household</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Allergen & Dietary Notes</label>
          <textarea
            rows={2}
            value={dietaryNotes}
            onChange={(e) => setDietaryNotes(e.target.value)}
            placeholder="e.g. Shellfish allergy; strict raw poultry separation"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-emerald-600"
          />
        </div>

        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider pt-2 border-t border-slate-100">
          Notification & Expiry Reminders
        </h3>

        <div className="space-y-2">
          <label className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Expiry Push Alerts</span>
              <span className="text-[11px] text-slate-500">Send notifications before perishable food expires</span>
            </div>
            <input
              type="checkbox"
              checked={enableExpiryPush}
              onChange={(e) => setEnableExpiryPush(e.target.checked)}
              className="accent-emerald-600 w-4 h-4 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Daily Hygiene Prompts</span>
              <span className="text-[11px] text-slate-500">Reminders for handwashing and chopping board safety</span>
            </div>
            <input
              type="checkbox"
              checked={enableHygieneReminder}
              onChange={(e) => setEnableHygieneReminder(e.target.checked)}
              className="accent-emerald-600 w-4 h-4 cursor-pointer"
            />
          </label>

          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-800">Alert Days In Advance</span>
            <select
              value={notificationDays}
              onChange={(e) => setNotificationDays(Number(e.target.value))}
              className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs"
            >
              <option value={1}>1 Day Before</option>
              <option value={2}>2 Days Before (Recommended)</option>
              <option value={3}>3 Days Before</option>
            </select>
          </div>
        </div>

        {saveSuccess && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Profile and settings saved successfully!</span>
          </div>
        )}

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </form>

      {/* Local Storage & Reset Demo Data */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3 shadow-xs">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Local Storage & Demo Controls
        </h3>
        <p className="text-xs text-slate-500">
          Restore initial college group project data, food items, checklists, and team rosters.
        </p>

        {showResetConfirm ? (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-2 text-xs">
            <p className="font-bold text-red-900">Are you sure you want to reset all data?</p>
            <p className="text-red-700 text-[11px]">This will reload standard college demonstration dataset.</p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  onResetAllData();
                  setShowResetConfirm(false);
                }}
                className="px-3 py-1.5 bg-red-600 text-white rounded-lg font-bold text-xs"
              >
                Yes, Reset Everything
              </button>
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg font-bold text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
            <span>Reload Fresh College Demo Data</span>
          </button>
        )}
      </div>

      {/* ======================================================== */}
      {/* ADD / EDIT TEAM MEMBER MODAL */}
      {/* ======================================================== */}
      {isMemberModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  {editingMemberId ? 'Edit Team Member' : 'Add Team Member'}
                </h3>
              </div>
              <button
                onClick={() => setIsMemberModalOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="p-5 space-y-3.5 overflow-y-auto">
              {memberError && (
                <div className="p-2.5 bg-red-50 text-red-700 rounded-xl text-xs font-medium border border-red-200">
                  {memberError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder="e.g. Karthik Juvva"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Project Role</label>
                <select
                  value={memberRole}
                  onChange={(e) => setMemberRole(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:outline-hidden focus:border-emerald-600"
                >
                  <option value="Project Lead & Flutter Architect">Project Lead & Flutter Architect</option>
                  <option value="UI/UX & Mobile Ergonomics Lead">UI/UX & Mobile Ergonomics Lead</option>
                  <option value="Database & Storage Engineer (SQLite)">Database & Storage Engineer (SQLite)</option>
                  <option value="Food Safety Specialist & QA Lead">Food Safety Specialist & QA Lead</option>
                  <option value="Full-Stack Flutter Developer">Full-Stack Flutter Developer</option>
                  <option value="Documentation & Testing Specialist">Documentation & Testing Specialist</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Student ID / Roll No</label>
                  <input
                    type="text"
                    value={memberStudentId}
                    onChange={(e) => setMemberStudentId(e.target.value)}
                    placeholder="e.g. 21CS042"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:outline-hidden focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    placeholder="student@college.edu"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:outline-hidden focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Module Assigned / Contribution
                </label>
                <textarea
                  rows={2}
                  value={memberContribution}
                  onChange={(e) => setMemberContribution(e.target.value)}
                  placeholder="e.g. Implemented SQLite database helper, schema tables, and provider state listeners."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsMemberModalOpen(false)}
                  className="px-3.5 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  {editingMemberId ? 'Update Member' : 'Add to Team'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

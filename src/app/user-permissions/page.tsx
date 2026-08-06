"use client";

import { useState } from "react";

interface PermissionItem {
  id: string;
  key: string;
  label: string;
  enabled: boolean;
}

interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: "Administrator" | "Operator" | "Auditor";
  status: "Active" | "Suspended";
  clearanceLevel: number;
}

export default function UserPermissionsPage() {
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // New User Form State
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<"Administrator" | "Operator" | "Auditor">("Operator");

  // Mock Global Operator Role Permissions
  const [permissions, setPermissions] = useState<PermissionItem[]>([
    { id: "1", key: "ptz_control", label: "PTZ Camera Joystick Control", enabled: true },
    { id: "2", key: "archive_delete", label: "Delete Archive Footages", enabled: false },
    { id: "3", key: "global_alarm", label: "Trigger Global Alarm", enabled: false },
    { id: "4", key: "override_nodes", label: "Override Core Machine Learning Nodes", enabled: false },
  ]);

  // Mock User Directory Datastore
  const [users, setUsers] = useState<UserAccount[]>([
    { id: "USR-001", name: "Sarah Connor", email: "s.connor@security.io", role: "Administrator", status: "Active", clearanceLevel: 5 },
    { id: "USR-002", name: "Marcus Wright", email: "m.wright@security.io", role: "Operator", status: "Active", clearanceLevel: 3 },
    { id: "USR-003", name: "John Doe", email: "j.doe@security.io", role: "Auditor", status: "Active", clearanceLevel: 2 },
  ]);

  const togglePermission = (id: string) => {
    const target = permissions.find(p => p.id === id);
    if (target?.key === "global_alarm" && !target.enabled) {
      setShowWarningModal(true);
      return;
    }
    setPermissions(prev => prev.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p));
  };

  const confirmCriticalPermission = () => {
    setPermissions(prev => prev.map(p => p.key === "global_alarm" ? { ...p, enabled: true } : p));
    setShowWarningModal(false);
  };

  // INLINE ACTIONS: Update an individual user's role & automatically adjust clearance tier
  const handleRoleChange = (userId: string, newRole: "Administrator" | "Operator" | "Auditor") => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        const level = newRole === "Administrator" ? 5 : newRole === "Operator" ? 3 : 2;
        return { ...user, role: newRole, clearanceLevel: level };
      }
      return user;
    }));
  };

  // INLINE ACTIONS: Instantly toggle status between Active and Suspended
  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        return { ...user, status: user.status === "Active" ? "Suspended" : "Active" };
      }
      return user;
    }));
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    const newUser: UserAccount = {
      id: `USR-${String(users.length + 1).padStart(3, '0')}`,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      status: "Active",
      clearanceLevel: newUserRole === "Administrator" ? 5 : newUserRole === "Operator" ? 3 : 2
    };

    setUsers(prev => [...prev, newUser]);
    setNewUserName("");
    setNewUserEmail("");
    setNewUserRole("Operator");
    setShowAddUserModal(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Head Panel Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Identity & Access Management</h2>
          <p className="text-xs text-neutral-400 mt-1">Provision operator credentials and govern deep command matrix policies inline.</p>
        </div>
        <button
          onClick={() => setShowAddUserModal(true)}
          className="bg-[#00A3FF] hover:bg-blue-600 text-black font-bold text-xs px-4 py-2.5 rounded transition-colors inline-flex items-center justify-center gap-1.5 shadow-lg shadow-[#00A3FF]/10 self-start sm:self-auto"
        >
          <span>➕</span> Add New Operator
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* Left Side: Dynamic Interactive Personnel Registry */}
        <div className="xl:col-span-2 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">Authenticated Personnel Directory</h3>
          <div className="bg-[#242424] border border-neutral-800 rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-900/50 text-neutral-400 text-xs uppercase tracking-wider font-mono">
                  <th className="p-4 border-b border-neutral-800">UID ID</th>
                  <th className="p-4 border-b border-neutral-800">Operator Profile</th>
                  <th className="p-4 border-b border-neutral-800">Inline Role Assignment</th>
                  <th className="p-4 border-b border-neutral-800">Clearance</th>
                  <th className="p-4 border-b border-neutral-800">Status Action</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-neutral-800/60">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono text-xs text-neutral-500">{user.id}</td>
                    <td className="p-4">
                      <div className="font-medium text-white">{user.name}</div>
                      <div className="text-xs text-neutral-500 font-mono">{user.email}</div>
                    </td>
                    <td className="p-4">
                      {/* Interactive Selection Trigger Box */}
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value as any)}
                        className={`text-xs px-2 py-1 rounded bg-neutral-900 border border-neutral-700 outline-none focus:border-[#00A3FF] font-medium cursor-pointer ${user.role === 'Administrator' ? 'text-purple-400' :
                            user.role === 'Operator' ? 'text-blue-400' : 'text-neutral-400'
                          }`}
                      >
                        <option value="Administrator">Administrator</option>
                        <option value="Operator">Operator</option>
                        <option value="Auditor">Auditor</option>
                      </select>
                    </td>
                    <td className="p-4 font-mono text-xs text-neutral-300">Lvl {user.clearanceLevel}</td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded border transition-colors ${user.status === "Active"
                            ? "bg-emerald-950/30 text-emerald-400 border-emerald-800/40 hover:bg-emerald-950/60"
                            : "bg-red-950/30 text-[#FF0000] border-red-950/40 hover:bg-red-950/60"
                          }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === "Active" ? "bg-emerald-400 animate-pulse" : "bg-[#FF0000]"}`} />
                        {user.status}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Shared Privilege Configuration Node */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">Global Settings Profile</h3>
          <div className="bg-[#242424] border border-neutral-800 rounded-lg p-5 space-y-4">
            <p className="text-xs text-neutral-400 leading-relaxed">
              Modifying these toggles applies global parameters across any system accounts sharing that base group clearance status.
            </p>
            <div className="space-y-3">
              {permissions.map((p) => (
                <div key={p.id} className="flex flex-col gap-2 p-3 bg-neutral-900/40 border border-neutral-800/60 rounded-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-neutral-200">{p.label}</span>
                    <button
                      onClick={() => togglePermission(p.id)}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded uppercase tracking-wider transition-colors ${p.enabled
                          ? "bg-[#00A3FF]/20 text-[#00A3FF] border border-[#00A3FF]/30"
                          : "bg-neutral-800 text-neutral-500 border border-neutral-700"
                        }`}
                    >
                      {p.enabled ? "Active" : "Locked"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: Operational Privilege Warning */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#242424] border border-red-500/40 max-w-sm w-full p-6 rounded-lg shadow-2xl space-y-4 animate-fadeIn">
            <h4 className="text-lg font-bold text-[#FF0000] flex items-center gap-2">
              ⚠️ Intercept Root Privilege
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed">
              You are enabling <span className="text-white font-bold">Trigger Global Alarm</span> execution capability. This allows deployment nodes to fire audio strobes and hardware locks.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowWarningModal(false)}
                className="flex-1 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs text-white rounded font-medium transition-colors"
              >
                Abort Policy
              </button>
              <button
                onClick={confirmCriticalPermission}
                className="flex-1 py-2 bg-[#FF0000] hover:bg-red-700 text-xs text-white rounded font-bold transition-colors"
              >
                Confirm Access
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Add New Operator */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#242424] border border-neutral-800 max-w-md w-full p-6 rounded-lg shadow-2xl space-y-5 animate-fadeIn">
            <div>
              <h4 className="text-base font-bold text-white">Provision Access Credentials</h4>
              <p className="text-xs text-neutral-400 mt-1">Issue a secure hardware session pass token to network personnel.</p>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Alexander Vance"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-xs text-white focus:border-[#00A3FF] outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">Secure Core Mail Address</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="a.vance@security.io"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-xs text-white focus:border-[#00A3FF] outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">Clearance Role Assignment</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as any)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-xs text-neutral-300 focus:border-[#00A3FF] outline-none"
                >
                  <option value="Operator">Operator (Clearance Level 3)</option>
                  <option value="Auditor">Auditor (Clearance Level 2)</option>
                  <option value="Administrator">Administrator (Clearance Level 5)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="flex-1 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs text-white rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#00A3FF] hover:bg-blue-600 text-black font-bold text-xs rounded transition-colors"
                >
                  Generate Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState, useEffect, useCallback } from "react";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  FileText,
  Settings,
  LogOut,
  Search,
  Trash2,
  Eye,
  Shield,
  ChevronDown,
  Menu,
  X,
  TrendingUp,
  TrendingDown,
  UserCheck,
  UserX,
  Activity,
  FileSpreadsheet,
} from "lucide-react";
import { FetchBorders } from "../services/Auth/Auth";
import { useAuth } from "@clerk/react";
import { useUser } from "../context/user_context";

const StatCard = ({ title, value, change, changeType, icon: Icon, color }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        <div
          className={`flex items-center gap-1 mt-2 text-sm font-medium ${changeType === "up" ? "text-emerald-600" : "text-red-600"}`}
        >
          {changeType === "up" ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>{change}</span>
          <span className="text-gray-400 font-normal ml-1">vs last month</span>
        </div>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const UserDetailsModal = ({ user, onClose }) => {
  if (!user) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-gradient-to-r from-red-900 to-red-800 p-6 text-white">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-bold">User Details</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="text-lg font-semibold">{user.name}</p>
              <p className="text-red-200 text-sm">{user.email}</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {[
            { label: "User ID", value: user.user_id },
            { label: "Phone", value: user.phone },
            { label: "Role", value: user.role || "Not Assigned" },
            { label: "Room Number", value: user.room_no },
            { label: "Roll Number", value: user.roll_number },
          ].map((item) => (
            <div
              key={item.label}
              className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
            >
              <span className="text-gray-500 text-sm">{item.label}</span>
              <span className="font-medium text-gray-900 text-sm text-right">
                {item.value}
              </span>
            </div>
          ))}
        </div>
        <div className="p-4 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const ChangeRoleModal = ({ user, onClose, onChangeRole }) => {
  const [selectedRole, setSelectedRole] = useState(user?.role || "student");
  if (!user) return null;

  const roles = ["student", "admin"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in duration-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Change Role</h3>
        <p className="text-sm text-gray-500 mb-4">
          Update role for{" "}
          <span className="font-semibold text-gray-700">{user.name}</span>
        </p>

        <div className="space-y-2 mb-6">
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`w-full px-4 py-3 rounded-xl text-left transition-all ${
                selectedRole === role
                  ? "bg-red-50 border-2 border-red-500 text-red-900 font-medium"
                  : "border-2 border-gray-100 hover:border-gray-200 text-gray-700"
              }`}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onChangeRole(user.user_id, selectedRole);
              onClose();
            }}
            className="flex-1 px-4 py-2.5 bg-red-900 text-white rounded-xl text-sm font-medium hover:bg-red-800 transition-colors shadow-lg shadow-red-900/20"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { getToken } = useAuth();
  const { user_details } = useUser();
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [detailsUser, setDetailsUser] = useState(null);
  const [roleUser, setRoleUser] = useState(null);
  const [selectAll, setSelectAll] = useState(false);

  // Filtered users
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.roll_number.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Analytics data
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.role).length;
  const adminCount = users.filter((u) => u.role === "admin").length;
  const studentCount = users.filter((u) => u.role === "student").length;

  // Handlers
  const toggleSelection = (userId) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredUsers.map((u) => u.user_id)));
    }
    setSelectAll(!selectAll);
  };

  const handleBulkDelete = () => {
    if (selectedUsers.size === 0) return;

    console.log("Bulk deleting user IDs:", Array.from(selectedUsers));

    // Remove selected users
    setUsers((prev) => prev.filter((u) => !selectedUsers.has(u.user_id)));
    setSelectedUsers(new Set());
    setSelectAll(false);
  };

  const handleDelete = (userId) => {
    console.log("Deleting user ID:", userId);
    setUsers((prev) => prev.filter((u) => u.user_id !== userId));
    setSelectedUsers((prev) => {
      const newSet = new Set(prev);
      newSet.delete(userId);
      return newSet;
    });
  };

  const handleChangeRole = (userId, newRole) => {
    console.log("Changing role for user ID:", userId, "to", newRole);
    setUsers((prev) =>
      prev.map((u) => (u.user_id === userId ? { ...u, role: newRole } : u)),
    );
  };

  const fetchBorders = async () => {
    const token = await getToken();
    const { hostel_id } = user_details;
    const res = await FetchBorders(token, hostel_id);
    if (res.success) {
      setUsers(res.data);
    } else {
      setUsers([]);
    }
  };

    const handleDownload = useCallback(() => {
      const rows = filteredUsers.map((d, i) => [
        i + 1,
        d.name || "",
        d.roll_number || "",
        d.room_no || "",
        d.phone || "",
        d.email || "",
        d.role || ""
      ]);
      const csv = [
        ["Sl No", "Name", "Roll No", "Room", "Phone","Email","Role"],
        ...rows
      ].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
      
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Borders_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, [filteredUsers]);

  useEffect(() => {
    console.log("first");
    fetchBorders();
  }, []);

  // Update selectAll when filtered changes
  useEffect(() => {
    if (
      filteredUsers.length > 0 &&
      filteredUsers.every((u) => selectedUsers.has(u.user_id))
    ) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedUsers, filteredUsers]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <main className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">

              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                  Dashboard
                </h1>
                <p className="text-sm text-gray-500 hidden sm:block">
                  Welcome back, manage your hostel efficiently
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium border border-emerald-200">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                System Online
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                <Activity className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto">
          {/* Analytics Cards */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-red-900" />
              Overview Analytics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <StatCard
                title="Total Users"
                value={totalUsers}
                change="+12%"
                changeType="up"
                icon={Users}
                color="bg-blue-600"
              />
              <StatCard
                title="Admins"
                value={adminCount}
                change="-2%"
                changeType="down"
                icon={Shield}
                color="bg-purple-600"
              />
              <StatCard
                title="Students"
                value={studentCount}
                change="+8%"
                changeType="up"
                icon={Users}
                color="bg-red-900"
              />
            </div>
          </section>

          {/* User Management */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 lg:p-6 border-b border-gray-100">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      
      {/* Left Content */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-red-900" />
          User Management
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Manage hostel residents and staff
        </p>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleDownload}
          // disabled={filteredCount === 0 || loading}
          className="flex items-center gap-2 bg-red-900 hover:bg-red-800 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Export
        </button>
      </div>

    </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-900/20 focus:border-red-900 w-full sm:w-64 transition-all"
                    />
                  </div>

                  {/* Bulk Delete */}
                  {selectedUsers.size > 0 && (
                    <button
                      onClick={handleBulkDelete}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Selected ({selectedUsers.size})
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-gray-300 text-red-900 focus:ring-red-900 cursor-pointer"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Room/Roll
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.user_id}
                      className={`hover:bg-gray-50/50 transition-colors group ${selectedUsers.has(user.user_id) ? "bg-red-50/30" : ""}`}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.has(user.user_id)}
                          onChange={() => toggleSelection(user.user_id)}
                          className="w-4 h-4 rounded border-gray-300 text-red-900 focus:ring-red-900 cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center text-red-900 font-bold text-sm">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-500 font-mono mt-0.5">
                              {user.user_id.slice(0, 16)}...
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-900">{user.email}</p>
                          <p className="text-sm text-gray-500">{user.phone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-700"
                              : // user.role === 'Warden' ? 'bg-amber-100 text-amber-700' :
                                user.role === "student"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {user.role || "Unassigned"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-900">
                            Room {user.room_no}
                          </p>
                          <p className="text-sm text-gray-500 font-mono">
                            {user.roll_number}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setDetailsUser(user)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setRoleUser(user)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Change Role"
                          >
                            <Shield className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(user.user_id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No users found</p>
                  <p className="text-sm text-gray-400">
                    Try adjusting your search
                  </p>
                </div>
              )}
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <div
                  key={user.user_id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${selectedUsers.has(user.user_id) ? "bg-red-50/30" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedUsers.has(user.user_id)}
                      onChange={() => toggleSelection(user.user_id)}
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-red-900 focus:ring-red-900 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center text-red-900 font-bold text-sm shrink-0">
                            {user.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 truncate">
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-500 font-mono truncate">
                              {user.user_id}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`shrink-0 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === "Admin"
                              ? "bg-purple-100 text-purple-700"
                              : user.role === "Warden"
                                ? "bg-amber-100 text-amber-700"
                                : user.role === "Student"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {user.role || "Unassigned"}
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-gray-50 rounded-lg p-2">
                          <p className="text-xs text-gray-500 mb-0.5">Email</p>
                          <p className="text-gray-900 truncate">{user.email}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2">
                          <p className="text-xs text-gray-500 mb-0.5">Phone</p>
                          <p className="text-gray-900">{user.phone}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2">
                          <p className="text-xs text-gray-500 mb-0.5">Room</p>
                          <p className="text-gray-900">{user.room_no}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2">
                          <p className="text-xs text-gray-500 mb-0.5">
                            Roll No
                          </p>
                          <p className="text-gray-900 font-mono text-xs">
                            {user.roll_number}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => setDetailsUser(user)}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Details
                        </button>
                        <button
                          onClick={() => setRoleUser(user)}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors"
                        >
                          <Shield className="w-3.5 h-3.5" />
                          Role
                        </button>
                        <button
                          onClick={() => handleDelete(user.user_id)}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No users found</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 lg:px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
              <p>
                Showing {filteredUsers.length} of {users.length} users
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-md font-medium">
                  {selectedUsers.size} selected
                </span>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Modals */}
      {detailsUser && (
        <UserDetailsModal
          user={detailsUser}
          onClose={() => setDetailsUser(null)}
        />
      )}
      {roleUser && (
        <ChangeRoleModal
          user={roleUser}
          onClose={() => setRoleUser(null)}
          onChangeRole={handleChangeRole}
        />
      )}
    </div>
  );
};

export default AdminDashboard;

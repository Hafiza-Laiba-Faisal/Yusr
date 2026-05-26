import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Users, Shield, MessageSquare, TrendingUp, Settings, Plus,
  ChevronDown, Check, X, Edit2, Trash2, Search, Eye, BookOpen
} from "lucide-react";

/* ─── Types ─── */
interface Permission {
  id: string;
  label: string;
  icon: typeof MessageSquare;
  description: string;
}

interface Role {
  id: string;
  name: string;
  color: string;
  permissions: string[];
  userCount: number;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  status: "active" | "invited" | "suspended";
  lastActive: string;
}

/* ─── Data ─── */
const allPermissions: Permission[] = [
  { id: "inbox.view", label: "View Inbox", icon: Eye, description: "Can view customer conversations" },
  { id: "inbox.reply", label: "Reply to Messages", icon: MessageSquare, description: "Can reply to customers in inbox" },
  { id: "inbox.assign", label: "Assign Conversations", icon: Users, description: "Can assign chats to team members" },
  { id: "knowledge.view", label: "View Knowledge Base", icon: BookOpen, description: "Can view knowledge base documents" },
  { id: "knowledge.edit", label: "Edit Knowledge Base", icon: Edit2, description: "Can add, edit, and delete knowledge base items" },
  { id: "settings.view", label: "View Settings", icon: Settings, description: "Can view workspace settings" },
  { id: "settings.edit", label: "Edit Settings", icon: Settings, description: "Can modify workspace settings and AI config" },
  { id: "users.view", label: "View Users", icon: Users, description: "Can view team members list" },
  { id: "users.manage", label: "Manage Users", icon: Shield, description: "Can invite, remove, and assign roles to users" },
  { id: "analytics.view", label: "View Analytics", icon: TrendingUp, description: "Can access performance analytics dashboard" },
];

const initialRoles: Role[] = [
  {
    id: "superadmin",
    name: "Super Admin",
    color: "bg-red-500",
    permissions: allPermissions.map(p => p.id),
    userCount: 1,
  },
  {
    id: "admin",
    name: "Admin",
    color: "bg-primary",
    permissions: ["inbox.view", "inbox.reply", "inbox.assign", "knowledge.view", "knowledge.edit", "settings.view", "settings.edit", "users.view", "users.manage", "analytics.view"],
    userCount: 2,
  },
  {
    id: "manager",
    name: "Manager",
    color: "bg-amber-500",
    permissions: ["inbox.view", "inbox.reply", "inbox.assign", "knowledge.view", "knowledge.edit", "analytics.view"],
    userCount: 3,
  },
  {
    id: "agent",
    name: "Agent",
    color: "bg-emerald-500",
    permissions: ["inbox.view", "inbox.reply", "knowledge.view"],
    userCount: 5,
  },
  {
    id: "viewer",
    name: "Viewer",
    color: "bg-slate-400",
    permissions: ["inbox.view", "knowledge.view", "analytics.view"],
    userCount: 2,
  },
];

const initialMembers: TeamMember[] = [
  { id: "1", name: "Hafiza Laiba", email: "hafizalaibafaisal@gmail.com", role: "superadmin", avatar: "HL", status: "active", lastActive: "Just now" },
  { id: "2", name: "Ahmed Khan", email: "ahmed@yusr.tech", role: "admin", avatar: "AK", status: "active", lastActive: "2 hours ago" },
  { id: "3", name: "Sara Malik", email: "sara@yusr.tech", role: "admin", avatar: "SM", status: "active", lastActive: "1 day ago" },
  { id: "4", name: "Usman Ali", email: "usman@team.com", role: "manager", avatar: "UA", status: "active", lastActive: "3 hours ago" },
  { id: "5", name: "Fatima Noor", email: "fatima@team.com", role: "manager", avatar: "FN", status: "invited", lastActive: "Pending" },
  { id: "6", name: "Bilal Shah", email: "bilal@team.com", role: "agent", avatar: "BS", status: "active", lastActive: "30 min ago" },
  { id: "7", name: "Zainab Raza", email: "zainab@team.com", role: "agent", avatar: "ZR", status: "active", lastActive: "1 hour ago" },
  { id: "8", name: "Hassan Iqbal", email: "hassan@team.com", role: "viewer", avatar: "HI", status: "suspended", lastActive: "5 days ago" },
];

/* ─── Component ─── */
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<"users" | "roles">("users");
  const [roles, setRoles] = useState(initialRoles);
  const [members] = useState(initialMembers);
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: "", role: "agent" });

  const togglePermission = (roleId: string, permId: string) => {
    setRoles(prev => prev.map(r => {
      if (r.id !== roleId || r.id === "superadmin") return r;
      const has = r.permissions.includes(permId);
      return { ...r, permissions: has ? r.permissions.filter(p => p !== permId) : [...r.permissions, permId] };
    }));
  };

  const filteredMembers = members.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleInfo = (roleId: string) => roles.find(r => r.id === roleId);

  const statusColors = {
    active: "bg-emerald-100 text-emerald-700",
    invited: "bg-amber-100 text-amber-700",
    suspended: "bg-red-100 text-red-700",
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-black tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground font-medium mt-1">Manage your team members, roles, and permissions.</p>
        </div>
        <div className="flex gap-3">
          <Card className="px-5 py-3 flex items-center gap-3 shadow-sm">
            <Users className="h-5 w-5 text-primary" />
            <div>
              <div className="font-display font-black text-xl">{members.length}</div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Team Members</div>
            </div>
          </Card>
          <Card className="px-5 py-3 flex items-center gap-3 shadow-sm">
            <Shield className="h-5 w-5 text-primary" />
            <div>
              <div className="font-display font-black text-xl">{roles.length}</div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Roles</div>
            </div>
          </Card>
        </div>
      </div>

      {/* ─── Tabs ─── */}
      <div className="flex gap-1 bg-foreground/5 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("users")} 
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "users" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          <Users className="h-4 w-4" /> Team Members
        </button>
        <button
          onClick={() => setActiveTab("roles")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "roles" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          <Shield className="h-4 w-4" /> Roles & Permissions
        </button>
      </div>

      {/* ─── Tab: Users ─── */}
      {activeTab === "users" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text" placeholder="Search members..."
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-xl border bg-background text-sm font-medium focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all outline-none"
              />
            </div>
            <Button className="bg-gradient-primary font-bold gap-2" onClick={() => setShowInvite(!showInvite)}>
              <Plus className="h-4 w-4" /> Invite Member
            </Button>
          </div>

          {/* Invite form */}
          {showInvite && (
            <Card className="p-6 border-primary/20 shadow-md">
              <h3 className="font-bold text-lg mb-4">Invite a Team Member</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email" placeholder="Email address"
                  value={inviteForm.email} onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  className="flex-1 h-11 px-4 rounded-xl border bg-background text-sm font-medium focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all outline-none"
                />
                <select
                  value={inviteForm.role} onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                  className="h-11 px-4 rounded-xl border bg-background text-sm font-medium focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all outline-none min-w-[140px]"
                >
                  {roles.filter(r => r.id !== "superadmin").map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
                <Button className="bg-gradient-primary font-bold h-11 px-6">Send Invite</Button>
              </div>
            </Card>
          )}

          {/* Members table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-foreground/[0.02]">
                    <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Member</th>
                    <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Role</th>
                    <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                    <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Last Active</th>
                    <th className="text-right p-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((m) => {
                    const role = getRoleInfo(m.role);
                    return (
                      <tr key={m.id} className="border-b last:border-0 hover:bg-foreground/[0.02] transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`h-10 w-10 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-sm`}>
                              {m.avatar}
                            </div>
                            <div>
                              <div className="font-bold text-sm">{m.name}</div>
                              <div className="text-xs text-muted-foreground">{m.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full text-white ${role?.color}`}>
                            <div className="h-1.5 w-1.5 rounded-full bg-white/50" />
                            {role?.name}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${statusColors[m.status]}`}>
                            {m.status}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground font-medium">{m.lastActive}</td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-1">
                            <button className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors" title="Edit role">
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            {m.role !== "superadmin" && (
                              <button className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors" title="Remove">
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ─── Tab: Roles & Permissions ─── */}
      {activeTab === "roles" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground font-medium">Define what each role can access. Click on permissions to toggle them.</p>
            <Button variant="outline" className="font-bold gap-2">
              <Plus className="h-4 w-4" /> Create Role
            </Button>
          </div>

          <div className="grid gap-6">
            {roles.map((role) => (
              <Card key={role.id} className={`overflow-hidden transition-all ${editingRole === role.id ? 'ring-2 ring-primary/30 shadow-xl' : 'hover:shadow-md'}`}>
                {/* Role header */}
                <div
                  className="p-6 flex items-center justify-between cursor-pointer hover:bg-foreground/[0.02] transition-colors"
                  onClick={() => setEditingRole(editingRole === role.id ? null : role.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-xl ${role.color} flex items-center justify-center shadow-sm`}>
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-display font-black text-lg">{role.name}</h3>
                      <p className="text-xs text-muted-foreground font-medium">
                        {role.permissions.length}/{allPermissions.length} permissions · {role.userCount} member{role.userCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {role.id === "superadmin" && (
                      <span className="text-[9px] font-bold bg-red-100 text-red-600 rounded-full px-2.5 py-1 uppercase tracking-widest">System Role</span>
                    )}
                    <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${editingRole === role.id ? "rotate-180" : ""}`} />
                  </div>
                </div>

                {/* Permissions grid (expanded) */}
                {editingRole === role.id && (
                  <div className="px-6 pb-6 border-t border-foreground/5 pt-6">
                    {role.id === "superadmin" && (
                      <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-xs font-bold flex items-center gap-2">
                        <Shield className="h-4 w-4" /> Super Admin has all permissions and cannot be modified.
                      </div>
                    )}
                    <div className="grid md:grid-cols-2 gap-3">
                      {allPermissions.map((perm) => {
                        const hasPermission = role.permissions.includes(perm.id);
                        const isDisabled = role.id === "superadmin";
                        const PermIcon = perm.icon;
                        return (
                          <button
                            key={perm.id}
                            disabled={isDisabled}
                            onClick={() => togglePermission(role.id, perm.id)}
                            className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                              hasPermission
                                ? "border-primary/30 bg-primary/5 hover:bg-primary/10"
                                : "border-foreground/10 bg-foreground/[0.02] hover:bg-foreground/5 opacity-60"
                            } ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
                          >
                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${hasPermission ? "bg-primary/20 text-primary" : "bg-foreground/10 text-muted-foreground"}`}>
                              {hasPermission ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-bold flex items-center gap-2">
                                <PermIcon className="h-3.5 w-3.5 shrink-0" />
                                {perm.label}
                              </div>
                              <div className="text-[11px] text-muted-foreground mt-0.5">{perm.description}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

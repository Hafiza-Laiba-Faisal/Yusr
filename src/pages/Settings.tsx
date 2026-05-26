import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Settings as SettingsIcon, Building2, Bot, Bell, Shield, 
  CreditCard, CreditCard as CardIcon, Save, ArrowRight,
  ExternalLink, Sparkles, Languages, Clock, User
} from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [aiActive, setAiActive] = useState(true);
  const [bilingual, setBilingual] = useState(true);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Settings saved successfully!");
    }, 800);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 pb-16">
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-black tracking-tight">Settings</h1>
          <p className="text-muted-foreground font-medium mt-1">Manage your business profile and AI configuration.</p>
        </div>
        <Button onClick={handleSave} disabled={loading} className="bg-gradient-primary font-bold gap-2 px-6 shadow-glow">
          {loading ? "Saving..." : <><Save className="h-4 w-4" /> Save Changes</>}
        </Button>
      </div>

      <div className="grid gap-8">
        {/* ─── Business Profile ─── */}
        <Card className="p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Building2 className="h-5 w-5" />
            </div>
            <h2 className="font-display font-black text-xl tracking-tight">Business Profile</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="biz-name" className="text-xs font-bold uppercase tracking-wider opacity-70">Business Name</Label>
                <Input id="biz-name" defaultValue="Khan's Restaurant" className="h-11 rounded-xl bg-foreground/[0.02]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="biz-phone" className="text-xs font-bold uppercase tracking-wider opacity-70">WhatsApp Number</Label>
                <Input id="biz-phone" defaultValue="+92 300 1234567" className="h-11 rounded-xl bg-foreground/[0.02]" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="biz-email" className="text-xs font-bold uppercase tracking-wider opacity-70">Business Email</Label>
                <Input id="biz-email" defaultValue="hello@khansrestaurant.com" className="h-11 rounded-xl bg-foreground/[0.02]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="biz-website" className="text-xs font-bold uppercase tracking-wider opacity-70">Website URL</Label>
                <Input id="biz-website" defaultValue="https://khansrestaurant.com" className="h-11 rounded-xl bg-foreground/[0.02]" />
              </div>
            </div>
          </div>
        </Card>

        {/* ─── AI Configuration ─── */}
        <Card className="p-8 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Sparkles className="h-32 w-32" />
          </div>
          <div className="flex items-center gap-3 mb-8 pb-4 border-b">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Bot className="h-5 w-5" />
            </div>
            <h2 className="font-display font-black text-xl tracking-tight">AI Agent Behavior</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-foreground/[0.02] border">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center border shadow-sm shrink-0">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-sm">Automated AI Replies</div>
                  <div className="text-xs text-muted-foreground font-medium">When active, AI will handle all incoming WhatsApp queries.</div>
                </div>
              </div>
              <Switch checked={aiActive} onCheckedChange={setAiActive} />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-foreground/[0.02] border">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center border shadow-sm shrink-0">
                  <Languages className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <div className="font-bold text-sm">Bilingual Mode (Urdu/English)</div>
                  <div className="text-xs text-muted-foreground font-medium">AI will automatically switch between English and Roman Urdu based on customer input.</div>
                </div>
              </div>
              <Switch checked={bilingual} onCheckedChange={setBilingual} />
            </div>

            <div className="grid md:grid-cols-2 gap-8 pt-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider opacity-70 flex items-center gap-1.5">
                  <Clock className="h-3 w-3" /> Auto-Wait Period (Seconds)
                </Label>
                <Input type="number" defaultValue="2" className="h-11 rounded-xl bg-foreground/[0.02]" />
                <p className="text-[10px] text-muted-foreground font-medium">Wait time before AI generates a response to feel more human.</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider opacity-70 flex items-center gap-1.5">
                   AI Persona Tone
                </Label>
                <select className="flex h-11 w-full rounded-xl border border-input bg-foreground/[0.02] px-3 py-2 text-sm focus:ring-2 focus:ring-primary/30 outline-none">
                  <option>Helpful & Professional</option>
                  <option>Friendly & Casual</option>
                  <option>Urgent & Direct</option>
                </select>
                <p className="text-[10px] text-muted-foreground font-medium">Controls the "personality" of your AI agent's messages.</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          {/* ─── Notification Settings ─── */}
          <Card className="p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b">
              <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Bell className="h-5 w-5" />
              </div>
              <h2 className="font-display font-black text-lg tracking-tight">Notifications</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Mobile Push Notifications</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Human Takeover Alerts</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Daily AI Performance Reports</span>
                <Switch />
              </div>
            </div>
          </Card>

          {/* ─── Subscription ─── */}
          <Card className="p-8 shadow-sm bg-gradient-soft border-primary/20">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-primary/10">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <CreditCard className="h-5 w-5" />
              </div>
              <h2 className="font-display font-black text-lg tracking-tight">Subscription</h2>
            </div>
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl font-black text-primary leading-none">Growth Plan</div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Rs. 5,000 / month</div>
                </div>
                <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">Active</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-background border text-xs font-semibold">
                <CardIcon className="h-4 w-4 text-muted-foreground" />
                <span>Visa ending in 4242</span>
                <Button variant="ghost" size="sm" className="ml-auto h-7 px-2 text-[10px] font-bold">Edit</Button>
              </div>
              <Button variant="outline" className="w-full font-bold text-xs gap-2 py-5 border-primary/20 hover:bg-primary/5 hover:text-primary transition-all">
                Change Plan <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>

        {/* ─── Danger Zone ─── */}
        <Card className="p-8 border-red-100 bg-red-50/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display font-black text-lg leading-tight text-red-900">Danger Zone</h3>
                <p className="text-sm text-red-700/60 font-medium">Permanently delete your workspace and all AI training data.</p>
              </div>
            </div>
            <Button variant="destructive" className="font-bold bg-red-600 hover:bg-red-700 h-11 px-8 rounded-xl shadow-lg shadow-red-200">
              Delete Workspace
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, FileText, Globe, Plus, Search, 
  Trash2, ExternalLink, HardDrive, Sparkles,
  Link as LinkIcon, FilePlus, ChevronRight, CheckCircle2
} from "lucide-react";
import { toast } from "sonner";

interface Source {
  id: string;
  type: "file" | "link" | "text";
  title: string;
  details: string;
  status: "synced" | "syncing" | "error";
  date: string;
  size?: string;
}

const initialSources: Source[] = [
  { id: "1", type: "file", title: "Business_Hours.pdf", details: "12 pages", status: "synced", date: "Apr 25, 2024", size: "1.2 MB" },
  { id: "2", type: "link", title: "https://yusr.shop/menu", details: "Web Crawl", status: "synced", date: "Apr 24, 2024" },
  { id: "3", type: "text", title: "Delivery Policy (Manual)", details: "Custom snippet", status: "synced", date: "Apr 26, 2024", size: "2 KB" },
  { id: "4", type: "file", title: "Common_FAQs.docx", details: "Manual upload", status: "syncing", date: "Apr 26, 2024", size: "45 KB" },
];

const Knowledge = () => {
  const [sources, setSources] = useState<Source[]>(initialSources);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSources = sources.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSyncAll = () => {
    toast.success("AI Training started! Your agent will be updated in a few minutes.");
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-display text-4xl font-black tracking-tight">Knowledge Base</h1>
          <p className="text-muted-foreground font-medium mt-1">Train your AI agent with your own business data.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="font-bold gap-2" onClick={handleSyncAll}>
            <Sparkles className="h-4 w-4 text-primary" /> Sync AI
          </Button>
          <Button className="bg-gradient-primary font-bold gap-2 shadow-glow">
            <Plus className="h-4 w-4" /> Add Source
          </Button>
        </div>
      </div>

      {/* ─── Stats ─── */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { label: "Total Training Data", val: "1.8 MB", icon: HardDrive, color: "text-blue-600" },
          { label: "Connected Sources", val: sources.length, icon: LinkIcon, color: "text-emerald-600" },
          { label: "AI Response Accuracy", val: "94.2%", icon: Sparkles, color: "text-primary" },
        ].map((s) => (
          <Card key={s.label} className="p-6 flex items-center gap-5 shadow-sm hover:shadow-md transition-all">
            <div className={`h-12 w-12 rounded-2xl bg-foreground/5 flex items-center justify-center ${s.color}`}>
              <s.icon className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-display font-black leading-none">{s.val}</div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">{s.label}</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* ─── Add Source Cards ─── */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary ml-1">Import Data</h3>
          {[
            { id: "file", title: "Upload Files", desc: "PDF, DOCX, TXT, CSV", icon: FilePlus },
            { id: "link", title: "Crawl Website", desc: "Imports content from URL", icon: Globe },
            { id: "text", title: "Plain Text", desc: "Manual Q&A snippets", icon: FileText },
          ].map((type) => (
            <button key={type.id} className="w-full text-left group">
              <Card className="p-5 flex items-center justify-between border-foreground/5 hover:border-primary/30 transition-all hover:shadow-lg hover:-translate-y-0.5">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <type.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm tracking-tight">{type.title}</div>
                    <div className="text-[10px] text-muted-foreground font-semibold uppercase">{type.desc}</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
              </Card>
            </button>
          ))}
          
          <Card className="p-6 bg-gradient-deep text-white rounded-[2rem] shadow-xl overflow-hidden relative">
            <div className="absolute -top-10 -right-10 h-32 w-32 bg-primary/20 blur-3xl rounded-full" />
            <Sparkles className="h-8 w-8 mb-4 opacity-50" />
            <h4 className="font-display font-black text-xl leading-tight">AI Auto-Tuning is Active</h4>
            <p className="text-xs text-white/60 mt-2 font-medium leading-relaxed">
              Your AI agent automatically updates its logic every time you add a new source.
            </p>
          </Card>
        </div>

        {/* ─── Sources List ─── */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary ml-1">Current Knowledge</h3>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input 
                placeholder="Find source..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-8 text-xs rounded-lg bg-background/50"
              />
            </div>
          </div>
          
          <div className="grid gap-3">
            {filteredSources.map((source) => (
              <Card key={source.id} className="p-4 group hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${
                      source.type === 'file' ? 'bg-blue-50 text-blue-600' : 
                      source.type === 'link' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {source.type === 'file' ? <FileText className="h-5 w-5" /> : 
                       source.type === 'link' ? <Globe className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-sm truncate">{source.title}</div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">{source.details}</span>
                        <span className="text-[10px] text-muted-foreground opacity-50">•</span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">{source.date}</span>
                        {source.size && (
                          <>
                            <span className="text-[10px] text-muted-foreground opacity-50">•</span>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">{source.size}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-foreground/5">
                      <div className={`h-1.5 w-1.5 rounded-full ${source.status === 'synced' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                      <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                        {source.status}
                      </span>
                    </div>
                    <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="pt-4 flex justify-center">
            <div className="flex items-center gap-2 text-[10px] font-bold bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full shadow-sm border border-emerald-100">
              <CheckCircle2 className="h-3.5 w-3.5" /> All systems synced & optimized
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Knowledge;

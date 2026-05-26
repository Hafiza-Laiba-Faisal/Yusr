import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Sparkles, Check, Instagram, Cog } from "lucide-react";
import logo from "@/assets/yusr-logo.png";

const serviceInfo: Record<string, { icon: typeof Instagram; title: string; desc: string }> = {
  "social-media": {
    icon: Instagram,
    title: "Social Media Automation",
    desc: "AI-generated posts, captions, hashtags & scheduling for Instagram and Facebook.",
  },
  "business-automation": {
    icon: Cog,
    title: "Business Process Automation",
    desc: "Automated reminders, inventory alerts, daily reports & Google Sheets integration.",
  },
};

const Waitlist = () => {
  const [params] = useSearchParams();
  const serviceKey = params.get("service") || "social-media";
  const service = serviceInfo[serviceKey] || serviceInfo["social-media"];
  const ServiceIcon = service.icon;

  const [form, setForm] = useState({ name: "", email: "", phone: "", business: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: connect to Supabase to save waitlist entry
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      {/* Nav */}
      <header className="border-b bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="yusr" className="h-9 w-9" />
            <span className="font-display text-xl font-bold tracking-tight">yusr</span>
          </Link>
          <Button asChild variant="ghost" size="sm" className="font-semibold gap-2">
            <Link to="/"><ArrowLeft className="h-4 w-4" /> Back to Home</Link>
          </Button>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-lg">
          {!submitted ? (
            <Card className="p-10 shadow-2xl rounded-[2rem]">
              {/* Service badge */}
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-foreground/5">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <ServiceIcon className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display font-black text-xl">{service.title}</h2>
                    <span className="text-[9px] font-bold bg-amber-100 text-amber-700 rounded-full px-2.5 py-0.5 uppercase tracking-widest">Coming Soon</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{service.desc}</p>
                </div>
              </div>

              <h3 className="font-display font-black text-2xl mb-2">Join the Waitlist</h3>
              <p className="text-sm text-muted-foreground mb-8">Be the first to know when this service launches. Early access members get exclusive discounts.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">Full Name *</label>
                  <input
                    type="text" required value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl border bg-background text-sm font-medium focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all outline-none"
                    placeholder="Ahmed Khan"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">Email *</label>
                  <input
                    type="email" required value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl border bg-background text-sm font-medium focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all outline-none"
                    placeholder="ahmed@business.com"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">WhatsApp Number</label>
                  <input
                    type="tel" value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl border bg-background text-sm font-medium focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all outline-none"
                    placeholder="+92 300 1234567"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">Business Name</label>
                  <input
                    type="text" value={form.business}
                    onChange={(e) => setForm({ ...form, business: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl border bg-background text-sm font-medium focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all outline-none"
                    placeholder="Khan's Restaurant"
                  />
                </div>
                <Button type="submit" size="lg" className="w-full h-14 bg-gradient-primary shadow-glow font-black text-lg mt-2">
                  Join Waitlist <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </Card>
          ) : (
            <Card className="p-14 shadow-2xl rounded-[2rem] text-center">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Check className="h-10 w-10 text-primary" />
              </div>
              <h2 className="font-display font-black text-3xl">You're on the list! 🎉</h2>
              <p className="text-muted-foreground mt-4 text-lg font-medium max-w-sm mx-auto">
                We'll notify you at <strong className="text-foreground">{form.email}</strong> as soon as <strong className="text-foreground">{service.title}</strong> is ready.
              </p>
              <p className="text-sm text-muted-foreground mt-3">Early access members get <strong className="text-primary">20% off</strong> the launch price.</p>
              <div className="mt-10 flex flex-col gap-3">
                <Button asChild className="bg-gradient-primary font-bold h-12">
                  <Link to="/auth">Try WhatsApp AI Agent (Live Now)</Link>
                </Button>
                <Button asChild variant="outline" className="font-bold h-12">
                  <Link to="/">Back to Home</Link>
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Waitlist;

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  MessageSquare, Bot, Zap, Shield, ArrowRight, Sparkles, Check,
  Instagram, Cog, Building2, Stethoscope, Scissors, GraduationCap,
  Home as HomeIcon, UtensilsCrossed, Star, Phone, Clock, TrendingUp,
  Bell
} from "lucide-react";
import logo from "@/assets/yusr-logo.png";

/* ─── Data ─── */
const industries = [
  { icon: UtensilsCrossed, name: "Restaurants & Cafes", desc: "Auto-order bots & digital menus that never miss an order." },
  { icon: Stethoscope, name: "Private Clinics", desc: "AI booking & appointment reminder systems for patients." },
  { icon: Scissors, name: "Boutiques & Salons", desc: "WhatsApp product catalogs and pricing bots for customers." },
  { icon: GraduationCap, name: "Educational Institutes", desc: "Automated fee collection reminders and parent communication." },
  { icon: HomeIcon, name: "Real Estate Agents", desc: "Instant property lead capture and automated follow-ups." },
  { icon: Building2, name: "Gyms & Spas", desc: "Self-service booking portals with membership management." },
];

const packages = [
  {
    name: "Starter",
    desc: "Perfect for small shops & solo businesses getting started.",
    setup: "Rs. 8,000",
    monthly: "Rs. 2,500",
    features: [
      "AI WhatsApp Auto-Replies",
      "Up to 500 messages/month",
      "Business FAQs & Hours Bot",
      "Owner Mobile Alerts",
      "Email Support",
    ],
  },
  {
    name: "Growth",
    desc: "Best for growing businesses with active customers.",
    setup: "Rs. 18,000",
    monthly: "Rs. 5,000",
    popular: true,
    features: [
      "Everything in Starter",
      "Up to 3,000 messages/month",
      "Custom Knowledge Base (RAG)",
      "Human ↔ AI Toggle",
      "Order & Booking Automation",
      "Priority WhatsApp Support",
    ],
  },
  {
    name: "Business",
    desc: "For established businesses needing full automation.",
    setup: "Rs. 35,000",
    monthly: "Rs. 9,000",
    features: [
      "Everything in Growth",
      "Unlimited Messages",
      "Multi-Agent Support",
      "Advanced Analytics Dashboard",
      "Google Sheets Integration",
      "Dedicated Account Manager",
      "24/7 Priority Support",
    ],
  },
];

const steps = [
  { n: "01", title: "Discovery Call", desc: "We understand your business, pain points, and goals." },
  { n: "02", title: "Live Demo", desc: "We build a mini WhatsApp bot demo tailored to your business." },
  { n: "03", title: "Setup & Training", desc: "Full deployment with staff training — go live in under a week." },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* ─── Nav ─── */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="yusr logo" className="h-11 w-11" width={44} height={44} />
            <span className="font-display text-2xl font-bold tracking-tight">yusr</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
            <a href="#services" className="text-muted-foreground hover:text-foreground transition-colors">Services</a>
            <a href="#industries" className="text-muted-foreground hover:text-foreground transition-colors">Industries</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="font-semibold"><Link to="/auth">Log in</Link></Button>
            <Button asChild size="sm" className="bg-gradient-primary shadow-sm font-semibold"><Link to="/onboarding">Get Started</Link></Button>
          </div>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
        <div className="relative container mx-auto px-4 py-24 md:py-32 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border bg-card/80 backdrop-blur px-4 py-1.5 text-xs font-semibold shadow-sm text-primary">
            <Sparkles className="h-3 w-3" />
            Empowering Pakistani Businesses with AI
          </div>
          <h1 className="font-display mt-8 text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight max-w-5xl mx-auto">
            Your 24/7 <span className="text-gradient">WhatsApp AI Agent</span> for Business
          </h1>
          <p className="mt-8 text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Never miss a customer message again. yusr deploys an intelligent AI agent on your WhatsApp
            that handles queries, takes orders, and books appointments — in English and Urdu.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-gradient-primary shadow-glow h-14 px-8 text-lg font-bold">
              <Link to="/onboarding">Start Free Trial <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 px-8 text-lg font-semibold"><a href="#pricing">See Pricing</a></Button>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto border-t pt-10 border-foreground/5">
            {[
              { icon: Clock, k: "24/7", v: "Always Online" },
              { icon: TrendingUp, k: "10x", v: "Faster Replies" },
              { icon: Phone, k: "0", v: "Missed Messages" },
              { icon: Star, k: "Bilingual", v: "English & Urdu" },
            ].map((s) => (
              <div key={s.v} className="flex flex-col items-center">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="font-display text-3xl font-extrabold">{s.k}</div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Main Service: WhatsApp AI Agent ─── */}
      <section id="services" className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Our Flagship Service</p>
          <h2 className="font-display text-4xl md:text-6xl font-black mt-4">WhatsApp AI Agent</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
            A smart, always-on AI agent that lives inside your WhatsApp — handling everything from FAQs to orders.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Features list */}
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 text-[10px] font-bold bg-primary text-primary-foreground rounded-full px-3 py-1 animate-pulse uppercase tracking-widest">
              Live & Active
            </span>
            <div className="space-y-6">
              {[
                { icon: MessageSquare, t: "Smart Auto-Replies", d: "AI answers pricing, timings, FAQs — instantly, without human intervention." },
                { icon: Bot, t: "Order & Appointment Booking", d: "Customers can place orders or book appointments right inside WhatsApp." },
                { icon: Zap, t: "Human ↔ AI Toggle", d: "Switch between AI and human mode with one click — full control, always." },
                { icon: Shield, t: "Custom Knowledge Base", d: "Train the AI on your own docs, menus, catalogs — it learns your business." },
                { icon: Bell, t: "Real-Time Owner Alerts", d: "Get instant notifications on your phone for every important conversation." },
                { icon: Star, t: "Bilingual Support", d: "Fluent in English and Urdu — connects naturally with Pakistani customers." },
              ].map((f) => (
                <div key={f.t} className="flex gap-5 group">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-lg group-hover:rotate-6 transition-transform">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-bold text-lg">{f.t}</div>
                    <div className="text-sm text-muted-foreground font-medium">{f.d}</div>
                  </div>
                </div>
              ))}
            </div>
            <Button asChild size="lg" className="bg-gradient-primary shadow-glow h-14 px-10 text-lg font-bold">
              <Link to="/onboarding">Try AI Agent Free <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>

          {/* Chat preview */}
          <div className="relative group">
            <div className="absolute -inset-10 bg-gradient-primary opacity-30 blur-[100px] rounded-full group-hover:opacity-40 transition-opacity" aria-hidden />
            <Card className="relative p-6 shadow-2xl border-white/50 bg-card/80 backdrop-blur-xl rounded-[2rem] overflow-hidden">
              <div className="flex items-center gap-4 pb-4 border-b border-foreground/5">
                <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-black text-lg shadow-inner">AK</div>
                <div className="flex-1">
                  <div className="font-black text-md">Ahmed Khan</div>
                  <div className="text-xs text-primary font-bold flex items-center gap-1.5 uppercase tracking-tighter">
                    <Bot className="h-3.5 w-3.5" /> AI Agent Active
                  </div>
                </div>
              </div>
              <div className="space-y-4 py-6 text-sm font-medium">
                <div className="flex justify-start"><div className="bg-[hsl(var(--bubble-in))] border border-foreground/5 rounded-2xl rounded-bl-sm px-4 py-2.5 max-w-[85%] shadow-sm">Assalam o alaikum! Menu bheijiye aur delivery time kya hai?</div></div>
                <div className="flex justify-end"><div className="bg-[hsl(var(--bubble-ai))] border border-primary/20 rounded-2xl rounded-br-sm px-4 py-2.5 max-w-[85%] shadow-elegant">
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-primary mb-1 uppercase tracking-widest"><Sparkles className="h-3 w-3" /> AI Agent</div>
                  Walaikum Assalam! 🙏 Hamara menu yahan dekhein: yusr.shop/menu. Delivery time Lahore mein 30-45 min hai. Kya order place karna chahein ge?
                </div></div>
                <div className="flex justify-start"><div className="bg-[hsl(var(--bubble-in))] border border-foreground/5 rounded-2xl rounded-bl-sm px-4 py-2.5 max-w-[85%] shadow-sm">Haan, 2 Zinger burgers bhej dein DHA Phase 5 pe</div></div>
                <div className="flex justify-end"><div className="bg-[hsl(var(--bubble-ai))] border border-primary/20 rounded-2xl rounded-br-sm px-4 py-2.5 max-w-[85%] shadow-elegant">
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-primary mb-1 uppercase tracking-widest"><Sparkles className="h-3 w-3" /> AI Agent</div>
                  Done! ✅ 2x Zinger Burger — Rs. 1,500. Delivery to DHA Phase 5 in ~40 min. Payment on delivery. Shukriya! 🎉
                </div></div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── Coming Soon Services ─── */}
      <section className="bg-gradient-soft py-16 border-y border-foreground/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Coming Soon</p>
            <h2 className="font-display text-3xl md:text-4xl font-black mt-3">More AI Tools on the Way</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">We're building more automation tools. Join the waitlist to get early access.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="p-8 flex gap-6 items-start border-dashed border-2 hover:border-primary/30 transition-colors group">
              <div className="h-14 w-14 rounded-2xl bg-foreground/5 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                <Instagram className="h-7 w-7 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-display font-black text-xl">Social Media Automation</h3>
                  <span className="text-[9px] font-bold bg-amber-100 text-amber-700 rounded-full px-2.5 py-0.5 uppercase tracking-widest">Soon</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">AI-generated posts, captions, hashtags & scheduling for Instagram and Facebook.</p>
                <Button asChild variant="outline" size="sm" className="mt-4 font-bold">
                  <Link to="/waitlist?service=social-media">Join Waitlist <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Link>
                </Button>
              </div>
            </Card>
            <Card className="p-8 flex gap-6 items-start border-dashed border-2 hover:border-primary/30 transition-colors group">
              <div className="h-14 w-14 rounded-2xl bg-foreground/5 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                <Cog className="h-7 w-7 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-display font-black text-xl">Business Process Automation</h3>
                  <span className="text-[9px] font-bold bg-amber-100 text-amber-700 rounded-full px-2.5 py-0.5 uppercase tracking-widest">Soon</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">Automated reminders, inventory alerts, daily reports & Google Sheets integration.</p>
                <Button asChild variant="outline" size="sm" className="mt-4 font-bold">
                  <Link to="/waitlist?service=business-automation">Join Waitlist <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── Industries ─── */}
      <section id="industries" className="py-24 bg-gradient-deep text-white relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" aria-hidden />
        <div className="relative container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-sm font-bold uppercase tracking-[0.2em]" style={{ color: "hsl(217 91% 65%)" }}>Industry Solutions</p>
            <h2 className="font-display text-4xl md:text-6xl font-black mt-4">Built for Every Business</h2>
            <p className="mt-4 text-white/60 text-lg max-w-xl mx-auto">We help businesses across Pakistan save time, reduce overhead, and delight customers.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((t) => (
              <div key={t.name} className="group relative rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-sm p-8 hover:bg-white/10 transition-all hover:-translate-y-1">
                <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6 group-hover:bg-white/20 transition-colors">
                  <t.icon className="h-7 w-7" style={{ color: "hsl(217 91% 65%)" }} />
                </div>
                <h3 className="font-display font-black text-xl group-hover:text-white transition-colors" style={{ color: "hsl(217 91% 85%)" }}>{t.name}</h3>
                <p className="text-sm text-white/50 mt-3 leading-relaxed font-medium">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Process ─── */}
      <section id="process" className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">How It Works</p>
          <h2 className="font-display text-4xl md:text-6xl font-black mt-4">Live in 3 Simple Steps</h2>
          <p className="mt-4 text-muted-foreground text-lg">From signup to first AI reply in under a week.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((s) => (
            <Card key={s.n} className="group p-10 text-center hover:shadow-xl hover:border-primary/20 transition-all hover:-translate-y-1">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/5 group-hover:bg-primary/10 transition-colors mb-6 mx-auto">
                <span className="font-display text-4xl font-black text-primary">{s.n}</span>
              </div>
              <h3 className="font-display font-black text-2xl group-hover:text-primary transition-colors">{s.title}</h3>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{s.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ─── Pricing ─── */}
      <section id="pricing" className="bg-gradient-soft py-24 border-y border-foreground/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Pricing</p>
            <h2 className="font-display text-4xl md:text-6xl font-black mt-4">Plans for Every Budget</h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">Affordable AI automation. Start small, scale as you grow. No hidden fees.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages.map((p) => (
              <Card key={p.name} className={`p-10 relative overflow-hidden flex flex-col hover:-translate-y-1 transition-all ${p.popular ? 'border-primary border-2 shadow-2xl scale-105' : 'hover:border-foreground/20 hover:shadow-xl'}`}>
                {p.popular && <div className="absolute -top-0 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-black px-5 py-1.5 rounded-b-xl uppercase tracking-widest">Best Value</div>}
                <h3 className="font-display font-black text-2xl uppercase tracking-tight mt-2">{p.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 font-medium">{p.desc}</p>
                <div className="mt-6 p-4 rounded-2xl bg-foreground/5">
                  <div className="font-display text-2xl font-black">{p.setup}</div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase">One-time Setup</div>
                </div>
                <div className="mt-4 pb-6 border-b">
                  <div className="font-display text-3xl font-black text-primary">{p.monthly}<span className="text-lg text-muted-foreground font-bold"> /mo</span></div>
                </div>
                <ul className="mt-8 space-y-4 text-sm font-medium flex-1">
                  {p.features.map(f => <li key={f} className="flex gap-3"><Check className="h-5 w-5 text-primary shrink-0" />{f}</li>)}
                </ul>
                <Button asChild className={`w-full mt-10 h-14 text-lg font-black ${p.popular ? 'bg-gradient-primary shadow-glow' : ''}`} variant={p.popular ? 'default' : 'outline'}>
                  <Link to="/auth">Choose {p.name}</Link>
                </Button>
              </Card>
            ))}
          </div>
          <p className="text-center mt-8 text-sm text-muted-foreground font-medium">All plans include 7-day free trial. Payment via JazzCash, EasyPaisa, or Bank Transfer.</p>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="container mx-auto px-4 py-24 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-black">Frequently Asked Questions</h2>
          <p className="mt-4 text-muted-foreground">Everything you need to know before getting started.</p>
        </div>
        <div className="space-y-4">
          {[
            { q: "How quickly can we go live?", a: "Most businesses go live within 5-7 days. We handle everything — setup, training the AI, and deployment." },
            { q: "Do I need any technical skills?", a: "Not at all. We set everything up for you and provide a simple dashboard. If you can use WhatsApp, you can use yusr." },
            { q: "Can the AI reply in Urdu?", a: "Yes! Our AI is optimized for both English and Roman Urdu, so it communicates naturally with your Pakistani customers." },
            { q: "What if the AI doesn't know an answer?", a: "It gracefully hands off to you or your team with one click. You always stay in control." },
            { q: "Is my data safe?", a: "Fully. We use bank-grade encryption and your data is never shared. Each business has isolated, private storage." },
            { q: "How do payments work?", a: "We accept JazzCash, EasyPaisa, and Bank Transfers. 50% advance for setup. Monthly fee starts when you go live." },
            { q: "Can I cancel anytime?", a: "Yes. No long-term contracts. You can cancel your monthly subscription whenever you need to." },
          ].map((f) => (
            <Card key={f.q} className="p-6 hover:border-primary/30 hover:shadow-md transition-all">
              <h3 className="font-black text-lg flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                {f.q}
              </h3>
              <p className="text-sm text-muted-foreground mt-3 font-medium leading-relaxed border-l-2 pl-5 border-foreground/5 ml-1">{f.a}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="container mx-auto px-4 py-24">
        <Card className="bg-gradient-deep text-white p-16 md:p-24 text-center relative overflow-hidden rounded-[3rem]">
          <div className="absolute inset-0 grid-bg opacity-20" aria-hidden />
          <div className="relative max-w-3xl mx-auto">
            <h2 className="font-display text-5xl md:text-7xl font-black tracking-tight">Ready to Automate?</h2>
            <p className="mt-6 text-xl text-white/70 leading-relaxed font-medium">
              Start your free trial today. No credit card needed. See results in your first week.
            </p>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-5">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 h-16 px-12 text-xl font-black shadow-2xl">
                <Link to="/onboarding">Start Free Trial <ArrowRight className="ml-3 h-6 w-6" /></Link>
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t pt-16 pb-8 bg-card/50">
        <div className="container mx-auto px-4">
          {/* Top Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src={logo} alt="yusr AI" className="h-10 w-10" width={40} height={40} loading="lazy" />
                <span className="font-black text-xl tracking-tight">yusr <span className="text-primary">AI</span></span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Pakistan-based AI automation service provider helping local businesses grow with WhatsApp AI bots and smart automation.
              </p>
              <div className="flex gap-3">
                <a href="https://www.facebook.com/profile.php?id=61576625588524" target="_blank" rel="noopener noreferrer"
                  className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors text-xs font-bold">f</a>
                <a href="https://instagram.com/yusr.ai" target="_blank" rel="noopener noreferrer"
                  className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors">
                  <Instagram className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-4">Quick Links</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#services" className="text-muted-foreground hover:text-primary transition-colors">Services</a></li>
                <li><a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</a></li>
                <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
                <li><Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms & Conditions</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-4">Contact</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">📍</span>
                  <span>House 15, Street 2, Mian Bazar, Data Darbar, Lahore, Pakistan, 54000</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>📞</span>
                  <a href="tel:+923284814266" className="hover:text-primary transition-colors">+92 328 4814266</a>
                </li>
                <li className="flex items-center gap-2">
                  <span>✉️</span>
                  <a href="mailto:support@yusr.tech" className="hover:text-primary transition-colors">support@yusr.tech</a>
                </li>
                <li className="flex items-center gap-2">
                  <span>💬</span>
                  <a href="https://wa.me/923284814266" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">WhatsApp Us</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <span>© {new Date().getFullYear()} Main Shah Nawaz · All Rights Reserved</span>
            <span className="text-center">Main Shah Nawaz (yusr) is a Pakistan-based AI automation service provider.</span>
            <div className="flex gap-6">
              <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
              <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;


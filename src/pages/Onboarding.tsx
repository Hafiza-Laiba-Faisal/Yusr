import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ArrowLeft, ArrowRight, Check, Sparkles, Building2, 
  UtensilsCrossed, Stethoscope, Scissors, GraduationCap, 
  Home as HomeIcon, Bot, MessageSquare, ShieldCheck
} from "lucide-react";
import logo from "@/assets/yusr-logo.png";

const steps = [
  { id: "business", title: "Business Type", desc: "Select your industry" },
  { id: "plan", title: "Select Plan", desc: "Choose your trial" },
  { id: "account", title: "Create Account", desc: "Basic details" },
];

const industries = [
  { id: "food", name: "Food & Beverage", icon: UtensilsCrossed },
  { id: "health", name: "Health & Medical", icon: Stethoscope },
  { id: "retail", name: "Retail & Boutique", icon: Scissors },
  { id: "edu", name: "Education", icon: GraduationCap },
  { id: "realestate", name: "Real Estate", icon: HomeIcon },
  { id: "other", name: "Other Business", icon: Building2 },
];

const plans = [
  { id: "starter", name: "Starter", price: "Rs. 2,500/mo", desc: "For solo owners" },
  { id: "growth", name: "Growth", price: "Rs. 5,000/mo", desc: "For scaling teams", popular: true },
  { id: "business", name: "Business", price: "Rs. 9,000/mo", desc: "Full automation" },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState({
    industry: "",
    plan: "growth",
    email: "",
    name: ""
  });

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate("/auth", { state: { ...data } });
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="yusr" className="h-9 w-9" />
            <span className="font-display text-xl font-bold tracking-tight">yusr</span>
          </Link>
          <div className="hidden md:flex items-center gap-4">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2">
                <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold ${i <= currentStep ? "bg-primary text-white" : "bg-foreground/10 text-muted-foreground"}`}>
                  {i < currentStep ? <Check className="h-3 w-3" /> : i + 1}
                </div>
                <span className={`text-xs font-bold ${i === currentStep ? "text-foreground" : "text-muted-foreground"}`}>{s.title}</span>
                {i < steps.length - 1 && <div className="h-px w-8 bg-foreground/10" />}
              </div>
            ))}
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="text-muted-foreground font-bold">Exit</Button>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-6 pb-24">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl font-black tracking-tight">{steps[currentStep].title}</h1>
            <p className="text-muted-foreground font-medium">{steps[currentStep].desc}</p>
          </div>

          <div className="min-h-[300px]">
            {/* Step 1: Industry */}
            {currentStep === 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {industries.map((ind) => (
                  <button 
                    key={ind.id}
                    onClick={() => { setData({...data, industry: ind.id}); nextStep(); }}
                    className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-4 hover:shadow-xl hover:-translate-y-1 ${data.industry === ind.id ? "bg-primary/5 border-primary shadow-lg ring-4 ring-primary/5" : "bg-card border-foreground/5 hover:border-primary/30"}`}
                  >
                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${data.industry === ind.id ? "bg-primary text-white" : "bg-foreground/5 text-muted-foreground"}`}>
                      <ind.icon className="h-7 w-7" />
                    </div>
                    <span className="font-bold text-sm">{ind.name}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Step 2: Plan Selection */}
            {currentStep === 1 && (
              <div className="grid gap-4">
                {plans.map((p) => (
                  <button 
                    key={p.id}
                    onClick={() => setData({...data, plan: p.id})}
                    className={`p-6 rounded-3xl border-2 transition-all flex items-center justify-between group ${data.plan === p.id ? "bg-primary/5 border-primary shadow-lg ring-4 ring-primary/5" : "bg-card border-foreground/5 hover:border-primary/30"}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${data.plan === p.id ? "bg-primary text-white" : "bg-foreground/5 text-muted-foreground"}`}>
                        <ShieldCheck className="h-6 w-6" />
                      </div>
                      <div className="text-left">
                        <div className="font-black text-lg flex items-center gap-2">
                          {p.name}
                          {p.popular && <span className="bg-primary/10 text-primary text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Popular</span>}
                        </div>
                        <p className="text-xs text-muted-foreground font-medium">{p.desc}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-display font-black text-xl text-primary">{p.price}</div>
                      <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">7 Day Trial included</div>
                    </div>
                  </button>
                ))}
                <div className="mt-8 flex justify-between gap-4">
                  <Button variant="ghost" className="font-bold h-12" onClick={prevStep}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                  <Button className="bg-gradient-primary font-black px-10 h-12 shadow-glow" onClick={nextStep}>Continue <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </div>
              </div>
            )}

            {/* Step 3: Account (Simplified redirect info) */}
            {currentStep === 2 && (
              <div className="text-center space-y-8 py-10">
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto animate-bounce">
                  <Sparkles className="h-12 w-12 text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-3xl font-black">Almost There!</h2>
                  <p className="text-muted-foreground font-medium mt-2 max-w-sm mx-auto">
                    We've configured your workspace for <strong>{industries.find(i => i.id === data.industry)?.name}</strong> on the <strong>{data.plan}</strong> plan.
                  </p>
                </div>
                <div className="flex flex-col gap-3 max-w-xs mx-auto">
                  <Button className="bg-gradient-primary font-black py-7 text-lg shadow-glow" onClick={nextStep}>
                    Finish Setup <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button variant="ghost" className="font-bold h-12" onClick={prevStep}>Back to Plans</Button>
                </div>
                <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-widest">
                  Redirecting to account creation...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trust bar */}
      <footer className="mt-auto border-t bg-card/50 py-6">
        <div className="container mx-auto px-4 flex justify-center items-center gap-10 opacity-50 grayscale">
          <div className="flex items-center gap-2 font-black text-sm"><MessageSquare className="h-4 w-4" /> Trusted AI</div>
          <div className="flex items-center gap-2 font-black text-sm"><Bot className="h-4 w-4" /> Urdu Optimized</div>
          <div className="flex items-center gap-2 font-black text-sm"><ShieldCheck className="h-4 w-4" /> Meta Verified</div>
        </div>
      </footer>
    </div>
  );
};

export default Onboarding;

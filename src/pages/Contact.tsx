import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Mail, Clock, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import logo from "@/assets/yusr-logo.png";

const contactCards = [
  {
    icon: Phone,
    title: "Phone / WhatsApp",
    value: "+92 328 4814266",
    href: "tel:+923284814266",
    sub: "Mon–Sat, 10am–8pm PKT",
  },
  {
    icon: Mail,
    title: "Email Support",
    value: "support@yusr.tech",
    href: "mailto:support@yusr.tech",
    sub: "We reply within 24 hours",
  },
  {
    icon: MapPin,
    title: "Office Address",
    value: "Lahore, Pakistan",
    href: "https://maps.google.com/?q=Data+Darbar+Rd+Lahore",
    sub: "House 15, Street 2, Mian Bazar, 54000",
  },
  {
    icon: Clock,
    title: "Business Hours",
    value: "Mon – Sat",
    href: null,
    sub: "10:00 AM – 8:00 PM (PKT)",
  },
];

const Contact = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="border-b bg-card/80 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="yusr AI" className="h-9 w-9" />
            <span className="font-black text-lg tracking-tight">yusr <span className="text-primary">AI</span></span>
          </Link>
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <MessageSquare className="h-4 w-4" />
            We're here to help
          </div>
          <h1 className="text-5xl font-black tracking-tight mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">
            Have a question about yusr AI? We'll get back to you within 24 hours — usually much faster.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactCards.map((card) => (
            <Card key={card.title} className="p-6 flex flex-col gap-4 hover:border-primary/50 transition-colors">
              <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                <card.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">{card.title}</p>
                {card.href ? (
                  <a href={card.href} target={card.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                    className="text-base font-bold text-foreground hover:text-primary transition-colors block mb-1">
                    {card.value}
                  </a>
                ) : (
                  <p className="text-base font-bold text-foreground mb-1">{card.value}</p>
                )}
                <p className="text-sm text-muted-foreground">{card.sub}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* WhatsApp CTA */}
          <Card className="p-8 bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Chat on WhatsApp</h3>
                <p className="text-sm text-muted-foreground">Fastest response</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
              Send us a WhatsApp message for the fastest support. Our team typically responds within 1 hour during business hours.
            </p>
            <Button asChild className="bg-green-500 hover:bg-green-600 text-white w-full font-bold">
              <a href="https://wa.me/923284814266?text=Hi%20yusr%20AI%2C%20I%20have%20a%20question!" target="_blank" rel="noopener noreferrer">
                Open WhatsApp Chat →
              </a>
            </Button>
          </Card>

          {/* Email CTA */}
          <Card className="p-8 bg-gradient-to-br from-primary/10 to-purple-500/5 border-primary/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Send an Email</h3>
                <p className="text-sm text-muted-foreground">For detailed queries</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
              For technical questions, business proposals, partnership inquiries, or detailed support — email is best.
            </p>
            <Button asChild variant="outline" className="w-full font-bold border-primary/40 hover:bg-primary/10">
              <a href="mailto:support@yusr.tech">
                support@yusr.tech →
              </a>
            </Button>
          </Card>
        </div>

        {/* Company Info */}
        <div className="mt-16 p-8 rounded-3xl border bg-card/50 text-center">
          <p className="text-muted-foreground text-sm leading-relaxed">
            <strong className="text-foreground">Main Shah Nawaz (yusr)</strong> is a Pakistan-based AI automation service provider.<br />
            House 15, Street 2, Mian Bazar, Data Darbar, Lahore, Pakistan, 54000 &nbsp;·&nbsp; +92 328 4814266 &nbsp;·&nbsp; support@yusr.tech
          </p>
        </div>
      </main>

      <footer className="border-t py-8 mt-16 bg-card/50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Main Shah Nawaz · yusr AI · Lahore, Pakistan &nbsp;·&nbsp;
          <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link> &nbsp;·&nbsp;
          <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link> &nbsp;·&nbsp;
          <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
        </div>
      </footer>
    </div>
  );
};

export default Contact;

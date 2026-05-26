import { Link } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
import logo from "@/assets/yusr-logo.png";

const Terms = () => {
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

      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="flex items-center gap-3 mb-8">
          <FileText className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-black">Terms & Conditions</h1>
        </div>
        <p className="text-muted-foreground mb-10">Last updated: May 14, 2026</p>

        <div className="space-y-10 text-foreground/90 leading-relaxed">

          <section>
            <h2 className="text-2xl font-bold mb-3">1. Agreement to Terms</h2>
            <p>By accessing or using yusr AI services ("Service"), you agree to be bound by these Terms and Conditions. If you do not agree, you may not use our Service. Main Shah Nawaz (yusr) is a Pakistan-based AI automation service provider.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">2. Description of Service</h2>
            <p>yusr provides AI-powered WhatsApp chatbot automation services for businesses. Our platform enables businesses to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Deploy AI chatbots on their WhatsApp Business numbers</li>
              <li>Automate customer responses using custom knowledge bases</li>
              <li>Manage conversations through our web dashboard</li>
              <li>Toggle between human and AI response modes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">3. AI Limitations & Disclaimer</h2>
            <p>You acknowledge and agree that:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>AI responses are generated automatically and may not always be accurate, complete, or appropriate.</li>
              <li>yusr AI is a tool to assist your business, not a replacement for human judgment.</li>
              <li>We are not liable for any business decisions made based on AI-generated responses.</li>
              <li>You are responsible for reviewing and moderating AI responses sent to your customers.</li>
              <li>AI performance depends on the quality of the knowledge base you provide.</li>
              <li>The AI operates within Meta's WhatsApp Business policies, which may change over time.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">4. User Responsibilities</h2>
            <p>As a user of yusr, you agree to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Use the service only for lawful business purposes</li>
              <li>Not use the platform for spam, unsolicited messaging, or harassment</li>
              <li>Obtain proper consent from your customers before sending automated messages</li>
              <li>Comply with Meta's WhatsApp Business Policy and all applicable Pakistan laws</li>
              <li>Keep your account credentials secure and confidential</li>
              <li>Not attempt to reverse-engineer or misuse our platform</li>
              <li>Not use yusr for cold messaging, bulk unsolicited campaigns, or scraping</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">5. Payment Terms</h2>
            <p>yusr operates on a setup fee + monthly subscription model:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Setup Fee:</strong> A one-time fee charged at the start of the engagement.</li>
              <li><strong>Monthly Subscription:</strong> Charged on the same date each month.</li>
              <li><strong>Payment Methods:</strong> Bank transfer, JazzCash, EasyPaisa, or as agreed.</li>
              <li><strong>Late Payment:</strong> Services may be suspended after 7 days of non-payment.</li>
              <li><strong>Pricing Changes:</strong> We will notify you 30 days in advance of any price changes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">6. Refund Policy</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Setup Fees:</strong> Non-refundable once the onboarding process has begun.</li>
              <li><strong>Monthly Fees:</strong> If you cancel within 7 days of your billing date and have not used the service, a pro-rated refund may be issued at our discretion.</li>
              <li><strong>Refund Requests:</strong> Must be submitted via email to <a href="mailto:support@yusr.tech" className="text-primary underline">support@yusr.tech</a> within 7 days of charge.</li>
              <li>We reserve the right to deny refunds if the service has been used or if terms have been violated.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">7. Third-Party Services</h2>
            <p>Our service integrates with third-party platforms including Meta (WhatsApp), Supabase, and AI providers. We are not responsible for the availability, terms, or pricing of these platforms. Changes to Meta's WhatsApp Business API policies may affect the features available through yusr.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">8. Intellectual Property</h2>
            <p>The yusr platform, its code, branding, and design are the intellectual property of yusr AI. You may not copy, replicate, or resell any part of our platform without written permission.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">9. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, yusr shall not be liable for any indirect, incidental, or consequential damages arising from use of our Service, including but not limited to loss of revenue, data loss, or business interruption.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">10. Termination</h2>
            <p>We reserve the right to suspend or terminate your account if you violate these terms. You may cancel your subscription at any time by contacting us. Upon termination, your data will be retained for 30 days before permanent deletion.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">11. Governing Law</h2>
            <p>These Terms are governed by the laws of the Islamic Republic of Pakistan. Any disputes shall be resolved in the courts of Lahore, Punjab, Pakistan.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">12. Contact</h2>
            <div className="space-y-1">
              <p><strong>Main Shah Nawaz (yusr)</strong></p>
              <p>House 15, Street 2, Mian Bazar, Data Darbar, Lahore, Pakistan, 54000</p>
              <p>Email: <a href="mailto:support@yusr.tech" className="text-primary underline">support@yusr.tech</a></p>
              <p>Phone: <a href="tel:+923284814266" className="text-primary underline">+92 328 4814266</a></p>
            </div>
          </section>

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

export default Terms;

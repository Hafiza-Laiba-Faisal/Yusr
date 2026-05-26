import { Link } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";
import logo from "@/assets/yusr-logo.png";

const PrivacyPolicy = () => {
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
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-black">Privacy Policy</h1>
        </div>
        <p className="text-muted-foreground mb-10">Last updated: May 14, 2026</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-10 text-foreground/90 leading-relaxed">

          <section>
            <h2 className="text-2xl font-bold mb-3">1. Who We Are</h2>
            <p>Main Shah Nawaz (yusr) is a Pakistan-based AI automation service provider offering WhatsApp chatbot and business automation services for small and medium enterprises (SMEs). We are located at House 15, Street 2, Mian Bazar, Data Darbar, Lahore, 54000. You can contact us at <a href="mailto:support@yusr.tech" className="text-primary underline">support@yusr.tech</a> or <a href="tel:+923284814266" className="text-primary underline">+92 328 4814266</a>.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">2. Information We Collect</h2>
            <p>We collect the following information when you use our services:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>WhatsApp Messages:</strong> Incoming messages sent to your business WhatsApp number via the Meta Cloud API. These are processed to generate AI responses.</li>
              <li><strong>Phone Numbers:</strong> WhatsApp phone numbers of people who message your business bot.</li>
              <li><strong>Business Information:</strong> Your business name, phone number, email, and workspace configuration.</li>
              <li><strong>Account Data:</strong> Email address and authentication details when you sign up on yusr.tech.</li>
              <li><strong>Usage Data:</strong> Platform usage logs for improving our service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">3. How We Use Your Data</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To deliver AI-powered WhatsApp auto-reply services</li>
              <li>To store message history for your business dashboard</li>
              <li>To generate AI responses using your knowledge base</li>
              <li>To send you platform notifications and support messages</li>
              <li>To improve our AI models and service quality</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">4. Meta WhatsApp API & Data Handling</h2>
            <p>yusr uses the <strong>Meta WhatsApp Business Cloud API</strong> to send and receive messages on behalf of registered businesses. This means:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>All messages pass through Meta's servers before reaching our system.</li>
              <li>We comply with Meta's <a href="https://www.whatsapp.com/legal/business-policy/" className="text-primary underline" target="_blank" rel="noopener noreferrer">WhatsApp Business Policy</a>.</li>
              <li>We do not send unsolicited messages (spam) to any WhatsApp user.</li>
              <li>Messages are only sent to users who have initiated contact or explicitly opted in.</li>
              <li>We do not use the platform for bulk cold messaging or unsolicited marketing.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">5. Customer Consent</h2>
            <p>We obtain and respect user consent in the following ways:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Users who message a yusr-powered business number have initiated consent by sending the first message.</li>
              <li>Business owners using our platform agree to our Terms of Service and are responsible for ensuring their customers have consented to receiving automated replies.</li>
              <li>We honor opt-out requests. If a user sends "STOP" or "Unsubscribe", the business is notified and should cease automated messaging to that user.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">6. Message Storage</h2>
            <p>Messages processed through yusr are stored securely in our Supabase-hosted database (hosted on AWS, Asia-Pacific region). We retain message history for up to <strong>12 months</strong> unless the business owner requests deletion. Data is encrypted at rest and in transit using industry-standard TLS encryption.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">7. Data Sharing</h2>
            <p>We do <strong>not</strong> sell your data. We share data only with:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Meta Platforms:</strong> Required to operate the WhatsApp Business API</li>
              <li><strong>Supabase:</strong> Our database and backend provider</li>
              <li><strong>Moonshot AI (Kimi):</strong> For AI response generation (message content is sent for processing)</li>
              <li><strong>Vercel:</strong> Our frontend hosting provider</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">8. Data Deletion Request</h2>
            <p>You have the right to request deletion of your data. To do so:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Email us at <a href="mailto:support@yusr.tech" className="text-primary underline">support@yusr.tech</a> with the subject "Data Deletion Request"</li>
              <li>Include your registered email address and business phone number</li>
              <li>We will process your request within <strong>14 business days</strong></li>
              <li>All associated messages, contacts, and workspace data will be permanently deleted</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">9. Cookies</h2>
            <p>Our website uses essential cookies for authentication and session management only. We do not use tracking or advertising cookies.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">10. Children's Privacy</h2>
            <p>Our services are not directed at individuals under the age of 18. We do not knowingly collect data from minors.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">11. Changes to This Policy</h2>
            <p>We may update this policy periodically. We will notify registered users via email for significant changes. Continued use of our service after changes constitutes acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">12. Contact Us</h2>
            <p>For any privacy-related questions or concerns:</p>
            <div className="mt-3 space-y-1">
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

export default PrivacyPolicy;

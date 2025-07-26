"use client";

import { useThemeContext } from "@/components/ui/ThemeProvider";
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  const { theme } = useThemeContext();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: theme.background, color: theme.primary }}>
      <Header 
        isReadOnly={true}
        className="fixed top-0 left-0 right-0 z-50"
      />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 mt-20">
        {/* Back to home link */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium mb-8 transition-opacity hover:opacity-70"
          style={{ color: theme.primary }}
        >
          <ArrowLeft size={16} />
          Back to duckbin
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ 
              color: theme.primary,
              fontFamily: 'var(--font-krona-one)'
            }}
          >
            Terms & Privacy
          </h1>
          <p className="text-l opacity-80 italic" style={{ color: theme.primary }}>
            Last updated: July 26, 2025
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none space-y-12">
          
          {/* Terms of Service */}
          <section>
            <h2 
              className="text-2xl md:text-3xl font-bold mb-6"
              style={{ 
                color: theme.primary,
                fontFamily: 'var(--font-krona-one)'
              }}
            >
              Terms of Service
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3" style={{ color: theme.primary }}>
                  1. Acceptance of Terms
                </h3>
                <p className="leading-relaxed opacity-90" style={{ color: theme.primary }}>
                  By using duckbin, you agree to these terms of service. If you do not agree to these terms, 
                  please do not use our service. We may update these terms at any time, and continued use 
                  constitutes acceptance of any changes.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3" style={{ color: theme.primary }}>
                  2. Service Description
                </h3>
                <p className="leading-relaxed opacity-90" style={{ color: theme.primary }}>
                  duckbin is a code sharing platform that allows users to create, share, and collaborate on 
                  code snippets. The service is provided "as is" without warranties of any kind.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3" style={{ color: theme.primary }}>
                  3. User Content
                </h3>
                <p className="leading-relaxed opacity-90 mb-3" style={{ color: theme.primary }}>
                  You retain ownership of content you create on duckbin. However, by sharing content publicly, 
                  you grant us and other users certain rights:
                </p>
                <ul className="list-disc ml-6 space-y-2 opacity-90" style={{ color: theme.primary }}>
                  <li>Public snippets can be viewed, copied, and forked by other users</li>
                  <li>We may use your content to improve and promote our service</li>
                  <li>You are responsible for ensuring you have the right to share your content</li>
                  <li>You must not share malicious, illegal, or harmful content</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3" style={{ color: theme.primary }}>
                  4. Prohibited Uses
                </h3>
                <p className="leading-relaxed opacity-90 mb-3" style={{ color: theme.primary }}>
                  You may not use duckbin for:
                </p>
                <ul className="list-disc ml-6 space-y-2 opacity-90" style={{ color: theme.primary }}>
                  <li>Sharing malicious code, malware, or security exploits</li>
                  <li>Violating intellectual property rights</li>
                  <li>Harassment, spam, or abusive behavior</li>
                  <li>Illegal activities or content that violates applicable laws</li>
                  <li>Attempting to compromise the security or functionality of our service</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3" style={{ color: theme.primary }}>
                  5. Service Availability
                </h3>
                <p className="leading-relaxed opacity-90" style={{ color: theme.primary }}>
                  We strive to maintain high availability but cannot guarantee uninterrupted service. 
                  We may modify, suspend, or discontinue any part of the service at any time.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3" style={{ color: theme.primary }}>
                  6. Limitation of Liability
                </h3>
                <p className="leading-relaxed opacity-90" style={{ color: theme.primary }}>
                  duckbin is provided "as is" without warranties. We are not liable for any damages 
                  arising from your use of the service, including but not limited to data loss, 
                  security breaches, or service interruptions.
                </p>
              </div>
            </div>
          </section>

          {/* Privacy Policy */}
          <section>
            <h2 
              className="text-2xl md:text-3xl font-bold mb-6"
              style={{ 
                color: theme.primary,
                fontFamily: 'var(--font-krona-one)'
              }}
            >
              Privacy Policy
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3" style={{ color: theme.primary }}>
                  1. Information We Collect
                </h3>
                <p className="leading-relaxed opacity-90 mb-3" style={{ color: theme.primary }}>
                  We collect minimal information to provide our service:
                </p>
                <ul className="list-disc ml-6 space-y-2 opacity-90" style={{ color: theme.primary }}>
                  <li><strong>Code snippets:</strong> The content you create and share</li>
                  <li><strong>Usage data:</strong> Basic analytics about how the service is used</li>
                  <li><strong>Technical data:</strong> IP addresses, browser information for security and functionality</li>
                  <li><strong>No personal accounts:</strong> We don't require registration or collect personal information</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3" style={{ color: theme.primary }}>
                  2. How We Use Information
                </h3>
                <p className="leading-relaxed opacity-90 mb-3" style={{ color: theme.primary }}>
                  We use collected information to:
                </p>
                <ul className="list-disc ml-6 space-y-2 opacity-90" style={{ color: theme.primary }}>
                  <li>Provide and improve our code sharing service</li>
                  <li>Ensure security and prevent abuse</li>
                  <li>Analyze usage patterns to enhance user experience</li>
                  <li>Comply with legal requirements when necessary</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3" style={{ color: theme.primary }}>
                  3. Data Sharing
                </h3>
                <p className="leading-relaxed opacity-90" style={{ color: theme.primary }}>
                  We do not sell or rent your information to third parties. Public code snippets are 
                  visible to all users by design. We may share data only when required by law or to 
                  protect our service and users.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3" style={{ color: theme.primary }}>
                  4. Data Security
                </h3>
                <p className="leading-relaxed opacity-90" style={{ color: theme.primary }}>
                  We implement reasonable security measures to protect your data. However, no online 
                  service is completely secure. You share content at your own risk.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3" style={{ color: theme.primary }}>
                  5. Data Retention
                </h3>
                <p className="leading-relaxed opacity-90" style={{ color: theme.primary }}>
                  Public snippets remain available unless deleted. We retain usage data for as long as 
                  necessary to provide our service and may anonymize data for analytical purposes.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3" style={{ color: theme.primary }}>
                  6. Cookies and Tracking
                </h3>
                <p className="leading-relaxed opacity-90" style={{ color: theme.primary }}>
                  We use minimal cookies for essential functionality (theme preferences, session management). 
                  We may use anonymous analytics to understand usage patterns and improve our service.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3" style={{ color: theme.primary }}>
                  7. Your Rights
                </h3>
                <p className="leading-relaxed opacity-90 mb-3" style={{ color: theme.primary }}>
                  You have the right to:
                </p>
                <ul className="list-disc ml-6 space-y-2 opacity-90" style={{ color: theme.primary }}>
                  <li>Access and control your public snippets</li>
                  <li>Request deletion of your content (where technically feasible)</li>
                  <li>Opt out of non-essential cookies</li>
                  <li>Contact us about privacy concerns</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 
              className="text-2xl md:text-3xl font-bold mb-6"
              style={{ 
                color: theme.primary,
                fontFamily: 'var(--font-krona-one)'
              }}
            >
              Contact Us
            </h2>
            <div className="space-y-4">
              <p className="leading-relaxed opacity-90" style={{ color: theme.primary }}>
                If you have questions about these terms or our privacy practices, please contact us:
              </p>
              <div className="space-y-2 opacity-90" style={{ color: theme.primary }}>
                <p><strong>GitHub:</strong> <a href="https://github.com/Yulkazs/duckbin" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-70">github.com/Yulkazs/duckbin</a></p>
                <p><strong>Support:</strong> Create an issue on our GitHub repository</p>
              </div>
            </div>
          </section>

          {/* Legal */}
          <section className="border-t pt-8" style={{ borderColor: theme.primary + '20' }}>
            <div className="text-sm opacity-60" style={{ color: theme.primary }}>
              <p className="mb-2">
                These terms constitute the entire agreement between you and duckbin regarding use of the service.
              </p>
              <p>
                If any provision is found unenforceable, the remaining provisions will remain in effect.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
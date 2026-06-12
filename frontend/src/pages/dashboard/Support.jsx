import { useState } from 'react';
import SectionCard from '../../components/profile/SectionCard';
import EmptyStateCard from '../../components/ui/EmptyState';
import PageTransition from '../../components/animations/PageTransition';

const QUICK_ACTIONS = [
  { label: 'Documentation', description: 'Browse full API references, guides, and integration tutorials.', accent: 'amber', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.483 9.246 5 7.5 5S4.168 5.483 3 6.253v13C4.168 18.483 5.754 18 7.5 18s3.332.483 4.5 1.253m0-13C13.168 5.483 14.754 5 16.5 5s3.332.483 4.5 1.253v13C19.832 18.483 18.246 18 16.5 18s-3.332.483-4.5 1.253" />
</svg>},
  { label: 'Security Guide', description: 'Learn best practices for securing your account and sessions.', accent: 'emerald', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M12 3l7.5 4.5v4.75c0 5.25-3.438 8.812-7.5 9.75-4.062-.938-7.5-4.5-7.5-9.75V7.5L12 3z" />
</svg>},
  { label: 'Report Issue', description: 'Found a bug or unexpected behaviour? Let our team know.', accent: 'rose', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.007v.008H12v-.008zm9-4.5a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>},
  { label: 'Contact Support', description: 'Reach our team directly for account or billing questions.', accent: 'blue', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12a9.75 9.75 0 1119.5 0v1.125a2.625 2.625 0 01-2.625 2.625H18a1.5 1.5 0 01-1.5-1.5v-3A1.5 1.5 0 0118 9.75h2.858A9.752 9.752 0 0012 2.25 9.752 9.752 0 003.142 9.75H6a1.5 1.5 0 011.5 1.5v3A1.5 1.5 0 016 15.75H4.875A2.625 2.625 0 012.25 13.125V12z" />
</svg>},
];

const ACCENT_STYLES = {
  amber: { card: 'bg-amber-400/8 border-amber-400/15', icon: 'bg-amber-400/10 border-amber-400/20 text-amber-400', text: 'text-amber-400' },
  emerald: { card: 'bg-emerald-400/8 border-emerald-400/15', icon: 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400', text: 'text-emerald-400' },
  rose: { card: 'bg-rose-400/8 border-rose-400/15', icon: 'bg-rose-400/10 border-rose-400/20 text-rose-400', text: 'text-rose-400' },
  blue: { card: 'bg-sky-400/8 border-sky-400/15', icon: 'bg-sky-400/10 border-sky-400/20 text-sky-300', text: 'text-sky-200' },
};

const FAQS = [
  { question: 'How do I verify my email?', answer: 'After registration, a verification email is sent to your address. Click the link inside to confirm your account. If you did not receive it, visit your Profile page and use the resend verification option.' },
  { question: 'How do I change my password?', answer: 'Navigate to Profile, then use the Change Password section. Enter your current password and a new password that meets the security requirements.' },
  { question: 'How do sessions work?', answer: 'Each login creates a session backed by a secure JWT access token and an httpOnly refresh token cookie. Your access token lives in memory only, never in localStorage.' },
  { question: 'How can I secure my account?', answer: 'Verify your email, use a strong unique password, review active sessions regularly, and watch for the Two-Factor Authentication feature coming soon.' },
  { question: 'What happens if I forget my password?', answer: 'From the login page, choose Forgot password and submit your email address. A reset link will be sent to you and expires after one hour.' },
];

function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className="border-b border-obsidian-800/40 last:border-0">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="group flex min-h-[44px] w-full items-center justify-between gap-4 py-4 text-left transition-colors duration-150"
      >
        <span className={`text-sm font-medium font-body transition-colors duration-150 ${isOpen ? 'text-amber-400' : 'text-ivory-200 group-hover:text-ivory-100'}`}>{question}</span>
        <span className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${isOpen ? 'rotate-180 border-amber-400/40 bg-amber-400/10' : 'border-obsidian-600 bg-obsidian-800'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 ${isOpen ? 'text-amber-400' : 'text-ivory-400/50'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-96 pb-4' : 'max-h-0'}`}>
        <p className="text-sm font-body leading-relaxed text-ivory-400/70">{answer}</p>
      </div>
    </div>
  );
}

function StatusRow({ label, value, status }) {
  const dotColor = status === 'operational' ? 'bg-emerald-400' : status === 'degraded' ? 'bg-amber-400' : 'bg-rose-400';
  return (
    <div className="flex flex-col gap-0.5 border-b border-obsidian-800/40 py-3 last:border-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <span className="flex-shrink-0 text-xs font-mono uppercase tracking-wider text-ivory-400/50">{label}</span>
      <div className="flex items-center gap-2">
        {status && <span className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${dotColor}`} />}
        <span className="text-sm font-body text-ivory-200">{value}</span>
      </div>
    </div>
  );
}

function QuickActionCard({ label, description, icon, accent }) {
  const a = ACCENT_STYLES[accent];
  return (
    <div className={`flex h-full flex-col gap-3 rounded-xl border p-4 sm:p-5 ${a.card}`}>
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg border flex-shrink-0 ${a.icon}`}>{icon}</div>
      <div className="min-w-0 flex-1">
        <p className={`mb-1 text-sm font-display font-semibold leading-tight ${a.text}`}>{label}</p>
        <p className="line-clamp-2 text-xs font-body leading-relaxed text-ivory-400/50">{description}</p>
      </div>
      <button
        disabled
        aria-disabled="true"
        className="min-h-[36px] w-full cursor-not-allowed rounded-lg border border-obsidian-700/60 bg-obsidian-800/60 px-3 py-2.5 text-xs font-display font-semibold tracking-wide text-ivory-400/30 opacity-60"
      >
        Coming Soon
      </button>
    </div>
  );
}

export default function Support() {
  const [openFAQ, setOpenFAQ] = useState(null);

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl space-y-5 p-4 sm:space-y-6 sm:p-6 md:p-8">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-ivory-400/30">Dashboard</span>
            <span className="text-xs text-ivory-400/20">/</span>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400/60">Help &amp; Support</span>
        </div>
        <h1 className="font-display text-xl font-bold text-ivory-100">Help &amp; Support</h1>
        <p className="mt-0.5 text-sm font-body text-ivory-400/50">Find answers, contact support, and learn more about Authify.</p>
      </div>

      <SectionCard
        title="Quick actions"
        description="Common support resources and channels."
        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_ACTIONS.map((action) => <QuickActionCard key={action.label} {...action} />)}
        </div>
      </SectionCard>

      <SectionCard
        title="Frequently asked questions"
        description="Answers to common questions about your account and Authify."
        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>}
      >
        <div>
          {FAQS.map((faq, index) => (
            <FAQItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              isOpen={openFAQ === index}
              onToggle={() => setOpenFAQ((prev) => (prev === index ? null : index))}
            />
          ))}
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 items-stretch gap-5 sm:gap-6 lg:grid-cols-2">
        <SectionCard
          title="Support status"
          description="Current availability and system health."
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        >
          <div>
            <StatusRow label="Support availability" value="Mon - Fri, 9 AM - 6 PM UTC" />
            <StatusRow label="Response time" value="24 - 48 hours" />
            <StatusRow label="System status" value="Operational" status="operational" />
            <StatusRow label="API status" value="Operational" status="operational" />
          </div>
        </SectionCard>

        <SectionCard
          title="Feature requests"
          description="Have an idea? We'd love to hear it."
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>}
        >
          <EmptyStateCard
            accent="blue"
            title="Support resources coming soon."
            description="Documentation and ticket support will be available in a future release."
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" /></svg>}
          />
        </SectionCard>
      </div>
    </div>
  </PageTransition>  
  );
}

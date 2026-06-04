import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/Button';
import { APP_ROUTES } from '../utils/constants';

const features = [
  {
    title: 'JWT + Refresh Tokens',
    description: 'Stateless access tokens with secure httpOnly cookie refresh rotation. Industry-standard session lifecycle.',
    icon: '⟲',
  },
  {
    title: 'Role-Based Access',
    description: 'Fine-grained RBAC with protected routes for users, moderators, and administrators out of the box.',
    icon: '◈',
  },
  {
    title: 'Rate Limiting',
    description: 'Built-in protection against brute-force attacks. Configurable per endpoint.',
    icon: '⊘',
  },
  {
    title: 'Token Rotation',
    description: 'Every refresh issues a new refresh token and invalidates the old one. Replay attacks are neutralised.',
    icon: '↻',
  },
  {
    title: 'Password Reset',
    description: 'Secure email-based reset flow with time-limited signed tokens. No security theatre.',
    icon: '✦',
  },
  {
    title: 'Future-Ready',
    description: 'Architected for OAuth, MFA, device management, audit logs and session history — without rewrites.',
    icon: '◎',
  },
];

const securityPillars = [
  { label: 'httpOnly Cookies', desc: 'Refresh token inaccessible to JS' },
  { label: 'Memory-only Token', desc: 'Access token never touches storage' },
  { label: 'Refresh Queue', desc: 'Single concurrent refresh per session' },
  { label: 'Silent Restore', desc: 'Session recovered on page load' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-obsidian-950">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-16 grid-bg overflow-hidden">
        {/* Glow orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-400/4 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-amber-400/3 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-400/20 bg-amber-400/5 mb-8 animate-fade-in">
            <span className="accent-dot" />
            <span className="text-xs font-mono text-amber-400 tracking-wider uppercase">Production-Grade Auth</span>
          </div>

          {/* Heading */}
          <h1
            className="font-display text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-6 opacity-0-start animate-slide-up"
            style={{ animationFillMode: 'forwards', animationDelay: '100ms' }}
          >
            Authentication
            <br />
            <span className="text-gradient">done right.</span>
          </h1>

          <p
            className="text-ivory-400 text-lg md:text-xl font-body font-light leading-relaxed max-w-xl mx-auto mb-10 opacity-0-start animate-slide-up"
            style={{ animationFillMode: 'forwards', animationDelay: '200ms' }}
          >
            Secure, scalable, production-grade authentication frontend.
            JWT rotation, RBAC, silent session restore — built the way it should be.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0-start animate-slide-up"
            style={{ animationFillMode: 'forwards', animationDelay: '300ms' }}
          >
            <Link to={APP_ROUTES.REGISTER}>
              <Button size="lg" variant="primary" className="shadow-glow-amber">
                Start for free →
              </Button>
            </Link>
            <Link to={APP_ROUTES.LOGIN}>
              <Button size="lg" variant="secondary">
                Sign in
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-xs font-mono text-ivory-400 tracking-wider">scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-ivory-400 to-transparent" />
        </div>
      </section>

      {/* Security pillars */}
      <section id="security" className="py-24 px-6 border-t border-obsidian-800/40">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-mono text-ivory-400/40 uppercase tracking-widest mb-12">
            Security Architecture
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {securityPillars.map((p, i) => (
              <div
                key={p.label}
                className="glass-card rounded-xl p-5 text-center"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <p className="font-display font-semibold text-ivory-100 text-sm mb-1">{p.label}</p>
                <p className="text-xs text-ivory-400/60 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-ivory-100 mb-4">
              Everything included.
            </h2>
            <p className="text-ivory-400 font-body max-w-lg mx-auto">
              All the hard parts of auth, implemented correctly. So you can focus on building your product.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="glass-card rounded-xl p-6 hover:border-obsidian-600 transition-colors group"
              >
                <div className="text-2xl mb-4 font-mono text-amber-400/70 group-hover:text-amber-400 transition-colors">
                  {f.icon}
                </div>
                <h3 className="font-display font-semibold text-ivory-100 mb-2">{f.title}</h3>
                <p className="text-sm text-ivory-400/70 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="py-24 px-6 border-t border-obsidian-800/40">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass-card rounded-2xl p-12 shadow-glow-amber">
            <h2 className="font-display text-3xl font-bold text-ivory-100 mb-4">
              Ready to ship?
            </h2>
            <p className="text-ivory-400 mb-8 font-body">
              Get started with a secure account in seconds.
            </p>
            <Link to={APP_ROUTES.REGISTER}>
              <Button size="lg" variant="primary" className="shadow-glow-amber">
                Create your account →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-obsidian-800/40 py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-amber-400 rounded-md flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-obsidian-950" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="font-display font-bold text-ivory-100 tracking-tight text-sm">Authify</span>
          </div>
          <p className="text-xs text-ivory-400/30 font-body">
            © {new Date().getFullYear()} Authify. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

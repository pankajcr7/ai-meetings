'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useInView,
  animate,
  AnimatePresence,
} from 'framer-motion';
import {
  Mic,
  FileText,
  ListChecks,
  ArrowRight,
  Upload,
  Sparkles,
  Zap,
  Check,
  Menu,
  X,
  Star,
  Play,
  Clock,
  Users,
  Shield,
  BarChart3,
  ChevronDown,
} from 'lucide-react';

/* ═══════════════════ ANIMATED COUNTER ═══════════════════ */

function Counter({ target, suffix = '' }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const val = useMotionValue(0);

  useEffect(() => {
    if (!inView) return;
    const c = animate(val, target, {
      duration: 2,
      ease: [0.22, 0.61, 0.36, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = Math.floor(v).toLocaleString() + suffix;
      },
    });
    return c.stop;
  }, [inView, val, target, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

/* ═══════════════════ WAVEFORM VISUALIZER ═══════════════════ */

function Waveform() {
  return (
    <div className="flex items-center gap-[3px] h-8">
      {Array.from({ length: 24 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-gradient-to-t from-orange-500 to-amber-400"
          animate={{
            height: [12, Math.random() * 28 + 8, 12],
          }}
          transition={{
            duration: 0.8 + Math.random() * 0.4,
            repeat: Infinity,
            delay: i * 0.05,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════ LIVE DEMO MOCKUP ═══════════════════ */

function LiveDemo() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ['Transcript', 'Summary', 'Actions'];

  return (
    <motion.div
      className="relative w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {/* Outer glow */}
      <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/10 via-rose-500/5 to-violet-500/10 rounded-3xl blur-2xl" />

      <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0e0e14]">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/70" />
              <div className="w-3 h-3 rounded-full bg-amber-500/70" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
            </div>
            <div className="h-4 w-px bg-white/10" />
            <span className="text-[11px] text-slate-500 font-medium">Sprint Planning — Live</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-rose-500/10 border border-rose-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-[10px] text-rose-400 font-semibold">REC 23:47</span>
            </div>
          </div>
        </div>

        {/* Waveform bar */}
        <div className="px-5 py-3 border-b border-white/[0.04] bg-white/[0.01] flex items-center justify-between">
          <Waveform />
          <div className="flex items-center gap-2 ml-4">
            <span className="text-[10px] text-slate-600">3 speakers detected</span>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex px-5 pt-3 gap-1 border-b border-white/[0.04]">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2 text-[12px] font-medium rounded-t-lg transition-all duration-200 relative ${
                activeTab === i
                  ? 'text-orange-400 bg-orange-500/[0.06]'
                  : 'text-slate-500 hover:text-slate-400'
              }`}
            >
              {tab}
              {activeTab === i && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-orange-500 to-amber-500"
                  layoutId="tab-indicator"
                />
              )}
            </button>
          ))}
        </div>

        {/* Content area */}
        <div className="p-5 min-h-[220px] md:min-h-[260px]">
          <AnimatePresence mode="wait">
            {activeTab === 0 && (
              <motion.div
                key="transcript"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                {[
                  { name: 'Sarah', color: 'bg-orange-500', textColor: 'text-orange-400', msg: "Let's prioritize the checkout flow redesign. Conversion dropped 12% this month." },
                  { name: 'David', color: 'bg-cyan-500', textColor: 'text-cyan-400', msg: "Agreed. I can have a prototype ready by Wednesday if we freeze the API spec today." },
                  { name: 'Maya', color: 'bg-violet-500', textColor: 'text-violet-400', msg: "I'll run user testing on the current flow today and share findings before EOD." },
                  { name: 'Sarah', color: 'bg-orange-500', textColor: 'text-orange-400', msg: "Perfect. Let's also loop in the analytics team for funnel data." },
                ].map((line, i) => (
                  <motion.div
                    key={i}
                    className="flex gap-3"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.15 }}
                  >
                    <div className={`w-7 h-7 rounded-full ${line.color} flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5`}>
                      {line.name[0]}
                    </div>
                    <div>
                      <span className={`text-[11px] font-semibold ${line.textColor}`}>{line.name}</span>
                      <p className="text-[12px] text-slate-400 leading-relaxed mt-0.5">{line.msg}</p>
                    </div>
                  </motion.div>
                ))}
                {/* Typing indicator */}
                <div className="flex items-center gap-2 text-[11px] text-slate-600 pl-10">
                  <span className="animate-typewriter-cursor">|</span> Transcribing live...
                </div>
              </motion.div>
            )}

            {activeTab === 1 && (
              <motion.div
                key="summary"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <div className="rounded-xl bg-gradient-to-br from-orange-500/[0.06] to-amber-500/[0.03] border border-orange-500/10 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                    <span className="text-[11px] font-semibold text-orange-400">AI Summary</span>
                  </div>
                  <p className="text-[12px] text-slate-300 leading-relaxed">
                    Team discussed checkout flow conversion drop (12% decline). David will create a prototype by Wednesday pending API spec freeze. Maya will conduct user testing today and share findings. Analytics team to be involved for funnel data analysis.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Duration', value: '23 min', icon: Clock },
                    { label: 'Speakers', value: '3', icon: Users },
                    { label: 'Topics', value: '4', icon: BarChart3 },
                  ].map((s) => (
                    <div key={s.label} className="rounded-lg bg-white/[0.02] border border-white/[0.05] p-3 text-center">
                      <s.icon className="w-3.5 h-3.5 text-slate-500 mx-auto mb-1" />
                      <div className="text-[13px] font-semibold text-white">{s.value}</div>
                      <div className="text-[10px] text-slate-500">{s.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 2 && (
              <motion.div
                key="actions"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-3"
              >
                {[
                  { task: 'Create checkout flow prototype', owner: 'David', due: 'Wed, Mar 25', priority: 'High', pColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
                  { task: 'Run user testing on current flow', owner: 'Maya', due: 'Today', priority: 'High', pColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
                  { task: 'Freeze API spec for checkout', owner: 'Sarah', due: 'Today', priority: 'Critical', pColor: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
                  { task: 'Request funnel data from analytics', owner: 'Sarah', due: 'Tomorrow', priority: 'Medium', pColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] transition-colors group"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="w-4 h-4 rounded border-2 border-white/10 group-hover:border-orange-500/40 transition-colors shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] text-slate-200 font-medium truncate">{item.task}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-500">{item.owner}</span>
                        <span className="text-[10px] text-slate-600">&middot;</span>
                        <span className="text-[10px] text-slate-500">{item.due}</span>
                      </div>
                    </div>
                    <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${item.pColor}`}>
                      {item.priority}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════ DATA ═══════════════════ */

const features = [
  {
    icon: Mic,
    title: 'Live Recording & Upload',
    desc: 'Record meetings directly in-browser or upload audio files. Supports MP3, WAV, WebM, and 20+ formats.',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    borderHover: 'hover:border-orange-500/20',
    span: 'md:col-span-2 md:row-span-1',
  },
  {
    icon: FileText,
    title: 'Smart Summaries',
    desc: 'AI distills your meeting into key decisions, discussion points, and outcomes.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    borderHover: 'hover:border-cyan-500/20',
    span: '',
  },
  {
    icon: ListChecks,
    title: 'Action Extraction',
    desc: 'Every task, assignee, and deadline is automatically extracted. Nothing falls through the cracks.',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    borderHover: 'hover:border-violet-500/20',
    span: '',
  },
  {
    icon: Zap,
    title: 'Integrations That Work',
    desc: 'Push action items to Slack, Notion, Asana, and Linear. Your workflow stays connected.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    borderHover: 'hover:border-emerald-500/20',
    span: 'md:col-span-2 md:row-span-1',
  },
];

const stats = [
  { value: 10000, suffix: '+', label: 'Meetings processed' },
  { value: 500, suffix: '+', label: 'Teams worldwide' },
  { value: 50000, suffix: '+', label: 'Actions tracked' },
  { value: 99, suffix: '%', label: 'Accuracy rate' },
];

const testimonials = [
  {
    quote: "This replaced our entire note-taking workflow. The accuracy of action item extraction is remarkable — better than any human note-taker.",
    name: 'Priya Sharma',
    role: 'Engineering Manager',
    company: 'Series B Startup',
    avatar: 'PS',
    gradient: 'from-orange-500 to-rose-500',
  },
  {
    quote: "We went from losing 40% of follow-ups to tracking everything. The Slack integration is seamless — action items just appear.",
    name: 'Marcus Webb',
    role: 'Head of Product',
    company: 'SaaS Platform',
    avatar: 'MW',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    quote: "Setup took 3 minutes. First meeting summary blew the team away. Now every team in our company uses it daily.",
    name: 'Elena Torres',
    role: 'COO',
    company: 'Design Studio',
    avatar: 'ET',
    gradient: 'from-violet-500 to-purple-500',
  },
];

const plans = [
  {
    name: 'Free',
    price: '$0',
    desc: 'Try it with your team',
    features: ['5 meetings/month', 'Transcription & summaries', 'Basic action items', 'Email export'],
    cta: 'Start Free',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/mo',
    desc: 'For teams that ship fast',
    features: ['Unlimited meetings', 'Speaker identification', 'Smart action extraction', 'Slack, Notion, Asana sync', 'Team workspaces', 'Priority support'],
    cta: 'Start Free Trial',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    desc: 'For scaling organizations',
    features: ['Everything in Pro', 'SSO & SAML', 'Custom integrations', 'Dedicated account manager', '99.9% SLA', 'On-premise deployment'],
    cta: 'Talk to Sales',
    highlight: false,
  },
];

const logos = ['Stripe', 'Notion', 'Linear', 'Figma', 'Vercel', 'Slack', 'Zoom', 'Asana', 'Google', 'Microsoft'];

/* ═══════════════════ MAIN PAGE ═══════════════════ */

export default function LandingPage() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.97]);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#08080f] text-white overflow-x-hidden selection:bg-orange-500/20">

      {/* ═══ NAV ═══ */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        navScrolled
          ? 'bg-[#08080f]/80 backdrop-blur-2xl border-b border-white/[0.04] py-3'
          : 'bg-transparent py-5'
      }`}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-rose-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Mic className="w-4 h-4 text-white" />
            </div>
            <span className="text-[17px] font-bold tracking-tight">meetflow</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {['Features', 'How it Works', 'Pricing'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-[13px] text-slate-400 hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-[13px] text-slate-400 hover:text-white transition-colors hidden sm:block">
              Log in
            </Link>
            <Link href="/signup" className="group inline-flex items-center gap-2 text-[13px] font-semibold px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-400 hover:to-rose-400 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all duration-300">
              Get Started
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setMobileMenu(!mobileMenu)}>
              {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden border-t border-white/[0.04] bg-[#08080f]/95 backdrop-blur-xl"
            >
              <div className="px-6 py-4 space-y-3">
                {['Features', 'How it Works', 'Pricing'].map((item) => (
                  <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="block text-sm text-slate-400 hover:text-white py-1"
                    onClick={() => setMobileMenu(false)}>
                    {item}
                  </a>
                ))}
                <Link href="/login" className="block text-sm text-slate-400 hover:text-white py-1" onClick={() => setMobileMenu(false)}>
                  Log in
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main>
        {/* ═══ HERO ═══ */}
        <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-12 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-[#08080f]" />
          <div className="absolute inset-0 bg-grid opacity-30" />

          {/* Mesh gradients */}
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-orange-600/[0.07] blur-[120px] animate-mesh-1" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-rose-600/[0.05] blur-[120px] animate-mesh-2" />
          <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] rounded-full bg-violet-600/[0.04] blur-[120px] animate-mesh-3" />

          {/* Radial fade */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-5%,rgba(251,146,60,0.08),transparent_60%)]" />

          <motion.div
            className="relative z-10 text-center px-6 max-w-4xl mx-auto"
            style={{ opacity: heroOpacity, scale: heroScale }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[12px] font-medium bg-white/[0.04] border border-white/[0.08] text-slate-300">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-orange-400 opacity-60" />
                  <span className="relative rounded-full h-2 w-2 bg-orange-400" />
                </span>
                Now with real-time transcription
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="text-[3rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5rem] font-extrabold tracking-[-0.04em] leading-[1.05] mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <span className="text-white">Meetings that</span>
              <br />
              <span className="bg-gradient-to-r from-orange-400 via-rose-400 to-violet-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-x">
                actually lead
              </span>{' '}
              <span className="text-white">to</span>
              <br />
              <span className="text-white">action.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-[15px] md:text-lg text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              Record any meeting. Get transcripts, summaries, and action items
              with owners and deadlines — automatically.
            </motion.p>

            {/* CTA Row */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              <Link href="/signup" className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-400 hover:to-rose-400 shadow-xl shadow-orange-500/20 hover:shadow-orange-500/30 transition-all duration-300">
                Start Free — No Card Required
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link href="#how-it-works" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-medium text-slate-300 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.06] hover:border-white/[0.1] transition-all duration-300">
                <Play className="w-3.5 h-3.5" />
                See How It Works
              </Link>
            </motion.div>

            <motion.div
              className="flex items-center justify-center gap-6 text-[12px] text-slate-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <span className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-500" /> Free forever plan</span>
              <span className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-500" /> 2-minute setup</span>
              <span className="hidden sm:flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-500" /> No credit card</span>
            </motion.div>
          </motion.div>

          {/* Live Demo */}
          <div className="relative z-10 w-full max-w-3xl mx-auto px-6 mt-16">
            <LiveDemo />
          </div>

          <div className="h-8" />
        </section>

        {/* ═══ LOGO BAR ═══ */}
        <section className="relative py-12 border-t border-white/[0.03]">
          <div className="max-w-6xl mx-auto px-6">
            <p className="text-center text-[10px] uppercase tracking-[0.25em] text-slate-600 font-medium mb-8">
              Trusted by teams at
            </p>
            <div className="relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#08080f] to-transparent z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#08080f] to-transparent z-10" />
              <div className="flex animate-marquee whitespace-nowrap">
                {[...logos, ...logos].map((n, i) => (
                  <span key={i} className="text-[15px] font-semibold text-slate-700/50 mx-8 select-none">{n}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ FEATURES BENTO GRID ═══ */}
        <section id="features" className="relative py-28 md:py-36">
          <div className="absolute inset-0 bg-dots opacity-30" />
          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <motion.div
              className="max-w-2xl mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-[11px] font-bold text-orange-400 uppercase tracking-[0.2em]">Features</span>
              <h2 className="text-3xl md:text-[2.75rem] font-bold tracking-[-0.02em] mt-3 mb-4 leading-tight">
                Every meeting, <br className="hidden md:block" />
                <span className="text-slate-400">fully organized.</span>
              </h2>
              <p className="text-slate-400 text-[15px] leading-relaxed">
                From the first word spoken to the last action item tracked — we cover the entire meeting lifecycle.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-4">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  className={f.span}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <div className={`group h-full rounded-2xl bg-white/[0.02] border border-white/[0.05] ${f.borderHover} p-7 transition-all duration-500 hover:bg-white/[0.03]`}>
                    <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center mb-5`}>
                      <f.icon className={`w-5 h-5 ${f.color}`} />
                    </div>
                    <h3 className="text-[17px] font-semibold tracking-tight mb-2">{f.title}</h3>
                    <p className="text-[13px] text-slate-400 leading-relaxed">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ HOW IT WORKS ═══ */}
        <section id="how-it-works" className="relative py-28 md:py-36 border-t border-white/[0.03]">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              className="text-center max-w-2xl mx-auto mb-20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.2em]">How It Works</span>
              <h2 className="text-3xl md:text-[2.75rem] font-bold tracking-[-0.02em] mt-3 mb-4">
                Three steps. Zero effort.
              </h2>
              <p className="text-slate-400 text-[15px]">
                Go from raw audio to organized, actionable outcomes in minutes.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connector line */}
              <div className="hidden md:block absolute top-[60px] left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

              {[
                { num: '01', icon: Upload, title: 'Upload or Record', desc: 'Drop audio or hit record. We support 20+ audio formats out of the box.', color: 'text-orange-400', bg: 'bg-orange-500/10', ring: 'ring-orange-500/20' },
                { num: '02', icon: Sparkles, title: 'AI Processes', desc: 'Transcription, speaker ID, summary, and action extraction — all automatic.', color: 'text-cyan-400', bg: 'bg-cyan-500/10', ring: 'ring-cyan-500/20' },
                { num: '03', icon: Zap, title: 'Review & Act', desc: 'Review results, assign tasks, and push to Slack, Notion, or Asana.', color: 'text-violet-400', bg: 'bg-violet-500/10', ring: 'ring-violet-500/20' },
              ].map((step, i) => (
                <motion.div
                  key={step.num}
                  className="relative text-center"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                >
                  <div className="inline-flex flex-col items-center">
                    <div className={`relative w-[72px] h-[72px] rounded-2xl ${step.bg} ring-1 ${step.ring} flex items-center justify-center mb-6`}>
                      <step.icon className={`w-7 h-7 ${step.color}`} />
                      <span className="absolute -top-2.5 -right-2.5 text-[10px] font-bold text-white bg-gradient-to-br from-orange-500 to-rose-500 rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                        {step.num}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold tracking-tight mb-2">{step.title}</h3>
                    <p className="text-[13px] text-slate-400 leading-relaxed max-w-[260px]">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ STATS ═══ */}
        <section className="relative py-20 border-y border-white/[0.03]">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/[0.02] via-rose-500/[0.02] to-violet-500/[0.02]" />
          <div className="max-w-5xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                >
                  <div className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-1">
                    <Counter target={s.value} suffix={s.suffix} />
                  </div>
                  <p className="text-[12px] text-slate-500 font-medium">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ TESTIMONIALS ═══ */}
        <section className="relative py-28 md:py-36">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              className="text-center max-w-2xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-[11px] font-bold text-rose-400 uppercase tracking-[0.2em]">Testimonials</span>
              <h2 className="text-3xl md:text-[2.75rem] font-bold tracking-[-0.02em] mt-3 mb-4">
                Teams love it.
              </h2>
              <p className="text-slate-400 text-[15px]">
                Here&apos;s what teams say after switching to AI Meeting.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-5">
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.name}
                  className="rounded-2xl bg-white/[0.02] border border-white/[0.05] p-7 flex flex-col hover:border-white/[0.08] transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-orange-400 text-orange-400" />
                    ))}
                  </div>
                  <p className="text-[14px] text-slate-300 leading-relaxed flex-1 mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-5 border-t border-white/[0.04]">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-[11px] font-bold text-white`}>
                      {t.avatar}
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-white">{t.name}</div>
                      <div className="text-[11px] text-slate-500">{t.role} &middot; {t.company}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ PRICING ═══ */}
        <section id="pricing" className="relative py-28 md:py-36 border-t border-white/[0.03]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(251,146,60,0.03),transparent)]" />
          <div className="max-w-5xl mx-auto px-6 relative z-10">
            <motion.div
              className="text-center max-w-2xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-[0.2em]">Pricing</span>
              <h2 className="text-3xl md:text-[2.75rem] font-bold tracking-[-0.02em] mt-3 mb-4">
                Simple, honest pricing.
              </h2>
              <p className="text-slate-400 text-[15px]">
                Start free. Upgrade when you&apos;re ready. No surprise charges.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-5">
              {plans.map((plan, i) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <div className={`relative h-full rounded-2xl p-7 flex flex-col transition-all duration-300 ${
                    plan.highlight
                      ? 'bg-gradient-to-b from-orange-500/[0.06] to-rose-500/[0.02] border-2 border-orange-500/20 shadow-2xl shadow-orange-500/[0.05]'
                      : 'bg-white/[0.02] border border-white/[0.05]'
                  }`}>
                    {plan.highlight && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                        <span className="text-[10px] font-bold text-white bg-gradient-to-r from-orange-500 to-rose-500 px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg shadow-orange-500/30">
                          Most Popular
                        </span>
                      </div>
                    )}

                    <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
                    <p className="text-[12px] text-slate-500 mb-4">{plan.desc}</p>
                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-3xl font-bold tracking-tight">{plan.price}</span>
                      {plan.period && <span className="text-sm text-slate-500">{plan.period}</span>}
                    </div>

                    <ul className="space-y-3 mb-8 flex-1">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-[13px] text-slate-300">
                          <Check className={`w-4 h-4 shrink-0 mt-0.5 ${plan.highlight ? 'text-orange-400' : 'text-slate-500'}`} />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <Link
                      href="/signup"
                      className={`block text-center text-[13px] font-semibold py-3 rounded-full transition-all duration-200 ${
                        plan.highlight
                          ? 'bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-400 hover:to-rose-400 text-white shadow-lg shadow-orange-500/20'
                          : 'bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.06] hover:border-white/[0.1]'
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ FINAL CTA ═══ */}
        <section className="relative py-28 md:py-36">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              className="relative text-center rounded-3xl overflow-hidden p-12 md:p-20"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7 }}
            >
              {/* Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-950/40 via-[#0e0e14] to-rose-950/30" />
              <div className="absolute inset-0 bg-grid opacity-20" />
              <div className="absolute inset-[0] rounded-3xl border border-white/[0.06]" />

              {/* Glow blobs */}
              <div className="absolute top-0 left-1/3 w-72 h-72 bg-orange-500/[0.08] rounded-full blur-[100px]" />
              <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-rose-500/[0.06] rounded-full blur-[100px]" />

              <div className="relative z-10">
                <h2 className="text-3xl md:text-[2.75rem] font-bold tracking-[-0.02em] mb-4 leading-tight">
                  Stop losing action items.
                  <br />
                  <span className="bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent">
                    Start shipping outcomes.
                  </span>
                </h2>
                <p className="text-slate-400 text-[15px] max-w-md mx-auto mb-8">
                  Join hundreds of teams who&apos;ve transformed their meetings. Free forever plan, instant setup.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link href="/signup" className="group inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-400 hover:to-rose-400 shadow-xl shadow-orange-500/20 transition-all duration-300">
                    Get Started Free
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <Link href="/login" className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-medium text-slate-300 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.06] transition-all duration-300">
                    Sign in
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-white/[0.04] pt-16 pb-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-rose-600 flex items-center justify-center">
                  <Mic className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-bold text-base">meetflow</span>
              </Link>
              <p className="text-[13px] text-slate-500 leading-relaxed max-w-[260px] mb-4">
                AI-powered meeting recorder & action tracker for teams that move fast.
              </p>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-soft" />
                <span className="text-[11px] text-slate-600">All systems operational</span>
              </div>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Integrations', 'Pricing', 'Changelog'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'GDPR'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-[13px] text-slate-500 hover:text-slate-300 transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/[0.04]">
            <p className="text-[11px] text-slate-600">
              &copy; {new Date().getFullYear()} meetflow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

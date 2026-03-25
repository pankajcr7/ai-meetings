'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
  Globe,
  Lock,
  Headphones,
  MessageSquare,
  Brain,
  Workflow,
  ArrowUpRight,
  MousePointerClick,
} from 'lucide-react';

/* ═══════════════════ ANIMATED COUNTER ═══════════════════ */

function Counter({ target, suffix = '' }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const val = useMotionValue(0);

  useEffect(() => {
    if (!inView) return;
    const c = animate(val, target, {
      duration: 2.5,
      ease: [0.22, 0.61, 0.36, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = Math.floor(v).toLocaleString() + suffix;
      },
    });
    return c.stop;
  }, [inView, val, target, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

/* ═══════════════════ TYPING ANIMATION ═══════════════════ */

function TypingText({ words }: { words: string[] }) {
  const [currentWord, setCurrentWord] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[currentWord];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (currentChar < word.length) {
            setCurrentChar(currentChar + 1);
          } else {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          if (currentChar > 0) {
            setCurrentChar(currentChar - 1);
          } else {
            setIsDeleting(false);
            setCurrentWord((currentWord + 1) % words.length);
          }
        }
      },
      isDeleting ? 40 : 80
    );
    return () => clearTimeout(timeout);
  }, [currentChar, isDeleting, currentWord, words]);

  return (
    <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
      {words[currentWord].substring(0, currentChar)}
      <span className="text-indigo-500 animate-typewriter-cursor">|</span>
    </span>
  );
}

/* ═══════════════════ WAVEFORM VISUALIZER ═══════════════════ */

function Waveform() {
  return (
    <div className="flex items-center gap-[3px] h-8">
      {Array.from({ length: 28 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-gradient-to-t from-indigo-500 via-violet-500 to-purple-400"
          animate={{
            height: [12, Math.random() * 28 + 8, 12],
          }}
          transition={{
            duration: 0.8 + Math.random() * 0.4,
            repeat: Infinity,
            delay: i * 0.04,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════ FAQ ITEM ═══════════════════ */

function FAQItem({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300 hover:border-slate-300 bg-white">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between px-6 py-5 text-left"
      >
        <span className="text-[15px] font-semibold text-slate-800 pr-4">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-slate-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="px-6 pb-5 text-[14px] text-slate-500 leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
      <div className="absolute -inset-8 bg-gradient-to-r from-indigo-200/40 via-violet-200/30 to-purple-200/40 rounded-3xl blur-3xl" />

      <div className="relative rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-2xl shadow-slate-200/60">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            <div className="h-4 w-px bg-slate-200" />
            <span className="text-[11px] text-slate-500 font-medium">Sprint Planning — Live</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-[10px] text-rose-600 font-semibold tracking-wide">REC 23:47</span>
            </div>
          </div>
        </div>

        {/* Waveform bar */}
        <div className="px-5 py-3 border-b border-slate-100 bg-white flex items-center justify-between">
          <Waveform />
          <div className="flex items-center gap-2 ml-4">
            <div className="flex -space-x-1.5">
              {['bg-indigo-500', 'bg-violet-500', 'bg-purple-500'].map((c, i) => (
                <div key={i} className={`w-5 h-5 rounded-full ${c} border-2 border-white flex items-center justify-center text-[7px] font-bold text-white`}>
                  {['S', 'D', 'M'][i]}
                </div>
              ))}
            </div>
            <span className="text-[10px] text-slate-400">3 speakers</span>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex px-5 pt-3 gap-1 border-b border-slate-100">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2 text-[12px] font-medium rounded-t-lg transition-all duration-200 relative ${
                activeTab === i
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
              {activeTab === i && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-500"
                  layoutId="tab-indicator"
                />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="px-5 py-4 space-y-4 min-h-[260px] bg-white">
          {[
            { name: 'Sarah', initial: 'S', color: 'bg-indigo-500', text: "Let's prioritize the checkout flow redesign. Conversion dropped 12% this month." },
            { name: 'David', initial: 'D', color: 'bg-violet-500', text: "Agreed. I can have a prototype ready by Wednesday if we freeze the API spec today." },
            { name: 'Maya', initial: 'M', color: 'bg-purple-500', text: "I'll run user testing on the current flow today and share findings before EOD." },
            { name: 'Sarah', initial: 'S', color: 'bg-indigo-500', text: "Perfect. Let's also loop in the analytics team for funnel data." },
          ].map((msg, i) => (
            <motion.div
              key={i}
              className="flex gap-3"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.2, duration: 0.4 }}
            >
              <div className={`w-7 h-7 rounded-full ${msg.color} flex items-center justify-center text-[9px] font-bold text-white shrink-0 mt-0.5`}>
                {msg.initial}
              </div>
              <div>
                <span className={`text-[11px] font-semibold ${msg.color === 'bg-indigo-500' ? 'text-indigo-600' : msg.color === 'bg-violet-500' ? 'text-violet-600' : 'text-purple-600'}`}>{msg.name}</span>
                <p className="text-[13px] text-slate-600 leading-relaxed mt-0.5">{msg.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom status */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/60 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] text-slate-400">Transcribing live...</span>
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
    desc: 'Record meetings directly in-browser or upload audio files. Supports MP3, WAV, WebM, and 20+ formats with crystal-clear quality.',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    iconBg: 'bg-indigo-100',
  },
  {
    icon: Brain,
    title: 'AI-Powered Summaries',
    desc: 'Advanced AI distills your meeting into key decisions, discussion points, and outcomes in seconds.',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    iconBg: 'bg-violet-100',
  },
  {
    icon: ListChecks,
    title: 'Smart Action Extraction',
    desc: 'Every task, assignee, and deadline is automatically extracted. Nothing falls through the cracks.',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    iconBg: 'bg-purple-100',
  },
  {
    icon: Workflow,
    title: 'Seamless Integrations',
    desc: 'Push action items to Slack, Notion, Asana, and Linear. Your workflow stays perfectly connected.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    iconBg: 'bg-emerald-100',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    desc: 'End-to-end encryption, SOC 2 compliance, and data residency options for peace of mind.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    iconBg: 'bg-amber-100',
  },
  {
    icon: Globe,
    title: 'Multi-Language Support',
    desc: 'Transcribe and summarize meetings in 30+ languages with automatic language detection.',
    color: 'text-sky-600',
    bg: 'bg-sky-50',
    iconBg: 'bg-sky-100',
  },
];

const stats = [
  { value: 10000, suffix: '+', label: 'Meetings processed', icon: Headphones },
  { value: 500, suffix: '+', label: 'Teams worldwide', icon: Users },
  { value: 50000, suffix: '+', label: 'Actions tracked', icon: ListChecks },
  { value: 99, suffix: '%', label: 'Accuracy rate', icon: BarChart3 },
];

const testimonials = [
  {
    quote: "This replaced our entire note-taking workflow. The accuracy of action item extraction is remarkable — better than any human note-taker we've ever had.",
    name: 'Priya Sharma',
    role: 'Engineering Manager',
    company: 'Series B Startup',
    avatar: 'PS',
    bg: 'bg-indigo-500',
  },
  {
    quote: "We went from losing 40% of follow-ups to tracking everything. The Slack integration is seamless — action items just appear in the right channels.",
    name: 'Marcus Webb',
    role: 'Head of Product',
    company: 'SaaS Platform',
    avatar: 'MW',
    bg: 'bg-violet-500',
  },
  {
    quote: "Setup took 3 minutes. First meeting summary blew the team away. Now every team in our company uses it daily without exception.",
    name: 'Elena Torres',
    role: 'COO',
    company: 'Design Studio',
    avatar: 'ET',
    bg: 'bg-purple-500',
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

const faqs = [
  {
    q: 'How accurate is the transcription?',
    a: 'Our AI achieves 99% accuracy across most accents and languages. We use state-of-the-art speech recognition models that continuously improve with each update.',
  },
  {
    q: 'Can I use it with Zoom, Google Meet, or Teams?',
    a: 'Yes! You can either record directly in the browser or upload recordings from any platform. We support 20+ audio and video formats including MP3, WAV, WebM, MP4, and more.',
  },
  {
    q: 'Is my meeting data secure?',
    a: 'Absolutely. All data is encrypted end-to-end, both in transit and at rest. We are SOC 2 compliant and offer data residency options for enterprise customers.',
  },
  {
    q: 'How does the action item extraction work?',
    a: 'Our AI analyzes the conversation context to identify tasks, assignees, deadlines, and priorities. It understands natural language patterns like "Can you handle this by Friday?" and converts them into structured action items.',
  },
  {
    q: 'Do I need to install anything?',
    a: 'No installation required. Everything works directly in your browser. Just sign up, hit record or upload a file, and you are good to go. Setup takes less than 2 minutes.',
  },
  {
    q: 'What happens after my free trial ends?',
    a: 'Your free plan continues with 5 meetings per month. No credit card is required to start, and you can upgrade or downgrade at any time without losing your data.',
  },
];

/* ═══════════════════ MAIN PAGE ═══════════════════ */

export default function LandingPage() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 0.97]);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900">

      {/* ═══ NAV ═══ */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        navScrolled
          ? 'bg-white/80 backdrop-blur-2xl border-b border-slate-200/60 py-3 shadow-sm'
          : 'bg-transparent py-5'
      }`}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/30 transition-shadow duration-300">
              <Mic className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-[18px] font-bold tracking-tight text-slate-900">meetflow</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {['Features', 'How it Works', 'Pricing', 'FAQ'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-[13px] text-slate-500 hover:text-slate-900 transition-colors duration-300 relative group font-medium">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-indigo-500 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-[13px] text-slate-500 hover:text-slate-900 transition-colors hidden sm:block font-medium">
              Log in
            </Link>
            <Link href="/signup" className="group relative inline-flex items-center gap-2 text-[13px] font-semibold px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/10 hover:shadow-slate-900/20 transition-all duration-300">
              <span className="flex items-center gap-2">
                Get Started
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
            <button className="md:hidden text-slate-500 hover:text-slate-900" onClick={() => setMobileMenu(!mobileMenu)}>
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
              className="md:hidden overflow-hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl"
            >
              <div className="px-6 py-4 space-y-3">
                {['Features', 'How it Works', 'Pricing', 'FAQ'].map((item) => (
                  <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="block text-sm text-slate-500 hover:text-slate-900 py-1 font-medium"
                    onClick={() => setMobileMenu(false)}>
                    {item}
                  </a>
                ))}
                <Link href="/login" className="block text-sm text-slate-500 hover:text-slate-900 py-1 font-medium" onClick={() => setMobileMenu(false)}>
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
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 via-white to-white" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-br from-indigo-100/60 via-violet-100/40 to-purple-100/30 rounded-full blur-3xl opacity-60" />
          <div className="absolute top-[20%] right-0 w-[400px] h-[400px] bg-gradient-to-bl from-sky-100/40 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-[30%] left-0 w-[300px] h-[300px] bg-gradient-to-tr from-violet-100/30 to-transparent rounded-full blur-3xl" />

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
              <span className="inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-[12px] font-medium bg-white border border-slate-200 text-slate-600 shadow-sm hover:shadow-md transition-shadow cursor-default">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                Now with real-time transcription
                <ArrowUpRight className="w-3 h-3 text-slate-400" />
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="text-[2.75rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5rem] font-extrabold tracking-[-0.04em] leading-[1.05] mb-6 text-slate-900"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Meetings that
              <br />
              <TypingText words={['actually lead', 'drive results', 'spark action', 'create impact']} />
              <br />
              to action.
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-lg md:text-xl text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              Record any meeting. Get transcripts, summaries, and action items
              with owners and deadlines — <strong className="text-slate-700">automatically</strong>.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              <Link href="/signup" className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-full text-[15px] font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all duration-300">
                Start Free — No Card Required
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <a href="#how-it-works" className="inline-flex items-center gap-2 px-6 py-4 rounded-full text-[15px] font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-300">
                <Play className="w-4 h-4" />
                See How It Works
              </a>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              className="flex items-center justify-center gap-6 text-[13px] text-slate-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {['Free forever plan', '2-minute setup', 'No credit card'].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  {t}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Demo */}
          <div className="relative z-10 mt-12 w-full max-w-3xl mx-auto px-6">
            <LiveDemo />
          </div>
        </section>

        {/* ═══ LOGO BAR ═══ */}
        <section className="relative py-16 border-y border-slate-100 bg-slate-50/50">
          <div className="max-w-6xl mx-auto px-6">
            <p className="text-center text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-8">
              Trusted by innovative teams at
            </p>
            <div className="relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-50 to-transparent z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-50 to-transparent z-10" />
              <div className="flex animate-marquee whitespace-nowrap">
                {[...logos, ...logos].map((logo, i) => (
                  <span key={i} className="mx-10 text-[16px] font-bold text-slate-300 hover:text-slate-400 transition-colors cursor-default select-none">
                    {logo}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ FEATURES ═══ */}
        <section id="features" className="relative py-28 md:py-36">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              className="text-center max-w-2xl mx-auto mb-20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 text-[11px] font-bold text-indigo-600 uppercase tracking-[0.2em] mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                Features
              </span>
              <h2 className="text-3xl md:text-[2.75rem] font-bold tracking-[-0.02em] mt-3 mb-5 text-slate-900">
                Every meeting,{' '}
                <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  fully organized.
                </span>
              </h2>
              <p className="text-slate-500 text-[16px] leading-relaxed">
                From the first word spoken to the last action item tracked — we cover the entire meeting lifecycle with intelligent automation.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group"
                >
                  <div className="h-full rounded-2xl bg-white border border-slate-200 p-7 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-100 transition-all duration-300">
                    <div className={`w-12 h-12 rounded-xl ${f.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                      <f.icon className={`w-6 h-6 ${f.color}`} />
                    </div>
                    <h3 className="text-[16px] font-semibold text-slate-900 mb-2 tracking-tight">{f.title}</h3>
                    <p className="text-[14px] text-slate-500 leading-relaxed">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ HOW IT WORKS ═══ */}
        <section id="how-it-works" className="relative py-28 md:py-36 bg-slate-50/70 border-y border-slate-100">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              className="text-center max-w-2xl mx-auto mb-20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 text-[11px] font-bold text-violet-600 uppercase tracking-[0.2em] mb-4">
                <MousePointerClick className="w-3.5 h-3.5" />
                How It Works
              </span>
              <h2 className="text-3xl md:text-[2.75rem] font-bold tracking-[-0.02em] mt-3 mb-5 text-slate-900">
                Three steps.{' '}
                <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Zero effort.</span>
              </h2>
              <p className="text-slate-500 text-[16px] leading-relaxed">
                Go from raw audio to organized, actionable outcomes in minutes.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connector line */}
              <div className="hidden md:block absolute top-[60px] left-[20%] right-[20%] h-px bg-gradient-to-r from-indigo-200 via-violet-200 to-purple-200" />

              {[
                { num: '01', icon: Upload, title: 'Upload or Record', desc: 'Drop audio or hit record. We support 20+ audio formats out of the box.', color: 'text-indigo-600', iconBg: 'bg-indigo-100', ring: 'ring-indigo-200' },
                { num: '02', icon: Sparkles, title: 'AI Processes', desc: 'Transcription, speaker ID, summary, and action extraction — all automatic.', color: 'text-violet-600', iconBg: 'bg-violet-100', ring: 'ring-violet-200' },
                { num: '03', icon: Zap, title: 'Review & Act', desc: 'Review results, assign tasks, and push to Slack, Notion, or Asana.', color: 'text-purple-600', iconBg: 'bg-purple-100', ring: 'ring-purple-200' },
              ].map((step, i) => (
                <motion.div
                  key={step.num}
                  className="relative text-center group"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                >
                  <div className="inline-flex flex-col items-center">
                    <div className={`relative w-[80px] h-[80px] rounded-2xl ${step.iconBg} ring-1 ${step.ring} flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-slate-100`}>
                      <step.icon className={`w-8 h-8 ${step.color}`} />
                      <span className="absolute -top-2.5 -right-2.5 text-[10px] font-bold text-white bg-indigo-600 rounded-full w-7 h-7 flex items-center justify-center shadow-lg">
                        {step.num}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold tracking-tight mb-2 text-slate-900">{step.title}</h3>
                    <p className="text-[13px] text-slate-500 leading-relaxed max-w-[260px]">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ STATS ═══ */}
        <section className="relative py-24 overflow-hidden">
          <div className="max-w-5xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  className="text-center group"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 mb-4 group-hover:bg-indigo-50 transition-colors">
                    <s.icon className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-1">
                    <Counter target={s.value} suffix={s.suffix} />
                  </div>
                  <p className="text-[12px] text-slate-400 font-medium">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ TESTIMONIALS ═══ */}
        <section className="relative py-28 md:py-36 bg-slate-50/70 border-y border-slate-100">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              className="text-center max-w-2xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 text-[11px] font-bold text-purple-600 uppercase tracking-[0.2em] mb-4">
                <MessageSquare className="w-3.5 h-3.5" />
                Testimonials
              </span>
              <h2 className="text-3xl md:text-[2.75rem] font-bold tracking-[-0.02em] mt-3 mb-5 text-slate-900">
                Teams{' '}
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">love</span>{' '}
                it.
              </h2>
              <p className="text-slate-500 text-[16px]">
                Here&apos;s what teams say after switching to meetflow.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="h-full rounded-2xl bg-white border border-slate-200 p-7 flex flex-col hover:border-slate-300 hover:shadow-lg hover:shadow-slate-100 transition-all duration-300">
                    <div className="flex gap-0.5 mb-4">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-[14px] text-slate-600 leading-relaxed flex-1 mb-6">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-3 pt-5 border-t border-slate-100">
                      <div className={`w-10 h-10 rounded-full ${t.bg} flex items-center justify-center text-[11px] font-bold text-white shadow-lg`}>
                        {t.avatar}
                      </div>
                      <div>
                        <div className="text-[13px] font-semibold text-slate-900">{t.name}</div>
                        <div className="text-[11px] text-slate-400">{t.role} &middot; {t.company}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ PRICING ═══ */}
        <section id="pricing" className="relative py-28 md:py-36">
          <div className="max-w-5xl mx-auto px-6 relative z-10">
            <motion.div
              className="text-center max-w-2xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 text-[11px] font-bold text-emerald-600 uppercase tracking-[0.2em] mb-4">
                <Zap className="w-3.5 h-3.5" />
                Pricing
              </span>
              <h2 className="text-3xl md:text-[2.75rem] font-bold tracking-[-0.02em] mt-3 mb-5 text-slate-900">
                Simple,{' '}
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">honest</span>{' '}
                pricing.
              </h2>
              <p className="text-slate-500 text-[16px]">
                Start free. Upgrade when you&apos;re ready. No surprise charges.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
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
                      ? 'bg-white border-2 border-indigo-500 shadow-2xl shadow-indigo-100'
                      : 'bg-white border border-slate-200 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-100'
                  }`}>
                    {plan.highlight && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                        <span className="text-[10px] font-bold text-white bg-indigo-600 px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg shadow-indigo-600/20">
                          Most Popular
                        </span>
                      </div>
                    )}

                    <h3 className="text-lg font-semibold mb-1 text-slate-900">{plan.name}</h3>
                    <p className="text-[12px] text-slate-400 mb-4">{plan.desc}</p>
                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-4xl font-bold tracking-tight text-slate-900">{plan.price}</span>
                      {plan.period && <span className="text-sm text-slate-400">{plan.period}</span>}
                    </div>

                    <ul className="space-y-3 mb-8 flex-1">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-[13px] text-slate-600">
                          <Check className={`w-4 h-4 shrink-0 mt-0.5 ${plan.highlight ? 'text-indigo-500' : 'text-slate-400'}`} />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <Link
                      href="/signup"
                      className={`block text-center text-[13px] font-semibold py-3.5 rounded-full transition-all duration-300 ${
                        plan.highlight
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
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

        {/* ═══ FAQ ═══ */}
        <section id="faq" className="relative py-28 md:py-36 bg-slate-50/70 border-y border-slate-100">
          <div className="max-w-3xl mx-auto px-6 relative z-10">
            <motion.div
              className="text-center max-w-2xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 text-[11px] font-bold text-amber-600 uppercase tracking-[0.2em] mb-4">
                <MessageSquare className="w-3.5 h-3.5" />
                FAQ
              </span>
              <h2 className="text-3xl md:text-[2.75rem] font-bold tracking-[-0.02em] mt-3 mb-5 text-slate-900">
                Frequently asked{' '}
                <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">questions</span>
              </h2>
              <p className="text-slate-500 text-[16px]">
                Everything you need to know about meetflow.
              </p>
            </motion.div>

            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <FAQItem
                    question={faq.q}
                    answer={faq.a}
                    isOpen={openFAQ === i}
                    onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                  />
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
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700" />
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />

              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/20 mb-8"
                >
                  <Sparkles className="w-7 h-7 text-white" />
                </motion.div>

                <h2 className="text-3xl md:text-[2.75rem] font-bold tracking-[-0.02em] mb-4 leading-tight text-white">
                  Stop losing action items.
                  <br />
                  Start shipping outcomes.
                </h2>
                <p className="text-indigo-100 text-[16px] max-w-md mx-auto mb-8">
                  Join hundreds of teams who&apos;ve transformed their meetings. Free forever plan, instant setup.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link href="/signup" className="group inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold bg-white text-indigo-700 hover:bg-indigo-50 shadow-xl shadow-black/10 transition-all duration-300">
                    Get Started Free
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                  <Link href="/login" className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-medium text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300">
                    Sign in
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-slate-200 pt-16 pb-8 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2.5 mb-4 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/15 group-hover:shadow-indigo-500/25 transition-shadow">
                  <Mic className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-bold text-base text-slate-900">meetflow</span>
              </Link>
              <p className="text-[13px] text-slate-400 leading-relaxed max-w-[260px] mb-4">
                AI-powered meeting recorder & action tracker for teams that move fast.
              </p>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] text-slate-400">All systems operational</span>
              </div>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Integrations', 'Pricing', 'Changelog'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'GDPR'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-[0.15em] mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-[13px] text-slate-400 hover:text-slate-700 transition-colors duration-300">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-100">
            <p className="text-[11px] text-slate-400">
              &copy; {new Date().getFullYear()} meetflow. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors">Privacy</a>
              <a href="#" className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors">Terms</a>
              <a href="#" className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors">Status</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

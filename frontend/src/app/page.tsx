'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from 'framer-motion';
import {
  Mic,
  FileText,
  ListChecks,
  ArrowRight,
  Upload,
  Play,
  Menu,
  X,
  Clock,
  Users,
  Shield,
  ChevronDown,
  Globe,
  Lock,
  Headphones,
  Brain,
  ArrowUpRight,
  Phone,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  Mail,
  Sparkles,
  Zap,
  Check,
} from 'lucide-react';

/* ═══════════════════ ANIMATED COUNTER ═══════════════════ */
function Counter({ target, suffix = '' }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ═══════════════════ WAVEFORM VISUALIZER ═══════════════════ */
function Waveform() {
  return (
    <div className="flex items-center gap-[2px] h-10">
      {Array.from({ length: 32 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-lime-400"
          animate={{
            height: [8, Math.random() * 32 + 8, 8],
          }}
          transition={{
            duration: 0.6 + Math.random() * 0.3,
            repeat: Infinity,
            delay: i * 0.03,
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
    <div className="border border-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:border-lime-400/30 bg-white/[0.02]">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between px-6 py-5 text-left"
      >
        <span className="text-[15px] font-medium text-white pr-4">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-lime-400" />
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
            <div className="px-6 pb-5 text-[14px] text-white/60 leading-relaxed">
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
      <div className="absolute -inset-8 bg-lime-400/10 rounded-3xl blur-3xl" />

      <div className="relative rounded-2xl overflow-hidden bg-[#0a0a0a] border border-white/10 shadow-2xl">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="h-4 w-px bg-white/20" />
            <span className="text-[11px] text-white/60 font-medium">Meeting in Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-lime-400/10 border border-lime-400/30">
              <div className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
              <span className="text-[10px] text-lime-400 font-semibold tracking-wide">LIVE 12:34</span>
            </div>
          </div>
        </div>

        {/* Waveform bar */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <Waveform />
          <div className="flex items-center gap-2 ml-4">
            <div className="flex -space-x-1.5">
              {['bg-lime-500', 'bg-lime-400', 'bg-lime-600'].map((c, i) => (
                <div key={i} className={`w-6 h-6 rounded-full ${c} border-2 border-[#0a0a0a] flex items-center justify-center text-[8px] font-bold text-black`}>
                  {['S', 'D', 'M'][i]}
                </div>
              ))}
            </div>
            <span className="text-[10px] text-white/40">3 speakers</span>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex px-5 pt-3 gap-1 border-b border-white/10">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2 text-[12px] font-medium rounded-t-lg transition-all duration-200 relative ${
                activeTab === i
                  ? 'text-lime-400 bg-lime-400/10'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              {tab}
              {activeTab === i && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-lime-400"
                  layoutId="tab-indicator"
                />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="px-5 py-4 space-y-4 min-h-[260px]">
          {[
            { name: 'Sarah', initial: 'S', color: 'bg-lime-500', text: "Let's prioritize the checkout flow redesign. Conversion dropped 12% this month." },
            { name: 'David', initial: 'D', color: 'bg-lime-400', text: "Agreed. I can have a prototype ready by Wednesday if we freeze the API spec today." },
            { name: 'Maya', initial: 'M', color: 'bg-lime-600', text: "I'll run user testing on the current flow to identify specific pain points." },
          ].map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
              className="flex gap-3"
            >
              <div className={`w-7 h-7 rounded-full ${msg.color} flex items-center justify-center text-[10px] font-bold text-black shrink-0`}>
                {msg.initial}
              </div>
              <div>
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span className="text-[11px] font-semibold text-white">{msg.name}</span>
                  <span className="text-[9px] text-white/30">{['2:34', '2:36', '2:38'][idx]}</span>
                </div>
                <p className="text-[13px] text-white/70 leading-relaxed">{msg.text}</p>
              </div>
            </motion.div>
          ))}

          {/* AI Summary Preview */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-4 p-4 rounded-xl bg-lime-400/5 border border-lime-400/20"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-lime-400" />
              <span className="text-[11px] font-semibold text-lime-400 uppercase tracking-wide">AI Summary</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-lime-400" />
                <span className="text-[12px] text-white/80">Checkout redesign prioritized</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-lime-400" />
                <span className="text-[12px] text-white/80">Prototype due Wednesday</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-lime-400" />
                <span className="text-[12px] text-white/80">User testing scheduled</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════ MAIN PAGE ═══════════════════ */
export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '#about' },
    { label: 'Features', href: '#features' },
    { label: 'Services', href: '#services' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Contact', href: '#contact' },
  ];

  const faqs = [
    { q: 'How does the AI transcription work?', a: 'Our AI uses advanced speech recognition to convert your meeting audio into accurate text in real-time. It supports multiple speakers and can identify different voices automatically.' },
    { q: 'Is my meeting data secure?', a: 'Absolutely. All data is encrypted end-to-end, and we comply with SOC 2, GDPR, and HIPAA standards. Your recordings are never used to train our AI models.' },
    { q: 'Can I integrate with other tools?', a: 'Yes! We integrate with Slack, Notion, Zoom, Google Meet, Teams, and 50+ other tools. You can automatically send summaries and action items to your preferred platforms.' },
    { q: 'What languages are supported?', a: 'We support 30+ languages including English, Spanish, French, German, Mandarin, Japanese, and more. Real-time translation is available for premium plans.' },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* ═══ NAVIGATION ═══ */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-lime-400 flex items-center justify-center">
                <Mic className="w-5 h-5 text-black" />
              </div>
              <span className="font-bold text-xl text-white">AI Meet</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[14px] font-medium text-white/70 hover:text-lime-400 transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-lime-400 text-black font-semibold text-[14px] hover:bg-lime-300 transition-all duration-300 group"
              >
                Let&apos;s Talk
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black/95 backdrop-blur-xl border-b border-white/10"
            >
              <div className="px-6 py-6 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-[16px] font-medium text-white/80 hover:text-lime-400"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-lime-400 text-black font-semibold text-[14px]"
                >
                  Let&apos;s Talk
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ═══ HERO SECTION ═══ */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          {/* Gradient circles */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-lime-400/5 rounded-full blur-3xl" />
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-lime-400/10 rounded-full blur-3xl" />
          
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `linear-gradient(rgba(163, 230, 53, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(163, 230, 53, 0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        {/* Left Side Elements */}
        <div className="fixed left-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-6 z-40">
          <div className="flex flex-col items-center gap-4 text-white/40">
            <Phone className="w-4 h-4" />
            <span className="text-[11px] font-medium rotate-180" style={{ writingMode: 'vertical-rl' }}>
              +1 (555) 000-0000
            </span>
          </div>
          <div className="w-px h-20 bg-white/10" />
          <div className="flex flex-col items-center gap-4 text-white/40">
            <span className="text-[11px] font-medium rotate-180" style={{ writingMode: 'vertical-rl' }}>
              Scroll Down
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="w-4 h-4 rotate-90" />
            </motion.div>
          </div>
        </div>

        {/* Right Side Elements - Social Icons */}
        <div className="fixed right-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-6 z-40">
          <span className="text-[11px] font-medium text-white/40 rotate-180" style={{ writingMode: 'vertical-rl' }}>
            Follow Me
          </span>
          <div className="w-px h-20 bg-white/10" />
          <div className="flex flex-col gap-4">
            {[Facebook, Twitter, Linkedin, Globe].map((Icon, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-lime-400 hover:border-lime-400/50 transition-colors"
              >
                <Icon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Main Hero Content */}
        <motion.div
          className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          {/* Left Content */}
          <div className="space-y-8">
            {/* Tag */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 text-white/60"
            >
              <span className="text-[13px] font-medium">Currently Available Worldwide</span>
              <ArrowUpRight className="w-4 h-4" />
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-2"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1]">
                Smart Meeting
              </h1>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1]">
                <span className="text-gradient-lime">Recorder</span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[16px] text-white/60 max-w-md leading-relaxed"
            >
              AI-powered meeting transcription, summarization, and action item extraction. 
              Never miss a key insight from your conversations.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link
                href="/signup"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-lime-400 text-black font-semibold text-[15px] hover:bg-lime-300 transition-all duration-300 group"
              >
                <Play className="w-5 h-5 fill-current" />
                Start Free Trial
              </Link>
              
              <button className="group flex items-center gap-3 text-white/80 hover:text-lime-400 transition-colors">
                <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center group-hover:border-lime-400/50 transition-colors">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
                <span className="text-[14px] font-medium">Watch Demo</span>
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center gap-8 pt-4"
            >
              <div>
                <div className="text-2xl font-bold text-white"><Counter target={50000} suffix="+" /></div>
                <div className="text-[12px] text-white/50">Meetings Recorded</div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <div className="text-2xl font-bold text-white"><Counter target={1000} suffix="+" /></div>
                <div className="text-[12px] text-white/50">Teams Trust Us</div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <div className="text-2xl font-bold text-white">99.9%</div>
                <div className="text-[12px] text-white/50">Uptime</div>
              </div>
            </motion.div>
          </div>

          {/* Right Content - Demo UI */}
          <div className="relative">
            {/* Decorative rotating circle */}
            <motion.div
              className="absolute -top-10 -right-10 w-32 h-32 border border-lime-400/30 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-lime-400 rounded-full" />
            </motion.div>

            {/* Rotating text circle */}
            <motion.div
              className="absolute -bottom-5 -left-5 w-24 h-24"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <path
                    id="circlePath"
                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                  />
                </defs>
                <text fill="rgba(163, 230, 53, 0.6)" fontSize="8" fontWeight="500">
                  <textPath href="#circlePath">
                    AI-POWERED • TRANSCRIPTION • SUMMARY • 
                  </textPath>
                </text>
              </svg>
            </motion.div>

            <LiveDemo />
          </div>
        </motion.div>
      </section>

      {/* ═══ FEATURES SECTION ═══ */}
      <section id="features" className="relative py-32 bg-black overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-lime-400/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lime-400/10 border border-lime-400/20 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Zap className="w-4 h-4 text-lime-400" />
              <span className="text-[12px] font-semibold text-lime-400 uppercase tracking-wider">Powerful Features</span>
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Your Meetings,<br />
              <span className="text-gradient-lime">Supercharged</span>
            </h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              Stop taking notes. Start having better conversations. Our AI captures everything that matters.
            </p>
          </motion.div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-min">
            
            {/* Large Card - Real-time Transcription */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="md:col-span-2 lg:row-span-2 group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 hover:border-lime-400/40 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-lime-400/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-8 h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-lime-400/20 flex items-center justify-center">
                    <Mic className="w-7 h-7 text-lime-400" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-lime-400/20 text-lime-400 text-[11px] font-semibold">LIVE</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Real-time Transcription</h3>
                <p className="text-white/50 text-[15px] leading-relaxed mb-6">
                  Every word captured instantly. Speaker identification, timestamps, and perfect accuracy in 30+ languages.
                </p>
                {/* Waveform visualization */}
                <div className="mt-auto">
                  <div className="flex items-end gap-1 h-24">
                    {Array.from({ length: 40 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 bg-lime-400/60 rounded-full"
                        animate={{
                          height: ['20%', `${Math.random() * 80 + 20}%`, '20%'],
                        }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          delay: i * 0.05,
                          ease: 'easeInOut',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Medium Card - AI Insights */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -5 }}
              className="md:col-span-1 lg:row-span-2 group relative overflow-hidden rounded-3xl bg-white/[0.02] border border-white/10 hover:border-lime-400/40 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-lime-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-6 h-full flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-lime-400/10 flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-lime-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">AI Summaries</h3>
                <p className="text-white/50 text-[14px] leading-relaxed mb-4">
                  Get the key takeaways without reading the entire transcript.
                </p>
                {/* AI Processing Animation */}
                <div className="mt-auto space-y-3">
                  {[
                    { text: 'Key decisions made', icon: '✓' },
                    { text: 'Action items extracted', icon: '✓' },
                    { text: 'Sentiment analyzed', icon: '✓' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.15 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-5 h-5 rounded-full bg-lime-400/20 flex items-center justify-center text-lime-400 text-[10px]">
                        {item.icon}
                      </div>
                      <span className="text-[13px] text-white/70">{item.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Small Card - Action Items */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden rounded-3xl bg-white/[0.02] border border-white/10 hover:border-lime-400/40 transition-all duration-500 p-6"
            >
              <div className="w-12 h-12 rounded-xl bg-lime-400/10 flex items-center justify-center mb-4">
                <ListChecks className="w-6 h-6 text-lime-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Action Items</h3>
              <p className="text-white/50 text-[13px]">
                Auto-extract tasks and assign owners. Nothing falls through the cracks.
              </p>
            </motion.div>

            {/* Small Card - Upload */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden rounded-3xl bg-white/[0.02] border border-white/10 hover:border-lime-400/40 transition-all duration-500 p-6"
            >
              <div className="w-12 h-12 rounded-xl bg-lime-400/10 flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-lime-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Upload Anything</h3>
              <p className="text-white/50 text-[13px]">
                MP3, MP4, WAV, MOV — we handle it all. Even Zoom recordings.
              </p>
            </motion.div>

            {/* Wide Card - Dashboard Preview with Image */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ y: -5 }}
              className="md:col-span-3 group relative overflow-hidden rounded-3xl bg-gradient-to-br from-lime-400/10 to-transparent border border-lime-400/20 hover:border-lime-400/50 transition-all duration-500"
            >
              <div className="grid md:grid-cols-2 gap-0">
                <div className="p-8 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-400/20 w-fit mb-4">
                    <Sparkles className="w-3 h-3 text-lime-400" />
                    <span className="text-[11px] font-semibold text-lime-400">DASHBOARD</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Your Command Center</h3>
                  <p className="text-white/50 text-[14px] leading-relaxed mb-6">
                    All your meetings, transcripts, and insights in one beautiful interface. Search across everything instantly.
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      {['bg-lime-400', 'bg-lime-500', 'bg-lime-600'].map((c, i) => (
                        <div key={i} className={`w-8 h-8 rounded-full ${c} border-2 border-black flex items-center justify-center text-[10px] font-bold text-black`}>
                          {['JD', 'SK', 'AM'][i]}
                        </div>
                      ))}
                    </div>
                    <span className="text-[13px] text-white/50">Team collaboration made easy</span>
                  </div>
                </div>
                <div className="relative h-64 md:h-auto overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/80 z-10" />
                  <img 
                    src="/images/dashboard-dark.png" 
                    alt="AI Meeting Dashboard" 
                    className="w-full h-full object-cover object-left transform group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="md:col-span-3 lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                { value: '30+', label: 'Languages Supported', icon: Globe },
                { value: '99.9%', label: 'Accuracy Rate', icon: Check },
                { value: '< 2s', label: 'Processing Time', icon: Zap },
                { value: 'SOC2', label: 'Certified Security', icon: Shield },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="group p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-lime-400/30 transition-all duration-300 text-center"
                >
                  <stat.icon className="w-6 h-6 text-lime-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-[12px] text-white/40">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-16 text-center"
          >
            <Link
              href="/signup"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-lime-400 text-black font-semibold text-[15px] hover:bg-lime-300 transition-all duration-300 group"
            >
              <Play className="w-5 h-5 fill-current" />
              Experience the Magic
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══ SERVICES SECTION ═══ */}
      <section id="services" className="relative py-32 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 text-[12px] font-semibold text-lime-400 uppercase tracking-[0.2em] mb-4">
                <Sparkles className="w-4 h-4" />
                Services
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                How It Works
              </h2>
              <p className="text-white/50 text-[16px] mb-8 leading-relaxed">
                Our AI meeting assistant seamlessly integrates into your workflow, 
                capturing every important detail so you can focus on the conversation.
              </p>

              <div className="space-y-6">
                {[
                  { step: '01', title: 'Record or Upload', desc: 'Start recording live or upload existing audio/video files' },
                  { step: '02', title: 'AI Processing', desc: 'Our AI transcribes, summarizes, and extracts insights' },
                  { step: '03', title: 'Share & Action', desc: 'Distribute summaries and track action items automatically' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.15 }}
                    className="flex gap-5"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-lime-400/10 border border-lime-400/30 flex items-center justify-center">
                        <span className="text-[14px] font-bold text-lime-400">{item.step}</span>
                      </div>
                      {i < 2 && <div className="w-px flex-1 bg-white/10 my-2" />}
                    </div>
                    <div className="pb-6">
                      <h4 className="text-lg font-semibold text-white mb-1">{item.title}</h4>
                      <p className="text-[14px] text-white/50">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Content - Visual */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden border border-white/10">
                <div className="absolute inset-0 bg-gradient-to-br from-lime-400/5 to-transparent" />
                <div className="p-8 space-y-4">
                  {/* Mock UI */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-lime-400 flex items-center justify-center">
                      <Mic className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <div className="text-[14px] font-semibold text-white">Product Team Standup</div>
                      <div className="text-[12px] text-lime-400">Recording in progress...</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { user: 'Alex', text: 'Shipped the new dashboard feature yesterday', time: '0:34' },
                      { user: 'Jordan', text: 'Working on API optimization, ETA tomorrow', time: '1:12' },
                      { user: 'Casey', text: 'User testing results look promising', time: '2:05' },
                    ].map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.2 }}
                        className="flex gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5"
                      >
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-semibold text-white">
                          {msg.user[0]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-[12px] font-medium text-white">{msg.user}</span>
                            <span className="text-[10px] text-white/30">{msg.time}</span>
                          </div>
                          <p className="text-[13px] text-white/60">{msg.text}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* AI Badge */}
                  <div className="mt-6 p-4 rounded-xl bg-lime-400/5 border border-lime-400/20">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-lime-400" />
                      <span className="text-[12px] font-semibold text-lime-400">AI Insights</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['Dashboard shipped', 'API optimization', 'User testing'].map((tag, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-lime-400/10 text-[11px] text-lime-400/80">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ PRICING SECTION ═══ */}
      <section id="pricing" className="relative py-32 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <motion.div
            className="text-center max-w-2xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 text-[12px] font-semibold text-lime-400 uppercase tracking-[0.2em] mb-4">
              <Clock className="w-4 h-4" />
              Pricing
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-white/50 text-[16px]">
              Start free, upgrade when you need more power
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: 'Free', price: '$0', period: '/month', features: ['5 meetings/month', 'Basic transcription', 'Email summaries', '7-day storage'], cta: 'Get Started', highlight: false },
              { name: 'Pro', price: '$19', period: '/month', features: ['Unlimited meetings', 'Advanced AI features', ' integrations', 'Priority support', '1-year storage'], cta: 'Start Pro Trial', highlight: true },
              { name: 'Enterprise', price: 'Custom', period: '', features: ['Everything in Pro', 'Custom AI training', 'SSO & Advanced security', 'Dedicated support', 'Unlimited storage'], cta: 'Contact Sales', highlight: false },
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative p-8 rounded-2xl ${plan.highlight ? 'bg-lime-400 text-black' : 'bg-white/[0.02] border border-white/10'}`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-black text-lime-400 text-[11px] font-semibold">
                    Most Popular
                  </div>
                )}
                <h3 className={`text-lg font-semibold mb-2 ${plan.highlight ? 'text-black/70' : 'text-white/70'}`}>{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className={`text-4xl font-bold ${plan.highlight ? 'text-black' : 'text-white'}`}>{plan.price}</span>
                  <span className={plan.highlight ? 'text-black/60' : 'text-white/50'}>{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fi) => (
                    <li key={fi} className="flex items-start gap-3 text-[14px]">
                      <Check className={`w-5 h-5 shrink-0 ${plan.highlight ? 'text-black' : 'text-lime-400'}`} />
                      <span className={plan.highlight ? 'text-black/80' : 'text-white/70'}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`block text-center py-4 rounded-full font-semibold text-[14px] transition-all duration-300 ${
                    plan.highlight
                      ? 'bg-black text-lime-400 hover:bg-black/80'
                      : 'bg-lime-400 text-black hover:bg-lime-300'
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ SECTION ═══ */}
      <section id="faq" className="relative py-32 bg-[#050505]">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 text-[12px] font-semibold text-lime-400 uppercase tracking-[0.2em] mb-4">
              <Headphones className="w-4 h-4" />
              FAQ
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Common Questions
            </h2>
            <p className="text-white/50 text-[16px]">
              Everything you need to know about AI Meet
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
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

      {/* ═══ CTA SECTION ═══ */}
      <section id="contact" className="relative py-32 bg-black">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            className="relative text-center rounded-3xl overflow-hidden p-12 md:p-20 border border-lime-400/20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Background */}
            <div className="absolute inset-0 bg-lime-400/5" />
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(163, 230, 53, 0.3) 1px, transparent 0)',
              backgroundSize: '24px 24px'
            }} />

            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-lime-400/10 border border-lime-400/30 mb-8"
              >
                <Sparkles className="w-7 h-7 text-lime-400" />
              </motion.div>

              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Ready to Transform<br />Your Meetings?
              </h2>
              <p className="text-white/50 text-[16px] max-w-md mx-auto mb-8">
                Join thousands of teams who never miss a key insight. 
                Start your free trial today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-lime-400 text-black font-semibold text-[15px] hover:bg-lime-300 transition-all duration-300 group"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/20 text-white font-medium text-[15px] hover:border-lime-400/50 hover:text-lime-400 transition-all duration-300"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-white/10 pt-20 pb-8 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-lime-400 flex items-center justify-center">
                  <Mic className="w-5 h-5 text-black" />
                </div>
                <span className="font-bold text-xl text-white">AI Meet</span>
              </Link>
              <p className="text-[13px] text-white/40 leading-relaxed mb-4">
                AI-powered meeting recorder & action tracker for teams that move fast.
              </p>
              <div className="flex items-center gap-3">
                {[Twitter, Linkedin, Facebook, Instagram].map((Icon, i) => (
                  <a key={i} href="#" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-lime-400 hover:border-lime-400/30 transition-colors">
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Integrations', 'Changelog'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'GDPR'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-[12px] font-bold text-white uppercase tracking-[0.15em] mb-4">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-[13px] text-white/40 hover:text-lime-400 transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact Info */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10">
            <p className="text-[12px] text-white/30">
              © {new Date().getFullYear()} AI Meet. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="mailto:hello@aimeet.com" className="flex items-center gap-2 text-[12px] text-white/40 hover:text-lime-400 transition-colors">
                <Mail className="w-4 h-4" />
                hello@aimeet.com
              </a>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
                <span className="text-[12px] text-white/40">All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

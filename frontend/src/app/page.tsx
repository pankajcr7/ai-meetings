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
} from 'framer-motion';
import {
  Mic,
  FileText,
  ListChecks,
  Plug,
  ArrowRight,
  Upload,
  Sparkles,
  Zap,
  Play,
  ChevronRight,
  CheckCircle2,
  Users,
  BarChart3,
  Shield,
  Github,
  Twitter,
  Linkedin,
} from 'lucide-react';

function TiltCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setRotate({ x: y * -10, y: x * 10 });
    },
    []
  );

  return (
    <motion.div
      className={className}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setRotate({ x: 0, y: 0 });
      }}
      animate={{
        rotateX: isHovered ? rotate.x : 0,
        rotateY: isHovered ? rotate.y : 0,
      }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      style={{ transformStyle: 'preserve-3d', perspective: 800 }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const count = useMotionValue(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(count, target, {
      duration: 2,
      ease: [0.25, 0.46, 0.45, 0.94],
      onUpdate: (v) => {
        if (ref.current) {
          ref.current.textContent =
            Math.floor(v).toLocaleString() + suffix;
        }
      },
    });
    return controls.stop;
  }, [isInView, count, target, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

function ProductMockup() {
  return (
    <div className="relative mt-16 md:mt-24 mx-auto max-w-5xl px-4" style={{ perspective: '1200px' }}>
      <motion.div
        className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-1.5 shadow-2xl shadow-blue-500/10"
        style={{ transformStyle: 'preserve-3d' }}
        initial={{ rotateX: 12, rotateY: -5, opacity: 0, y: 60 }}
        animate={{ rotateX: 5, rotateY: -3, opacity: 1, y: 0 }}
        transition={{ duration: 1.4, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        whileHover={{ rotateX: 0, rotateY: 0, scale: 1.01 }}
      >
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 blur-sm" />
        <div className="relative rounded-xl bg-[#0d0d1a] overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
            <div className="flex-1 text-center">
              <span className="text-xs text-slate-500">AI Meeting — Dashboard</span>
            </div>
          </div>
          <div className="flex h-[280px] md:h-[380px]">
            <div className="w-48 md:w-56 border-r border-white/5 p-3 hidden sm:block">
              <div className="text-xs font-medium text-slate-400 mb-3">Meetings</div>
              {['Q4 Planning Review', 'Sprint Retro #23', 'Design Sync', 'Product Roadmap'].map(
                (m, i) => (
                  <div
                    key={m}
                    className={`text-xs px-2.5 py-2 rounded-lg mb-1.5 cursor-default transition-colors ${
                      i === 0
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : 'text-slate-500 hover:text-slate-400'
                    }`}
                  >
                    {m}
                  </div>
                )
              )}
            </div>
            <div className="flex-1 p-4 overflow-hidden">
              <div className="text-sm font-medium text-slate-300 mb-1">Transcript</div>
              <div className="text-xs text-slate-500 mb-4">Q4 Planning Review · 47 min</div>
              <div className="space-y-3">
                {[
                  { name: 'Sarah', color: 'text-blue-400', text: 'Let\'s review the Q4 targets and align on priorities...' },
                  { name: 'Alex', color: 'text-purple-400', text: 'The engineering team has capacity for 3 major initiatives...' },
                  { name: 'Sarah', color: 'text-blue-400', text: 'Great. Let\'s prioritize the API redesign and dashboard v2...' },
                  { name: 'Jordan', color: 'text-cyan-400', text: 'I can own the dashboard migration. Need design specs by Friday.' },
                ].map((line, i) => (
                  <div key={i} className="flex gap-2 text-xs">
                    <span className={`font-medium ${line.color} whitespace-nowrap`}>{line.name}:</span>
                    <span className="text-slate-400">{line.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-52 md:w-64 border-l border-white/5 p-4 hidden md:block">
              <div className="text-sm font-medium text-slate-300 mb-3">Action Items</div>
              {[
                { text: 'Finalize Q4 roadmap', status: 'High', color: 'text-red-400 bg-red-500/10' },
                { text: 'Share design specs', status: 'Medium', color: 'text-yellow-400 bg-yellow-500/10' },
                { text: 'Schedule follow-up', status: 'Low', color: 'text-green-400 bg-green-500/10' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 mb-3 p-2 rounded-lg bg-white/[0.02] border border-white/5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-600 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-slate-300 truncate">{item.text}</div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded mt-1 inline-block ${item.color}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const features = [
  {
    icon: Mic,
    title: 'Smart Transcription',
    description:
      'Upload audio or record directly in the browser. AI-powered speech recognition delivers accurate, speaker-identified transcripts in minutes.',
    gradient: 'from-blue-500 to-cyan-500',
    span: 'md:col-span-2',
  },
  {
    icon: FileText,
    title: 'Instant Summaries',
    description:
      'Get concise, intelligent summaries highlighting key decisions, topics, and outcomes from every meeting.',
    gradient: 'from-purple-500 to-pink-500',
    span: '',
  },
  {
    icon: ListChecks,
    title: 'Action Items',
    description:
      'Automatically extract action items with assignees, deadlines, and priorities. Never lose a follow-up.',
    gradient: 'from-amber-500 to-orange-500',
    span: '',
  },
  {
    icon: Plug,
    title: 'Seamless Integrations',
    description:
      'Sync action items to Slack, Notion, and Asana. Keep your entire team aligned without switching context.',
    gradient: 'from-emerald-500 to-teal-500',
    span: 'md:col-span-2',
  },
];

const steps = [
  {
    num: '01',
    icon: Upload,
    title: 'Upload or Record',
    description:
      'Drop your audio file or record directly in the browser. We support all major audio formats.',
  },
  {
    num: '02',
    icon: Sparkles,
    title: 'AI Processes',
    description:
      'Our AI transcribes, summarizes, and extracts action items with high accuracy in real time.',
  },
  {
    num: '03',
    icon: Zap,
    title: 'Take Action',
    description:
      'Review results, assign tasks, set deadlines, and sync to your favorite productivity tools.',
  },
];

const stats = [
  { value: 10000, suffix: '+', label: 'Meetings Processed' },
  { value: 500, suffix: '+', label: 'Teams' },
  { value: 50000, suffix: '+', label: 'Action Items Tracked' },
  { value: 99, suffix: '.5%', label: 'Accuracy' },
];

const marqueeItems = [
  'Google',
  'Microsoft',
  'Slack',
  'Notion',
  'Zoom',
  'Asana',
  'Linear',
  'Figma',
  'Vercel',
  'Stripe',
];

export default function LandingPage() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, -150]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white selection:bg-blue-500/30 overflow-x-hidden">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          navScrolled
            ? 'bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/10'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow">
              <Mic className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              AI Meeting
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {['Features', 'How it Works', 'Pricing'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-slate-300 hover:text-white transition-colors hidden sm:block"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/20 transition-all"
            >
              Get Started
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero */}
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#111827] to-[#0a0a0f]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_50%)]" />
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px] animate-float" />
          <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-purple-500/15 rounded-full blur-[128px] animate-float-delayed" />
          <div className="absolute top-2/3 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] animate-float" />

          <motion.div
            className="relative z-10 text-center px-4 max-w-5xl mx-auto"
            style={{ y: heroY, opacity: heroOpacity }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 border border-white/15 rounded-full px-4 py-1.5 text-sm text-blue-400 bg-blue-500/5 backdrop-blur-sm mb-8">
                <Sparkles className="w-3.5 h-3.5" />
                Powered by AI
              </div>
            </motion.div>

            <motion.h1
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                AI Meeting Recorder
              </span>
              <br />
              <span
                className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent bg-[length:200%_auto]"
                style={{ animation: 'gradient-shift 8s ease infinite' }}
              >
                + Action Tracker
              </span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
            >
              Auto-transcribe, summarize, and extract action items from your
              meetings. Never miss a follow-up again.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 animate-glow-pulse"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-medium border border-white/15 hover:border-white/25 bg-white/5 hover:bg-white/10 transition-all duration-300"
              >
                <Play className="w-4 h-4" />
                Watch Demo
              </Link>
            </motion.div>
          </motion.div>

          <ProductMockup />
          <div className="h-20" />
        </section>

        {/* Logo Marquee */}
        <section className="relative py-16 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4">
            <p className="text-center text-xs uppercase tracking-widest text-slate-500 mb-10">
              Trusted by teams at leading companies
            </p>
            <div className="relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0a0a0f] to-transparent z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0a0a0f] to-transparent z-10" />
              <div className="flex animate-marquee whitespace-nowrap">
                {[...marqueeItems, ...marqueeItems].map((name, i) => (
                  <span
                    key={i}
                    className="text-lg font-semibold text-slate-600 mx-10 select-none"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section id="features" className="relative py-24 md:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.04),transparent_70%)]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: '-100px' }}
            >
              <p className="text-sm font-medium text-blue-400 uppercase tracking-widest mb-3">
                Features
              </p>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Everything you need
              </h2>
              <p className="text-slate-400 text-lg max-w-xl mx-auto">
                From recording to action items, we handle the entire meeting
                workflow.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-4 md:gap-5">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true, margin: '-80px' }}
                  className={feature.span}
                >
                  <TiltCard className="h-full">
                    <div className="group relative h-full rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-6 md:p-8 hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-500 hover:shadow-lg hover:shadow-blue-500/[0.05] overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/[0.02] to-transparent rounded-bl-full" />
                      <div
                        className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} mb-5 shadow-lg`}
                        style={{
                          boxShadow: `0 8px 24px -4px rgba(0,0,0,0.3)`,
                        }}
                      >
                        <feature.icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-slate-400 leading-relaxed text-sm md:text-base">
                        {feature.description}
                      </p>
                      <div
                        className={`absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                      />
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section
          id="how-it-works"
          className="relative py-24 md:py-32 border-t border-white/5"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: '-100px' }}
            >
              <p className="text-sm font-medium text-purple-400 uppercase tracking-widest mb-3">
                How It Works
              </p>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Three simple steps
              </h2>
              <p className="text-slate-400 text-lg max-w-xl mx-auto">
                Go from raw meeting audio to organized action items in minutes.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 md:gap-6 relative">
              <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              {steps.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.2 }}
                  viewport={{ once: true, margin: '-80px' }}
                  className="relative text-center md:text-left"
                >
                  <div className="relative inline-flex flex-col items-center md:items-start">
                    <span className="text-6xl md:text-7xl font-black bg-gradient-to-b from-white/10 to-transparent bg-clip-text text-transparent mb-4 select-none">
                      {step.num}
                    </span>
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center mb-5">
                      <step.icon className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-slate-400 leading-relaxed text-sm md:text-base max-w-xs">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="relative py-20 border-t border-b border-white/5">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/[0.03] via-purple-500/[0.03] to-blue-500/[0.03]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true, margin: '-50px' }}
                >
                  <div className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing placeholder anchor */}
        <section id="pricing" />

        {/* CTA */}
        <section className="relative py-24 md:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(139,92,246,0.06),transparent_60%)]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <motion.div
              className="relative rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-sm p-10 md:p-16 text-center overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true, margin: '-100px' }}
            >
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]" />
              <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px]" />

              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-3xl md:text-5xl font-bold mb-4">
                    Ready to transform
                    <br />
                    <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      your meetings?
                    </span>
                  </h2>
                </motion.div>
                <motion.p
                  className="text-slate-400 text-lg max-w-lg mx-auto mb-8"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  Join teams who are already saving hours every week. Start
                  free, no credit card required.
                </motion.p>
                <motion.div
                  className="flex flex-col sm:flex-row items-center justify-center gap-4"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
                  >
                    Start for Free
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-medium border border-white/15 hover:border-white/25 bg-white/5 hover:bg-white/10 transition-all duration-300"
                  >
                    Login
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-white/[0.06] pt-16 pb-10">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Mic className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-lg text-white">AI Meeting</span>
              </Link>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                AI-powered meeting recorder and action tracker for modern teams.
              </p>
            </div>

            {[
              {
                title: 'Product',
                links: ['Features', 'Integrations', 'Pricing', 'Changelog'],
              },
              {
                title: 'Company',
                links: ['About', 'Blog', 'Careers', 'Contact'],
              },
              {
                title: 'Legal',
                links: ['Privacy', 'Terms', 'Security', 'GDPR'],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-sm font-semibold text-slate-300 mb-4">
                  {col.title}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/[0.06]">
            <p className="text-sm text-slate-600">
              &copy; {new Date().getFullYear()} AI Meeting. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-slate-600 hover:text-slate-400 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

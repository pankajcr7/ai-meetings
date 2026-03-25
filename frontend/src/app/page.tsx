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
  useSpring,
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
    <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-x">
      {words[currentWord].substring(0, currentChar)}
      <span className="animate-typewriter-cursor text-purple-400">|</span>
    </span>
  );
}

/* ═══════════════════ AURORA BACKGROUND ═══════════════════ */

function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#06060e]" />
      {/* Aurora orbs */}
      <div className="absolute top-[-30%] left-[-10%] w-[700px] h-[700px] rounded-full bg-purple-600/[0.08] blur-[150px] animate-aurora-1" />
      <div className="absolute top-[-20%] right-[-15%] w-[600px] h-[600px] rounded-full bg-cyan-500/[0.06] blur-[140px] animate-aurora-2" />
      <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] rounded-full bg-pink-600/[0.05] blur-[130px] animate-aurora-3" />
      <div className="absolute top-[30%] right-[10%] w-[400px] h-[400px] rounded-full bg-blue-600/[0.04] blur-[120px] animate-aurora-4" />
      {/* Noise texture overlay */}
      <div className="absolute inset-0 bg-noise opacity-[0.03]" />
      {/* Radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,transparent_40%,#06060e_100%)]" />
    </div>
  );
}

/* ═══════════════════ STAR FIELD ═══════════════════ */

function StarField() {
  const stars = useRef(
    Array.from({ length: 80 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      delay: Math.random() * 3,
      duration: Math.random() * 3 + 2,
    }))
  ).current;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{
            opacity: [0.1, 0.8, 0.1],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════ WAVEFORM VISUALIZER ═══════════════════ */

function Waveform() {
  return (
    <div className="flex items-center gap-[3px] h-8">
      {Array.from({ length: 28 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-gradient-to-t from-purple-500 via-pink-400 to-cyan-400"
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

/* ═══════════════════ GLOWING CARD ═══════════════════ */

function GlowCard({
  children,
  className = '',
  glowColor = 'rgba(139, 92, 246, 0.15)',
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative group ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect */}
      {isHovered && (
        <div
          className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${glowColor}, transparent 60%)`,
          }}
        />
      )}
      {children}
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
      <div className="absolute -inset-6 bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-cyan-500/10 rounded-3xl blur-3xl" />
      {/* Animated border */}
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 animate-border-glow" />

      <div className="relative rounded-2xl overflow-hidden bg-[#0a0a16]/90 backdrop-blur-xl">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/70 hover:bg-rose-500 transition-colors cursor-pointer" />
              <div className="w-3 h-3 rounded-full bg-amber-500/70 hover:bg-amber-500 transition-colors cursor-pointer" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/70 hover:bg-emerald-500 transition-colors cursor-pointer" />
            </div>
            <div className="h-4 w-px bg-white/10" />
            <span className="text-[11px] text-slate-500 font-medium">Sprint Planning — Live</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-[10px] text-rose-400 font-semibold tracking-wide">REC 23:47</span>
            </div>
          </div>
        </div>

        {/* Waveform bar */}
        <div className="px-5 py-3 border-b border-white/[0.04] bg-white/[0.01] flex items-center justify-between">
          <Waveform />
          <div className="flex items-center gap-2 ml-4">
            <div className="flex -space-x-1.5">
              {['bg-purple-500', 'bg-cyan-500', 'bg-pink-500'].map((c, i) => (
                <div key={i} className={`w-5 h-5 rounded-full ${c} border-2 border-[#0a0a16] flex items-center justify-center text-[7px] font-bold text-white`}>
                  {['S', 'D', 'M'][i]}
                </div>
              ))}
            </div>
            <span className="text-[10px] text-slate-600">3 speakers</span>
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
                  ? 'text-purple-400 bg-purple-500/[0.06]'
                  : 'text-slate-500 hover:text-slate-400'
              }`}
            >
              {tab}
              {activeTab === i && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500"
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
                  { name: 'Sarah', color: 'bg-purple-500', textColor: 'text-purple-400', msg: "Let's prioritize the checkout flow redesign. Conversion dropped 12% this month." },
                  { name: 'David', color: 'bg-cyan-500', textColor: 'text-cyan-400', msg: "Agreed. I can have a prototype ready by Wednesday if we freeze the API spec today." },
                  { name: 'Maya', color: 'bg-pink-500', textColor: 'text-pink-400', msg: "I'll run user testing on the current flow today and share findings before EOD." },
                  { name: 'Sarah', color: 'bg-purple-500', textColor: 'text-purple-400', msg: "Perfect. Let's also loop in the analytics team for funnel data." },
                ].map((line, i) => (
                  <motion.div
                    key={i}
                    className="flex gap-3"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.15 }}
                  >
                    <div className={`w-7 h-7 rounded-full ${line.color} flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5 shadow-lg shadow-${line.color}/20`}>
                      {line.name[0]}
                    </div>
                    <div>
                      <span className={`text-[11px] font-semibold ${line.textColor}`}>{line.name}</span>
                      <p className="text-[12px] text-slate-400 leading-relaxed mt-0.5">{line.msg}</p>
                    </div>
                  </motion.div>
                ))}
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
                <div className="rounded-xl bg-gradient-to-br from-purple-500/[0.08] to-cyan-500/[0.04] border border-purple-500/10 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-[11px] font-semibold text-purple-400">AI Summary</span>
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
                    <div key={s.label} className="rounded-lg bg-white/[0.02] border border-white/[0.05] p-3 text-center hover:border-purple-500/20 transition-colors">
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
                  { task: 'Freeze API spec for checkout', owner: 'Sarah', due: 'Today', priority: 'Critical', pColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
                  { task: 'Request funnel data from analytics', owner: 'Sarah', due: 'Tomorrow', priority: 'Medium', pColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-purple-500/20 transition-all duration-300 group cursor-pointer"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="w-4 h-4 rounded border-2 border-white/10 group-hover:border-purple-500/40 transition-colors shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] text-slate-200 font-medium truncate">{item.task}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
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

/* ═══════════════════ FLOATING BADGE ═══════════════════ */

function FloatingBadge({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={`absolute hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] shadow-2xl ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════ FAQ ITEM ═══════════════════ */

function FAQItem({ question, answer, isOpen, onClick }: { question: string; answer: string; isOpen: boolean; onClick: () => void }) {
  return (
    <motion.div
      className="border border-white/[0.06] rounded-2xl overflow-hidden hover:border-purple-500/20 transition-colors duration-300"
      initial={false}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <span className="text-[15px] font-medium text-white pr-4">{question}</span>
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
            transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <div className="px-6 pb-6 text-[14px] text-slate-400 leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ═══════════════════ DATA ═══════════════════ */

const features = [
  {
    icon: Mic,
    title: 'Live Recording & Upload',
    desc: 'Record meetings directly in-browser or upload audio files. Supports MP3, WAV, WebM, and 20+ formats with crystal-clear quality.',
    color: 'text-purple-400',
    bg: 'from-purple-500/20 to-purple-600/5',
    glow: 'rgba(139, 92, 246, 0.15)',
    span: 'md:col-span-2',
  },
  {
    icon: Brain,
    title: 'AI-Powered Summaries',
    desc: 'Advanced AI distills your meeting into key decisions, discussion points, and outcomes in seconds.',
    color: 'text-cyan-400',
    bg: 'from-cyan-500/20 to-cyan-600/5',
    glow: 'rgba(6, 182, 212, 0.15)',
    span: '',
  },
  {
    icon: ListChecks,
    title: 'Smart Action Extraction',
    desc: 'Every task, assignee, and deadline is automatically extracted. Nothing falls through the cracks.',
    color: 'text-pink-400',
    bg: 'from-pink-500/20 to-pink-600/5',
    glow: 'rgba(236, 72, 153, 0.15)',
    span: '',
  },
  {
    icon: Workflow,
    title: 'Seamless Integrations',
    desc: 'Push action items to Slack, Notion, Asana, and Linear. Your workflow stays perfectly connected.',
    color: 'text-emerald-400',
    bg: 'from-emerald-500/20 to-emerald-600/5',
    glow: 'rgba(16, 185, 129, 0.15)',
    span: 'md:col-span-2',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    desc: 'End-to-end encryption, SOC 2 compliance, and data residency options for peace of mind.',
    color: 'text-amber-400',
    bg: 'from-amber-500/20 to-amber-600/5',
    glow: 'rgba(245, 158, 11, 0.15)',
    span: '',
  },
  {
    icon: Globe,
    title: 'Multi-Language Support',
    desc: 'Transcribe and summarize meetings in 30+ languages with automatic language detection.',
    color: 'text-blue-400',
    bg: 'from-blue-500/20 to-blue-600/5',
    glow: 'rgba(59, 130, 246, 0.15)',
    span: '',
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
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    quote: "We went from losing 40% of follow-ups to tracking everything. The Slack integration is seamless — action items just appear in the right channels.",
    name: 'Marcus Webb',
    role: 'Head of Product',
    company: 'SaaS Platform',
    avatar: 'MW',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    quote: "Setup took 3 minutes. First meeting summary blew the team away. Now every team in our company uses it daily without exception.",
    name: 'Elena Torres',
    role: 'COO',
    company: 'Design Studio',
    avatar: 'ET',
    gradient: 'from-pink-500 to-rose-500',
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
    gradient: '',
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/mo',
    desc: 'For teams that ship fast',
    features: ['Unlimited meetings', 'Speaker identification', 'Smart action extraction', 'Slack, Notion, Asana sync', 'Team workspaces', 'Priority support'],
    cta: 'Start Free Trial',
    highlight: true,
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    desc: 'For scaling organizations',
    features: ['Everything in Pro', 'SSO & SAML', 'Custom integrations', 'Dedicated account manager', '99.9% SLA', 'On-premise deployment'],
    cta: 'Talk to Sales',
    highlight: false,
    gradient: '',
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
  const heroScale = useTransform(scrollY, [0, 500], [1, 0.95]);
  const heroY = useTransform(scrollY, [0, 500], [0, 80]);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#06060e] text-white overflow-x-hidden selection:bg-purple-500/20 selection:text-purple-200">

      {/* ═══ NAV ═══ */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        navScrolled
          ? 'bg-[#06060e]/70 backdrop-blur-2xl border-b border-white/[0.04] py-3'
          : 'bg-transparent py-5'
      }`}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-shadow duration-300">
              <Mic className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-[18px] font-bold tracking-tight bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">meetflow</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {['Features', 'How it Works', 'Pricing', 'FAQ'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-[13px] text-slate-400 hover:text-white transition-colors duration-300 relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-[13px] text-slate-400 hover:text-white transition-colors hidden sm:block">
              Log in
            </Link>
            <Link href="/signup" className="group relative inline-flex items-center gap-2 text-[13px] font-semibold px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                Get Started
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
              className="md:hidden overflow-hidden border-t border-white/[0.04] bg-[#06060e]/95 backdrop-blur-xl"
            >
              <div className="px-6 py-4 space-y-3">
                {['Features', 'How it Works', 'Pricing', 'FAQ'].map((item) => (
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
          <AuroraBackground />
          <StarField />
          <div className="absolute inset-0 bg-grid opacity-20" />

          <motion.div
            className="relative z-10 text-center px-6 max-w-4xl mx-auto"
            style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <span className="inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-[12px] font-medium bg-white/[0.04] border border-white/[0.08] text-slate-300 backdrop-blur-xl hover:bg-white/[0.06] transition-colors cursor-default">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-purple-400 opacity-60" />
                  <span className="relative rounded-full h-2 w-2 bg-purple-400" />
                </span>
                Now with real-time transcription
                <ArrowUpRight className="w-3 h-3 text-slate-500" />
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="text-[2.75rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.25rem] font-extrabold tracking-[-0.04em] leading-[1.05] mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <span className="text-white">Meetings that</span>
              <br />
              <TypingText words={['actually lead', 'drive results', 'spark action', 'create impact']} />
              <br />
              <span className="text-white">to action.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-[15px] md:text-lg text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              Record any meeting. Get transcripts, summaries, and action items
              with owners and deadlines — <span className="text-slate-300 font-medium">automatically</span>.
            </motion.p>

            {/* CTA Row */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              <Link href="/signup" className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_70%)]" />
                <span className="relative z-10 flex items-center gap-2">
                  Start Free — No Card Required
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
              </Link>
              <Link href="#how-it-works" className="inline-flex items-center gap-2 px-7 py-4 rounded-full text-sm font-medium text-slate-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.12] backdrop-blur-xl transition-all duration-300 group">
                <Play className="w-3.5 h-3.5 group-hover:text-purple-400 transition-colors" />
                See How It Works
              </Link>
            </motion.div>

            <motion.div
              className="flex items-center justify-center gap-6 text-[12px] text-slate-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Free forever plan</span>
              <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> 2-minute setup</span>
              <span className="hidden sm:flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> No credit card</span>
            </motion.div>
          </motion.div>

          {/* Floating badges */}
          <FloatingBadge delay={1.2} className="top-[25%] left-[8%] animate-float">
            <Brain className="w-4 h-4 text-purple-400" />
            <span className="text-[11px] text-slate-300 font-medium">AI Processing</span>
          </FloatingBadge>
          <FloatingBadge delay={1.5} className="top-[35%] right-[6%] animate-float-delayed">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-[11px] text-slate-300 font-medium">Instant Results</span>
          </FloatingBadge>
          <FloatingBadge delay={1.8} className="bottom-[30%] left-[5%] animate-float-slow">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] text-slate-300 font-medium">Enterprise Secure</span>
          </FloatingBadge>

          {/* Live Demo */}
          <div className="relative z-10 w-full max-w-3xl mx-auto px-6 mt-16">
            <LiveDemo />
          </div>

          <div className="h-8" />
        </section>

        {/* ═══ LOGO BAR ═══ */}
        <section className="relative py-16 border-t border-white/[0.03]">
          <div className="max-w-6xl mx-auto px-6">
            <p className="text-center text-[10px] uppercase tracking-[0.3em] text-slate-600 font-medium mb-10">
              Trusted by innovative teams at
            </p>
            <div className="relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#06060e] to-transparent z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#06060e] to-transparent z-10" />
              <div className="flex animate-marquee whitespace-nowrap">
                {[...logos, ...logos].map((n, i) => (
                  <span key={i} className="text-[16px] font-semibold text-slate-700/40 mx-10 select-none hover:text-slate-500/60 transition-colors duration-300">{n}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ FEATURES BENTO GRID ═══ */}
        <section id="features" className="relative py-28 md:py-40">
          <div className="absolute inset-0 bg-dots opacity-20" />
          {/* Section aurora */}
          <div className="absolute top-[10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-purple-600/[0.03] blur-[120px]" />
          <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-cyan-600/[0.03] blur-[120px]" />

          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <motion.div
              className="max-w-2xl mb-20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 text-[11px] font-bold text-purple-400 uppercase tracking-[0.2em] mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                Features
              </span>
              <h2 className="text-3xl md:text-[2.75rem] font-bold tracking-[-0.02em] mt-3 mb-5 leading-tight">
                Every meeting, <br className="hidden md:block" />
                <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">fully organized.</span>
              </h2>
              <p className="text-slate-400 text-[15px] leading-relaxed max-w-lg">
                From the first word spoken to the last action item tracked — we cover the entire meeting lifecycle with intelligent automation.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-4">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  className={f.span}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <GlowCard glowColor={f.glow} className="h-full">
                    <div className="h-full rounded-2xl bg-white/[0.02] border border-white/[0.06] p-7 transition-all duration-500 hover:bg-white/[0.04] hover:border-white/[0.1] group">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                        <f.icon className={`w-5 h-5 ${f.color}`} />
                      </div>
                      <h3 className="text-[17px] font-semibold tracking-tight mb-2 group-hover:text-white transition-colors">{f.title}</h3>
                      <p className="text-[13px] text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">{f.desc}</p>
                    </div>
                  </GlowCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ HOW IT WORKS ═══ */}
        <section id="how-it-works" className="relative py-28 md:py-40 border-t border-white/[0.03]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(139,92,246,0.03),transparent)]" />
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              className="text-center max-w-2xl mx-auto mb-20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 text-[11px] font-bold text-cyan-400 uppercase tracking-[0.2em] mb-4">
                <MousePointerClick className="w-3.5 h-3.5" />
                How It Works
              </span>
              <h2 className="text-3xl md:text-[2.75rem] font-bold tracking-[-0.02em] mt-3 mb-4">
                Three steps. <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Zero effort.</span>
              </h2>
              <p className="text-slate-400 text-[15px]">
                Go from raw audio to organized, actionable outcomes in minutes.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connector line */}
              <div className="hidden md:block absolute top-[60px] left-[20%] right-[20%] h-px">
                <div className="w-full h-full bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/40 via-pink-500/40 to-cyan-500/40 blur-sm" />
              </div>

              {[
                { num: '01', icon: Upload, title: 'Upload or Record', desc: 'Drop audio or hit record. We support 20+ audio formats out of the box.', color: 'text-purple-400', bg: 'from-purple-500/20 to-purple-600/5', ring: 'ring-purple-500/20', glow: 'shadow-purple-500/20' },
                { num: '02', icon: Sparkles, title: 'AI Processes', desc: 'Transcription, speaker ID, summary, and action extraction — all automatic.', color: 'text-pink-400', bg: 'from-pink-500/20 to-pink-600/5', ring: 'ring-pink-500/20', glow: 'shadow-pink-500/20' },
                { num: '03', icon: Zap, title: 'Review & Act', desc: 'Review results, assign tasks, and push to Slack, Notion, or Asana.', color: 'text-cyan-400', bg: 'from-cyan-500/20 to-cyan-600/5', ring: 'ring-cyan-500/20', glow: 'shadow-cyan-500/20' },
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
                    <div className={`relative w-[80px] h-[80px] rounded-2xl bg-gradient-to-br ${step.bg} ring-1 ${step.ring} flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-xl ${step.glow}`}>
                      <step.icon className={`w-8 h-8 ${step.color}`} />
                      <span className="absolute -top-2.5 -right-2.5 text-[10px] font-bold text-white bg-gradient-to-br from-purple-500 to-pink-500 rounded-full w-7 h-7 flex items-center justify-center shadow-lg shadow-purple-500/30">
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
        <section className="relative py-24 border-y border-white/[0.03] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/[0.02] via-pink-500/[0.02] to-cyan-500/[0.02]" />
          <div className="absolute inset-0 bg-grid opacity-10" />
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
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-4 group-hover:border-purple-500/20 transition-colors">
                    <s.icon className="w-5 h-5 text-slate-500 group-hover:text-purple-400 transition-colors" />
                  </div>
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
        <section className="relative py-28 md:py-40">
          <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] rounded-full bg-pink-600/[0.03] blur-[120px]" />
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              className="text-center max-w-2xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 text-[11px] font-bold text-pink-400 uppercase tracking-[0.2em] mb-4">
                <MessageSquare className="w-3.5 h-3.5" />
                Testimonials
              </span>
              <h2 className="text-3xl md:text-[2.75rem] font-bold tracking-[-0.02em] mt-3 mb-4">
                Teams <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">love</span> it.
              </h2>
              <p className="text-slate-400 text-[15px]">
                Here&apos;s what teams say after switching to meetflow.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-5">
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <GlowCard glowColor="rgba(236, 72, 153, 0.1)">
                    <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-7 flex flex-col hover:border-white/[0.1] transition-all duration-300 h-full">
                      <div className="flex gap-0.5 mb-4">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} className="w-4 h-4 fill-purple-400 text-purple-400" />
                        ))}
                      </div>
                      <p className="text-[14px] text-slate-300 leading-relaxed flex-1 mb-6">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                      <div className="flex items-center gap-3 pt-5 border-t border-white/[0.04]">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-[11px] font-bold text-white shadow-lg`}>
                          {t.avatar}
                        </div>
                        <div>
                          <div className="text-[13px] font-semibold text-white">{t.name}</div>
                          <div className="text-[11px] text-slate-500">{t.role} &middot; {t.company}</div>
                        </div>
                      </div>
                    </div>
                  </GlowCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ PRICING ═══ */}
        <section id="pricing" className="relative py-28 md:py-40 border-t border-white/[0.03]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(139,92,246,0.04),transparent)]" />
          <div className="max-w-5xl mx-auto px-6 relative z-10">
            <motion.div
              className="text-center max-w-2xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 text-[11px] font-bold text-emerald-400 uppercase tracking-[0.2em] mb-4">
                <Zap className="w-3.5 h-3.5" />
                Pricing
              </span>
              <h2 className="text-3xl md:text-[2.75rem] font-bold tracking-[-0.02em] mt-3 mb-4">
                Simple, <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">honest</span> pricing.
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
                  <GlowCard glowColor={plan.highlight ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255,255,255,0.05)'}>
                    <div className={`relative h-full rounded-2xl p-7 flex flex-col transition-all duration-300 ${
                      plan.highlight
                        ? 'bg-gradient-to-b from-purple-500/[0.08] to-pink-500/[0.03] border-2 border-purple-500/20 shadow-2xl shadow-purple-500/[0.05]'
                        : 'bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1]'
                    }`}>
                      {plan.highlight && (
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                          <span className="text-[10px] font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg shadow-purple-500/30">
                            Most Popular
                          </span>
                        </div>
                      )}

                      <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
                      <p className="text-[12px] text-slate-500 mb-4">{plan.desc}</p>
                      <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                        {plan.period && <span className="text-sm text-slate-500">{plan.period}</span>}
                      </div>

                      <ul className="space-y-3 mb-8 flex-1">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-start gap-2.5 text-[13px] text-slate-300">
                            <Check className={`w-4 h-4 shrink-0 mt-0.5 ${plan.highlight ? 'text-purple-400' : 'text-slate-500'}`} />
                            {f}
                          </li>
                        ))}
                      </ul>

                      <Link
                        href="/signup"
                        className={`block text-center text-[13px] font-semibold py-3.5 rounded-full transition-all duration-300 ${
                          plan.highlight
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30'
                            : 'bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.06] hover:border-white/[0.12]'
                        }`}
                      >
                        {plan.cta}
                      </Link>
                    </div>
                  </GlowCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ FAQ ═══ */}
        <section id="faq" className="relative py-28 md:py-40 border-t border-white/[0.03]">
          <div className="absolute inset-0 bg-dots opacity-15" />
          <div className="max-w-3xl mx-auto px-6 relative z-10">
            <motion.div
              className="text-center max-w-2xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 text-[11px] font-bold text-amber-400 uppercase tracking-[0.2em] mb-4">
                <MessageSquare className="w-3.5 h-3.5" />
                FAQ
              </span>
              <h2 className="text-3xl md:text-[2.75rem] font-bold tracking-[-0.02em] mt-3 mb-4">
                Frequently asked <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">questions</span>
              </h2>
              <p className="text-slate-400 text-[15px]">
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
        <section className="relative py-28 md:py-40">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              className="relative text-center rounded-3xl overflow-hidden p-12 md:p-20"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7 }}
            >
              {/* Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-950/50 via-[#0a0a16] to-pink-950/40" />
              <div className="absolute inset-0 bg-grid opacity-15" />
              <div className="absolute inset-[0] rounded-3xl border border-white/[0.06]" />

              {/* Glow blobs */}
              <div className="absolute top-0 left-1/4 w-80 h-80 bg-purple-500/[0.08] rounded-full blur-[120px] animate-aurora-1" />
              <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-pink-500/[0.06] rounded-full blur-[120px] animate-aurora-2" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-cyan-500/[0.04] rounded-full blur-[100px]" />

              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/20 mb-8"
                >
                  <Sparkles className="w-7 h-7 text-purple-400" />
                </motion.div>

                <h2 className="text-3xl md:text-[2.75rem] font-bold tracking-[-0.02em] mb-4 leading-tight">
                  Stop losing action items.
                  <br />
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                    Start shipping outcomes.
                  </span>
                </h2>
                <p className="text-slate-400 text-[15px] max-w-md mx-auto mb-8">
                  Join hundreds of teams who&apos;ve transformed their meetings. Free forever plan, instant setup.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link href="/signup" className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300" />
                    <span className="relative z-10 flex items-center gap-2">
                      Get Started Free
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                  </Link>
                  <Link href="/login" className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-medium text-slate-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300">
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
              <Link href="/" className="flex items-center gap-2.5 mb-4 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/30 transition-shadow">
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
                      <a href="#" className="text-[13px] text-slate-500 hover:text-slate-300 transition-colors duration-300">{link}</a>
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
            <div className="flex items-center gap-4">
              <a href="#" className="text-[11px] text-slate-600 hover:text-slate-400 transition-colors">Privacy</a>
              <a href="#" className="text-[11px] text-slate-600 hover:text-slate-400 transition-colors">Terms</a>
              <a href="#" className="text-[11px] text-slate-600 hover:text-slate-400 transition-colors">Status</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

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
  Plug,
  Video,
  Layers,
  Briefcase,
  Calendar,
  Bot,
  Radio,
  Rocket,
  CheckCircle,
} from 'lucide-react';

/* ═══════════════════ PLATFORM ICONS - REAL BRAND LOGOS ═══════════════════ */
function ZoomIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.64 15.2l-2.4 1.6V12l-3.2 2.133V16H8v-2.667l4.8-3.2V8H9.067L6.667 6.4V8.8l-2.4-1.6v6.4l2.4-1.6v2.4l3.733 2.4H16v-2.667l3.2 2.133V15.2z" fill="#2D8CFF"/>
    </svg>
  );
}

function TeamsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.625 8.438h-3.75V3.188A3.19 3.19 0 0 0 13.687 0h-3.75A3.19 3.19 0 0 0 6.75 3.188v5.25H3a3.188 3.188 0 0 0 0 6.375h3.75v5.25A3.19 3.19 0 0 0 9.938 23.25h3.75a3.19 3.19 0 0 0 3.187-3.187v-5.25h3.75a3.188 3.188 0 0 0 0-6.375z" fill="#6264A7"/>
      <circle cx="18.188" cy="5.813" r="2.813" fill="#6264A7"/>
      <circle cx="18.188" cy="13.5" r="2.813" fill="#6264A7"/>
    </svg>
  );
}

function MeetIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 10.9c-.61 0-1.1.49-1.1 1.1s.49 1.1 1.1 1.1c.61 0 1.1-.49 1.1-1.1s-.49-1.1-1.1-1.1z" fill="#00832d"/>
      <path d="M6.52 14.54c-.58.39-1.38.23-1.76-.36-.35-.53-.17-1.24.38-1.57l6.63-4.11c.65-.4 1.48-.23 1.93.4l.01.01c.39.54.28 1.3-.26 1.7l-6.93 4.93z" fill="#00832d"/>
      <path d="M22 6.55V17.5c0 1.24-1.01 2.25-2.25 2.25h-.75v-3.75c0-1.24-1.01-2.25-2.25-2.25h-3v-3h3c1.24 0 2.25-1.01 2.25-2.25V4.3h.75C20.99 4.3 22 5.31 22 6.55z" fill="#00832d"/>
      <path d="M16.75 8.5V17.5c0 1.24-1.01 2.25-2.25 2.25H4.25C3.01 19.75 2 18.74 2 17.5V6.55c0-1.24 1.01-2.25 2.25-2.25h10.25c1.24 0 2.25 1.01 2.25 2.25v1.95z" fill="#00832d"/>
    </svg>
  );
}

function SlackIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52z" fill="#E01E5A"/>
      <path d="M6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" fill="#36C5F0"/>
      <path d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834z" fill="#2EB67D"/>
      <path d="M8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z" fill="#ECB22E"/>
      <path d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834z" fill="#E01E5A"/>
      <path d="M17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z" fill="#36C5F0"/>
      <path d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52z" fill="#2EB67D"/>
      <path d="M15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" fill="#ECB22E"/>
    </svg>
  );
}

function NotionIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 2.3c-.42-.326-.98-.7-2.055-.607L3.01 3.13c-.466.046-.56.28-.374.466l1.823 1.612zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.934zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952l1.448.327s0 .84-1.168.84l-3.22.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.514.28-.887.747-.933l3.22-.187z" fill="#000"/>
    </svg>
  );
}

function AsanaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.78 12.653c-2.437 0-4.415 1.978-4.415 4.415 0 2.437 1.978 4.415 4.415 4.415 2.437 0 4.415-1.978 4.415-4.415 0-2.437-1.978-4.415-4.415-4.415zm0 6.573c-1.192 0-2.158-.966-2.158-2.158 0-1.192.966-2.158 2.158-2.158 1.192 0 2.158.966 2.158 2.158 0 1.192-.966 2.158-2.158 2.158zM12 12.653c-2.437 0-4.415 1.978-4.415 4.415 0 2.437 1.978 4.415 4.415 4.415 2.437 0 4.415-1.978 4.415-4.415 0-2.437-1.978-4.415-4.415-4.415zm0 6.573c-1.192 0-2.158-.966-2.158-2.158 0-1.192.966-2.158 2.158-2.158 1.192 0 2.158.966 2.158 2.158 0 1.192-.966 2.158-2.158 2.158zM5.22 12.653c-2.437 0-4.415 1.978-4.415 4.415 0 2.437 1.978 4.415 4.415 4.415 2.437 0 4.415-1.978 4.415-4.415 0-2.437-1.978-4.415-4.415-4.415zm0 6.573c-1.192 0-2.158-.966-2.158-2.158 0-1.192.966-2.158 2.158-2.158 1.192 0 2.158.966 2.158 2.158 0 1.192-.966 2.158-2.158 2.158z" fill="#F06A6A"/>
    </svg>
  );
}

function TrelloIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 0H3C1.343 0 0 1.343 0 3v18c0 1.656 1.343 3 3 3h18c1.656 0 3-1.344 3-3V3c0-1.657-1.344-3-3-3zM10.44 18.18c0 .795-.645 1.44-1.44 1.44H4.56c-.795 0-1.44-.646-1.44-1.44V4.56c0-.795.645-1.44 1.44-1.44H9c.795 0 1.44.645 1.44 1.44v13.62zm10.44-6.3c0 .795-.645 1.44-1.44 1.44h-3.84c-.795 0-1.44-.645-1.44-1.44V4.56c0-.795.646-1.44 1.44-1.44h3.84c.795 0 1.44.645 1.44 1.44v7.32z" fill="#0079BF"/>
    </svg>
  );
}

function SalesforceIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M10.006 5.415a4.195 4.195 0 0 1 3.045-1.306c1.56 0 2.954.9 3.576 2.266a5.21 5.21 0 0 1 2.146-.461c2.79 0 5.052 2.17 5.052 4.847 0 2.677-2.262 4.847-5.052 4.847a5.09 5.09 0 0 1-.775-.058c-.54 1.213-1.704 2.054-3.05 2.054a3.79 3.79 0 0 1-1.78-.443c-.54 1.38-1.848 2.35-3.373 2.35-1.739 0-3.191-1.177-3.64-2.791a3.15 3.15 0 0 1-.6.057c-1.862 0-3.372-1.454-3.372-3.247 0-1.065.53-2.01 1.342-2.609a3.81 3.81 0 0 1-.294-1.466c0-2.155 1.79-3.901 3.998-3.901 1.257 0 2.38.57 3.125 1.47z" fill="#00A1E0"/>
    </svg>
  );
}

function HubSpotIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.164 7.93V5.084a2.2 2.2 0 0 0 1.267-1.986 2.24 2.24 0 0 0-2.242-2.223 2.24 2.24 0 0 0-2.24 2.223c0 .849.482 1.576 1.181 1.947v2.88a7.077 7.077 0 0 0-4.018 2.425l-8.55-6.65a2.855 2.855 0 0 0-.108-.896 2.873 2.873 0 0 0-2.867-2.69 2.879 2.879 0 0 0-2.887 2.87 2.879 2.879 0 0 0 2.887 2.87c.656 0 1.26-.22 1.746-.589l8.443 6.57a7.03 7.03 0 0 0-.219 1.762 7.03 7.03 0 0 0 .31 2.058l-2.823 2.4a2.468 2.468 0 0 0-1.51-.52 2.5 2.5 0 0 0-2.5 2.498A2.5 2.5 0 0 0 4.9 22.5a2.5 2.5 0 0 0 2.499-2.498c0-.353-.074-.688-.206-.994l2.682-2.278a7.045 7.045 0 0 0 4.855 1.944 7.045 7.045 0 0 0 5.27-11.746zm-3.894 5.816a1.588 1.588 0 0 1-1.588 1.588 1.588 1.588 0 0 1-1.588-1.588 1.588 1.588 0 0 1 1.588-1.588 1.588 1.588 0 0 1 1.588 1.588z" fill="#FF7A59"/>
    </svg>
  );
}

function ZapierIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.607 8.294l-2.14-2.14a.46.46 0 0 0-.652 0l-2.14 2.14a.462.462 0 0 0 0 .652l2.14 2.14a.46.46 0 0 0 .652 0l2.14-2.14a.462.462 0 0 0 0-.652zM12.96 3.94a.46.46 0 0 0-.652 0L10.17 6.08a.462.462 0 0 0 0 .652l2.14 2.14a.46.46 0 0 0 .652 0l2.14-2.14a.462.462 0 0 0 0-.652l-2.14-2.14zM6.343 3.94a.46.46 0 0 0-.652 0l-2.14 2.14a.462.462 0 0 0 0 .652l2.14 2.14a.46.46 0 0 0 .652 0l2.14-2.14a.462.462 0 0 0 0-.652l-2.14-2.14zm-.657 4.354a.46.46 0 0 0-.652 0l-2.14 2.14a.462.462 0 0 0 0 .652l2.14 2.14a.46.46 0 0 0 .652 0l2.14-2.14a.462.462 0 0 0 0-.652l-2.14-2.14zm6.6 6.6a.46.46 0 0 0-.652 0l-2.14 2.14a.462.462 0 0 0 0 .652l2.14 2.14a.46.46 0 0 0 .652 0l2.14-2.14a.462.462 0 0 0 0-.652l-2.14-2.14zm-6.6 0a.46.46 0 0 0-.652 0l-2.14 2.14a.462.462 0 0 0 0 .652l2.14 2.14a.46.46 0 0 0 .652 0l2.14-2.14a.462.462 0 0 0 0-.652l-2.14-2.14z" fill="#FF4A00"/>
    </svg>
  );
}

function PipedriveIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15V7h2c1.66 0 3 1.34 3 3v1c0 1.66-1.34 3-3 3h-2v3zm2-8h-2v4h2c1.1 0 2-.9 2-2v-.5c0-.83-.67-1.5-1.5-1.5z" fill="#00A0B0"/>
    </svg>
  );
}

function WebexIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2V9h2v8zm6 0h-2V9h2v8z" fill="#00BCF2"/>
      <circle cx="12" cy="7" r="2"/>
    </svg>
  );
}

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

            {/* NEW: Meeting Quality Score */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.35 }}
              whileHover={{ y: -5 }}
              className="md:col-span-1 group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 hover:border-purple-400/50 transition-all duration-500 p-6"
            >
              <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-purple-500/20 text-purple-400 text-[10px] font-semibold">NEW</div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Meeting Quality Score</h3>
              <p className="text-white/50 text-[13px] mb-3">
                AI rates your meetings 0-100 on engagement, clarity, and actionability.
              </p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-purple-400">87</span>
                <span className="text-xs text-white/40">/100 avg score</span>
              </div>
            </motion.div>

            {/* NEW: Decision Registry */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 hover:border-amber-400/50 transition-all duration-500 p-6"
            >
              <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-semibold">NEW</div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                  <circle cx="12" cy="12" r="2"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Decision Registry</h3>
              <p className="text-white/50 text-[13px]">
                AI auto-extracts and tracks every decision made with impact levels.
              </p>
            </motion.div>

            {/* NEW: Sentiment Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.45 }}
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500/10 to-pink-600/5 border border-pink-500/20 hover:border-pink-400/50 transition-all duration-500 p-6"
            >
              <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-pink-500/20 text-pink-400 text-[10px] font-semibold">NEW</div>
              <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-pink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                  <line x1="9" y1="9" x2="9.01" y2="9"/>
                  <line x1="15" y1="9" x2="15.01" y2="9"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Sentiment Timeline</h3>
              <p className="text-white/50 text-[13px] mb-3">
                Track emotional journey with 😊😐😔 indicators throughout meetings.
              </p>
              <div className="flex gap-1">
                <div className="h-6 w-1 bg-green-500/60 rounded-full" />
                <div className="h-4 w-1 bg-green-500/40 rounded-full" />
                <div className="h-8 w-1 bg-green-500/80 rounded-full" />
                <div className="h-5 w-1 bg-yellow-500/60 rounded-full" />
                <div className="h-7 w-1 bg-green-500/70 rounded-full" />
              </div>
            </motion.div>

            {/* NEW: Meeting Cost Calculator */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 hover:border-emerald-400/50 transition-all duration-500 p-6"
            >
              <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold">NEW</div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Meeting Cost Calculator</h3>
              <p className="text-white/50 text-[13px]">
                See real-time cost: people × duration × hourly rate. 💰
              </p>
            </motion.div>

            {/* NEW: Conflict Detector */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.55 }}
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 hover:border-orange-400/50 transition-all duration-500 p-6"
            >
              <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-semibold">NEW</div>
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Conflict Detector</h3>
              <p className="text-white/50 text-[13px]">
                AI spots disagreements and tension points with severity ratings.
              </p>
            </motion.div>

            {/* NEW: Company Memory Search */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              whileHover={{ y: -5 }}
              className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-500 p-6"
            >
              <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-semibold">NEW</div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">Company Memory Search</h3>
                  <p className="text-white/50 text-[13px] mb-3">
                    Full-text search across all meetings, transcripts, and action items. Never lose a decision again.
                  </p>
                  <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                    <svg className="w-4 h-4 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <span className="text-xs text-white/40">Search: &ldquo;Q4 planning decisions&rdquo;</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* NEW: AI Meeting Coach + Voice Summary */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.65 }}
              whileHover={{ y: -5 }}
              className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 border border-indigo-500/20 hover:border-indigo-400/50 transition-all duration-500 p-6"
            >
              <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-semibold">NEW</div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                    <line x1="12" y1="19" x2="12" y2="22"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">AI Meeting Coach & Voice Summary</h3>
                  <p className="text-white/50 text-[13px] mb-3">
                    Real-time coaching suggestions during meetings + Audio summaries for on-the-go listening. 🎧
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs">
                      <span>🎯</span> Live Coaching
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs">
                      <span>🔊</span> Voice Playback
                    </div>
                  </div>
                </div>
              </div>
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

      {/* ═══ INTEGRATIONS SECTION ═══ */}
      <section id="integrations" className="relative py-32 bg-[#050505] overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl" />
        </div>

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
              <Plug className="w-4 h-4 text-lime-400" />
              <span className="text-[12px] font-semibold text-lime-400 uppercase tracking-wider">Integrations</span>
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Works With Your<br />
              <span className="text-gradient-lime">Favorite Tools</span>
            </h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              Our AI bot joins your meetings automatically. No plugins to install, no extensions to configure.
            </p>
          </motion.div>

          {/* Integration Categories */}
          <div className="space-y-12">
            
            {/* Video Conferencing */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Video className="w-5 h-5 text-lime-400" />
                <h3 className="text-lg font-semibold text-white">Video Conferencing</h3>
                <div className="flex-1 h-px bg-white/10" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Zoom', Icon: ZoomIcon, color: 'from-blue-500/20 to-blue-600/10', desc: 'Auto-join & record', status: 'live' },
                  { name: 'Google Meet', Icon: MeetIcon, color: 'from-green-500/20 to-green-600/10', desc: 'Chrome extension', status: 'live' },
                  { name: 'Microsoft Teams', Icon: TeamsIcon, color: 'from-purple-500/20 to-purple-600/10', desc: 'Bot integration', status: 'live' },
                  { name: 'Webex', Icon: WebexIcon, color: 'from-blue-400/20 to-blue-500/10', desc: 'Meeting assistant', status: 'live' },
                ].map((platform, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className={`group relative p-6 rounded-2xl bg-gradient-to-br ${platform.color} border border-white/10 hover:border-lime-400/30 transition-all duration-300`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <platform.Icon className="w-10 h-10 text-white" />
                      {platform.status === 'live' && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-medium text-lime-400 uppercase">LIVE</span>
                          <div className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
                        </div>
                      )}
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-1">{platform.name}</h4>
                    <p className="text-[13px] text-white/50">{platform.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Productivity & Collaboration */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Layers className="w-5 h-5 text-lime-400" />
                <h3 className="text-lg font-semibold text-white">Productivity & Collaboration</h3>
                <div className="flex-1 h-px bg-white/10" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Slack', Icon: SlackIcon, color: 'from-purple-500/20 to-purple-600/10', desc: 'Auto-share summaries' },
                  { name: 'Notion', Icon: NotionIcon, color: 'from-gray-500/20 to-gray-600/10', desc: 'Meeting database' },
                  { name: 'Asana', Icon: AsanaIcon, color: 'from-pink-500/20 to-pink-600/10', desc: 'Task sync' },
                  { name: 'Trello', Icon: TrelloIcon, color: 'from-blue-500/20 to-blue-600/10', desc: 'Card creation' },
                ].map((platform, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className={`group relative p-6 rounded-2xl bg-gradient-to-br ${platform.color} border border-white/10 hover:border-lime-400/30 transition-all duration-300`}
                  >
                    <platform.Icon className="w-10 h-10 text-white mb-4" />
                    <h4 className="text-lg font-semibold text-white mb-1">{platform.name}</h4>
                    <p className="text-[13px] text-white/50">{platform.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CRM & Sales */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Briefcase className="w-5 h-5 text-lime-400" />
                <h3 className="text-lg font-semibold text-white">CRM & Sales</h3>
                <div className="flex-1 h-px bg-white/10" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Salesforce', Icon: SalesforceIcon, color: 'from-blue-400/20 to-blue-500/10', desc: 'Lead tracking' },
                  { name: 'HubSpot', Icon: HubSpotIcon, color: 'from-orange-500/20 to-orange-600/10', desc: 'Contact sync' },
                  { name: 'Pipedrive', Icon: PipedriveIcon, color: 'from-green-500/20 to-green-600/10', desc: 'Deal updates' },
                  { name: 'Zapier', Icon: ZapierIcon, color: 'from-orange-400/20 to-orange-500/10', desc: '5,000+ apps' },
                ].map((platform, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className={`group relative p-6 rounded-2xl bg-gradient-to-br ${platform.color} border border-white/10 hover:border-lime-400/30 transition-all duration-300`}
                  >
                    <platform.Icon className="w-10 h-10 text-white mb-4" />
                    <h4 className="text-lg font-semibold text-white mb-1">{platform.name}</h4>
                    <p className="text-[13px] text-white/50">{platform.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

          </div>

          {/* How It Works - Auto Recording */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-20"
          >
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-lime-400/10 to-lime-500/5 border border-lime-400/20 p-8 md:p-12">
              <div className="absolute top-0 right-0 w-64 h-64 bg-lime-400/10 rounded-full blur-3xl" />
              
              <div className="relative grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Auto-Recording Bot
                  </h3>
                  <p className="text-white/60 text-lg mb-8">
                    Our AI bot automatically joins your scheduled meetings and starts recording. No manual intervention needed.
                  </p>
                  
                  <div className="space-y-4">
                    {[
                      { step: '1', text: 'Connect your calendar (Google/Outlook)' },
                      { step: '2', text: 'AI bot auto-joins scheduled meetings' },
                      { step: '3', text: 'Recording & transcription starts automatically' },
                      { step: '4', text: 'Insights delivered to your preferred tools' },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.7 + i * 0.1 }}
                        className="flex items-center gap-4"
                      >
                        <div className="w-10 h-10 rounded-full bg-lime-400/20 flex items-center justify-center">
                          <span className="text-lime-400 font-bold">{item.step}</span>
                        </div>
                        <span className="text-white/80">{item.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <div className="relative rounded-2xl bg-black/40 border border-white/10 p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="ml-4 text-sm text-white/40">AI Meeting Bot</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <ZoomIcon className="w-6 h-6 text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-white">Zoom Meeting</div>
                          <div className="text-xs text-lime-400 flex items-center gap-1">
                            <Bot className="w-3 h-3" /> Bot joined • Recording...
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-red-400 uppercase font-medium">REC</span>
                          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <TeamsIcon className="w-6 h-6 text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-white">Teams Call</div>
                          <div className="text-xs text-white/40">Scheduled in 15 min</div>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                          <MeetIcon className="w-6 h-6 text-green-400" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-white">Google Meet</div>
                          <div className="text-xs text-lime-400 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Processing transcript...
                          </div>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-16 text-center"
          >
            <Link
              href="/signup"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-lime-400 text-black font-semibold text-[15px] hover:bg-lime-300 transition-all duration-300 group"
            >
              <Plug className="w-5 h-5" />
              Connect Your Tools
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
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

      {/* ═══ POWER SECTION ═══ */}
      <section id="power" className="relative py-32 bg-[#050505] overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-lime-400/10 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-lime-400/5 rounded-full blur-[80px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <motion.div
            className="text-center max-w-3xl mx-auto mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lime-400/10 border border-lime-400/20 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Rocket className="w-4 h-4 text-lime-400" />
              <span className="text-[12px] font-semibold text-lime-400 uppercase tracking-wider">Why Teams Choose Us</span>
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Never Miss a<br />
              <span className="text-gradient-lime">Critical Moment</span>
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              While others take notes, you'll be fully present. Our AI captures everything, 
              so you never have to choose between listening and documenting.
            </p>
          </motion.div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              {
                icon: Bot,
                title: "AI Bot Joins Automatically",
                desc: "No extensions. No plugins. Our bot detects your scheduled meetings and joins without you lifting a finger.",
                stat: "100%",
                statLabel: "Hands-free",
                color: "lime"
              },
              {
                icon: Brain,
                title: "Smarter Than Notes",
                desc: "Not just transcription. Action items, decisions, blockers, and sentiment—all extracted automatically.",
                stat: "95%",
                statLabel: "Accuracy",
                color: "cyan"
              },
              {
                icon: Zap,
                title: "Instant Share to 50+ Tools",
                desc: "Summaries land in Slack, tasks sync to Asana, deals update in Salesforce. Zero manual work.",
                stat: "3s",
                statLabel: "Sync time",
                color: "amber"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -8 }}
                className="group relative p-8 rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 hover:border-lime-400/30 transition-all duration-500"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${
                  feature.color === 'lime' ? 'from-lime-400/10' : 
                  feature.color === 'cyan' ? 'from-cyan-400/10' : 
                  'from-amber-400/10'
                } via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`} />
                
                <div className="relative">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                    feature.color === 'lime' ? 'bg-lime-400/20' : 
                    feature.color === 'cyan' ? 'bg-cyan-400/20' : 
                    'bg-amber-400/20'
                  }`}>
                    <feature.icon className={`w-7 h-7 ${
                      feature.color === 'lime' ? 'text-lime-400' : 
                      feature.color === 'cyan' ? 'text-cyan-400' : 
                      'text-amber-400'
                    }`} />
                  </div>
                  
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className={`text-4xl font-bold ${
                      feature.color === 'lime' ? 'text-lime-400' : 
                      feature.color === 'cyan' ? 'text-cyan-400' : 
                      'text-amber-400'
                    }`}>{feature.stat}</span>
                    <span className="text-sm text-white/50">{feature.statLabel}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-white/50 text-[15px] leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Social Proof + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="relative rounded-3xl bg-gradient-to-br from-lime-400/20 via-lime-400/5 to-transparent border border-lime-400/30 p-8 md:p-12"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex -space-x-3">
                    {[1,2,3,4,5].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-lime-400/30 to-lime-400/10 border-2 border-black flex items-center justify-center text-[10px] font-bold text-lime-400">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <div className="flex items-center gap-1 text-amber-400 mb-1">
                      {[1,2,3,4,5].map((i) => (
                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-white/60">Trusted by 10,000+ teams</p>
                  </div>
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-4">
                  Join the Meeting Revolution
                </h3>
                <p className="text-white/50 mb-6">
                  Stop taking notes. Start having better conversations. 
                  Get started free—no credit card required.
                </p>
                
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-lime-400 text-black font-semibold text-[15px] hover:bg-lime-300 transition-all duration-300 group"
                  >
                    Start Free Trial
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <div className="flex items-center gap-2 text-white/40 text-sm">
                    <CheckCircle className="w-4 h-4 text-lime-400" />
                    14-day free trial
                  </div>
                </div>
              </div>
              
              {/* Mini Demo Preview */}
              <div className="relative hidden md:block">
                <div className="relative rounded-2xl bg-black/50 border border-white/10 p-6 overflow-hidden">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    </div>
                    <span className="ml-2 text-xs text-white/40">AI Processing...</span>
                  </div>
                  
                  <div className="space-y-3">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-2 bg-gradient-to-r from-lime-400/50 to-lime-400 rounded-full"
                    />
                    <div className="flex gap-3">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: "70%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                        className="h-2 bg-white/20 rounded-full"
                      />
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: "30%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.9 }}
                        className="h-2 bg-lime-400/30 rounded-full"
                      />
                    </div>
                    <div className="flex gap-2 mt-4">
                      <span className="px-3 py-1 rounded-full bg-lime-400/20 text-lime-400 text-xs">Action Items: 5</span>
                      <span className="px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-400 text-xs">Decisions: 3</span>
                    </div>
                  </div>
                </div>
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

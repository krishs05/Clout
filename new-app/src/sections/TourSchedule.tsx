import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, Settings, Container, ExternalLink, ChevronRight } from 'lucide-react';
import { tourScheduleConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

// Custom Extend Icon Component
const ExtendIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
);

const TourSchedule = () => {
  // Null check: if config is empty, do not render
  if (tourScheduleConfig.tourDates.length === 0 && !tourScheduleConfig.sectionTitle) {
    return null;
  }

  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [, setActiveStep] = useState<number>(0);
  const [isVisible, setIsVisible] = useState(false);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 80%',
      onEnter: () => setIsVisible(true),
    });

    scrollTriggerRef.current = st;

    return () => {
      st.kill();
    };
  }, []);

  useEffect(() => {
    if (!isVisible || !contentRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current?.querySelectorAll('.step-item') || [],
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power3.out',
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [isVisible]);

  const getStepIcon = (step: string) => {
    const iconClass = "w-6 h-6";
    switch (step.toLowerCase()) {
      case 'github':
        return <Github className={iconClass} />;
      case 'environment':
        return <Settings className={iconClass} />;
      case 'docker':
        return <Container className={iconClass} />;
      case 'extend':
        return <ExtendIcon className={iconClass} />;
      default:
        return <ChevronRight className={iconClass} />;
    }
  };

  const getStepColor = (step: string) => {
    switch (step.toLowerCase()) {
      case 'github':
        return 'from-indigo-500/20 to-violet-500/20 text-indigo-400';
      case 'environment':
        return 'from-amber-500/20 to-orange-500/20 text-amber-400';
      case 'docker':
        return 'from-sky-500/20 to-blue-500/20 text-sky-400';
      case 'extend':
        return 'from-emerald-500/20 to-teal-500/20 text-emerald-400';
      default:
        return 'from-zinc-500/20 to-zinc-600/20 text-zinc-400';
    }
  };

  const STEPS = tourScheduleConfig.tourDates;

  return (
    <section
      id="docs"
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#0a0a0b] py-24 overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

      {/* Content container */}
      <div ref={contentRef} className="relative z-20 max-w-7xl mx-auto px-6 md:px-12">
        {/* Section header */}
        <div className="mb-16 text-center">
          <p className="font-mono-custom text-xs text-indigo-400 uppercase tracking-wider mb-3">
            {tourScheduleConfig.sectionLabel}
          </p>
          <h2 className="font-display text-4xl md:text-6xl text-white tracking-tight">
            {tourScheduleConfig.sectionTitle}
          </h2>
          <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">
            {tourScheduleConfig.bottomNote}
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, index) => {
            const gradientColor = getStepColor(step.city);
            const Icon = getStepIcon(step.city);

            return (
              <div
                key={step.id}
                className="step-item group relative"
                onMouseEnter={() => setActiveStep(index)}
              >
                <div className="relative p-6 rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300 h-full">
                  {/* Step number */}
                  <div className="absolute -top-3 -left-2 font-mono-custom text-5xl font-bold text-white/[0.03] select-none">
                    {step.date}
                  </div>

                  {/* Icon container */}
                  <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${gradientColor} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent" />
                    {Icon}
                  </div>

                  {/* Content */}
                  <h3 className="font-display text-xl text-white mb-2">
                    {step.city}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                    {step.venue}
                  </p>

                  {/* Action link */}
                  <button className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors group/btn">
                    <span>{tourScheduleConfig.buyButtonText}</span>
                    <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>

                  {/* Active indicator */}
                  <div className={`absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <a
            href="https://github.com/clout-bot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/25"
          >
            <Github className="w-5 h-5" />
            <span>{tourScheduleConfig.bottomCtaText}</span>
          </a>
        </div>
      </div>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
};

export default TourSchedule;

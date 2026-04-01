import { ShieldCheck, Zap, Maximize, Layers, Unlock, Activity, Compass } from 'lucide-react';
import Reveal from '@/src/components/hade/animation/Reveal';

const PhilosophyLayer = () => {
  const principles = [
    { label: 'Adaptation', text: 'The tools follow the person, not the other way around.', icon: <Zap size={14} className='text-cyberLime' strokeWidth={2.5} /> },
    { label: 'Utility', text: 'Helping the system work with people and context.', icon: <ShieldCheck size={14} className='text-cyberLime' strokeWidth={2.5} /> },
    { label: 'Depth', text: "Understand the 'why' behind every click.", icon: <Maximize size={14} className='text-cyberLime' strokeWidth={2.5} /> },
    { label: 'Scale', text: 'Build for the journey, not just the screen.', icon: <Layers size={14} className='text-cyberLime' strokeWidth={2.5} /> },
  ];

  return (
    <section className='py-8'>
      <Reveal delay={100}>
        <div className='relative w-full rounded-[40px] bg-[#0A0A0B] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.25)] overflow-hidden'>
          <div className='grid lg:grid-cols-[1fr_1.1fr] items-stretch'>

            {/* Left Column */}
            <div className='p-6 md:p-10 lg:p-12 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col'>
              <div className='mb-8 md:mb-10'>
                <div className='flex items-center gap-3 mb-6'>
                  <Compass size={16} className='text-cyberLime/80' strokeWidth={1.5} />
                  <p className='font-mono text-[9px] uppercase tracking-[.4em] text-white/40 font-bold'>
                    Foundation // Why HADE exists
                  </p>
                </div>

                <h2 className='text-4xl md:text-5xl font-semibold text-white mb-5'>Philosophy</h2>
                <p className='text-xl md:text-2xl font-medium text-white/90 italic leading-snug'>
                  "Design that actually listens."
                </p>

                <p className='mt-5 text-base text-white/50 leading-relaxed max-w-md'>
                  Most tools are built for a generic user state, forcing every interaction down the same rigid path.
                  <br /><br />
                  A truly intelligent interface should observe context and adapt in real{`\u00A0`}time.
                </p>
              </div>

              {/* Visual Element / Topology Graphic */}
              <div className='relative w-full h-32 mt-auto opacity-40'>
                <svg viewBox='0 0 400 120' className='w-full h-full text-white/20'>
                  <line x1='0' y1='60' x2='400' y2='60' stroke='currentColor' strokeWidth='0.5' strokeDasharray='4 8' />
                  <path d='M 20 60 Q 100 60, 150 40 T 280 80 T 380 60' fill='none' stroke='url(#gradient-lime)' strokeWidth='1.5' />
                  {[40, 150, 280, 350].map((x, i) => (
                    <circle key={i} cx={x} cy={60} r='1.5' fill='currentColor' />
                  ))}
                  <text x='20' y='100' className='fill-white/20 font-mono text-[8px] tracking-[.2em] uppercase'>Human Pace</text>
                  <text x='320' y='20' className='fill-cyberLime font-mono text-[8px] tracking-[.2em] uppercase font-bold'>The Adjustment</text>

                  <defs>
                    <linearGradient id='gradient-lime' x1='0%' y1='0%' x2='100%' y2='0%'>
                      <stop offset='0%' stopColor='rgba(255,255,255,0.1)' />
                      <stop offset='50%' stopColor='#A3E635' />
                      <stop offset='100%' stopColor='rgba(255,255,255,0.1)' />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className='mt-10 flex items-center gap-6 relative z-10'>
                <div className='h-px flex-1 bg-white/5' />
                <div className='flex items-center gap-2'>
                  <div className='h-1.5 w-1.5 rounded-full bg-cyberLime' />
                  <span className='font-mono text-[8px] uppercase tracking-[.3em] text-white/30 font-bold'>Living System</span>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className='bg-[#0D0D0E] p-6 md:p-10 lg:p-12'>
              <div className='flex items-center gap-2 mb-8'>
                <Activity size={12} className='text-white/20' />
                <p className='font-mono text-[9px] uppercase tracking-[.4em] text-white/40 font-bold'>The belief system</p>
              </div>

              <div className='grid gap-px bg-white/5 rounded-2xl border border-white/5 overflow-hidden'>
                {principles.map((p, i) => (
                  <div key={p.label} className='flex items-start gap-4 p-5 md:p-6 bg-[#0A0A0B]'>
                    <div className='flex flex-col items-center'>
                      <p className='text-[8px] text-white/50'>0{i + 1}</p>
                      <div className='p-2'>{p.icon}</div>
                    </div>
                    <div>
                      <p className='text-[8px] uppercase text-cyberLime/70 mb-1'>{p.label}</p>
                      <p className='text-sm text-white/80'>{p.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className='mt-8 flex justify-between items-end'>
                <p className='text-[10px] font-mono text-white/50 leading-relaxed italic max-w-[240px]'>// Mapping the space between intention and action.</p>
                <Unlock size={14} className='text-white/5' />
              </div>
            </div>

          </div>
        </div>
      </Reveal>

      <Reveal delay={300}>
        <div className='mt-10 flex justify-center'>
          <p className='text-[10px] text-ink/20'>HADE Systems · 2026</p>
        </div>
      </Reveal>
    </section>
  );
};

export default PhilosophyLayer;
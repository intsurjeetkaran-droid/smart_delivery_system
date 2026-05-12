import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  motion, useInView, useScroll,
  useTransform,
} from 'framer-motion'
import {
  Truck, MapPin, BarChart3, Users, Zap, Bell,
  ArrowRight, CheckCircle, Package, Navigation,
  Shield, Clock, ChevronDown,
} from 'lucide-react'

// ─── Animation variants ───────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

const stagger = (delay = 0.1) => ({
  hidden: {},
  show:   { transition: { staggerChildren: delay } },
})

// ─── Scroll-triggered section wrapper ────────────────────────────────────────

const Section: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      variants={stagger(0.12)}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── Animated counter ─────────────────────────────────────────────────────────

const Counter: React.FC<{ target: string }> = ({ target }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [display, setDisplay] = useState('0')
  const num = parseInt(target.replace(/\D/g, ''))
  const suffix = target.replace(/[0-9]/g, '')

  useEffect(() => {
    if (!inView || isNaN(num)) { setDisplay(target); return }
    let start = 0
    const duration = 1400
    const step = 16
    const increment = num / (duration / step)
    const timer = setInterval(() => {
      start += increment
      if (start >= num) { setDisplay(target); clearInterval(timer) }
      else setDisplay(Math.floor(start) + suffix)
    }, step)
    return () => clearInterval(timer)
  }, [inView, num, suffix, target])

  return <span ref={ref}>{display}</span>
}

// ─── Floating delivery card (hero decoration) ─────────────────────────────────

const FloatingCard: React.FC<{
  icon: React.ReactNode; label: string; value: string
  className?: string; delay?: number
}> = ({ icon, label, value, className = '', delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    className={`absolute bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl ${className}`}
  >
    <div className="w-9 h-9 bg-brand-500/20 rounded-xl flex items-center justify-center text-brand-300">
      {icon}
    </div>
    <div>
      <div className="text-xs text-white/50 leading-none">{label}</div>
      <div className="text-sm font-bold text-white mt-0.5">{value}</div>
    </div>
  </motion.div>
)

// ─── Data ─────────────────────────────────────────────────────────────────────

const features = [
  {
    icon: <MapPin size={22} />, title: 'Route Optimization',
    desc: 'Nearest-neighbour TSP algorithm finds the most efficient multi-stop delivery sequence with real ETA.',
    color: 'text-brand-600', bg: 'bg-brand-50', border: 'hover:border-brand-200',
  },
  {
    icon: <Navigation size={22} />, title: 'Real-Time Tracking',
    desc: 'Live GPS via Socket.IO. Customers watch their driver move on an interactive map as it happens.',
    color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'hover:border-indigo-200',
  },
  {
    icon: <BarChart3 size={22} />, title: 'Order Dashboard',
    desc: 'Full lifecycle management — pending to delivered — with status filters and instant search.',
    color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'hover:border-emerald-200',
  },
  {
    icon: <Shield size={22} />, title: 'Role-Based Access',
    desc: 'JWT + RBAC enforced on every endpoint. Customers, drivers, and admins each see exactly what they need.',
    color: 'text-purple-600', bg: 'bg-purple-50', border: 'hover:border-purple-200',
  },
  {
    icon: <Zap size={22} />, title: 'Instant Assignment',
    desc: 'Admins assign drivers in one click. Order status auto-updates across the entire platform.',
    color: 'text-amber-600', bg: 'bg-amber-50', border: 'hover:border-amber-200',
  },
  {
    icon: <Bell size={22} />, title: 'Notifications',
    desc: 'Email alerts for order updates, delivery confirmations, and important status changes.',
    color: 'text-rose-600', bg: 'bg-rose-50', border: 'hover:border-rose-200',
  },
]

const stats = [
  { value: '6',    label: 'Microservices',  sub: 'Independent & scalable' },
  { value: '48',   label: 'Tests Passing',  sub: 'Full integration coverage' },
  { value: '3',    label: 'User Roles',     sub: 'Customer · Driver · Admin' },
  { value: '100%', label: 'Real-Time',      sub: 'Socket.IO powered' },
]

const steps = [
  { n: '01', icon: <Users size={20} />,    title: 'Register',       desc: 'Create an account as customer, driver, or admin.' },
  { n: '02', icon: <Package size={20} />,  title: 'Place Order',    desc: 'Submit pickup and delivery addresses instantly.' },
  { n: '03', icon: <MapPin size={20} />,   title: 'Optimize Route', desc: 'TSP algorithm finds the most efficient stop order.' },
  { n: '04', icon: <Truck size={20} />,    title: 'Track Live',     desc: 'Driver streams GPS. Customer watches on the map.' },
]

const perks = ['No credit card required', 'All roles included', 'Real-time tracking']

// ─── Component ────────────────────────────────────────────────────────────────

const HomePage: React.FC = () => {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY    = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="bg-navy-800/95 backdrop-blur-md text-white sticky top-0 z-50 border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center"
            >
              <Truck size={18} />
            </motion.div>
            <span className="font-bold text-lg">Smart<span className="text-brand-400">Delivery</span></span>
          </div>
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link to="/login" className="text-sm text-white/70 hover:text-white transition-colors px-3 py-2">
                Login
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/register" className="text-sm font-semibold bg-brand-500 hover:bg-brand-400 px-4 py-2 rounded-xl transition-colors">
                Get Started
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 text-white overflow-hidden min-h-[92vh] flex items-center">

        {/* Background grid */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

        {/* Glow blobs */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 -left-32 w-96 h-96 bg-brand-500 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-1/4 -right-32 w-80 h-80 bg-indigo-500 rounded-full blur-3xl pointer-events-none"
        />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 w-full">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm text-white/80 mb-8"
            >
              <motion.div
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-brand-400 rounded-full"
              />
              Microservices · Real-Time · Route Optimization
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.08] tracking-tight mb-6"
            >
              Smart Delivery &{' '}
              <span className="relative inline-block">
                <span className="text-brand-400">Route Optimization</span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1, duration: 0.6, ease: 'easeOut' }}
                  className="absolute -bottom-1 left-0 right-0 h-1 bg-brand-400/40 rounded-full origin-left"
                />
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-xl text-white/65 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              A full-stack microservices platform for intelligent delivery management —
              real-time GPS tracking, TSP route optimization, and role-based order control.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link to="/register"
                  className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors shadow-lg shadow-brand-500/30 text-base">
                  Start for Free <ArrowRight size={18} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link to="/login"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-base">
                  Sign In
                </Link>
              </motion.div>
            </motion.div>

            {/* Floating decoration cards */}
            <div className="relative mt-20 h-16 hidden lg:block">
              <FloatingCard icon={<Package size={18} />}  label="New Order"       value="Koramangala → HSR"   className="-left-8 -top-4"  delay={0.9} />
              <FloatingCard icon={<Navigation size={18} />} label="Driver Location" value="12.9352, 77.6245"  className="left-1/2 -translate-x-1/2 -top-8" delay={1.1} />
              <FloatingCard icon={<Clock size={18} />}    label="ETA"             value="28 min remaining"    className="-right-8 -top-4" delay={1.3} />
            </div>
          </div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30 text-xs"
        >
          <span>Scroll</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronDown size={16} />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      <section className="bg-navy-900 text-white py-14 px-4">
        <Section className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div key={s.label} variants={fadeUp} custom={i} className="text-center group">
              <div className="text-4xl font-extrabold text-brand-400 mb-1 tabular-nums">
                <Counter target={s.value} />
              </div>
              <div className="text-sm font-semibold text-white">{s.label}</div>
              <div className="text-xs text-white/40 mt-0.5">{s.sub}</div>
            </motion.div>
          ))}
        </Section>
      </section>

      {/* ── Features ───────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <Section className="text-center mb-16">
            <motion.p variants={fadeUp} className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-3">
              Platform Features
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 max-w-xl mx-auto text-lg">
              Built on a microservices architecture with 6 independent services, each handling a specific domain.
            </motion.p>
          </Section>

          <Section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -6, boxShadow: '0 12px 32px -8px rgba(0,0,0,0.12)' }}
                className={`bg-white rounded-2xl p-6 border border-gray-100 ${f.border} transition-colors cursor-default`}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center mb-5`}
                >
                  <span className={f.color}>{f.icon}</span>
                </motion.div>
                <h3 className="font-semibold text-gray-900 mb-2 text-base">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <Section className="text-center mb-16">
            <motion.p variants={fadeUp} className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-3">
              Workflow
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl font-bold text-gray-900 mb-4">
              How it works
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 text-lg">
              From order placement to delivery in four steps
            </motion.p>
          </Section>

          <Section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <motion.div key={s.n} variants={fadeUp} custom={i} className="relative">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
                    className="hidden lg:block absolute top-6 h-px bg-gradient-to-r from-brand-300 to-gray-200 origin-left z-0"
                    style={{ left: '3.5rem', right: '-1rem' }}
                  />
                )}
                <div className="relative z-10">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="w-12 h-12 bg-brand-500 text-white rounded-2xl flex items-center justify-center mb-4 shadow-md shadow-brand-500/30"
                  >
                    {s.icon}
                  </motion.div>
                  <div className="text-xs font-bold text-brand-400 mb-1 tracking-widest">{s.n}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* ── Testimonial / highlight strip ──────────────────────────────────── */}
      <section className="py-16 px-4 bg-navy-800 overflow-hidden">
        <Section className="max-w-4xl mx-auto text-center">
          <motion.div variants={fadeUp} className="text-white/40 text-sm uppercase tracking-widest mb-6">
            Built for real delivery operations
          </motion.div>
          <motion.blockquote variants={fadeUp} className="text-2xl sm:text-3xl font-semibold text-white leading-snug mb-8">
            "Instead of calling drivers on the phone and guessing routes,{' '}
            <span className="text-brand-400">everything is managed digitally</span> — orders,
            assignments, tracking, and routes — all in one place."
          </motion.blockquote>
          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-6 text-white/50 text-sm">
            {['E-commerce stores', 'Food delivery', 'Courier services', 'Pharmacies', 'Grocery delivery'].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle size={13} className="text-brand-400" /> {t}
              </span>
            ))}
          </motion.div>
        </Section>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 relative overflow-hidden bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl pointer-events-none"
        />

        <Section className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-extrabold text-white mb-5 leading-tight">
            Ready to get started?
          </motion.h2>
          <motion.p variants={fadeUp} className="text-brand-100 mb-10 text-lg max-w-xl mx-auto">
            Create your account and start managing deliveries in minutes.
            All roles, all features, no setup required.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.97 }}>
              <Link to="/register"
                className="inline-flex items-center gap-2 bg-white text-brand-600 font-bold px-10 py-4 rounded-xl hover:bg-brand-50 transition-colors shadow-xl text-base">
                Create Free Account <ArrowRight size={18} />
              </Link>
            </motion.div>
          </motion.div>
          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-6 mt-10 text-brand-100 text-sm">
            {perks.map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle size={14} /> {t}
              </span>
            ))}
          </motion.div>
        </Section>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="bg-navy-900 text-white/50 py-8 px-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brand-500 rounded-md flex items-center justify-center">
              <Truck size={13} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-white">
              Smart<span className="text-brand-400">Delivery</span>
            </span>
          </div>
          <p className="text-xs text-center">
            © 2026 Smart Delivery & Route Optimization System · Built by{' '}
            <a href="https://github.com/intsurjeetkaran-droid" target="_blank" rel="noreferrer"
              className="text-brand-400 hover:text-brand-300 transition-colors">
              Surjeet Akaran
            </a>
          </p>
        </div>
      </footer>

    </div>
  )
}

export default HomePage

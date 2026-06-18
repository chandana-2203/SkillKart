import { useState, useEffect } from "react";
import {
  ShoppingCart, Moon, Sun, Star, Plus, Minus, Trash2,
  CheckCircle, ArrowRight, Code2, Brain, Database,
  Layers, BookOpen, GraduationCap, Users, TrendingUp,
  Sparkles, Trophy, Globe, Tag, BarChart3,
  Clock, Shield, Zap, X, Check, Rocket,
  Flame,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  category: string;
  image: string;
  badge?: string;
  lessons: number;
  hours: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface CheckoutData {
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  couponCode?: string;
}

type Page = "landing" | "marketplace" | "cart" | "success" | "about";

// ─── Data ─────────────────────────────────────────────────────────────────────

const PRODUCTS: Product[] = [
  {
    id: 1,
    title: "DSA Interview Mastery",
    description:
      "300+ curated problems with pattern recognition, time complexity drills, and FAANG-specific question banks.",
    price: 999,
    rating: 4.8,
    category: "Interview Prep",
    image:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=220&fit=crop&auto=format",
    badge: "Bestseller",
    lessons: 85,
    hours: "40 hrs",
  },
  {
    id: 2,
    title: "AWS Cloud Essentials",
    description:
      "Prepare for AWS Solutions Architect with hands-on labs, architecture diagrams, and timed practice exams.",
    price: 1499,
    rating: 4.9,
    category: "Cloud Computing",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=220&fit=crop&auto=format",
    badge: "Top Rated",
    lessons: 120,
    hours: "60 hrs",
  },
  {
    id: 3,
    title: "React Pro Toolkit",
    description:
      "Advanced hooks, performance patterns, TypeScript integration, and testing with Vitest and Playwright.",
    price: 799,
    rating: 4.7,
    category: "Web Development",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=220&fit=crop&auto=format",
    lessons: 65,
    hours: "30 hrs",
  },
  {
    id: 4,
    title: "SQL Interview Handbook",
    description:
      "Complex joins, window functions, query optimization, and real interview problems from top tech companies.",
    price: 499,
    rating: 4.8,
    category: "Database",
    image:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=220&fit=crop&auto=format",
    lessons: 45,
    hours: "20 hrs",
  },
  {
    id: 5,
    title: "AI Engineering Crash Course",
    description:
      "Build production LLM apps with RAG pipelines, vector DBs, fine-tuning, and responsible AI engineering.",
    price: 1999,
    rating: 5.0,
    category: "Artificial Intelligence",
    image:
      "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=220&fit=crop&auto=format",
    badge: "New",
    lessons: 95,
    hours: "50 hrs",
  },
  {
    id: 6,
    title: "System Design Fundamentals",
    description:
      "Design Twitter, Netflix, and Uber at scale — load balancing, sharding, CDNs, and microservices.",
    price: 1299,
    rating: 4.9,
    category: "System Design",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=220&fit=crop&auto=format",
    badge: "Hot",
    lessons: 75,
    hours: "35 hrs",
  },
];

const COUPONS: Record<string, number> = { LEARN10: 10, LEARN20: 20 };

const FEATURED_IDS = [1, 2, 5];

const BADGE_STYLES: Record<string, string> = {
  Bestseller: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Top Rated": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  New: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
  Hot: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
};

const CATEGORY_PILL: Record<string, string> = {
  "Interview Prep": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  "Cloud Computing": "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  "Web Development": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  Database: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  "Artificial Intelligence": "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  "System Design": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i < Math.floor(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-slate-200 text-slate-200 dark:fill-slate-600 dark:text-slate-600"
          }`}
        />
      ))}
      <span className="text-xs font-bold text-amber-500 ml-0.5">{rating.toFixed(1)}</span>
    </div>
  );
}

function SectionLabel({ num, title }: { num: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-1 rounded-lg font-mono tracking-wider">
        {num}
      </span>
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar({
  page,
  setPage,
  dark,
  setDark,
  cartCount,
}: {
  page: Page;
  setPage: (p: Page) => void;
  dark: boolean;
  setDark: (d: boolean) => void;
  cartCount: number;
}) {
  const links: { label: string; id: Page }[] = [
    { label: "Home", id: "landing" },
    { label: "Marketplace", id: "marketplace" },
    { label: "About Project", id: "about" },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/75 dark:bg-slate-900/80 border-b border-black/5 dark:border-white/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <button onClick={() => setPage("landing")} className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
            Skill<span className="text-indigo-600 dark:text-indigo-400">Kart</span>
          </span>
        </button>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1 flex-1">
          {links.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => setPage(id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
                page === id
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setDark(!dark)}
            aria-label="Toggle dark mode"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-all"
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setPage("cart")}
            aria-label="Shopping cart"
            className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-all"
          >
            <ShoppingCart className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}

// ─── Hero Illustration ────────────────────────────────────────────────────────

function HeroIllustration() {
  return (
    <div className="relative h-[460px] hidden lg:block">
      <div className="absolute top-10 left-8 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-6 right-4 w-52 h-52 bg-cyan-400/20 rounded-full blur-3xl" />

      {/* Main progress card */}
      <div className="absolute top-10 left-4 right-12 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-5 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0">
            <Code2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-bold text-sm leading-tight">DSA Interview Mastery</div>
            <div className="text-white/60 text-xs mt-0.5">Interview Preparation</div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-white font-bold text-sm">68%</div>
            <div className="text-white/50 text-xs">Done</div>
          </div>
        </div>
        <div className="h-2 bg-white/10 rounded-full mb-4 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-400 to-indigo-400 rounded-full" style={{ width: "68%" }} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["Arrays", "Trees", "Dynamic Programming", "Graphs"].map((tag) => (
            <span key={tag} className="text-xs px-2.5 py-1 rounded-lg bg-white/10 text-white/75 border border-white/10">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Achievement badge */}
      <div className="absolute top-2 right-0 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3.5 shadow-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-400/20 flex items-center justify-center">
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-white text-sm font-bold leading-tight">50 Solved!</div>
            <div className="text-white/50 text-xs">Today's milestone</div>
          </div>
        </div>
      </div>

      {/* Streak */}
      <div className="absolute top-28 right-0 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3.5 shadow-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-rose-500/20 flex items-center justify-center">
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div>
            <div className="text-white text-sm font-bold leading-tight">7-Day Streak</div>
            <div className="text-white/50 text-xs">Keep it up!</div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="absolute bottom-0 left-4 right-4 grid grid-cols-3 gap-3">
        {[
          { icon: Users, value: "10K+", label: "Learners", color: "text-cyan-300" },
          { icon: Star, value: "4.9★", label: "Avg Rating", color: "text-amber-300" },
          { icon: BookOpen, value: "500+", label: "Resources", color: "text-violet-300" },
        ].map(({ icon: Icon, value, label, color }) => (
          <div
            key={label}
            className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-3 text-center"
          >
            <Icon className={`w-5 h-5 ${color} mx-auto mb-1.5`} />
            <div className="text-white font-bold text-base leading-tight">{value}</div>
            <div className="text-white/50 text-[11px] mt-0.5">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Featured Course Card ─────────────────────────────────────────────────────

function FeaturedCourseCard({
  product,
  onAdd,
  inCart,
}: {
  product: Product;
  onExplore: () => void;
  onAdd: () => void;
  inCart: boolean;
}) {
  return (
    <div className="group bg-card rounded-3xl border border-border overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-900/30 transition-all duration-300 hover:-translate-y-1.5 flex flex-col">
      <div className="relative h-48 bg-indigo-100 dark:bg-slate-800 overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${CATEGORY_PILL[product.category] ?? "bg-slate-100 text-slate-700"}`}>
            {product.category}
          </span>
        </div>
        {product.badge && (
          <div className="absolute top-3 right-3">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${BADGE_STYLES[product.badge] ?? "bg-white text-gray-700"}`}>
              {product.badge}
            </span>
          </div>
        )}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <StarRating rating={product.rating} />
          <span className="text-white/80 text-xs flex items-center gap-1">
            <Clock className="w-3 h-3" />{product.hours}
          </span>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-foreground text-base leading-snug mb-1.5">{product.title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-4">{product.description}</p>
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <span className="text-2xl font-extrabold text-foreground tracking-tight">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          <button
            onClick={onAdd}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
              inCart
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5"
            }`}
          >
            {inCart ? <><Check className="w-4 h-4" /> Added</> : <><ShoppingCart className="w-4 h-4" /> Add to Cart</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Landing Page ─────────────────────────────────────────────────────────────

function LandingPage({
  setPage,
  addToCart,
  cartIds,
}: {
  setPage: (p: Page) => void;
  addToCart: (p: Product) => void;
  cartIds: Set<number>;
}) {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 min-h-[88vh] flex items-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-violet-600/15 rounded-full blur-[130px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full py-16 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-white/85 text-sm font-medium mb-8">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              AI-curated paths for developers in 2025
            </div>

            <h1 className="text-5xl sm:text-6xl xl:text-7xl font-extrabold text-white leading-[1.07] tracking-tight mb-6">
              Level Up<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-violet-300 to-pink-300">
                Your Career
              </span>
            </h1>

            <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-xl">
              Explore curated learning resources, interview preparation kits, and industry-ready courses
              designed for developers and future innovators.
            </p>

            <div className="flex flex-wrap gap-3 mb-12">
              <button
                onClick={() => setPage("marketplace")}
                className="flex items-center gap-2 bg-white text-indigo-700 font-bold px-6 py-3.5 rounded-2xl hover:bg-indigo-50 hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5"
              >
                Explore Courses <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage("about")}
                className="border border-white/20 bg-white/5 backdrop-blur-sm text-white font-semibold px-6 py-3.5 rounded-2xl hover:bg-white/12 transition-all duration-200"
              >
                Learn More
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              {[
                { value: "10,000+", label: "Active Learners", icon: Users },
                { value: "500+", label: "Learning Resources", icon: BookOpen },
                { value: "95%", label: "Satisfaction Rate", icon: TrendingUp },
              ].map(({ value, label, icon: Icon }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-cyan-300" />
                  </div>
                  <div>
                    <div className="text-white font-extrabold text-xl leading-tight">{value}</div>
                    <div className="text-white/45 text-xs mt-0.5">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <HeroIllustration />
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              <Star className="w-3.5 h-3.5 fill-indigo-600 dark:fill-indigo-400" />
              Featured Courses
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3 tracking-tight">
              Start with the best
            </h2>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto">
              Hand-picked courses to fast-track your career in tech
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {FEATURED_IDS.map((id) => {
              const product = PRODUCTS.find((p) => p.id === id)!;
              return (
                <FeaturedCourseCard
                  key={id}
                  product={product}
                  onExplore={() => setPage("marketplace")}
                  onAdd={() => addToCart(product)}
                  inCart={cartIds.has(product.id)}
                />
              );
            })}
          </div>

          <div className="text-center">
            <button
              onClick={() => setPage("marketplace")}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white font-bold px-7 py-3.5 rounded-2xl hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/25 transition-all duration-200 hover:-translate-y-0.5"
            >
              Explore All Courses <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 rounded-3xl p-10 sm:p-14 text-center">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-400/15 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10">
            <div className="text-5xl mb-5">🚀</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
              Start Learning Today
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-lg mx-auto">
              Join 10,000+ developers who accelerated their careers with SkillKart. Use code{" "}
              <span className="font-bold text-amber-300">LEARN20</span> for 20% off your first order.
            </p>
            <button
              onClick={() => setPage("marketplace")}
              className="bg-white text-indigo-700 font-bold px-8 py-4 rounded-2xl hover:bg-indigo-50 hover:shadow-2xl transition-all duration-200 hover:-translate-y-0.5"
            >
              Browse All Courses
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({
  product,
  onAdd,
  inCart,
}: {
  product: Product;
  onAdd: () => void;
  inCart: boolean;
}) {
  return (
    <div className="group bg-card rounded-3xl border border-border overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-900/30 transition-all duration-300 hover:-translate-y-1.5 flex flex-col">
      {/* Image */}
      <div className="relative h-44 bg-indigo-100 dark:bg-slate-800 overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute top-3 left-3">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
              CATEGORY_PILL[product.category] ?? "bg-slate-100 text-slate-700"
            }`}
          >
            {product.category}
          </span>
        </div>
        {product.badge && (
          <div className="absolute top-3 right-3">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${BADGE_STYLES[product.badge] ?? "bg-white text-gray-700"}`}>
              {product.badge}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-foreground text-base leading-snug mb-2">{product.title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-3 flex-1">{product.description}</p>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            {product.lessons} lessons
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {product.hours}
          </span>
        </div>

        <StarRating rating={product.rating} />

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <div>
            <span className="text-2xl font-extrabold text-foreground tracking-tight">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
          </div>
          <button
            onClick={onAdd}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
              inCart
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5"
            }`}
          >
            {inCart ? (
              <>
                <Check className="w-4 h-4" /> Added
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Marketplace ──────────────────────────────────────────────────────────────

function MarketplacePage({
  addToCart,
  setPage,
  cart,
}: {
  addToCart: (p: Product) => void;
  setPage: (p: Page) => void;
  cart: CartItem[];
}) {
  const cartIds = new Set(cart.map((i) => i.id));
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 tracking-tight">
            Learning Marketplace
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Industry-ready courses crafted by experts. Start your journey today.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-foreground">All Courses</h2>
            <p className="text-muted-foreground text-sm mt-1">{PRODUCTS.length} premium resources</p>
          </div>
          {cartCount > 0 && (
            <button
              onClick={() => setPage("cart")}
              className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              View Cart ({cartCount})
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={() => addToCart(product)}
              inCart={cartIds.has(product.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

function CartPage({
  cart,
  updateQty,
  removeItem,
  coupon,
  setCoupon,
  appliedCoupon,
  applyCoupon,
  removeCoupon,
  couponError,
  subtotal,
  discountAmt,
  total,
  checkout,
  setPage,
}: {
  cart: CartItem[];
  updateQty: (id: number, delta: number) => void;
  removeItem: (id: number) => void;
  coupon: string;
  setCoupon: (s: string) => void;
  appliedCoupon: { code: string; discount: number } | null;
  applyCoupon: () => void;
  removeCoupon: () => void;
  couponError: string;
  subtotal: number;
  discountAmt: number;
  total: number;
  checkout: () => void;
  setPage: (p: Page) => void;
}) {
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-4 py-24">
        <div className="w-24 h-24 rounded-3xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mb-6">
          <ShoppingCart className="w-12 h-12 text-indigo-400" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8 max-w-sm">
          Add some courses to get started on your learning journey.
        </p>
        <button
          onClick={() => setPage("marketplace")}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-indigo-700 transition-colors"
        >
          Browse Courses
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Shopping Cart</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {cart.length} course{cart.length !== 1 ? "s" : ""} selected
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-card rounded-2xl border border-border p-4 sm:p-5 flex gap-4 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-indigo-100 dark:bg-slate-700 shrink-0">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                        {item.category}
                      </div>
                      <h3 className="font-bold text-foreground text-sm sm:text-base leading-snug line-clamp-2">
                        {item.title}
                      </h3>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-red-500 transition-colors shrink-0 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        disabled={item.quantity <= 1}
                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-card disabled:opacity-30 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-card transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                    </div>
                    <div className="text-right">
                      <div className="font-extrabold text-foreground text-base">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </div>
                      {item.quantity > 1 && (
                        <div className="text-xs text-muted-foreground">
                          ₹{item.price.toLocaleString("en-IN")} each
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Coupon hints */}
            <div className="bg-amber-50 dark:bg-amber-900/15 border border-amber-200/60 dark:border-amber-700/30 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 text-sm font-semibold mb-2">
                <Tag className="w-4 h-4" />
                Available Coupons
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(COUPONS).map(([code, disc]) => (
                  <button
                    key={code}
                    onClick={() => setCoupon(code)}
                    className="text-xs font-bold bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700/50 text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors"
                  >
                    {code} — {disc}% OFF
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-4 lg:sticky lg:top-24 h-fit">
            {/* Coupon box */}
            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="font-bold text-foreground text-sm mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4 text-indigo-600" /> Apply Coupon
              </h3>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl px-3 py-2.5">
                  <div>
                    <div className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                      {appliedCoupon.code}
                    </div>
                    <div className="text-xs text-emerald-600 dark:text-emerald-400">
                      {appliedCoupon.discount}% discount applied
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                    placeholder="Enter coupon code"
                    className="flex-1 px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-muted-foreground"
                  />
                  <button
                    onClick={applyCoupon}
                    className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              )}
              {couponError && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {couponError}
                </p>
              )}
            </div>

            {/* Summary */}
            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="font-bold text-foreground text-base mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold text-foreground">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                {discountAmt > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" />
                      Discount ({appliedCoupon?.discount}%)
                    </span>
                    <span className="font-semibold">−₹{discountAmt.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="h-px bg-border" />
                <div className="flex justify-between text-base font-extrabold">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">₹{total.toLocaleString("en-IN")}</span>
                </div>
                {discountAmt > 0 && (
                  <div className="text-center text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-900/20 rounded-xl py-2">
                    🎉 You save ₹{discountAmt.toLocaleString("en-IN")}!
                  </div>
                )}
              </div>

              <button
                onClick={checkout}
                className="w-full mt-5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-3.5 rounded-2xl hover:from-indigo-700 hover:to-violet-700 hover:shadow-xl hover:shadow-indigo-500/25 transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Checkout Securely
              </button>
              <p className="text-center text-xs text-muted-foreground mt-3 flex items-center justify-center gap-1">
                <Shield className="w-3 h-3" />
                SSL encrypted · 30-day money-back guarantee
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Success Page ─────────────────────────────────────────────────────────────

function SuccessPage({
  data,
  setPage,
}: {
  data: CheckoutData;
  setPage: (p: Page) => void;
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full">
        <div className="text-center mb-10">
          <div className="relative inline-flex mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
              <Check className="w-12 h-12 text-white" strokeWidth={3} />
            </div>
            <span className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-2 tracking-tight">
            Order Placed Successfully!
          </h1>
          <p className="text-muted-foreground">
            Check your email for access details. Your learning journey starts now.
          </p>
        </div>

        <div className="bg-card rounded-3xl border border-border shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="font-bold text-foreground text-sm mb-4 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              Purchased Courses
            </h3>
            <div className="space-y-3">
              {data.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl overflow-hidden bg-indigo-100 dark:bg-slate-700 shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-foreground truncate">{item.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.quantity > 1 ? `Qty: ${item.quantity}` : item.category}
                    </div>
                  </div>
                  <div className="text-sm font-bold text-foreground shrink-0">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-slate-50/60 dark:bg-slate-800/40 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground font-semibold">₹{data.subtotal.toLocaleString("en-IN")}</span>
            </div>
            {data.discount > 0 && (
              <div className="flex justify-between text-sm text-emerald-600 dark:text-emerald-400">
                <span>Discount Applied</span>
                <span className="font-semibold">−₹{data.discount.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="h-px bg-border" />
            <div className="flex justify-between font-extrabold text-base">
              <span className="text-foreground">Final Amount</span>
              <span className="text-foreground">₹{data.total.toLocaleString("en-IN")}</span>
            </div>
            {data.discount > 0 && (
              <div className="text-center text-sm text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-900/20 rounded-xl py-2.5">
                🎉 Total Savings: ₹{data.discount.toLocaleString("en-IN")}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => setPage("marketplace")}
          className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-4 rounded-2xl hover:from-indigo-700 hover:to-violet-700 hover:shadow-xl hover:shadow-indigo-500/25 transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2"
        >
          <Rocket className="w-4 h-4" />
          Continue Learning
        </button>
      </div>
    </div>
  );
}

// ─── About Page ───────────────────────────────────────────────────────────────

function AboutPage() {
  const flow = [
    { icon: Globe,        label: "Browse Courses",     desc: "Users visit the Marketplace and browse 6 available courses." },
    { icon: ShoppingCart, label: "Add to Cart",        desc: "Clicking 'Add to Cart' saves the course to the shopping cart." },
    { icon: Plus,         label: "Update Quantity",    desc: "Users can increase or decrease course quantity using +/− controls." },
    { icon: Tag,          label: "Apply Coupon",       desc: "Enter LEARN10 for 10% off or LEARN20 for 20% off the order total." },
    { icon: BarChart3,    label: "Calculate Discount", desc: "The app recalculates subtotal, discount amount, and final price in real time." },
    { icon: CheckCircle,  label: "Checkout",           desc: "Clicking 'Checkout' clears the cart and shows the order confirmation screen." },
  ];

  const stack = [
    { name: "React",         icon: Code2,    color: "text-cyan-600 dark:text-cyan-400",    bg: "bg-cyan-50 dark:bg-cyan-900/20" },
    { name: "TypeScript",    icon: Shield,   color: "text-blue-600 dark:text-blue-400",    bg: "bg-blue-50 dark:bg-blue-900/20" },
    { name: "Vite",          icon: Zap,      color: "text-violet-600 dark:text-violet-400",bg: "bg-violet-50 dark:bg-violet-900/20" },
    { name: "Local Storage", icon: Database, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
  ];

  const aiUsages = [
    { icon: Sparkles, title: "UI Ideation",          desc: "AI helped generate layout ideas, color combinations, and component structure before writing a single line of code." },
    { icon: Layers,   title: "Component Planning",   desc: "AI broke the project into clear components — Navbar, ProductCard, CartItem, OrderSummary — with defined props and responsibilities." },
    { icon: Check,    title: "Validation Logic",     desc: "Coupon code validation, quantity edge cases, and discount calculations were planned with AI to avoid bugs from the start." },
    { icon: BookOpen, title: "Development Guidance", desc: "Throughout development, AI assisted with TypeScript types, responsive layout patterns, and dark mode implementation." },
  ];

  const future = [
    { icon: Users,    label: "User Accounts",              desc: "Allow users to register, log in, and view their order history across sessions." },
    { icon: Shield,   label: "Payment Integration",        desc: "Connect a real payment gateway (Razorpay or Stripe) to process actual transactions." },
    { icon: Brain,    label: "Personalized Recommendations", desc: "Suggest courses based on what the user has browsed or purchased before." },
    { icon: Database, label: "Backend Database",           desc: "Store products, orders, and user data in a real database instead of local state." },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-white/75 text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            Take-Home Assignment
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
            How SkillKart Works
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            A simple, honest overview of the project — what it does, how it was built, and where it can go next.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-16">

        {/* Project Overview */}
        <section>
          <SectionLabel num="01" title="Project Overview" />
          <div className="bg-card rounded-2xl border border-border p-6">
            <p className="text-muted-foreground leading-relaxed text-base">
              SkillKart is a learning marketplace where users can browse courses, add them to a cart,
              apply discount coupons, and view the final purchase amount.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              {[
                { icon: BookOpen,    label: "6 Courses",       desc: "Curated learning resources across tech domains" },
                { icon: ShoppingCart,label: "Cart System",     desc: "Add, remove, and adjust quantities freely" },
                { icon: Tag,         label: "Coupon Codes",    desc: "LEARN10 and LEARN20 for real-time discounts" },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-4 text-center">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="font-bold text-foreground text-sm mb-1">{label}</div>
                  <div className="text-muted-foreground text-xs leading-relaxed">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section>
          <SectionLabel num="02" title="How It Works" />
          <div className="bg-card rounded-2xl border border-border p-6">
            {flow.map(({ icon: Icon, label, desc }, i) => (
              <div key={label} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  {i < flow.length - 1 && (
                    <div className="w-0.5 h-7 bg-gradient-to-b from-indigo-300 to-transparent dark:from-indigo-700 my-1" />
                  )}
                </div>
                <div className={`pt-2 ${i < flow.length - 1 ? "pb-7" : ""}`}>
                  <div className="font-bold text-foreground text-sm">{label}</div>
                  <div className="text-muted-foreground text-sm mt-0.5 leading-relaxed">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section>
          <SectionLabel num="03" title="Technology Stack" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stack.map(({ name, icon: Icon, color, bg }) => (
              <div key={name} className={`${bg} rounded-2xl p-5 flex flex-col items-center text-center gap-3`}>
                <Icon className={`w-7 h-7 ${color}`} />
                <span className="font-bold text-foreground text-sm">{name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* AI Development */}
        <section>
          <SectionLabel num="04" title="AI-Assisted Development" />
          <p className="text-muted-foreground mb-5 leading-relaxed">
            AI tools were used throughout this project to speed up development and improve quality:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {aiUsages.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-card rounded-2xl border border-border p-5 flex gap-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-bold text-foreground text-sm mb-1">{title}</div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Future Enhancements */}
        <section>
          <SectionLabel num="05" title="Future Enhancements" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {future.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="bg-card rounded-2xl border border-border p-5 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <div className="font-bold text-foreground text-sm mb-1">{label}</div>
                  <p className="text-muted-foreground text-xs leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>{/* Developer Information */}
<section>
  <SectionLabel num="06" title="Developer Information" />

  <div className="bg-card rounded-2xl border border-border p-6">
    <h3 className="text-xl font-bold text-foreground mb-4">
      Chandana T S
    </h3>

    <p className="text-muted-foreground mb-4">
      Computer Science & Engineering Graduate
    </p>

    <div className="space-y-3">
      <div>
        <span className="font-semibold">Email:</span>{" "}
        <a
          href="mailto:chandanats220304@gmail.com"
          className="text-indigo-600 hover:underline"
        >
          chandanats220304@gmail.com
        </a>
      </div>

      <div>
        <span className="font-semibold">LinkedIn:</span>{" "}
        <a
          href="https://www.linkedin.com/in/chandana-t-s-271bb6318/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:underline"
        >
          View LinkedIn Profile
        </a>
      </div>

      <div>
        <span className="font-semibold">GitHub:</span>{" "}
        <a
          href="https://github.com/chandana-2203"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:underline"
        >
          github.com/chandana-2203
        </a>
      </div>
    </div>
  </div>
</section>

      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("landing");
  const [dark, setDark] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const nav = (p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQty = (id: number, delta: number) =>
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i))
    );

  const removeItem = (id: number) => setCart((prev) => prev.filter((i) => i.id !== id));

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const discountAmt = appliedCoupon ? Math.round((subtotal * appliedCoupon.discount) / 100) : 0;
  const total = subtotal - discountAmt;

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (COUPONS[code]) {
      setAppliedCoupon({ code, discount: COUPONS[code] });
      setCouponError("");
    } else {
      setCouponError("Invalid code. Try LEARN10 or LEARN20.");
      setAppliedCoupon(null);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCoupon("");
    setCouponError("");
  };

  const checkout = () => {
    setCheckoutData({
      items: [...cart],
      subtotal,
      discount: discountAmt,
      total,
      couponCode: appliedCoupon?.code,
    });
    setCart([]);
    setAppliedCoupon(null);
    setCoupon("");
    nav("success");
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar page={page} setPage={nav} dark={dark} setDark={setDark} cartCount={cartCount} />
      <main>
        {page === "landing" && (
          <LandingPage
            setPage={nav}
            addToCart={addToCart}
            cartIds={new Set(cart.map((i) => i.id))}
          />
        )}
        {page === "marketplace" && (
          <MarketplacePage addToCart={addToCart} setPage={nav} cart={cart} />
        )}
        {page === "cart" && (
          <CartPage
            cart={cart}
            updateQty={updateQty}
            removeItem={removeItem}
            coupon={coupon}
            setCoupon={setCoupon}
            appliedCoupon={appliedCoupon}
            applyCoupon={applyCoupon}
            removeCoupon={removeCoupon}
            couponError={couponError}
            subtotal={subtotal}
            discountAmt={discountAmt}
            total={total}
            checkout={checkout}
            setPage={nav}
          />
        )}
        {page === "success" && checkoutData && (
          <SuccessPage data={checkoutData} setPage={nav} />
        )}
        {page === "about" && <AboutPage />}
      </main>
    </div>
  );
}

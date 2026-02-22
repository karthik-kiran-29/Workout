import { useState, useEffect, useRef } from "react";
import { addData } from "./lib/firebase";

import HeroWomanTop from "./assets/Golden-Yellow-Kanjivaram-Silk-Saree.webp";
import HeroWomanBottom from "./assets/hero-women-pos.png";
import OldSilkSarees from "./assets/Money-To-Saree.png";
/* ─────────────────────────────────────────────
   GLOBAL CSS  (injected once via <style> tag)
───────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Crimson+Pro:wght@300;400;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --gold: #c8922a;
  --dark-gold: #a0701a;
  --deep: #1a0a00;
  --warm: #fdf6ec;
  --accent: #7b1f1f;
}

html { scroll-behavior: smooth; }

body {
  font-family: 'Crimson Pro', Georgia, serif;
  background: var(--warm);
  color: var(--deep);
  overflow-x: hidden;
}

/* ── MARQUEE ── */
.marquee-wrap { background: var(--gold); overflow: hidden; padding: 8px 0; }
.marquee-track {
  display: flex; gap: 80px;
  animation: marquee 50s linear infinite;
  white-space: nowrap; width: max-content;
}
.marquee-track span {
  font-size: 16px; font-weight: 600; color: #fff;
  letter-spacing: 2px; text-transform: uppercase;
}
@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

/* ── NAV ── */
nav {
  position: sticky; top: 0; z-index: 200;
  background: rgba(255,255,255,0.96);
  border-bottom: 2px solid var(--gold);
  padding: 20px 40px; display: flex; align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 30px rgba(0,0,0,0.1);
  backdrop-filter: blur(10px);
}
.logo-area h1 { font-family: 'Playfair Display', serif; font-size: 30px; color: var(--deep); line-height: 1.1; }
.logo-area p { font-size: 12px; color: var(--gold); letter-spacing: 2px; text-transform: uppercase; }
.nav-links { display: flex; list-style: none; }
.nav-links li { position: relative; }
.nav-links a {
  display: block; padding: 22px 18px; font-size: 22px;
  font-weight: 600; color: var(--deep); text-decoration: none;
  transition: color .2s; letter-spacing: .5px;
}
.nav-links a:hover { color: var(--gold); }
.nav-links .has-dropdown:hover .dropdown { display: block; }
.dropdown {
  display: none; position: absolute; top: 100%; left: 0;
  background: #fff; border: 1px solid #e8d8b8;
  border-top: 2px solid var(--gold); min-width: 230px;
  z-index: 300; box-shadow: 0 8px 30px rgba(0,0,0,0.12);
}
.dropdown a { padding: 10px 20px; font-size: 14px; border-bottom: 1px solid #f5ede0; font-weight: 400; }
.dropdown a:hover { background: #fdf6ec; color: var(--gold); }
.nav-cta {
  background: var(--gold); color: #fff !important;
  padding: 22px 22px !important; border-radius: 2px; font-size: 22px !important;
  transition: background .2s, transform .2s !important;
}
.nav-cta:hover { background: var(--dark-gold) !important; transform: translateY(-2px) !important; }

/* ── HAMBURGER ── */
.hamburger { display: none !important; }

/* Mobile Nav Drawer */
.mobile-nav {
  display: none; position: fixed; inset: 0; top: 0; z-index: 500;
  background: rgba(0,0,0,0.5);
}
.mobile-nav.open { display: block; }
.mobile-nav-inner {
  background: #fff; width: 80%; max-width: 320px; height: 100%;
  padding: 30px 24px; overflow-y: auto;
  transform: translateX(-100%); transition: transform .35s cubic-bezier(.4,0,.2,1);
}
.mobile-nav.open .mobile-nav-inner { transform: translateX(0); }
.mobile-nav-logo { font-family: 'Playfair Display', serif; font-size: 18px; color: var(--deep); margin-bottom: 6px; }
.mobile-nav-sub { font-size: 11px; color: var(--gold); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 28px; }
.mobile-nav-links { list-style: none; }
.mobile-nav-links li a {
  display: block; padding: 14px 0; font-size: 17px; font-weight: 600;
  color: var(--deep); text-decoration: none;
  border-bottom: 1px solid #f0e8d8; transition: color .2s, transform .2s;
}
.mobile-nav-links li a:hover { color: var(--gold); transform: translateX(6px); }
.mobile-nav-cta {
  display: block; margin-top: 24px; background: var(--gold); color: #fff;
  text-align: center; padding: 14px; font-size: 16px; font-weight: 600;
  text-decoration: none; letter-spacing: 1px;
}

.hero {
  min-height: 92vh;
  position: relative; display: flex; align-items: center; overflow: hidden;
  background: #0d0400;
}
.hero-img-right {
  position: absolute; right: 0; top: 0; bottom: 0;
  width: 45%; height: 100%; z-index: 1;
  overflow: hidden;
}
.hero-img-right img {
  width: 100%; height: 100%; object-fit: cover; object-position: top center;
  border-radius: 0; opacity: 0.85;
  mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.6) 20%, black 60%);
  -webkit-mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.6) 20%, black 60%);
}
@media (max-width: 768px) {
  .hero-img-right {
    position: relative; width: 100%; height: 260px;
    order: -1; top: auto; right: auto; bottom: auto;
  }
  .hero-img-right img { mask-image: linear-gradient(to bottom, black 60%, transparent 100%); -webkit-mask-image: linear-gradient(to bottom, black 60%, transparent 100%); }
  .hero { flex-direction: column; min-height: 100svh; }
  .hero-content { z-index: 2; }
}

#hero-canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
.hero-content {
  position: relative; z-index: 2; max-width: 700px;
  padding: 80px; animation: heroEntry 1.2s ease both;
}
@keyframes heroEntry {
  from { opacity: 0; transform: translateY(60px) rotateX(10deg); }
  to   { opacity: 1; transform: translateY(0) rotateX(0deg); }
}
.hero-badge {
  display: inline-block;
  background: rgba(200,146,42,0.15); border: 1px solid var(--gold);
  color: var(--gold); font-size: 11px; letter-spacing: 3px;
  text-transform: uppercase; padding: 6px 16px; margin-bottom: 24px;
  animation: glowPulse 3s ease infinite;
}
@keyframes glowPulse {
  0%,100% { box-shadow: 0 0 0px rgba(200,146,42,0); }
  50% { box-shadow: 0 0 20px rgba(200,146,42,0.5); }
}
.hero h2 {
  font-family: 'Playfair Display', serif;
  font-size: clamp(32px, 6vw, 72px); color: #fff; line-height: 1.1; margin-bottom: 20px;
}
.hero h2 em { color: var(--gold); font-style: italic; }
.hero p { color: #c8b89a; font-size: 17px; line-height: 1.7; margin-bottom: 36px; font-weight: 300; }
.hero-btns { display: flex; gap: 16px; flex-wrap: wrap; }

/* ── BUTTONS ── */
.btn-primary {
  background: var(--gold); color: #fff; padding: 14px 32px;
  font-size: 15px; font-family: 'Crimson Pro', serif; font-weight: 600;
  text-decoration: none; border: none; cursor: pointer;
  letter-spacing: 1px; transition: all .3s;
  display: inline-block; position: relative; overflow: hidden;
}
.btn-primary::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.25), transparent);
  transform: translateX(-100%); transition: transform .4s;
}
.btn-primary:hover { background: var(--dark-gold); transform: translateY(-3px) scale(1.02); box-shadow: 0 10px 30px rgba(200,146,42,0.4); }
.btn-primary:hover::after { transform: translateX(100%); }
.btn-outline {
  background: transparent; color: #fff; padding: 13px 32px;
  font-size: 15px; font-family: 'Crimson Pro', serif; font-weight: 600;
  text-decoration: none; border: 1px solid rgba(255,255,255,0.4); cursor: pointer;
  letter-spacing: 1px; transition: all .3s; display: inline-block;
}
.btn-outline:hover { border-color: var(--gold); color: var(--gold); transform: translateY(-3px); box-shadow: 0 10px 30px rgba(200,146,42,0.2); }

/* ── HERO STATS ── */
.hero-stats {
  position: absolute; right: 80px; bottom: 60px;
  display: flex; gap: 50px; z-index: 2;
}
.hero-stat { text-align: center; animation: floatStat 4s ease-in-out infinite; }
.hero-stat:nth-child(2) { animation-delay: .8s; }
.hero-stat:nth-child(3) { animation-delay: 1.6s; }
@keyframes floatStat {
  0%,100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.hero-stat .num { font-family: 'Playfair Display', serif; font-size: 48px; color: var(--gold); line-height: 1; }
.hero-stat .lbl { font-size: 13px; color: #9a8a78; letter-spacing: 2px; text-transform: uppercase; margin-top: 6px; }

/* ── SECTION COMMONS ── */
section { padding: 90px 40px; }
.section-label { font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: var(--gold); margin-bottom: 12px; font-weight: 600; }
.section-title { font-family: 'Playfair Display', serif; font-size: clamp(24px, 4vw, 48px); color: var(--deep); line-height: 1.15; margin-bottom: 20px; }
.section-title em { color: var(--gold); font-style: italic; }
.section-sub { font-size: 17px; color: #6a5540; line-height: 1.7; max-width: 600px; font-weight: 300; }
.max-w { max-width: 1200px; margin: 0 auto; }

/* ── SCROLL REVEAL ── */
.reveal { opacity: 0; transform: translateY(36px); transition: opacity .85s cubic-bezier(.25,.8,.25,1), transform .85s cubic-bezier(.25,.8,.25,1); }
.reveal.visible { opacity: 1; transform: translateY(0); }
.reveal-left { opacity: 0; transform: translateX(-48px); transition: opacity .85s cubic-bezier(.25,.8,.25,1), transform .85s cubic-bezier(.25,.8,.25,1); }
.reveal-left.visible { opacity: 1; transform: translateX(0); }
.reveal-right { opacity: 0; transform: translateX(48px); transition: opacity .85s cubic-bezier(.25,.8,.25,1), transform .85s cubic-bezier(.25,.8,.25,1); }
.reveal-right.visible { opacity: 1; transform: translateX(0); }

img { border-radius: 16px; }
.about-img-3d img { border-radius: 16px; }
.product-card-img img { border-radius: 12px 12px 0 0; }
.about-img-3d { border-radius: 16px; overflow: hidden; }
.product-card { border-radius: 12px; }
.product-card-img { border-radius: 12px 12px 0 0; overflow: hidden; }
.product-card-body { border-radius: 0 0 12px 12px; }
.flip-front, .flip-back { border-radius: 12px; }
.why-card { border-radius: 12px; }
.testimonial-card { border-radius: 12px; }
.branch-card { border-radius: 12px; }

/* ── FEATURES STRIP ── */
.features-strip { background: var(--deep); padding: 50px 40px; }
.features-grid { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(3,1fr); gap: 40px; }
.feature-item {
  display: flex; gap: 20px; align-items: flex-start;
  transition: transform .3s;
}
.feature-item:hover { transform: translateY(-8px) scale(1.02); }
.feature-icon {
  width: 60px; height: 60px; border: 1px solid var(--gold);
  display: flex; align-items: center; justify-content: center;
  font-size: 26px; flex-shrink: 0; color: var(--gold);
  transition: transform .6s, background .3s;
  transform-style: preserve-3d;
}
.feature-item:hover .feature-icon { transform: rotateY(180deg); background: var(--gold); }
.feature-item h3 { font-family: 'Playfair Display', serif; font-size: 18px; color: #fff; margin-bottom: 6px; }
.feature-item p { font-size: 14px; color: #9a8a78; line-height: 1.6; }

/* ── ABOUT ── */
.about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; max-width: 1200px; margin: 0 auto; }
.about-img-wrap { position: relative; perspective: 1000px; }
.about-img-3d {
  width: 100%; aspect-ratio: 4/3;
  background: linear-gradient(135deg, #2a1005, #c8922a40);
  display: flex; align-items: center; justify-content: center;
  font-size: 100px; transform-style: preserve-3d;
  transition: transform .6s ease;
  box-shadow: 0 30px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1);
}
.about-img-wrap:hover .about-img-3d { transform: rotateY(-12deg) rotateX(5deg) scale(1.02); }
.about-badge {
  position: absolute; bottom: -20px; right: -20px;
  background: var(--gold); color: #fff; padding: 24px;
  text-align: center; width: 140px; height: 140px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  border-radius: 50%; animation: rotateBadge 8s linear infinite;
  box-shadow: 0 10px 30px rgba(200,146,42,0.5);
}
@keyframes rotateBadge {
  0%,100% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(5deg) scale(1.05); }
  75% { transform: rotate(-5deg) scale(1.05); }
}
.about-badge .num { font-family: 'Playfair Display', serif; font-size: 36px; line-height: 1; }
.about-badge .lbl { font-size: 12px; letter-spacing: 1px; text-align: center; margin-top: 4px; }
.about-check-list { list-style: none; margin-top: 24px; }
.about-check-list li {
  padding: 12px 0; border-bottom: 1px solid #e8d8b8;
  font-size: 16px; color: #4a3520;
  display: flex; align-items: center; gap: 12px;
  transition: transform .2s, color .2s;
}
.about-check-list li:hover { transform: translateX(8px); color: var(--gold); }
.about-check-list li::before { content: '✦'; color: var(--gold); font-size: 12px; flex-shrink: 0; }
.about-phone { margin-top: 32px; display: flex; align-items: center; gap: 16px; }
.about-phone .num { font-family: 'Playfair Display', serif; font-size: 24px; color: var(--deep); }
.about-phone .lbl { font-size: 12px; color: #9a8a78; letter-spacing: 1px; text-transform: uppercase; }

/* ── BUY SECTION ── */
.buy-section { background: #f5ede0; }
.buy-grid { max-width: 1200px; margin: 50px auto 0; display: grid; grid-template-columns: repeat(4,1fr); gap: 24px; }

/* 3D FLIP CARD */
.flip-card { perspective: 900px; height: 280px; cursor: pointer; }
.flip-inner {
  position: relative; width: 100%; height: 100%;
  transform-style: preserve-3d; transition: transform .7s cubic-bezier(.4,0,.2,1);
}
.flip-card:hover .flip-inner { transform: rotateY(180deg); }
.flip-front, .flip-back {
  position: absolute; inset: 0; backface-visibility: hidden;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  border-radius: 2px;
}
.flip-front { background: #fff; box-shadow: 0 8px 30px rgba(0,0,0,0.08); }
.flip-back {
  background: linear-gradient(135deg, var(--deep), #3a1a05);
  transform: rotateY(180deg); padding: 24px;
  border: 2px solid var(--gold);
}
.flip-front .emoji { font-size: 64px; margin-bottom: 16px; transition: transform .3s; }
.flip-card:hover .flip-front .emoji { transform: scale(1.1); }
.flip-front h3 { font-family: 'Playfair Display', serif; font-size: 16px; color: var(--deep); text-align: center; padding: 0 12px; }
.flip-back h3 { font-family: 'Playfair Display', serif; color: var(--gold); font-size: 18px; margin-bottom: 12px; text-align: center; }
.flip-back p { color: #c8b89a; font-size: 14px; text-align: center; line-height: 1.6; }
.flip-back .sell-btn { margin-top: 16px; background: var(--gold); color: #fff; padding: 8px 20px; font-size: 14px; cursor: pointer; border: none; font-family: 'Crimson Pro', serif; }

/* ── PRODUCTS ── */
.products-grid { max-width: 1200px; margin: 50px auto 0; display: grid; grid-template-columns: repeat(3,1fr); gap: 28px; }
.product-card {
  position: relative; overflow: hidden; cursor: pointer;
  transform-style: preserve-3d; transition: transform .4s, box-shadow .4s;
}
.product-card:hover { transform: translateY(-12px) rotateX(3deg); box-shadow: 0 30px 60px rgba(0,0,0,0.2); }
.product-card-img {
  height: 260px;
  background: linear-gradient(135deg, #2a1005, #c8922a40);
  display: flex; align-items: center; justify-content: center;
  font-size: 72px; transition: transform .5s;
  position: relative; overflow: hidden;
}
.product-card-img::before {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(200,146,42,0.15) 50%, transparent 70%);
  transform: translateX(-100%) rotate(45deg);
  transition: transform .6s;
}
.product-card:hover .product-card-img::before { transform: translateX(200%) rotate(45deg); }
.product-card:hover .product-card-img { transform: scale(1.08); }
.product-card-body {
  background: #fff; padding: 20px 24px;
  border-bottom: 3px solid transparent; transition: border-color .3s;
}
.product-card:hover .product-card-body { border-color: var(--gold); }
.product-card h3 { font-family: 'Playfair Display', serif; font-size: 18px; color: var(--deep); margin-bottom: 8px; }
.product-card a { color: var(--gold); font-size: 14px; text-decoration: none; letter-spacing: 1px; font-weight: 600; }

/* ── PROCESS ── */
.process-section { background: var(--deep); }
.process-section .section-title { color: #fff; }
.process-grid {
  max-width: 1100px; margin: 60px auto 0;
  display: grid; grid-template-columns: repeat(4,1fr); gap: 0; position: relative;
}
.process-grid::before {
  content: ''; position: absolute; top: 40px; left: 12.5%; right: 12.5%;
  height: 1px; background: rgba(200,146,42,0.3);
}
.process-step { text-align: center; padding: 0 20px; }
.step-num {
  width: 80px; height: 80px; border: 2px solid var(--gold); border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 28px; color: var(--gold); margin: 0 auto 24px;
  background: var(--deep); position: relative; z-index: 1;
  transition: all .5s; transform-style: preserve-3d;
}
.process-step:hover .step-num {
  background: var(--gold); color: #fff;
  transform: rotateY(360deg) scale(1.15);
  box-shadow: 0 0 30px rgba(200,146,42,0.6);
}
.step-label { font-size: 11px; letter-spacing: 2px; color: var(--gold); text-transform: uppercase; margin-bottom: 8px; }
.process-step h3 { font-family: 'Playfair Display', serif; font-size: 18px; color: #fff; margin-bottom: 10px; }
.process-step p { font-size: 14px; color: #8a7a68; line-height: 1.7; }

/* ── WHY US ── */
.why-grid { max-width: 1200px; margin: 50px auto 0; display: grid; grid-template-columns: repeat(3,1fr); gap: 30px; perspective: 1500px; }
.why-card {
  background: #fff; padding: 36px 30px;
  border: 1px solid #e8d8b8; border-top: 3px solid var(--gold);
  transition: transform .4s ease, box-shadow .4s ease;
  transform-style: preserve-3d;
}
.why-card:hover { transform: rotateX(-6deg) rotateY(4deg) translateY(-10px) scale(1.02); box-shadow: 0 25px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(200,146,42,0.3); }
.why-icon { font-size: 42px; margin-bottom: 16px; display: block; transition: transform .4s; }
.why-card:hover .why-icon { transform: translateZ(20px) rotateY(20deg); }
.why-card h3 { font-family: 'Playfair Display', serif; font-size: 20px; color: var(--deep); margin-bottom: 10px; }
.why-card p { font-size: 15px; color: #6a5540; line-height: 1.7; }

/* ── STATS STRIP ── */
.stats-strip { background: var(--gold); padding: 60px 40px; }
.stats-grid { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(4,1fr); gap: 30px; text-align: center; }
.counter-num { font-family: 'Playfair Display', serif; font-size: 52px; color: #fff; line-height: 1; display: block; }
.counter-lbl { color: rgba(255,255,255,0.85); font-size: 13px; letter-spacing: 2px; text-transform: uppercase; margin-top: 8px; }

/* ── TESTIMONIALS ── */
.testimonials { background: #f5ede0; }
.review-header { display: flex; align-items: center; gap: 40px; max-width: 1200px; margin: 0 auto 50px; flex-wrap: wrap; }
.review-score .score { font-family: 'Playfair Display', serif; font-size: 72px; color: var(--deep); line-height: 1; }
.stars { color: var(--gold); font-size: 20px; margin: 6px 0; }
.testimonials-grid { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
.testimonial-card {
  background: #fff; padding: 30px;
  border-left: 3px solid var(--gold);
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  transition: transform .4s, box-shadow .4s;
  transform-style: preserve-3d;
}
.testimonial-card:hover { transform: translateY(-8px) rotateX(3deg) rotateY(2deg); box-shadow: 0 20px 50px rgba(0,0,0,0.12); }
.testimonial-card .qt { font-size: 40px; color: var(--gold); line-height: 1; font-family: Georgia; margin-bottom: 10px; }
.testimonial-card p { font-size: 15px; color: #4a3520; line-height: 1.8; font-style: italic; margin-bottom: 20px; }
.testimonial-card .author { font-weight: 600; color: var(--deep); font-size: 15px; font-style: normal; }

/* ── BRANCHES ── */
.branches-section { background: var(--deep); }
.branches-section .section-title { color: #fff; }
.branches-grid { max-width: 1200px; margin: 50px auto 0; display: grid; grid-template-columns: repeat(5,1fr); gap: 20px; }
.branches-two-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  padding: 0 8px;
}

@media (max-width: 900px) {
  .branches-two-grid { gap: 20px; }
}

@media (max-width: 768px) {
  .branches-two-grid {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 0;
  }
}
.branch-card {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(200,146,42,0.3);
  padding: 30px 20px; text-align: center;
  transition: all .4s; cursor: pointer;
  transform-style: preserve-3d; perspective: 500px;
}
.branch-card:hover {
  background: rgba(200,146,42,0.12); border-color: var(--gold);
  transform: rotateX(-8deg) scale(1.05);
  box-shadow: 0 20px 40px rgba(200,146,42,0.2);
}
.branch-card .icon { font-size: 32px; margin-bottom: 12px; display: block; transition: transform .4s; }
.branch-card:hover .icon { transform: translateZ(15px) rotateY(15deg) scale(1.3); }
.branch-card h3 { font-family: 'Playfair Display', serif; color: #fff; font-size: 18px; margin-bottom: 6px; }
.branch-card p { color: #9a8a78; font-size: 13px; }

/* ── PROMISE ── */
.promise-grid { max-width: 1100px; margin: 50px auto 0; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start; }
.promise-list { list-style: none; }
.promise-list li {
  display: flex; gap: 16px; align-items: flex-start;
  padding: 18px 0; border-bottom: 1px solid #e8d8b8;
  transition: transform .3s; cursor: default;
}
.promise-list li:hover { transform: translateX(8px) perspective(400px) rotateY(-3deg); }
.promise-list .check { width: 32px; height: 32px; background: var(--gold); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; margin-top: 2px; transition: transform .4s; }
.promise-list li:hover .check { transform: rotateY(360deg) scale(1.2); }
.promise-list h4 { font-family: 'Playfair Display', serif; font-size: 17px; color: var(--deep); margin-bottom: 4px; }
.promise-list p { font-size: 14px; color: #6a5540; }
.promise-cta-box {
  background: var(--deep); padding: 50px 40px; text-align: center;
  transition: transform .4s; transform-style: preserve-3d;
}
.promise-cta-box:hover { transform: rotateY(-5deg) rotateX(3deg); box-shadow: 20px 20px 60px rgba(0,0,0,0.3); }
.promise-cta-box h3 { font-family: 'Playfair Display', serif; color: #fff; font-size: 28px; margin-bottom: 16px; }
.promise-cta-box p { color: #9a8a78; font-size: 16px; margin-bottom: 30px; line-height: 1.7; }
.promise-cta-box .phone { font-family: 'Playfair Display', serif; font-size: 32px; color: var(--gold); margin-bottom: 24px; display: block; text-decoration: none; animation: glowPulse 3s ease infinite; }

/* ── FAQ ── */
.faq-section { background: #f5ede0; }
.faq-grid { max-width: 800px; margin: 50px auto 0; }
.faq-item { border-bottom: 1px solid #e8d8b8; }
.faq-q {
  width: 100%; background: none; border: none; padding: 20px 0;
  text-align: left; font-family: 'Playfair Display', serif; font-size: 18px;
  color: var(--deep); cursor: pointer; display: flex; justify-content: space-between; align-items: center;
  transition: color .2s;
}
.faq-q:hover { color: var(--gold); }
.faq-q .indicator { color: var(--gold); font-size: 22px; transition: transform .4s cubic-bezier(.4,0,.2,1); flex-shrink: 0; margin-left: 12px; }
.faq-q.open .indicator { transform: rotate(45deg) scale(1.2); }
.faq-a {
  font-size: 15px; color: #6a5540; line-height: 1.8;
  overflow: hidden; max-height: 0;
  transition: max-height .5s cubic-bezier(.4,0,.2,1), padding .3s;
}
.faq-a.show { max-height: 200px; padding-bottom: 20px; }

/* ── CONTACT ── */
.contact-grid { max-width: 1100px; margin: 50px auto 0; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; }
.contact-info-item { display: flex; gap: 20px; align-items: flex-start; margin-bottom: 30px; transition: transform .3s; }
.contact-info-item:hover { transform: translateX(6px); }
.contact-info-item .icon { width: 48px; height: 48px; background: #fdf0e0; border: 1px solid var(--gold); display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; transition: transform .5s, background .3s; }
.contact-info-item:hover .icon { transform: rotateY(360deg); background: var(--gold); }
.contact-info-item h4 { font-family: 'Playfair Display', serif; font-size: 16px; color: var(--deep); margin-bottom: 4px; }
.contact-info-item p, .contact-info-item a { font-size: 15px; color: #6a5540; text-decoration: none; }
.contact-info-item a:hover { color: var(--gold); }
.form-group { margin-bottom: 20px; }
.form-group label { display: block; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; color: #9a8a78; margin-bottom: 8px; }
.form-group input, .form-group textarea {
  width: 100%; padding: 14px 16px;
  border: 1px solid #d8c8a8; background: #fff;
  font-family: 'Crimson Pro', serif; font-size: 16px; color: var(--deep);
  outline: none; transition: border-color .2s, transform .2s, box-shadow .2s;
}
.form-group input:focus, .form-group textarea:focus { border-color: var(--gold); transform: scale(1.01); box-shadow: 0 4px 20px rgba(200,146,42,0.15); }
.form-group textarea { height: 120px; resize: vertical; }

/* ── FOOTER ── */
footer { background: #0d0500; color: #8a7a68; padding: 70px 40px 30px; }
.footer-grid { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 50px; margin-bottom: 50px; }
.footer-brand h2 { font-family: 'Playfair Display', serif; color: #fff; font-size: 22px; margin-bottom: 8px; }
.footer-brand p { font-size: 14px; line-height: 1.7; color: #6a5a48; }
.footer-brand .gold-line { width: 40px; height: 2px; background: var(--gold); margin: 16px 0; }
footer h4 { font-family: 'Playfair Display', serif; color: #d4c4aa; font-size: 16px; margin-bottom: 20px; }
footer ul { list-style: none; }
footer ul li { margin-bottom: 10px; }
footer ul li a { color: #6a5a48; text-decoration: none; font-size: 14px; transition: color .2s, transform .2s; display: inline-block; }
footer ul li a:hover { color: var(--gold); transform: translateX(6px); }
.footer-bottom { max-width: 1200px; margin: 0 auto; padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center; font-size: 13px; flex-wrap: wrap; gap: 16px; }
.social-links { display: flex; gap: 12px; }
.social-link { width: 36px; height: 36px; border: 1px solid rgba(200,146,42,0.4); display: flex; align-items: center; justify-content: center; color: var(--gold); font-size: 16px; text-decoration: none; transition: all .4s; }
.social-link:hover { background: var(--gold); color: #fff; transform: rotateY(360deg) scale(1.1); }

/* ── FLOATING BUTTONS ── */
.float-btns {
  position: fixed; bottom: 24px; right: 16px;
  display: flex; flex-direction: column; gap: 12px;
  z-index: 999;
  max-width: calc(100vw - 32px);
}
.float-btn {
  width: 52px; height: 52px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; text-decoration: none;
  box-shadow: 0 4px 20px rgba(0,0,0,0.25);
  transition: transform .3s, box-shadow .3s;
  animation: floatPulse 3s ease infinite;
  flex-shrink: 0;
}
.float-btn:nth-child(2) { animation-delay: 1.5s; }
@keyframes floatPulse { 0%,100%{transform:scale(1);} 50%{transform:scale(1.08);} }
.float-btn:hover { transform: scale(1.18) rotate(8deg) !important; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
.float-wa { background: #25d366; color: #fff; }
.float-call { background: var(--gold); color: #fff; }

@media (max-width: 480px) {
  .float-btns { bottom: 16px; right: 12px; gap: 10px; }
  .float-btn { width: 46px; height: 46px; font-size: 18px; }
}
.float-gift {
  background: linear-gradient(135deg, #c8922a, #a0501a);
  color: #fff; position: relative; overflow: hidden;
  animation: giftBounce 2s ease infinite !important;
}
@keyframes giftBounce {
  0%,100% { transform: scale(1) rotate(0deg); }
  25% { transform: scale(1.15) rotate(-8deg); }
  50% { transform: scale(1.2) rotate(0deg); }
  75% { transform: scale(1.15) rotate(8deg); }
}
.gift-ripple {
  position: absolute; inset: 0; border-radius: 50%;
  border: 3px solid rgba(255,255,255,0.6);
  animation: rippleOut 1.8s ease-out infinite;
}
@keyframes rippleOut {
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(2.2); opacity: 0; }
}

.popup-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.6);
  z-index: 9999; display: flex; align-items: center; justify-content: center;
  animation: fadeInOverlay .3s ease;
}
@keyframes fadeInOverlay { from{opacity:0} to{opacity:1} }
.popup-box {
  background: #fff; border-radius: 20px; padding: 50px 40px; text-align: center;
  max-width: 420px; width: 90%; position: relative;
  animation: popIn .4s cubic-bezier(.175,.885,.32,1.275) both;
  box-shadow: 0 30px 80px rgba(0,0,0,0.3);
}
@keyframes popIn { from{opacity:0;transform:scale(.7)} to{opacity:1;transform:scale(1)} }
.popup-icon { font-size: 72px; margin-bottom: 16px; animation: bounceIn .6s .2s cubic-bezier(.175,.885,.32,1.275) both; display: block; }
@keyframes bounceIn { from{transform:scale(0) rotate(-20deg)} to{transform:scale(1) rotate(0deg)} }
.popup-box h3 { font-family: 'Playfair Display', serif; font-size: 26px; color: var(--deep); margin-bottom: 10px; }
.popup-box p { font-size: 16px; color: #6a5540; line-height: 1.6; margin-bottom: 28px; }
.popup-close { background: var(--gold); color: #fff; border: none; padding: 14px 36px; font-size: 16px; font-family: 'Crimson Pro', serif; cursor: pointer; border-radius: 6px; font-weight: 600; transition: background .2s; }
.popup-close:hover { background: var(--dark-gold); }
/* ════════════════════════════════════════════
   RESPONSIVE — TABLET (≤ 1024px)
════════════════════════════════════════════ */
@media (max-width: 1024px) {
  nav { padding: 0 16px; flex-wrap: wrap; gap: 8px; }
  .nav-links { display: flex; flex-wrap: wrap; gap: 0; }
  .hamburger { display: none !important; }

  .topbar { padding: 8px 24px; gap: 20px; font-size: 12px; }

  .hero-content { padding: 60px 40px; }
  .hero-stats { right: 40px; gap: 30px; }
  .hero-stat .num { font-size: 36px; }

  .features-grid { grid-template-columns: 1fr; gap: 28px; }
  .features-strip { padding: 40px 24px; }

  .about-grid { grid-template-columns: 1fr; gap: 50px; }
  .about-badge { width: 110px; height: 110px; right: -10px; }
  .about-badge .num { font-size: 28px; }

  .buy-grid { grid-template-columns: repeat(2, 1fr); }

  .products-grid { grid-template-columns: repeat(2, 1fr); }

  .why-grid { grid-template-columns: repeat(2, 1fr); }

  .process-grid { grid-template-columns: repeat(2, 1fr); gap: 40px; }
  .process-grid::before { display: none; }

  .stats-grid { grid-template-columns: repeat(2, 1fr); }

  .testimonials-grid { grid-template-columns: 1fr 1fr; }

  .branches-grid { grid-template-columns: repeat(3, 1fr); }

  .promise-grid { grid-template-columns: 1fr; gap: 40px; }

  .contact-grid { grid-template-columns: 1fr; }

  .footer-grid { grid-template-columns: 1fr 1fr; gap: 36px; }

  section { padding: 70px 24px; }
}

/* ════════════════════════════════════════════
   RESPONSIVE — MOBILE (≤ 768px)
════════════════════════════════════════════ */
@media (max-width: 768px) {
  /* Topbar */
  .topbar { padding: 8px 16px; gap: 10px; flex-direction: column; align-items: flex-start; font-size: 12px; }

  /* Nav */
  nav { padding: 8px 10px; flex-wrap: wrap; gap: 6px; }
  .logo-area h1 { font-size: 14px; }
  .logo-area p { font-size: 9px; letter-spacing: 1px; }
  .nav-links { display: flex !important; flex-wrap: wrap; gap: 0; }
  .nav-links a { padding: 10px 8px; font-size: 13px; }
  .nav-cta { padding: 10px 10px !important; font-size: 13px !important; }

  /* Hero */
  .hero { min-height: 100svh; align-items: flex-end; }
  .hero-content { padding: 30px 20px 140px; max-width: 100%; }
  .hero-badge { font-size: 9px; letter-spacing: 2px; padding: 5px 12px; }
  .hero h2 { font-size: clamp(26px, 8vw, 40px); }
  .hero p { font-size: 15px; margin-bottom: 24px; }
  .hero-btns { gap: 12px; }
  .btn-primary, .btn-outline { padding: 12px 22px; font-size: 14px; }

  .hero-stats {
    position: relative; right: auto; bottom: auto;
    justify-content: center; gap: 20px;
    padding: 20px 20px 30px;
    background: rgba(0,0,0,0.5);
    width: 100%;
  }
  .hero-stat .num { font-size: 28px; }
  .hero-stat .lbl { font-size: 10px; letter-spacing: 1px; }

  /* Features */
  .features-strip { padding: 36px 16px; }
  .feature-icon { width: 50px; height: 50px; font-size: 22px; }
  .feature-item h3 { font-size: 16px; }

  /* Sections */
  section { padding: 56px 16px; }
  .section-title { font-size: clamp(22px, 6vw, 32px); }

  /* About */
  .about-img-3d { font-size: 70px; }
  .about-badge { width: 90px; height: 90px; right: 0; bottom: -14px; }
  .about-badge .num { font-size: 22px; }
  .about-badge .lbl { font-size: 10px; }
  .about-check-list li { font-size: 14px; }
  .about-phone .num { font-size: 20px; }

  /* Buy / Flip cards */
  .buy-grid { grid-template-columns: 1fr 1fr; gap: 14px; }
  .flip-card { height: 220px; }
  .flip-front .emoji { font-size: 48px; margin-bottom: 10px; background-image: url("./src/assets/Types_old_Silk_sarees.jpg");}
  .flip-front h3 { font-size: 13px; }
  .flip-back h3 { font-size: 15px; }
  .flip-back p { font-size: 13px; }

  /* Products */
  .products-grid { grid-template-columns: 1fr 1fr; gap: 14px; }
  .product-card-img { height: 180px; font-size: 52px; }
  .product-card h3 { font-size: 14px; }
  .product-card-body { padding: 14px 16px; }

  /* Why */
  .why-grid { grid-template-columns: 1fr; gap: 20px; }
  .why-card { padding: 28px 22px; }

  /* Process */
  .process-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
  .step-num { width: 64px; height: 64px; font-size: 24px; }
  .process-step h3 { font-size: 15px; }
  .process-step p { font-size: 13px; }

  /* Stats */
  .stats-strip { padding: 40px 16px; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 24px; }
  .counter-num { font-size: 38px; }
  .counter-lbl { font-size: 11px; }

  /* Testimonials */
  .testimonials-grid { grid-template-columns: 1fr; }
  .review-score .score { font-size: 56px; }
  .review-header { gap: 20px; }

  /* Branches */
  .branches-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
  .branch-card { padding: 22px 14px; }
  .branch-card h3 { font-size: 15px; }

  /* Promise */
  .promise-grid { gap: 30px; }
  .promise-cta-box { padding: 36px 24px; }
  .promise-cta-box h3 { font-size: 22px; }
  .promise-cta-box .phone { font-size: 24px; }

  /* FAQ */
  .faq-q { font-size: 15px; padding: 16px 0; }

  /* Contact */
  .contact-grid { gap: 36px; }

  /* Footer */
  .footer-grid { grid-template-columns: 1fr; gap: 28px; }
  footer { padding: 50px 16px 24px; }
  .footer-bottom { flex-direction: column; align-items: flex-start; gap: 12px; }

  /* Float buttons */
  .float-btns { bottom: 20px; right: 16px; gap: 10px; }
  .float-btn { width: 50px; height: 50px; font-size: 20px; }
}

/* ════════════════════════════════════════════
   RESPONSIVE — SMALL MOBILE (≤ 480px)
════════════════════════════════════════════ */
@media (max-width: 480px) {
  .topbar { display: none; } /* hide on very small to save space */

  .hero-content { padding: 24px 16px 20px; }
  .hero h2 { font-size: clamp(24px, 9vw, 34px); }
  .hero { min-height: 100svh; flex-direction: column; justify-content: flex-end; }
  .hero-stats { gap: 14px; padding: 16px; }
  .hero-stat .num { font-size: 24px; }

  .buy-grid { grid-template-columns: 1fr; }
  .flip-card { height: 200px; }

  .products-grid { grid-template-columns: 1fr; }
  .product-card-img { height: 200px; }

  .process-grid { grid-template-columns: 1fr; }

  .branches-grid { grid-template-columns: repeat(2, 1fr); }

  .stats-grid { grid-template-columns: repeat(2, 1fr); }

  .section-title { font-size: clamp(20px, 7vw, 28px); }

  .btn-primary, .btn-outline { width: 100%; text-align: center; display: block; }
  .hero-btns { flex-direction: column; }

  .promise-cta-box .btn-primary,
  .promise-cta-box .btn-outline { font-size: 15px; padding: 14px; }
}

/* ── EXCHANGE RATE GRID ── */
.exchange-rate-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

@media (max-width: 1024px) {
  .exchange-rate-grid { gap: 40px; }
}

@media (max-width: 768px) {
  .exchange-rate-grid {
    grid-template-columns: 1fr;
    gap: 36px;
  }
  .exchange-rate-grid .reveal-right {
    order: -1;
  }
  .exchange-rate-grid .reveal-right img {
    max-height: 260px;
    object-fit: cover;
    width: 100%;
  }
  .exchange-rate-grid .reveal-right > div[style] {
    bottom: -12px !important;
    left: 10px !important;
    padding: 14px 18px !important;
  }
}

@media (max-width: 480px) {
  .exchange-rate-grid .reveal-right img { max-height: 200px; }
}
`;

/* ── DATA ── */
const allProducts = [
  { imgUrl: "./src/assets/saree_img_1.png",  name: "Pattu Vethai",              desc: "Traditional Pattu Vethai sarees bought at best market rates." },
  { imgUrl: "./src/assets/saree_img_2.png",  name: "Pattu Sattai",              desc: "Authentic Pattu Sattai evaluated by silk experts." },
  { imgUrl: "./src/assets/saree_img_3.png",  name: "Pattu Thundu",              desc: "Fine Pattu Thundu pieces accepted in any condition." },
  { imgUrl: "./src/assets/saree_img_4.png",  name: "Pattu Salai",               desc: "Premium Pattu Salai weaves — instant cash offered." },
  { imgUrl: "./src/assets/saree_img_5.png",  name: "Pattu Pavadai",             desc: "Silk Pattu Pavadai and dresses purchased at fair value." },
  { imgUrl: "./src/assets/saree_img_6.png",  name: "Banarasi Silk",             desc: "Exquisite Banarasi weaves in any condition accepted." },
  { imgUrl: "./src/assets/saree_img_7.png",  name: "Mysore Silk",               desc: "Soft Mysore silk sarees purchased with fair valuation." },
  { imgUrl: "./src/assets/saree_img_8.png",  name: "Tissue Silk Sarees",        desc: "Delicate tissue sarees evaluated with expert care." },
  { imgUrl: "./src/assets/saree_img_9.png",  name: "Jacquard Silk Saree",       desc: "Intricate Jacquard silk designs — top prices paid." },
  { imgUrl: "./src/assets/saree_img_10.png", name: "Tanki / Jangla Silk Saree", desc: "Traditional Tanki and Jangla weaves expertly valued." },
  { imgUrl: "./src/assets/saree_img_11.png", name: "Padiyur Silk Sarees",       desc: "Authentic Padiyur silk sarees bought instantly." },
  { imgUrl: "./src/assets/saree_img_12.png", name: "Kanchipuram Pattu Saree",   desc: "Premium Kanchipuram silk with authentic zari work." },
  { imgUrl: "./src/assets/saree_img_13.png", name: "Jangala Banarasi Sarees",   desc: "Heritage Jangala Banarasi — we buy all types." },
  { imgUrl: "./src/assets/saree_img_14.png", name: "Thirli Onam Silk Sarees",   desc: "Festive Onam silk sarees accepted at premium rates." },
  { imgUrl: "./src/assets/saree_img_15.png", name: "Kavaring Silk Sarees",      desc: "Beautiful Kavaring silk sarees evaluated fairly." },
  { imgUrl: "./src/assets/saree_img_16.png", name: "Mixed Jatiqui Silk Sarees", desc: "Mixed Jatiqui silk varieties — all types accepted." },
];

const INITIAL_SHOW = 6;
const products = allProducts; // keep reference for any other usage

const whyUs = [
  {
    icon: "💰",
    title: "Instant Cash",
    desc: "Get paid immediately for your old sarees — no waiting, no delays.",
  },
  {
    icon: "📊",
    title: "Best Market Value",
    desc: "We offer genuine rates based on today's silk market value.",
  },
  {
    icon: "🤝",
    title: "Trusted Evaluation",
    desc: "Transparent process with no hidden costs or surprises.",
  },
  {
    icon: "🏠",
    title: "Doorstep Service",
    desc: "Home visits available for bulk and premium sarees.",
  },
  {
    icon: "⭐",
    title: "20+ Years Experience",
    desc: "Decades of expertise in evaluating authentic silk sarees.",
  },
  {
    icon: "✅",
    title: "ISO Certified",
    desc: "Professional and certified operations you can fully trust.",
  },
];

const steps = [
  {
    num: "01",
    icon: "📞",
    title: "Contact Us",
    desc: "Call or WhatsApp to schedule. Share your address directly.",
  },
  {
    num: "02",
    icon: "🚗",
    title: "Arrival for Pickup",
    desc: "Our executive arrives at your location within 12 hours.",
  },
  {
    num: "03",
    icon: "🔬",
    title: "Testing Silk Quality",
    desc: "We test silk quality through proven methods.",
  },
  {
    num: "04",
    icon: "💵",
    title: "On Spot Cash",
    desc: "After validation, cash is given without any delays.",
  },
];

const testimonials = [
  {
    name: "Nathish Raja",
    text: "Excellent service! They gave me the best price for my old Kanchipuram sarees. The process was transparent and payment was instant.",
    rating: 5,
  },
  {
    name: "Ramkumar",
    text: "Very professional team. They came home and evaluated my mother's old silk sarees respectfully. Highly recommend!",
    rating: 5,
  },
  {
    name: "Priya Lakshmi",
    text: "Trusted and reliable buyers. Got a fair price for my grandmother's collection. The staff was courteous and prompt.",
    rating: 5,
  },
];
const branches = [
  {
    name: "Lakshmi Pattu Center",
    area: "Planner Selvam Park Signal, CSI Church Opposite, Erode - 1",
    phone: "+91 90256 52123",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3913.1!2d77.7172!3d11.3410!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDIwJzI3LjYiTiA3N8KwNDMnMDIuMCJF!5e0!3m2!1sen!2sin!4v1700000000000",
    mapLink: "https://maps.google.com/?q=Lakshmi+Pattu+Center+Erode",
    color: "#c8922a",
  },
  {
    name: "Kaanjithangamayil",
    area: "62, Nethaji Complex, Supreme Tower Opposite, Manikoondu, Erode - 1",
    phone: "+91 90256 52123",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3913.2!2d77.7200!3d11.3420!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDIwJzMxLjIiTiA3N8KwNDMnMTIuMCJF!5e0!3m2!1sen!2sin!4v1700000000001",
    mapLink: "https://maps.google.com/?q=Kaanjithangamayil+Erode+Manikoondu",
    color: "#7b1f1f",
  },
];

const faqs = [
  {
    q: "What types of sarees do you buy?",
    a: "We buy all types of old silk sarees including Kanchipuram, Banarasi, Mysore, Arani, Thirubuvanam, Tissue sarees, Pattu Pavadai, 9-yard sarees, and more.",
  },
  {
    q: "How do you determine the price?",
    a: "We assess each saree based on silk quality, weaving type, zari content, design intricacy, and current market rates. Our evaluation is fully transparent.",
  },
  {
    q: "Do you provide home pickup service?",
    a: "Yes! We offer doorstep pickup across Erode. For bulk collections, we arrange home visits on call.",
  },
  {
    q: "Is payment made immediately?",
    a: "Absolutely. We provide on-the-spot cash payment immediately after evaluation. No delays, no bank transfers.",
  },
  {
    q: "What is your service area?",
    a: "We operate from Erode and have branches in Salem, Chennai, Trichy, and Erode.",
  },
];

/* ── THREE.JS HERO CANVAS ── */
function ThreeHero() {
  const canvasRef = useRef(null);

  useEffect(() => {
    let animId;
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    script.onload = () => {
      const THREE = window.THREE;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const W = canvas.offsetWidth,
        H = canvas.offsetHeight;
      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
      camera.position.z = 5;

      const geo = new THREE.BufferGeometry();
      const count = 700;
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 22;
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const pMat = new THREE.PointsMaterial({
        color: 0xc8922a,
        size: 0.06,
        transparent: true,
        opacity: 0.85,
      });
      const points = new THREE.Points(geo, pMat);
      scene.add(points);

      const rings = [];
      for (let i = 0; i < 6; i++) {
        const rg = new THREE.TorusGeometry(1.5 + i * 0.7, 0.012, 16, 100);
        const rm = new THREE.MeshBasicMaterial({
          color: 0xc8922a,
          transparent: true,
          opacity: 0.12 - i * 0.015,
        });
        const ring = new THREE.Mesh(rg, rm);
        ring.rotation.x = Math.random() * Math.PI;
        ring.rotation.y = Math.random() * Math.PI;
        scene.add(ring);
        rings.push(ring);
      }

      const ribbons = [];
      for (let i = 0; i < 10; i++) {
        const rg = new THREE.PlaneGeometry(0.04, 2.5 + Math.random() * 2);
        const rm = new THREE.MeshBasicMaterial({
          color: 0xc8922a,
          transparent: true,
          opacity: 0.05 + Math.random() * 0.07,
          side: THREE.DoubleSide,
        });
        const m = new THREE.Mesh(rg, rm);
        m.position.set(
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 5 - 2,
        );
        m.rotation.z = Math.random() * Math.PI;
        scene.add(m);
        ribbons.push({
          mesh: m,
          speed: 0.003 + Math.random() * 0.006,
          offset: Math.random() * Math.PI * 2,
        });
      }

      const jewels = [];
      for (let i = 0; i < 6; i++) {
        const jg = new THREE.OctahedronGeometry(0.15 + Math.random() * 0.15);
        const jm = new THREE.MeshBasicMaterial({
          color: 0xc8922a,
          wireframe: true,
          transparent: true,
          opacity: 0.2,
        });
        const j = new THREE.Mesh(jg, jm);
        j.position.set(
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 4 - 2,
        );
        scene.add(j);
        jewels.push({
          mesh: j,
          ry: 0.01 + Math.random() * 0.02,
          rz: 0.005 + Math.random() * 0.01,
          offset: Math.random() * Math.PI * 2,
        });
      }

      let mouseX = 0,
        mouseY = 0;
      const handleMouse = (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
      };
      const handleTouch = (e) => {
        if (e.touches[0]) {
          mouseX = (e.touches[0].clientX / window.innerWidth - 0.5) * 2;
          mouseY = -(e.touches[0].clientY / window.innerHeight - 0.5) * 2;
        }
      };
      window.addEventListener("mousemove", handleMouse);
      window.addEventListener("touchmove", handleTouch, { passive: true });

      const animate = (t = 0) => {
        animId = requestAnimationFrame(animate);
        const time = t * 0.001;
        points.rotation.y = time * 0.04 + mouseX * 0.1;
        points.rotation.x = time * 0.015 + mouseY * 0.05;
        rings.forEach((r, i) => {
          r.rotation.x += 0.003 + i * 0.0005;
          r.rotation.y += 0.004;
        });
        ribbons.forEach(({ mesh, speed, offset }) => {
          mesh.rotation.z += speed * 0.5;
          mesh.position.y += Math.sin(time + offset) * 0.003;
        });
        jewels.forEach(({ mesh, ry, rz, offset }) => {
          mesh.rotation.y += ry;
          mesh.rotation.z += rz;
          mesh.position.y += Math.sin(time * 0.8 + offset) * 0.003;
        });
        camera.position.x += (mouseX * 0.3 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 0.2 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
      };
      animate();

      const onResize = () => {
        if (!canvas) return;
        renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
        camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
        camera.updateProjectionMatrix();
      };
      window.addEventListener("resize", onResize);
    };
    document.head.appendChild(script);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} id="hero-canvas" />;
}

/* ── ANIMATED COUNTER ── */
function Counter({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          let v = 0;
          const step = () => {
            v += Math.ceil(target / 55);
            if (v >= target) {
              setVal(target);
              return;
            }
            setVal(v);
            requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return (
    <span ref={ref} className="counter-num">
      {val}
      {suffix}
    </span>
  );
}

/* ── MOBILE NAV DRAWER ── */
function MobileNav({ open, onClose }) {
  return (
    <div className={`mobile-nav ${open ? "open" : ""}`} onClick={onClose}>
      <div className="mobile-nav-inner" onClick={(e) => e.stopPropagation()}>
        <div className="mobile-nav-logo">Sri Lakshmi Pattu Center</div>
        <div className="mobile-nav-sub">Old Silk Saree Buyers · Erode</div>
        <ul className="mobile-nav-links">
          {[
            ["Home", "#home"],
            ["About Us", "#about"],
            ["Products", "#products"],
            ["Our Locations", "#branches"],
            ["FAQ", "#faq"],
            ["Contact", "#contact"],
          ].map(([label, href]) => (
            <li key={href}>
              <a href={href} onClick={onClose}>
                {label}
              </a>
            </li>
          ))}
        </ul>
        <a href="#contact" className="mobile-nav-cta" onClick={onClose}>
          Get Free Quote
        </a>
        <div style={{ marginTop: 28, display: "flex", gap: 12 }}>
          <a
            href="tel:+919025652123"
            style={{
              flex: 1,
              background: "var(--gold)",
              color: "#fff",
              padding: "12px",
              textAlign: "center",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            📞 Call
          </a>
          <a
            href="https://wa.me/919025652123"
            style={{
              flex: 1,
              background: "#25d366",
              color: "#fff",
              padding: "12px",
              textAlign: "center",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            💬 WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

function ProductsSection() {
  const [expanded, setExpanded] = useState(false);
  const visibleProducts = expanded ? allProducts : allProducts.slice(0, INITIAL_SHOW);
  const remaining = allProducts.length - INITIAL_SHOW;

  return (
    <section id="products" style={{ background: "#fff" }}>
      <div className="max-w">
        <div className="reveal" style={{ textAlign: "center" }}>
          <div className="section-label">Our Buying Products</div>
          <h2 className="section-title">Browse Our <em>16 Saree Categories</em></h2>
          <p className="section-sub" style={{ margin: "12px auto 0", textAlign: "center" }}>
            We buy all types of old silk sarees — from everyday weaves to rare heirloom pieces.
          </p>
        </div>

        {/* FIRST 16 — always visible */}
        <div className="products-grid" style={{ marginTop: 50 }}>
          {allProducts.slice(0, INITIAL_SHOW).map((p, i) => (
            <ProductCard key={i} p={p} i={i} />
          ))}
        </div>

        {/* REMAINING — expand/collapse */}
        <div style={{
          maxHeight: expanded ? 2000 : 0,
          overflow: "hidden",
          transition: "max-height 0.8s cubic-bezier(0.25,0.8,0.25,1)"
        }}>
          <div className="products-grid" style={{ marginTop: 28 }}>
            {allProducts.slice(INITIAL_SHOW).map((p, i) => (
              <ProductCard key={i + INITIAL_SHOW} p={p} i={i} />
            ))}
          </div>
        </div>

        {/* EXPAND / COLLAPSE BUTTON */}
        <div style={{ textAlign: "center", marginTop: 40 }} className="reveal">
          <button
            onClick={() => setExpanded(!expanded)}
            className="btn-primary"
            style={{
              border: "none", cursor: "pointer", marginRight: 16,
              display: "inline-flex", alignItems: "center", gap: 10,
              fontSize: 15, padding: "14px 32px"
            }}
          >
            <span style={{
              display: "inline-block",
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.4s ease", fontSize: 18, lineHeight: 1
            }}>▼</span>
            {expanded ? `Show Less` : `Show ${remaining} More Categories`}
          </button>
          <a href="#contact" className="btn-outline"
            style={{ color: "var(--deep)", borderColor: "var(--gold)", display: "inline-block" }}>
            Sell All Types →
          </a>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ p, i }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="product-card reveal" style={{ transitionDelay: `${(i % 3) * 0.1}s` }}>
      <div className="product-card-img" style={{ position: "relative", overflow: "hidden" }}>
        {p.imgUrl && !imgError ? (
          <img
            src={p.imgUrl}
            alt={p.name}
            onError={() => setImgError(true)}
            style={{ height: "100%", width: "100%", objectFit: "cover", borderRadius: "12px 12px 0 0" }}
          />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            background: "linear-gradient(135deg, #1a0800 0%, #3d1a00 50%, #6b3010 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 13, color: "rgba(200,146,42,0.7)", letterSpacing: 1 }}>No Image</span>
          </div>
        )}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(26,8,0,0.65) 0%, transparent 55%)",
          pointerEvents: "none", borderRadius: "12px 12px 0 0"
        }} />
      </div>
      <div className="product-card-body">
        <h3>{p.name}</h3>
        <p style={{ fontSize: 13, color: "#6a5540", marginBottom: 10, lineHeight: 1.5 }}>{p.desc}</p>
        <a href="#contact">Sell Now →</a>
      </div>
    </div>
  );
}

/* ── MAIN ── */
export default function App() {
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    message: "",
  });
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
      { threshold: 0.1 },
    );
    document
      .querySelectorAll(".reveal, .reveal-left, .reveal-right")
      .forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Prevent body scroll when mobile nav open
  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileNavOpen]);

  const submit = (e) => {
    e.preventDefault();
    addData(form);
    setForm({ name: "", phone: "", city: "", message: "" });
    setShowPopup(true);
    setTimeout(() => {
      window.open(
        `https://wa.me/919025652123?text=${encodeURIComponent("I have registered from website and want to know more!")}`,
        "_blank",
      );
    }, 1800);
  };
  return (
    <>
      <style>{CSS}</style>

      {/* SUCCESS POPUP */}
      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-box" onClick={(e) => e.stopPropagation()}>
            <span className="popup-icon">🎉</span>
            <h3>You're Registered!</h3>
            <p>
              Thank you! We've received your details and will contact you
              shortly. You're now eligible for exciting discounts & gifts!
            </p>
            <button className="popup-close" onClick={() => setShowPopup(false)}>
              Wonderful, Thank You!
            </button>
          </div>
        </div>
      )}

      {/* MOBILE NAV */}
      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      {/* NAV */}
      <nav>
        <div className="logo-area">
          <h1>Sri Lakshmi Pattu Center</h1>
          <p>Old Silk Saree Buyers · Erode</p>
        </div>
        {/* Desktop links */}
        <ul className="nav-links">
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#about">About Us</a>
          </li>
          <li className="has-dropdown">
            <a href="#products">Products ▾</a>
            <div className="dropdown">
              {products.map((p, i) => (
                <a key={i} href="#products">
                  {p.name}
                </a>
              ))}
            </div>
          </li>
          <li>
            <a href="#faq">FAQ</a>
          </li>
          <li className="has-dropdown">
            <a href="#branches"> Locations ▾</a>
            <div className="dropdown" style={{ minWidth: 320 }}>
              {branches.map((b, i) => (
                <div
                  key={i}
                  style={{
                    padding: "14px 20px",
                    borderBottom: "1px solid #f0e8d8",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Playfair Display',serif",
                      fontWeight: 700,
                      color: "var(--deep)",
                      fontSize: 15,
                      marginBottom: 4,
                    }}
                  >
                    {b.name}
                  </div>
                  <div
                    style={{ fontSize: 13, color: "#6a5540", marginBottom: 6 }}
                  >
                    {b.area}
                  </div>
                  <a
                    href={b.mapLink}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontSize: 13,
                      color: "var(--gold)",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    📍 View on Map →
                  </a>
                </div>
              ))}
            </div>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
          <li>
            <a href="#contact" className="nav-cta">
              Get Free Quote
            </a>
          </li>
        </ul>
        {/* Hamburger */}
        <button
          className={`hamburger ${mobileNavOpen ? "open" : ""}`}
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* ─── HERO ─── */}
      <section id="home" className="hero">
        <ThreeHero />
        <div className="hero-img-right">
          <img src={HeroWomanTop} alt="Silk Saree" />
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            Erode's Most Trusted Silk Saree Buyers
          </div>
          <h2>
            Get <em>Top Value</em> for Your Old Silk Sarees
          </h2>
          <p>
            We buy old pattu sarees, silk sarees, pattu pavadai, and silver
            items — fast, fair, and hassle-free. Instant cash payment
            guaranteed.
          </p>
          <div className="hero-btns">
            <a href="tel:+919025652123" className="btn-primary">
              📞 Call Now
            </a>
            <a href="#contact" className="btn-outline">
              Get Free Quote
            </a>
          </div>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="num">20+</div>
            <div className="lbl">Years Experience</div>
          </div>
          <div className="hero-stat">
            <div className="num">50K+</div>
            <div className="lbl">Sarees Bought</div>
          </div>
          <div className="hero-stat">
            <div className="num">4.6★</div>
            <div className="lbl">Google Rating</div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          {Array(12)
            .fill(
              "✦ Old Silk Saree Buyers ✦ Best Price Guaranteed ✦ Instant Cash ✦ Doorstep Service ✦ 20+ Years Experience",
            )
            .map((t, i) => (
              <span key={i}>{t}</span>
            ))}
        </div>
      </div>

      {/* ─── ABOUT ─── */}
      <section id="about" style={{ background: "#fff" }}>
        <div className="about-grid">
          <div className="about-img-wrap reveal-left">
            <div>
              <img
                src={HeroWomanBottom}
                className="about-img-3d"
                placeholder="Woman with Smile and saree"
              />
            </div>
            <div className="about-badge">
              <div className="num">20+</div>
              <div className="lbl">Years Experience</div>
            </div>
          </div>
          <div className="reveal-right">
            <div className="section-label">Welcome to Our Center</div>
            <h2 className="section-title">
              Sri Lakshmi <em>Pattu Center</em>
            </h2>
            <p className="section-sub">
              Erode's most trusted destination for old silk saree buyers. With
              20+ years of experience, we stand as a symbol of trust,
              transparency, and fair value.
            </p>
            <ul className="about-check-list">
              <li>Buying Old Silk Sarees &amp; Old Pattu Sarees</li>
              <li>Old Pattu Pavadai &amp; Silk Saree Dresses</li>
              <li>Old Silver Items &amp; Old Brass Items</li>
              <li>ISO Certified — Award Winning 2023</li>
            </ul>
            <div className="about-phone">
              <span style={{ fontSize: 28 }}>📞</span>
              <div>
                <div className="lbl">Call to ask any question</div>
                <div className="num">
                  <a
                    href="tel:+919025652123"
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    +91 90256 52123
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PROCESS ─── */}
      <section className="process-section">
        <div className="max-w">
          <div className="reveal" style={{ textAlign: "center" }}>
            <div className="section-label" style={{ color: "var(--gold)" }}>
              How It Works
            </div>
            <h2 className="section-title">
              Our Simple <em>Buying Process</em>
            </h2>
          </div>
          <div className="process-grid">
            {steps.map((s, i) => (
              <div
                key={i}
                className="process-step reveal"
                style={{ transitionDelay: `${i * 0.15}s` }}
              >
                <div className="step-num">{s.icon}</div>
                <div className="step-label">Step {s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COUNTER STRIP ─── */}
      <div className="stats-strip">
        <div className="stats-grid">
          {[
            { t: 20, s: "+", l: "Years Experience" },
            { t: 50, s: "K+", l: "Sarees Bought" },
            { t: 2, s: "", l: "Branch Locations" },
            { t: 3223, s: "+", l: "Happy Customers" },
          ].map((s, i) => (
            <div
              key={i}
              className="reveal"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <Counter target={s.t} suffix={s.s} />
              <div className="counter-lbl">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── EXCHANGE RATE SECTION ─── */}
      <section
        style={{
          background: "var(--deep)",
          padding: "90px 40px",
          overflow: "hidden",
        }}
      >
        <div className="max-w exchange-rate-grid">
          <div className="reveal-left">
            <div className="section-label" style={{ color: "var(--gold)" }}>
              Saree Valuation
            </div>
            <h2 className="section-title" style={{ color: "#fff" }}>
              How Much Will You <em>Receive?</em>
            </h2>
            <p
              style={{
                color: "#c8b89a",
                fontSize: 17,
                lineHeight: 1.8,
                marginBottom: 32,
                fontWeight: 300,
              }}
            >
              We evaluate every saree individually based on silk purity, zari
              weight, weave type, and current market rates. Our transparent
              process ensures you always receive the{" "}
              <strong style={{ color: "var(--gold)" }}>
                best possible value
              </strong>
              .
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                marginBottom: 36,
              }}
            >
              {[
                {
                  range: "₹500 – ₹5,000",
                  label: "Regular Silk & Cotton-blend Sarees",
                  icon: "🧵",
                },
                {
                  range: "₹5,000 – ₹25,000",
                  label: "Arani, Mysore & Thirubuvanam Silk",
                  icon: "🌺",
                },
                {
                  range: "₹25,000 – ₹1,00,000+",
                  label: "Kanchipuram & Banarasi Heavy Zari Sarees",
                  icon: "💎",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 16,
                    alignItems: "center",
                    background: "rgba(200,146,42,0.08)",
                    borderLeft: "3px solid var(--gold)",
                    padding: "16px 20px",
                    borderRadius: "0 10px 10px 0",
                    transition: "transform .3s",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "translateX(8px)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "translateX(0)")
                  }
                >
                  <span style={{ fontSize: 28 }}>{item.icon}</span>
                  <div>
                    <div
                      style={{
                        fontFamily: "'Playfair Display',serif",
                        color: "var(--gold)",
                        fontSize: 20,
                        fontWeight: 700,
                      }}
                    >
                      {item.range}
                    </div>
                    <div
                      style={{ color: "#9a8a78", fontSize: 14, marginTop: 2 }}
                    >
                      {item.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <a href="#contact" className="btn-primary">
              Get Your Free Quote →
            </a>
          </div>
          <div className="reveal-right" style={{ position: "relative" }}>
            <img
              src={OldSilkSarees}
              alt="Old Silk Sarees"
              style={{
                width: "110%",
                borderRadius: 20,
                boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
                display: "block",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -20,
                left: -20,
                background: "var(--gold)",
                borderRadius: 12,
                padding: "20px 28px",
                boxShadow: "0 10px 40px rgba(200,146,42,0.5)",
              }}
            >
              <div
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: 32,
                  color: "#fff",
                  lineHeight: 1,
                }}
              >
                ₹1L+
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.85)",
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  marginTop: 4,
                }}
              >
                Maximum Paid
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRODUCTS ─── */}
      <ProductsSection />

      {/* ─── TESTIMONIALS ─── */}
      <section className="testimonials">
        <div className="max-w">
          <div className="review-header">
            <div className="review-score reveal-left">
              <div className="score">4.6</div>
              <div className="stars">★★★★★</div>
            </div>
            <div className="reveal-right">
              <div className="section-label">Customer Reviews</div>
              <h2 className="section-title">
                What Our <em>Customers Say</em>
              </h2>
            </div>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="testimonial-card reveal"
                style={{ transitionDelay: `${i * 0.15}s` }}
              >
                <div className="qt">"</div>
                <p>{t.text}</p>
                <div className="stars">{"★".repeat(t.rating)}</div>
                <div className="author">— {t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BRANCHES ─── */}
      <section id="branches" className="branches-section">
        <div className="max-w">
          <div className="reveal" style={{ textAlign: "center" }}>
            <div className="section-label">Our Showrooms</div>
            <h2 className="section-title">
              Visit Us at Our <em>Two Locations</em>
            </h2>
            <p
              style={{
                color: "#9a8a78",
                maxWidth: 520,
                margin: "12px auto 0",
                fontSize: 16,
              }}
            >
              Two premium showrooms in the heart of Erode, each offering the
              same trusted experience.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 32,
              marginTop: 50,
              maxWidth: 1000,
              margin: "50px auto 0",
            }}
            className="branches-two-grid"
          >
            {branches.map((b, i) => (
              <div
                key={i}
                className="branch-card-full reveal"
                style={{ transitionDelay: `${i * 0.15}s` }}
              >
                <div style={{borderTop:`4px solid ${b.color}`,background:'rgba(255,255,255,0.05)',borderRadius:12,padding:'clamp(20px, 4vw, 32px) clamp(16px, 3vw, 28px)',border:'1px solid rgba(200,146,42,0.25)',backdropFilter:'blur(4px)'}}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>🏪</div>
                  <h3
                    style={{
                      fontFamily: "'Playfair Display',serif",
                      color: "#fff",
                      fontSize: 22,
                      marginBottom: 10,
                    }}
                  >
                    {b.name}
                  </h3>
                  <p
                    style={{
                      color: "#c8b89a",
                      fontSize: 14,
                      lineHeight: 1.7,
                      marginBottom: 16,
                    }}
                  >
                    📍 {b.area}
                  </p>
                  <p
                    style={{
                      color: "var(--gold)",
                      fontSize: 15,
                      marginBottom: 20,
                    }}
                  >
                    📞 {b.phone}
                  </p>
                  <div
                    style={{
                      borderRadius: 10,
                      overflow: "hidden",
                      marginBottom: 16,
                      border: "1px solid rgba(200,146,42,0.3)",
                    }}
                  >
                    <iframe
                      src={b.mapEmbed}
                      width="100%" height="220" style={{border:0,display:'block',minHeight:180}}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={b.name}
                    />
                  </div>
                  <a
                    href={b.mapLink}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "block",
                      textAlign: "center",
                      background: "var(--gold)",
                      color: "#fff",
                      padding: "12px",
                      fontWeight: 600,
                      textDecoration: "none",
                      borderRadius: 6,
                      fontSize: 14,
                      transition: "background .2s",
                    }}
                  >
                    📍 Get Directions
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROMISE ─── */}
      <section style={{ background: "#fff" }}>
        <div className="max-w">
          <div className="reveal" style={{ textAlign: "center" }}>
            <div className="section-label">Our Promise</div>
            <h2 className="section-title">
              What We <em>Guarantee</em> You
            </h2>
          </div>
          <div className="promise-grid">
            <ul className="promise-list reveal-left">
              {[
                {
                  title: "Fair Market Value",
                  desc: "Genuine rates based on current silk market prices.",
                },
                {
                  title: "Instant Cash Payment",
                  desc: "On-the-spot payment with no delays.",
                },
                {
                  title: "Quick Evaluation",
                  desc: "Fast, expert assessment of your silk items.",
                },
                {
                  title: "Professional & Friendly Service",
                  desc: "Courteous staff ensuring a comfortable experience.",
                },
                {
                  title: "Doorstep Collection",
                  desc: "Available for select locations across Erode.",
                },
              ].map((item, i) => (
                <li key={i}>
                  <div className="check">✓</div>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="promise-cta-box reveal-right">
              <h3>Ready to Sell Your Old Silk Sarees?</h3>
              <p>
                Contact us today for a free evaluation and instant cash payment.
                We come to your doorstep!
              </p>
              <a href="tel:+919025652123" className="phone">
                +91 90256 52123
              </a>
              <a
                href="tel:+919025652123"
                className="btn-primary"
                style={{ display: "block", marginBottom: 12 }}
              >
                📞 Call Now
              </a>
              <a
                href="https://wa.me/919025652123"
                className="btn-outline"
                style={{ display: "block", color: "#fff" }}
              >
                💬 WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          {Array(12)
            .fill(
              "✦ Old Silk Saree Buyers ✦ Best Price Guaranteed ✦ Instant Cash ✦ Doorstep Service ✦ 20+ Years Experience",
            )
            .map((t, i) => (
              <span key={i}>{t}</span>
            ))}
        </div>
      </div>

      {/* ─── CONTACT ─── */}
      <section id="contact" style={{ background: "#fff" }}>
        <div className="max-w">
          <div className="reveal" style={{ textAlign: "center" }}>
            <div className="section-label">🎁 Register & Win</div>
            <h2 className="section-title">
              Register Now & Unlock <em>Exciting Gifts!</em>
            </h2>
            <p
              className="section-sub"
              style={{ margin: "12px auto 0", textAlign: "center" }}
            >
              Fill in your details below to register and stand a chance to win
              exclusive discounts, surprise gifts, and priority home pickup
              service!
            </p>
          </div>
          <div className="contact-grid">
            <div className="reveal-left">
              {[
                {
                  icon: "📞",
                  title: "Call Us",
                  content: <a href="tel:+919025652123">+91 90256 52123</a>,
                },
                {
                  icon: "✉️",
                  title: "Email Us",
                  content: (
                    <a href="mailto:srilakshmipattucenter98@gmail.com">
                      srilakshmipattucenter98@gmail.com
                    </a>
                  ),
                },
                {
                  icon: "📍",
                  title: "Head Office",
                  content: (
                    <p>
                      No 155/4, Opposite Pothys, Cross Cut Rd, Erode, Tamil Nadu
                      – 641012
                    </p>
                  ),
                },
                {
                  icon: "🕐",
                  title: "Working Hours",
                  content: <p>Mon – Sat: 9:00 AM – 7:00 PM</p>,
                },
              ].map((item, i) => (
                <div key={i} className="contact-info-item">
                  <div className="icon">{item.icon}</div>
                  <div>
                    <h4>{item.title}</h4>
                    {item.content}
                  </div>
                </div>
              ))}
            </div>
            <div className="reveal-right">
              <form onSubmit={submit}>
                {[
                  {
                    label: "Your Name",
                    field: "name",
                    type: "text",
                    ph: "Enter your full name",
                  },
                  {
                    label: "Phone Number",
                    field: "phone",
                    type: "tel",
                    ph: "+91 XXXXX XXXXX",
                  },
                  {
                    label: "Your City",
                    field: "city",
                    type: "text",
                    ph: "Erode, Salem...",
                  },
                ].map(({ label, field, type, ph }) => (
                  <div key={field} className="form-group">
                    <label>{label}</label>
                    <input
                      type={type}
                      value={form[field]}
                      onChange={(e) =>
                        setForm({ ...form, [field]: e.target.value })
                      }
                      placeholder={ph}
                      required={field !== "city"}
                    />
                  </div>
                ))}
                <div className="form-group">
                  <label>Message (Optional)</label>
                  <textarea
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    placeholder="Tell us about your sarees..."
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: "100%", fontSize: 16, padding: 16 }}
                >
                  🎁 Register & Claim My Gift
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="faq-section">
        <div className="max-w">
          <div className="reveal" style={{ textAlign: "center" }}>
            <div className="section-label">Common Questions</div>
            <h2 className="section-title">
              Frequently Asked <em>Questions</em>
            </h2>
          </div>
          <div className="faq-grid">
            {faqs.map((f, i) => (
              <div
                key={i}
                className="faq-item reveal"
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <button
                  className={`faq-q ${openFaq === i ? "open" : ""}`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {f.q}
                  <span className="indicator">+</span>
                </button>
                <div className={`faq-a ${openFaq === i ? "show" : ""}`}>
                  {f.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer>
        <div className="footer-grid">
          <div className="footer-brand reveal">
            <h2>Sri Lakshmi Pattu Center</h2>
            <div className="gold-line" />
            <p>
              Erode's most trusted old silk saree buyers. Turning your silk
              treasures into instant value since 2004.
            </p>
          </div>
          {[
            {
              title: "Quick Links",
              links: [
                ["Home", "#home"],
                ["About Us", "#about"],
                ["Products", "#products"],
                ["FAQ", "#faq"],
                ["Contact", "#contact"],
              ],
            },
            {
              title: "Branches",
              links: [
                ["Erode", "#contact"],
                ["Erode", "#contact"],
              ],
            },
            {
              title: "Products",
              links: [
                ["Kanchipuram Silk", "#products"],
                ["Banarasi Silk", "#products"],
                ["Tissue Sarees", "#products"],
                ["Mysore Silk", "#products"],
                ["Old Silver Items", "#products"],
              ],
            },
          ].map((col, i) => (
            <div
              key={i}
              className="reveal"
              style={{ transitionDelay: `${(i + 1) * 0.1}s` }}
            >
              <h4>{col.title}</h4>
              <ul>
                {col.links.map(([l, h], j) => (
                  <li key={j}>
                    <a href={h}>{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span>©2025 Sri Lakshmi Pattu Center. All Rights Reserved.</span>
          <div className="social-links">
            <a
              href="https://wa.me/919025652123"
              className="social-link"
              target="_blank"
              rel="noreferrer"
              title="WhatsApp"
            >
              💬
            </a>
            <a href="tel:+919025652123" className="social-link" title="Call Us">
              📞
            </a>
            <a
              href="mailto:srilakshmipattucenter98@gmail.com"
              className="social-link"
              title="Email"
            >
              ✉️
            </a>
            <a
              href="https://www.facebook.com/YOUR_PAGE"
              className="social-link"
              target="_blank"
              rel="noreferrer"
              title="Facebook"
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="currentColor"
              >
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/YOUR_HANDLE"
              className="social-link"
              target="_blank"
              rel="noreferrer"
              title="Instagram"
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a
              href="https://www.youtube.com/YOUR_CHANNEL"
              className="social-link"
              target="_blank"
              rel="noreferrer"
              title="YouTube"
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="currentColor"
              >
                <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
                <polygon
                  points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"
                  fill="white"
                />
              </svg>
            </a>
          </div>
        </div>
      </footer>

      {/* FLOATING BUTTONS */}
      <div className="float-btns">
        <a
          href="https://wa.me/919025652123"
          className="float-btn float-wa"
          target="_blank"
          rel="noreferrer"
          title="Chat on WhatsApp"
        >
          <svg viewBox="0 0 32 32" width="26" height="26" fill="white">
            <path d="M16 2C8.28 2 2 8.28 2 16c0 2.44.64 4.73 1.76 6.72L2 30l7.52-1.72A13.93 13.93 0 0016 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm7.24 19.36c-.3.84-1.76 1.6-2.44 1.68-.64.08-1.44.12-2.32-.16-.52-.16-1.2-.4-2.08-.76-3.64-1.56-6.04-5.2-6.22-5.44-.18-.24-1.44-1.92-1.44-3.64 0-1.72.9-2.56 1.22-2.92.3-.34.66-.42.88-.42.22 0 .44 0 .64.01.2.01.48-.08.74.56.28.66.94 2.28.1 2.7-.2.1-.36.2-.52.3-.18.12-.34.24-.18.48.18.26.78 1.28 1.68 2.08 1.16 1.02 2.12 1.34 2.42 1.5.3.16.48.14.66-.08.18-.22.76-.88 1.00-1.18.24-.3.48-.26.8-.14.32.12 2.04.96 2.38 1.14.34.18.58.26.66.4.08.16.08.9-.22 1.74z" />
          </svg>
        </a>
        <a
          href="#contact"
          className="float-btn float-gift"
          title="Win exciting gifts!"
          onClick={(e) => {
            e.preventDefault();
            document
              .getElementById("contact")
              .scrollIntoView({ behavior: "smooth" });
          }}
        >
          <svg viewBox="0 0 32 32" width="24" height="24" fill="white">
            <path d="M26 10h-2.46A5 5 0 0016 4a5 5 0 00-7.54 6H6a2 2 0 00-2 2v2a2 2 0 002 2h1v8a2 2 0 002 2h14a2 2 0 002-2v-8h1a2 2 0 002-2v-2a2 2 0 00-2-2zm-10-4a3 3 0 013 3H13a3 3 0 013-3zm-4 6h-6v-2h6zm2 12H9v-8h5zm8 0h-6v-8h6zm0-10h-6v-2h6z" />
          </svg>
          <span className="gift-ripple"></span>
        </a>
      </div>
    </>
  );
}

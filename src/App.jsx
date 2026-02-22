import { useState, useEffect, useRef } from "react";
import pattusaree from "./assets/Pattusaree.jpg";
import { addData } from "./lib/firebase";

import HeroWoman from './assets/hero-women-pos.png';
import OldSilkSarees from './assets/Types_old_Silk_sarees.jpg'
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
.hamburger {
  display: none; flex-direction: column; gap: 5px;
  background: none; border: none; cursor: pointer; padding: 8px;
}
.hamburger span { display: block; width: 25px; height: 2px; background: var(--deep); border-radius: 2px; transition: all .3s; }
.hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.hamburger.open span:nth-child(2) { opacity: 0; }
.hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

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

/* ── HERO ── */
.hero {
  min-height: 92vh;
  position: relative; display: flex; align-items: center; overflow: hidden;
  background: #0d0400;
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
.reveal { opacity: 0; transform: translateY(50px) rotateX(8deg); transform-origin: top center; transition: opacity .7s ease, transform .7s ease; }
.reveal.visible { opacity: 1; transform: translateY(0) rotateX(0deg); }
.reveal-left { opacity: 0; transform: translateX(-60px) rotateY(12deg); transform-origin: right center; transition: opacity .7s ease, transform .7s ease; }
.reveal-left.visible { opacity: 1; transform: translateX(0) rotateY(0deg); }
.reveal-right { opacity: 0; transform: translateX(60px) rotateY(-12deg); transform-origin: left center; transition: opacity .7s ease, transform .7s ease; }
.reveal-right.visible { opacity: 1; transform: translateX(0) rotateY(0deg); }

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
.float-btns { position: fixed; bottom: 30px; right: 30px; display: flex; flex-direction: column; gap: 12px; z-index: 999; }
.float-btn { width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 22px; text-decoration: none; box-shadow: 0 4px 20px rgba(0,0,0,0.2); transition: transform .3s, box-shadow .3s; animation: floatPulse 3s ease infinite; }
.float-btn:nth-child(2) { animation-delay: 1.5s; }
@keyframes floatPulse { 0%,100%{transform:scale(1);} 50%{transform:scale(1.08);} }
.float-btn:hover { transform: scale(1.2) rotate(10deg) !important; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
.float-wa { background: #25d366; color: #fff; }
.float-call { background: var(--gold); color: #fff; }

/* ════════════════════════════════════════════
   RESPONSIVE — TABLET (≤ 1024px)
════════════════════════════════════════════ */
@media (max-width: 1024px) {
  nav { padding: 0 24px; }
  .nav-links { display: none; }
  .hamburger { display: flex; }

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
  nav { padding: 0 16px; }
  .logo-area h1 { font-size: 17px; }
  .logo-area p { font-size: 10px; letter-spacing: 1px; }

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
`;

/* ── DATA ── */
const products = [
  { emoji: pattusaree, isImg: true, name: "Old Kanchipuram Silk Sarees", desc: "Premium Kanchipuram silk with authentic zari work." },
  { emoji: "🧵", name: "Old Banarasi Silk Sarees", desc: "Exquisite Banarasi weaves in any condition accepted." },
  { emoji: "✨", name: "Old Tissue Sarees", desc: "Delicate tissue sarees evaluated with expert care." },
  { emoji: "🌺", name: "Old Thirubuvanam Sarees", desc: "Traditional Thirubuvanam silk — best prices paid." },
  { emoji: "🏛️", name: "Old Mysore Sarees", desc: "Soft Mysore silk purchased with fair valuation." },
  { emoji: "🌸", name: "Old Arani Sarees", desc: "Authentic Arani silk sarees bought instantly." },
  { emoji: "🎋", name: "Old Dharmapuram Sarees", desc: "Heritage Dharmapuram weaves — we buy all types." },
  { emoji: "💎", name: "Old Silk Sarees", desc: "Any old silk saree accepted at best market value." },
  { emoji: "👘", name: "Old Pattu Pudavai", desc: "Pattu pudavai and pavadai — full fair cash offered." },
];

const whyUs = [
  { icon: "💰", title: "Instant Cash", desc: "Get paid immediately for your old sarees — no waiting, no delays." },
  { icon: "📊", title: "Best Market Value", desc: "We offer genuine rates based on today's silk market value." },
  { icon: "🤝", title: "Trusted Evaluation", desc: "Transparent process with no hidden costs or surprises." },
  { icon: "🏠", title: "Doorstep Service", desc: "Home visits available for bulk and premium sarees." },
  { icon: "⭐", title: "20+ Years Experience", desc: "Decades of expertise in evaluating authentic silk sarees." },
  { icon: "✅", title: "ISO Certified", desc: "Professional and certified operations you can fully trust." },
];

const steps = [
  { num: "01", icon: "📞", title: "Contact Us", desc: "Call or WhatsApp to schedule. Share your address directly." },
  { num: "02", icon: "🚗", title: "Arrival for Pickup", desc: "Our executive arrives at your location within 12 hours." },
  { num: "03", icon: "🔬", title: "Testing Silk Quality", desc: "We test silk quality through proven methods." },
  { num: "04", icon: "💵", title: "On Spot Cash", desc: "After validation, cash is given without any delays." },
];

const testimonials = [
  { name: "Nathish Raja", text: "Excellent service! They gave me the best price for my old Kanchipuram sarees. The process was transparent and payment was instant.", rating: 5 },
  { name: "Ramkumar", text: "Very professional team. They came home and evaluated my mother's old silk sarees respectfully. Highly recommend!", rating: 5 },
  { name: "Priya Lakshmi", text: "Trusted and reliable buyers. Got a fair price for my grandmother's collection. The staff was courteous and prompt.", rating: 5 },
];

const faqs = [
  { q: "What types of sarees do you buy?", a: "We buy all types of old silk sarees including Kanchipuram, Banarasi, Mysore, Arani, Thirubuvanam, Tissue sarees, Pattu Pavadai, 9-yard sarees, and more." },
  { q: "How do you determine the price?", a: "We assess each saree based on silk quality, weaving type, zari content, design intricacy, and current market rates. Our evaluation is fully transparent." },
  { q: "Do you provide home pickup service?", a: "Yes! We offer doorstep pickup across Erode. For bulk collections, we arrange home visits on call." },
  { q: "Is payment made immediately?", a: "Absolutely. We provide on-the-spot cash payment immediately after evaluation. No delays, no bank transfers." },
  { q: "What is your service area?", a: "We operate from Erode and have branches in Salem, Chennai, Trichy, and Erode." },
];

/* ── THREE.JS HERO CANVAS ── */
function ThreeHero() {
  const canvasRef = useRef(null);

  useEffect(() => {
    let animId;
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    script.onload = () => {
      const THREE = window.THREE;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const W = canvas.offsetWidth, H = canvas.offsetHeight;
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
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
      const pMat = new THREE.PointsMaterial({ color: 0xc8922a, size: 0.06, transparent: true, opacity: 0.85 });
      const points = new THREE.Points(geo, pMat);
      scene.add(points);

      const rings = [];
      for (let i = 0; i < 6; i++) {
        const rg = new THREE.TorusGeometry(1.5 + i * 0.7, 0.012, 16, 100);
        const rm = new THREE.MeshBasicMaterial({ color: 0xc8922a, transparent: true, opacity: 0.12 - i * 0.015 });
        const ring = new THREE.Mesh(rg, rm);
        ring.rotation.x = Math.random() * Math.PI;
        ring.rotation.y = Math.random() * Math.PI;
        scene.add(ring);
        rings.push(ring);
      }

      const ribbons = [];
      for (let i = 0; i < 10; i++) {
        const rg = new THREE.PlaneGeometry(0.04, 2.5 + Math.random() * 2);
        const rm = new THREE.MeshBasicMaterial({ color: 0xc8922a, transparent: true, opacity: 0.05 + Math.random() * 0.07, side: THREE.DoubleSide });
        const m = new THREE.Mesh(rg, rm);
        m.position.set((Math.random() - 0.5) * 14, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 5 - 2);
        m.rotation.z = Math.random() * Math.PI;
        scene.add(m);
        ribbons.push({ mesh: m, speed: 0.003 + Math.random() * 0.006, offset: Math.random() * Math.PI * 2 });
      }

      const jewels = [];
      for (let i = 0; i < 6; i++) {
        const jg = new THREE.OctahedronGeometry(0.15 + Math.random() * 0.15);
        const jm = new THREE.MeshBasicMaterial({ color: 0xc8922a, wireframe: true, transparent: true, opacity: 0.2 });
        const j = new THREE.Mesh(jg, jm);
        j.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4 - 2);
        scene.add(j);
        jewels.push({ mesh: j, ry: 0.01 + Math.random() * 0.02, rz: 0.005 + Math.random() * 0.01, offset: Math.random() * Math.PI * 2 });
      }

      let mouseX = 0, mouseY = 0;
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
        rings.forEach((r, i) => { r.rotation.x += 0.003 + i * 0.0005; r.rotation.y += 0.004; });
        ribbons.forEach(({ mesh, speed, offset }) => { mesh.rotation.z += speed * 0.5; mesh.position.y += Math.sin(time + offset) * 0.003; });
        jewels.forEach(({ mesh, ry, rz, offset }) => { mesh.rotation.y += ry; mesh.rotation.z += rz; mesh.position.y += Math.sin(time * 0.8 + offset) * 0.003; });
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

    return () => { cancelAnimationFrame(animId); };
  }, []);

  return <canvas ref={canvasRef} id="hero-canvas" />;
}

/* ── ANIMATED COUNTER ── */
function Counter({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let v = 0;
        const step = () => {
          v += Math.ceil(target / 55);
          if (v >= target) { setVal(target); return; }
          setVal(v); requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref} className="counter-num">{val}{suffix}</span>;
}

/* ── MOBILE NAV DRAWER ── */
function MobileNav({ open, onClose }) {
  return (
    <div className={`mobile-nav ${open ? "open" : ""}`} onClick={onClose}>
      <div className="mobile-nav-inner" onClick={e => e.stopPropagation()}>
        <div className="mobile-nav-logo">Sri Lakshmi Pattu Center</div>
        <div className="mobile-nav-sub">Old Silk Saree Buyers · Erode</div>
        <ul className="mobile-nav-links">
          {[["Home", "#home"], ["About Us", "#about"], ["Products", "#products"], ["FAQ", "#faq"], ["Contact", "#contact"]].map(([label, href]) => (
            <li key={href}><a href={href} onClick={onClose}>{label}</a></li>
          ))}
        </ul>
        <a href="#contact" className="mobile-nav-cta" onClick={onClose}>Get Free Quote</a>
        <div style={{ marginTop: 28, display: "flex", gap: 12 }}>
          <a href="tel:+917010506200" style={{ flex: 1, background: "var(--gold)", color: "#fff", padding: "12px", textAlign: "center", textDecoration: "none", fontWeight: 600, fontSize: 14 }}>📞 Call</a>
          <a href="https://wa.me/917010506200" style={{ flex: 1, background: "#25d366", color: "#fff", padding: "12px", textAlign: "center", textDecoration: "none", fontWeight: 600, fontSize: 14 }}>💬 WhatsApp</a>
        </div>
      </div>
    </div>
  );
}

/* ── MAIN ── */
export default function App() {
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", city: "", message: "" });
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Prevent body scroll when mobile nav open
  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileNavOpen]);

  const submit = (e) => {
    e.preventDefault();
    alert("Thank you! We will contact you shortly.");
    addData(form)
    setForm({ name: "", phone: "", city: "", message: "" });
  };

  return (
    <>
      <style>{CSS}</style>

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
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About Us</a></li>
          <li className="has-dropdown">
            <a href="#products">Products ▾</a>
            <div className="dropdown">{products.map((p, i) => <a key={i} href="#products">{p.name}</a>)}</div>
          </li>
          <li><a href="#faq">FAQ</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><a href="#contact" className="nav-cta">Get Free Quote</a></li>
        </ul>
        {/* Hamburger */}
        <button
          className={`hamburger ${mobileNavOpen ? "open" : ""}`}
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* ─── HERO ─── */}
      <section id="home" className="hero">
        <ThreeHero />
        <div className="hero-content">
          <div className="hero-badge">Erode's Most Trusted Silk Saree Buyers</div>
          <h2>Get <em>Top Value</em> for Your Old Silk Sarees</h2>
          <p>We buy old pattu sarees, silk sarees, pattu pavadai, and silver items — fast, fair, and hassle-free. Instant cash payment guaranteed.</p>
          <div className="hero-btns">
            <a href="tel:+917010506200" className="btn-primary">📞 Call Now</a>
            <a href="#contact" className="btn-outline">Get Free Quote</a>
          </div>
        </div>
        <div className="hero-stats">
          <div className="hero-stat"><div className="num">20+</div><div className="lbl">Years Experience</div></div>
          <div className="hero-stat"><div className="num">50K+</div><div className="lbl">Sarees Bought</div></div>
          <div className="hero-stat"><div className="num">4.6★</div><div className="lbl">Google Rating</div></div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          {Array(12).fill("✦ Old Silk Saree Buyers ✦ Best Price Guaranteed ✦ Instant Cash ✦ Doorstep Service ✦ 20+ Years Experience").map((t, i) => <span key={i}>{t}</span>)}
        </div>
      </div>

      {/* ─── ABOUT ─── */}
      <section id="about" style={{ background: "#fff" }}>
        <div className="about-grid">
          <div className="about-img-wrap reveal-left">
            <div>
              <img src={HeroWoman} className="about-img-3d" placeholder="Woman with Smile and saree"/>
            </div>
            <div className="about-badge"><div className="num">20+</div><div className="lbl">Years Experience</div></div>
          </div>
          <div className="reveal-right">
            <div className="section-label">Welcome to Our Center</div>
            <h2 className="section-title">Sri Lakshmi  <em>Pattu Center</em></h2>
            <p className="section-sub">Erode's most trusted destination for old silk saree buyers. With 20+ years of experience, we stand as a symbol of trust, transparency, and fair value.</p>
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
                <div className="num"><a href="tel:+917010506200" style={{ color: "inherit", textDecoration: "none" }}>+9170105 06200</a></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PROCESS ─── */}
      <section className="process-section">
        <div className="max-w">
          <div className="reveal" style={{ textAlign: "center" }}>
            <div className="section-label" style={{ color: "var(--gold)" }}>How It Works</div>
            <h2 className="section-title">Our Simple <em>Buying Process</em></h2>
          </div>
          <div className="process-grid">
            {steps.map((s, i) => (
              <div key={i} className="process-step reveal" style={{ transitionDelay: `${i * 0.15}s` }}>
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
            { t: 5, s: "", l: "Branch Locations" },
            { t: 3223, s: "+", l: "Happy Customers" },
          ].map((s, i) => (
            <div key={i} className="reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
              <Counter target={s.t} suffix={s.s} />
              <div className="counter-lbl">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── WHAT WE BUY ─── */}
      <section className="buy-section">
        <div className="max-w">
          <div className="reveal" style={{ textAlign: "center" }}>
            <div className="section-label">What We Accept</div>
            <h2 className="section-title">All Types of <em>Silk Materials</em></h2>
          </div>
          <div className="buy-grid">
            {[
              {title: "Old Silk Sarees", desc: "All varieties of old silk sarees purchased at premium rates." },
              { emoji: "✨", title: "Old Pattu Sarees", desc: "Traditional pattu sarees evaluated by silk experts." },
              { emoji: "👘", title: "Pattu Pavadai", desc: "Silk skirts and blouses accepted in any condition." },
              { emoji: "🪡", title: "Silk Fabric Pieces", desc: "Silk saree dresses and fabric pieces also purchased." },
            ].map((card, i) => (
              <div key={i} className="flip-card reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="flip-inner">
                  <div className="flip-front">
                    <h3>{card.title}</h3>
                  </div>
                  <div className="flip-back">
                    <h3>{card.title}</h3>
                    <p>{card.desc}</p>
                    <button className="sell-btn" onClick={() => document.getElementById("contact").scrollIntoView({ behavior: "smooth" })}>Sell Now →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRODUCTS ─── */}
      <section id="products" style={{ background: "#fff" }}>
        <div className="max-w">
          <div className="reveal" style={{ textAlign: "center" }}>
            <div className="section-label">Our Buying Products</div>
            <h2 className="section-title">Browse Our <em>Product Categories</em></h2>
          </div>
          <div className="products-grid">
            {products.map((p, i) => (
              <div key={i} className="product-card reveal" style={{ transitionDelay: `${(i % 3) * 0.12}s` }}>
                <div className="product-card-img">
                  {p.isImg
                    ? <img src={p.emoji} alt={p.name} style={{ height: "100%", width: "120%" }} />
                    : p.emoji
                  }
                </div>
                <div className="product-card-body">
                  <h3>{p.name}</h3>
                  <a href="#contact">Sell Now →</a>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }} className="reveal">
            <a href="#contact" className="btn-primary">View All &amp; Sell Now</a>
          </div>
        </div>
      </section>

      {/* ─── WHY US ─── */}
      <section style={{ background: "#f5ede0" }}>
        <div className="max-w">
          <div className="reveal">
            <div className="section-label">Why Choose Us</div>
            <h2 className="section-title">Why Choose Sri Lakshmi  <em>Pattu Center?</em></h2>
          </div>
          <div className="why-grid">
            {whyUs.map((w, i) => (
              <div key={i} className="why-card reveal" style={{ transitionDelay: `${(i % 3) * 0.12}s` }}>
                <span className="why-icon">{w.icon}</span>
                <h3>{w.title}</h3>
                <p>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="testimonials">
        <div className="max-w">
          <div className="review-header">
            <div className="review-score reveal-left">
              <div className="score">4.6</div>
              <div className="stars">★★★★★</div>
              <p>3,223+ Google Reviews</p>
            </div>
            <div className="reveal-right">
              <div className="section-label">Customer Reviews</div>
              <h2 className="section-title">What Our <em>Customers Say</em></h2>
            </div>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card reveal" style={{ transitionDelay: `${i * 0.15}s` }}>
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
      <section className="branches-section">
        <div className="max-w">
          <div className="reveal" style={{ textAlign: "center" }}>
            <div className="section-label">Our Branches</div>
            <h2 className="section-title">We Are <em>Across Tamil Nadu</em></h2>
          </div>
          <div className="branches-grid">
            {["Erode", "Salem", "Chennai", "Trichy", "Erode"].map((b, i) => (
              <div key={i} className="branch-card reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                <span className="icon">📍</span>
                <h3>{b}</h3>
                <p>+9170105 06200</p>
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
            <h2 className="section-title">What We <em>Guarantee</em> You</h2>
          </div>
          <div className="promise-grid">
            <ul className="promise-list reveal-left">
              {[
                { title: "Fair Market Value", desc: "Genuine rates based on current silk market prices." },
                { title: "Instant Cash Payment", desc: "On-the-spot payment with no delays." },
                { title: "Quick Evaluation", desc: "Fast, expert assessment of your silk items." },
                { title: "Professional & Friendly Service", desc: "Courteous staff ensuring a comfortable experience." },
                { title: "Doorstep Collection", desc: "Available for select locations across Erode." },
              ].map((item, i) => (
                <li key={i}>
                  <div className="check">✓</div>
                  <div><h4>{item.title}</h4><p>{item.desc}</p></div>
                </li>
              ))}
            </ul>
            <div className="promise-cta-box reveal-right">
              <h3>Ready to Sell Your Old Silk Sarees?</h3>
              <p>Contact us today for a free evaluation and instant cash payment. We come to your doorstep!</p>
              <a href="tel:+917010506200" className="phone">+9170105 06200</a>
              <a href="tel:+917010506200" className="btn-primary" style={{ display: "block", marginBottom: 12 }}>📞 Call Now</a>
              <a href="https://wa.me/917010506200" className="btn-outline" style={{ display: "block", color: "#fff" }}>💬 WhatsApp Us</a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="faq-section">
        <div className="max-w">
          <div className="reveal" style={{ textAlign: "center" }}>
            <div className="section-label">Common Questions</div>
            <h2 className="section-title">Frequently Asked <em>Questions</em></h2>
          </div>
          <div className="faq-grid">
            {faqs.map((f, i) => (
              <div key={i} className="faq-item reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
                <button className={`faq-q ${openFaq === i ? "open" : ""}`} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {f.q}
                  <span className="indicator">+</span>
                </button>
                <div className={`faq-a ${openFaq === i ? "show" : ""}`}>{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONTACT ─── */}
      <section id="contact" style={{ background: "#fff" }}>
        <div className="max-w">
          <div className="reveal" style={{ textAlign: "center" }}>
            <div className="section-label">Get In Touch</div>
            <h2 className="section-title">Contact <em>Us Today</em></h2>
          </div>
          <div className="contact-grid">
            <div className="reveal-left">
              {[
                { icon: "📞", title: "Call Us", content: <a href="tel:+917010506200">+9170105 06200</a> },
                { icon: "✉️", title: "Email Us", content: <a href="mailto:lakshmipattucbe@gmail.com">lakshmipattucbe@gmail.com</a> },
                { icon: "📍", title: "Head Office", content: <p>No 155/4, Opposite Pothys, Cross Cut Rd, Erode, Tamil Nadu – 641012</p> },
                { icon: "🕐", title: "Working Hours", content: <p>Mon – Sat: 9:00 AM – 7:00 PM</p> },
              ].map((item, i) => (
                <div key={i} className="contact-info-item">
                  <div className="icon">{item.icon}</div>
                  <div><h4>{item.title}</h4>{item.content}</div>
                </div>
              ))}
            </div>
            <div className="reveal-right">
              <form onSubmit={submit}>
                {[
                  { label: "Your Name", field: "name", type: "text", ph: "Enter your full name" },
                  { label: "Phone Number", field: "phone", type: "tel", ph: "+91 XXXXX XXXXX" },
                  { label: "Your City", field: "city", type: "text", ph: "Erode, Salem..." },
                ].map(({ label, field, type, ph }) => (
                  <div key={field} className="form-group">
                    <label>{label}</label>
                    <input type={type} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} placeholder={ph} required={field !== "city"} />
                  </div>
                ))}
                <div className="form-group">
                  <label>Message (Optional)</label>
                  <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us about your sarees..." />
                </div>
                <button type="submit" className="btn-primary" style={{ width: "100%", fontSize: 16, padding: 16 }}>
                  Send Message — Get Free Quote
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer>
        <div className="footer-grid">
          <div className="footer-brand reveal">
            <h2>Sri Lakshmi Pattu Center</h2>
            <div className="gold-line" />
            <p>Erode's most trusted old silk saree buyers. Turning your silk treasures into instant value since 2004.</p>
          </div>
          {[
            { title: "Quick Links", links: [["Home", "#home"], ["About Us", "#about"], ["Products", "#products"], ["FAQ", "#faq"], ["Contact", "#contact"]] },
            { title: "Branches", links: [["Erode", "#contact"], ["Salem", "#contact"], ["Chennai", "#contact"], ["Trichy", "#contact"], ["Erode", "#contact"]] },
            { title: "Products", links: [["Kanchipuram Silk", "#products"], ["Banarasi Silk", "#products"], ["Tissue Sarees", "#products"], ["Mysore Silk", "#products"], ["Old Silver Items", "#products"]] },
          ].map((col, i) => (
            <div key={i} className="reveal" style={{ transitionDelay: `${(i + 1) * 0.1}s` }}>
              <h4>{col.title}</h4>
              <ul>{col.links.map(([l, h], j) => <li key={j}><a href={h}>{l}</a></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span>©2025 Sri Lakshmi Pattu Center. All Rights Reserved.</span>
          <div className="social-links">
            <a href="https://wa.me/917010506200" className="social-link" target="_blank" rel="noreferrer">💬</a>
            <a href="tel:+917010506200" className="social-link">📞</a>
            <a href="mailto:lakshmipattucbe@gmail.com" className="social-link">✉️</a>
          </div>
        </div>
      </footer>

      {/* FLOATING BUTTONS */}
      <div className="float-btns">
        <a href="https://wa.me/917010506200" className="float-btn float-wa" target="_blank" rel="noreferrer">💬</a>
        <a href="tel:+917010506200" className="float-btn float-call">📞</a>
      </div>
    </>
  );
}
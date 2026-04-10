"use client";

import React, { useState, useEffect, useRef } from "react";
import emailjs from '@emailjs/browser';

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [warpEnded, setWarpEnded] = useState(false);
  const [showName, setShowName] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [progress, setProgress] = useState(0);

  // EmailJS Form State
  const formRef = useRef<HTMLFormElement>(null);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState<boolean | null>(null);

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsSending(true);

    // Read EmailJS keys securely from .env.local
    emailjs.sendForm(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '', 
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '', 
      formRef.current,
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''
    )
    .then((result) => {
        setIsSending(false);
        setSendSuccess(true);
        formRef.current?.reset();
        setTimeout(() => setSendSuccess(null), 5000);
    }, (error) => {
        setIsSending(false);
        setSendSuccess(false);
        setTimeout(() => setSendSuccess(null), 5000);
    });
  };

  useEffect(() => {
    // Start progress bar animation
    const progressTimer = setTimeout(() => setProgress(100), 100);

    // After 8.5 seconds (giving Spline time to wave), start simple crossfade transition directly to the name
    const transitionTimer = setTimeout(() => {
        setWarpEnded(true);
        setShowName(true);
    }, 8500);

    // Swap text to title after Name finishes its 2s flash (Total: 10.5s)
    const titleTimer = setTimeout(() => {
        setShowName(false);
        setShowTitle(true);
    }, 10500);
    
    // Complete entire intro sequence revealing the portfolio (Total: 12.5s)
    const removeTimer = setTimeout(() => setShowIntro(false), 12500);
    
    return () => {
      clearTimeout(progressTimer);
      clearTimeout(transitionTimer);
      clearTimeout(titleTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  return (
    <main className={`min-h-screen bg-[#050505] text-white selection:bg-neon-blue selection:text-black font-sans overflow-x-hidden ${showIntro ? 'h-screen overflow-y-hidden' : ''}`}>
      
      {/* Prefetch Heavy Spline Models immediately so the browser downloads them concurrently off disk rather than waiting for iframes to mount */}
      <link rel="preload" href="https://prod.spline.design/EFemSjMLKLNVtUzr/scene.splinecode" as="fetch" crossOrigin="anonymous" />
      <link rel="preload" href="https://prod.spline.design/SlxT2aFwXSiiccb7/scene.splinecode?v=2" as="fetch" crossOrigin="anonymous" />

      {/* Cinematic Text Flashes overlaid on black after warp */}
      <div className={`fixed inset-0 z-[500] bg-[#020202] flex flex-col items-center justify-center transition-opacity duration-1000 ${showIntro && warpEnded ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {showName && (
            <h1 className="text-xl md:text-3xl lg:text-5xl font-black text-white drop-shadow-[0_0_40px_rgba(255,255,255,1)] absolute text-center uppercase tracking-[0.2em] md:tracking-[0.3em] animate-title-flash w-full px-4 overflow-hidden">
              KABIR PATEL
            </h1>
        )}
        {showTitle && (
            <h2 className="text-xl md:text-3xl lg:text-5xl font-sans font-light text-white tracking-[0.2em] md:tracking-[0.3em] animate-title-flash absolute text-center uppercase w-full px-4 overflow-hidden">
              SOFTWARE <span className="font-bold text-neon-blue drop-shadow-[0_0_20px_rgba(0,243,255,0.8)]">DEVELOPER</span>
            </h2>
        )}
      </div>

      {/* Solid background blocker to absolutely prevent the home page from leaking through during opacity crossfades! */}
      {showIntro && <div className="fixed inset-0 z-[50] bg-[#020202] pointer-events-none"></div>}
      
      {/* Splash Intro Overlay - Starfield/Space Theme */}
      <div className={`fixed inset-0 z-[100] bg-[#020202] flex-col items-center justify-center origin-center overflow-hidden transition-all duration-1000 ${warpEnded ? 'opacity-0 pointer-events-none' : 'opacity-100'} ${showIntro ? 'flex' : 'hidden'}`}>
        
        {/* Deep Space Background details */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-[#020202] to-black opacity-80 z-0"></div>
        {/* Simulated stars */}
        <div className={`absolute inset-0 z-0 opacity-50 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]`}></div>

        {/* Use iframe sandboxing to stop broken Spline background timeline bugs from bleeding into Next.js DevOverlay */}
        <div className={`w-full h-full absolute inset-0 z-10 transition-all duration-1000 ease-in ${warpEnded ? 'opacity-0 scale-[0.9]' : 'opacity-100'}`} style={{ willChange: "transform, opacity" }}>
          <iframe 
             src="/spline.html?url=https://prod.spline.design/EFemSjMLKLNVtUzr/scene.splinecode" 
             frameBorder="0" 
             width="100%" 
             height="100%"
             className="w-full h-full border-none outline-none pointer-events-none"
             title="Space Background"
          ></iframe>
        </div>

        <div className={`z-20 text-center pointer-events-none mt-[50vh] bg-black/40 px-10 py-8 rounded-3xl backdrop-blur-md border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.9)] flex flex-col items-center transition-all duration-500 will-change-transform ${warpEnded ? 'opacity-0 scale-[0.9]' : 'opacity-100'}`}>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 drop-shadow-2xl">
            Hello, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-blue-500 drop-shadow-[0_0_20px_rgba(0,243,255,0.8)]">Kabir Patel</span>
          </h1>
          <p className="text-gray-400 font-mono tracking-widest uppercase text-sm mb-6 flex gap-2">
            <span className="w-2 h-2 rounded-full bg-neon-blue animate-pulse mt-1"></span> Initializing environment...
          </p>
          
          {/* Loading Bar */}
          <div className="w-64 h-1.5 bg-gray-900 rounded-full overflow-hidden shadow-[0_0_10px_rgba(0,243,255,0.2)]">
            <div 
              className="h-full bg-neon-blue rounded-full shadow-[0_0_10px_rgba(0,243,255,1)] transition-all ease-[cubic-bezier(0.25,0.1,0.25,1)]" 
              style={{ width: `${progress}%`, transitionDuration: '8400ms' }}
            ></div>
          </div>
        </div>
      </div>

      {/* Navigation / Header */}
      {/* Navigation / Header */}
      <header className={`fixed top-4 left-0 right-0 z-50 px-4 md:px-8 flex justify-between items-center transition-all duration-[1500ms] delay-300 ${showIntro ? 'opacity-0 translate-y-[-50px]' : 'opacity-100 translate-y-0'}`}>
        {/* Logo */}
        <div className="text-2xl font-black tracking-tighter drop-shadow-lg text-white">
          PORT<span className="text-neon-blue">FOLIO</span>
        </div>

        {/* Floating Nav Pill */}
        <nav className="hidden md:flex items-center gap-1 px-3 py-2 bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          {[
            { name: "Home", href: "#hero" },
            { name: "About", href: "#about" },
            { name: "Skills", href: "#skills" },
            { name: "Projects", href: "#projects" }
          ].map((item) => (
            <a 
              key={item.name} 
              href={item.href} 
              className="px-5 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-full transition-all duration-300 ease-out relative group"
            >
              {item.name}
              <span className="absolute inset-x-4 -bottom-px h-px bg-gradient-to-r from-transparent via-neon-blue to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </a>
          ))}
        </nav>

        {/* Contact Me CTA */}
        <a href="#contact" className="px-6 py-2.5 text-sm font-bold rounded-full border border-neon-blue/50 text-neon-blue hover:bg-neon-blue hover:text-black transition-all shadow-[0_0_15px_rgba(0,243,255,0.2)] hover:shadow-[0_0_20px_rgba(0,243,255,0.6)]">
          Contact Me
        </a>
      </header>

      {/* 1. Hero Section */}
      <section id="hero" className="relative w-full min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neon-blue/20 via-[#050505] to-[#050505] opacity-50"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/10 blur-[120px] rounded-full mix-blend-screen"></div>

        {/* Info Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between">
          <div className="w-full md:w-1/2 flex flex-col items-start gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm shadow-[0_0_10px_rgba(0,243,255,0.1)]">
              <span className="w-2 h-2 rounded-full bg-neon-blue animate-pulse"></span>
              <span className="text-xs font-mono text-neon-blue uppercase tracking-widest">Available for Work</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
              Hi, I’m <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-blue-500 drop-shadow-[0_0_30px_rgba(0,243,255,0.6)]">Kabir Patel</span> <br />
              <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-white/90 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] block mt-4">
                Full Stack Developer & <br className="hidden lg:block" /> Machine Learning Enthusiast
              </span>
            </h1>
            <p className="text-lg text-gray-400 max-w-lg font-light mt-6 leading-relaxed">
              I build modern web applications and explore intelligent systems using <span className="text-neon-blue font-medium">React</span>, <span className="text-neon-blue font-medium">Next.js</span>, and machine learning.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#projects" className="px-8 py-3 bg-neon-blue text-black font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(0,243,255,0.8)] transition-all hover:-translate-y-1 block text-center">
                Explore Work
              </a>
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="px-8 py-3 bg-white/5 text-white font-semibold rounded-lg hover:bg-white/10 backdrop-blur-md transition-all hover:-translate-y-1 border border-white/10 block text-center">
                View Resume
              </a>
            </div>
          </div>

          <div className="w-full md:w-1/2 h-[500px] lg:h-[700px] mt-12 md:mt-0 relative group perspective-1000">
            <div className="absolute inset-0 bg-gradient-to-tr from-neon-blue/5 to-transparent rounded-2xl border border-white/5 shadow-2xl overflow-hidden backdrop-blur-sm group-hover:border-neon-blue/30 transition-all duration-500">
              {/* Spline Canvas Container - Performance Optimized Execution */}
              <div id="spline-canvas-container" className="w-full h-full flex items-center justify-center overflow-hidden rounded-2xl relative">
                  {warpEnded && (
                    <iframe 
                       // Defer rendering this heavy 3D asset until the Intro Avatar finishes so the GPU doesn't throttle
                       src="/spline.html?url=https://prod.spline.design/SlxT2aFwXSiiccb7/scene.splinecode?v=2" 
                       frameBorder="0" 
                       width="100%" 
                       height="100%"
                       className="w-full h-full border-none outline-none pointer-events-none group-hover:pointer-events-auto"
                       title="3D Avatar"
                    ></iframe>
                  )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1.5 About Section */}
      <section id="about" className="py-32 w-full relative z-10 bg-[#020202]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            
            {/* Visual Element */}
            <div className="w-full md:w-1/2 relative group perspective-1000">
              <div className="absolute inset-0 bg-gradient-to-tr from-neon-blue to-blue-600 rounded-3xl opacity-20 blur-2xl group-hover:opacity-40 transition-all duration-700"></div>
              <div className="relative p-8 rounded-3xl bg-[#0a0a0a] border border-white/10 shadow-2xl overflow-hidden min-h-[400px] flex items-center justify-center group-hover:scale-[1.03] group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(0,243,255,0.15)] group-hover:border-neon-blue/30 transition-all duration-500">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-neon-blue/10 blur-[80px] rounded-full mix-blend-screen"></div>
                 {/* Decorative Code Block */}
                 <div className="font-mono text-xs md:text-sm text-gray-500/80 p-6 w-full leading-relaxed bg-[#111] rounded-xl border border-white/5 shadow-inner">
                    <span className="text-pink-500">const</span> <span className="text-blue-400">kabir</span> = {'{'} <br/>
                    &nbsp;&nbsp;role: <span className="text-green-300">"Full Stack Developer"</span>, <br/>
                    &nbsp;&nbsp;passion: <span className="text-green-300">"Machine Learning Enthusiast"</span>, <br/>
                    &nbsp;&nbsp;skills: [<span className="text-green-300">"React"</span>, <span className="text-green-300">"Next.js"</span>, <span className="text-green-300">"Python"</span>, <span className="text-green-300">"C++"</span>], <br/>
                    &nbsp;&nbsp;motto: <span className="text-green-300">"Building intelligent web systems."</span> <br/>
                    {'}'}; <br/>
                    <br/>
                    <span className="text-pink-500">export default</span> <span className="text-blue-400">kabir</span>;
                 </div>
              </div>
            </div>

            {/* Text Content */}
            <div className="w-full md:w-1/2 space-y-6">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm shadow-[0_0_15px_rgba(0,243,255,0.15)] w-fit mb-2">
                <span className="w-2 h-2 rounded-full bg-neon-blue animate-pulse shadow-[0_0_10px_rgba(0,243,255,0.8)]"></span>
                <span className="text-xs md:text-sm font-mono text-neon-blue uppercase tracking-widest font-bold">About Me</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">
                Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-blue-500">Scalable Solutions</span>
              </h3>
              <p className="text-gray-300 text-xl md:text-2xl font-light leading-[1.7]">
                I am a curious, design-driven Full Stack Developer passionate about crafting seamless and immersive digital experiences. 
              </p>
              <p className="text-gray-400 text-lg md:text-xl font-light leading-relaxed">
                My engineering journey blends the precision of complex algorithmic challenges in <span className="text-neon-blue font-medium">C++</span> with the fluid mechanics of modern UI development using <span className="text-neon-blue font-medium">React</span> and <span className="text-neon-blue font-medium">Next.js</span>. Whether I'm scaling backend data pipelines with <span className="text-neon-blue font-medium">Python</span> or polishing micro-animations on the frontend, I thrive entirely at the intersection where beautiful aesthetics meet highly intelligent systems.
              </p>
              
              <div className="pt-6 border-t border-white/10 flex flex-wrap gap-4">
                 <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="px-8 py-3 bg-neon-blue text-black font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(0,243,255,0.8)] transition-all hover:-translate-y-1 inline-flex items-center gap-2">
                    View Full Resume
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                 </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Current Projects Section */}
      <section id="projects" className="py-32 w-full relative z-10 bg-black">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div>
              <h2 className="text-sm font-mono text-neon-blue uppercase tracking-widest mb-2">Portfolio</h2>
              <h3 className="text-4xl md:text-5xl font-bold">Current Projects</h3>
            </div>
            <a href="#" className="text-gray-400 hover:text-neon-blue mt-4 md:mt-0 transition-colors flex items-center gap-2">
              View All <span className="text-xl">↗</span>
            </a>
          </div>

          <div className="flex gap-8 overflow-x-auto snap-x snap-mandatory pb-8 w-full pt-4" style={{ WebkitOverflowScrolling: 'touch' }}>
            {/* Featured Project: YouTube Tab Resizer */}
            <div className="shrink-0 snap-start w-[90vw] md:w-[900px] group relative rounded-3xl bg-[#0a0a0a] border border-white/10 overflow-hidden hover:border-neon-blue/50 hover:-translate-y-3 hover:shadow-[0_15px_40px_rgba(0,243,255,0.15)] transition-all duration-700 flex flex-col md:flex-row">
              <div className="p-10 flex flex-col justify-center w-full md:w-1/2 z-10 relative">
                <div className="absolute top-0 left-0 w-32 h-32 bg-neon-blue/10 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-blue/10 border border-neon-blue/20">
                  <span className="text-xs font-mono text-neon-blue">Browser Extension</span>
                </div>
                <h4 className="text-3xl font-bold mb-4 drop-shadow-md group-hover:text-neon-blue transition-colors">YouTube Tab Resizer</h4>
                <p className="text-gray-400 mb-8 leading-relaxed font-light">
                  A custom lightweight browser extension allowing fluid, dynamic resizing of YouTube video players and sidebars directly from the tab without diving into dev tools or CSS userstyles. Experience uninterrupted viewing tailored to your screen.
                </p>
                <div className="flex gap-4">
                  <button className="text-sm font-bold flex items-center gap-2 hover:text-neon-blue transition-colors border-b border-transparent hover:border-neon-blue pb-1">
                    Install Extension <span>→</span>
                  </button>
                  <button className="text-sm text-gray-500 font-bold flex items-center gap-2 hover:text-white transition-colors">
                    GitHub Repo
                  </button>
                </div>
              </div>
              <div className="w-full md:w-1/2 bg-[#111] relative overflow-hidden flex items-center justify-center p-8 group border-t md:border-t-0 md:border-l border-white/5">
                <div className="absolute inset-0 bg-gradient-to-bl from-neon-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                {/* Placeholder Image container */}
                <div className="w-full h-64 bg-[#1a1a1a] border border-[#333] rounded-xl shadow-2xl relative group-hover:scale-[1.05] transition-transform duration-700 flex items-center justify-center overflow-hidden">
                    <div className="w-full h-8 bg-[#2a2a2a] absolute top-0 left-0 flex items-center px-4 gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    {/* Placeholder content showing a Mock UI */}
                    <div className="mt-8 flex flex-col gap-4 w-3/4 opacity-50">
                        <div className="h-4 bg-[#333] rounded w-full"></div>
                        <div className="h-32 bg-[#222] rounded w-full border border-neon-blue/20"></div>
                    </div>
                    <div className="absolute flex items-center justify-center">
                        <span className="font-mono text-gray-500 bg-[#1a1a1a] px-3 py-1 rounded">[ Interface Image Placeholder ]</span>
                    </div>
                </div>
              </div>
            </div>

            {/* Other generic projects */}
            <div className="shrink-0 snap-start w-[85vw] md:w-[450px] group rounded-3xl bg-[#0a0a0a] border border-white/10 overflow-hidden hover:border-white/30 hover:-translate-y-3 hover:shadow-[0_15px_40px_rgba(255,255,255,0.05)] transition-all duration-700 p-8 flex flex-col justify-between min-h-[400px]">
                <div>
                     <h4 className="text-2xl font-bold mb-2 group-hover:text-white transition-colors text-white/90">Automated Data Pipeline</h4>
                     <p className="text-gray-400 text-sm">Python / Apache Airflow</p>
                </div>
                <div className="w-full h-40 bg-[#151515] rounded-lg border border-[#222] flex items-center justify-center group-hover:border-white/20 group-hover:scale-[1.02] transition-all duration-700 mt-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <span className="text-gray-600 font-mono text-xs z-10">[ Pipeline Graph Thumbnail ]</span>
                </div>
            </div>

            <div className="shrink-0 snap-start w-[85vw] md:w-[450px] group rounded-3xl bg-[#0a0a0a] border border-white/10 overflow-hidden hover:border-white/30 hover:-translate-y-3 hover:shadow-[0_15px_40px_rgba(255,255,255,0.05)] transition-all duration-700 p-8 flex flex-col justify-between min-h-[400px] mr-8">
                <div>
                     <h4 className="text-2xl font-bold mb-2 group-hover:text-white transition-colors text-white/90">E-Commerce Mobile App</h4>
                     <p className="text-gray-400 text-sm">React Native / Node.js</p>
                </div>
                <div className="w-full h-40 bg-[#151515] rounded-lg border border-[#222] flex items-center justify-center group-hover:border-white/20 group-hover:scale-[1.02] transition-all duration-700 mt-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <span className="text-gray-600 font-mono text-xs z-10">[ App UI Thumbnail ]</span>
                </div>
            </div>
            
            {/* Added spacer to let user scroll past the last item comfortably */}
            <div className="shrink-0 w-[4vw] md:w-[2vw]"></div>
          </div>
        </div>
      </section>

      {/* 3. Contact Section */}
      <section id="contact" className="py-32 w-full relative bg-[#050505] flex items-center justify-center">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-neon-blue/10 via-[#050505] to-[#050505] opacity-50 z-0"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-neon-blue/20 blur-[150px] rounded-full mix-blend-screen z-0"></div>

        <div className="relative z-10 w-full max-w-4xl mx-auto px-8">
          <div className="relative group perspective-1000">
            {/* Holographic Glowing Border */}
            <div className="absolute -inset-0.5 bg-gradient-to-tr from-neon-blue to-blue-600 rounded-3xl opacity-20 group-hover:opacity-50 blur-lg transition-opacity duration-700"></div>

            {/* Content Container */}
            <div className="relative bg-[#0a0a0a]/90 backdrop-blur-2xl rounded-3xl border border-white/10 p-8 md:p-12 overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-12">
              
              <div className="w-full md:w-1/2 flex flex-col items-start z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm shadow-[0_0_10px_rgba(0,243,255,0.1)]">
                  <span className="text-xs font-mono text-neon-blue uppercase tracking-widest">Connect</span>
                </div>
                <h3 className="text-4xl md:text-5xl font-bold mb-4">Let's work <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-blue-500">together</span></h3>
                <p className="text-gray-400 font-light mb-8 leading-relaxed">
                  I'm currently open for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
                </p>
                <div className="flex flex-col gap-5 w-full">
                  {/* Gmail */}
                  <a href="mailto:kabirpatel2005@gmail.com" className="inline-flex items-center gap-4 text-base font-medium text-gray-300 hover:text-neon-blue transition-colors group">
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-neon-blue/10 group-hover:border-neon-blue/30 group-hover:shadow-[0_0_15px_rgba(0,243,255,0.2)] transition-all">
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                      </svg>
                    </div>
                    <span className="truncate">kabirpatel2005@gmail.com</span>
                  </a>

                  {/* LinkedIn */}
                  <a href="https://www.linkedin.com/in/kabir-patel-738772275/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-4 text-base font-medium text-gray-300 hover:text-neon-blue transition-colors group">
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-neon-blue/10 group-hover:border-neon-blue/30 group-hover:shadow-[0_0_15px_rgba(0,243,255,0.2)] transition-all">
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </div>
                    LinkedIn Profile
                  </a>

                  {/* GitHub */}
                  <a href="https://github.com/Dev-By-Kabir" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-4 text-base font-medium text-gray-300 hover:text-neon-blue transition-colors group">
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-neon-blue/10 group-hover:border-neon-blue/30 group-hover:shadow-[0_0_15px_rgba(0,243,255,0.2)] transition-all">
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                         <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </div>
                    GitHub Profile
                  </a>
                </div>
              </div>

              <div className="w-full md:w-1/2 z-10">
                <form ref={formRef} onSubmit={sendEmail} className="flex flex-col gap-4 w-full">
                  <div className="flex flex-col gap-1.5">
                     <label htmlFor="user_name" className="text-xs font-mono text-gray-500 uppercase tracking-widest pl-1">Name</label>
                     <input type="text" id="user_name" name="user_name" required placeholder="John Doe" className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/50 transition-all font-light" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                     <label htmlFor="user_email" className="text-xs font-mono text-gray-500 uppercase tracking-widest pl-1">Email</label>
                     <input type="email" id="user_email" name="user_email" required placeholder="john@domain.com" className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/50 transition-all font-light" />
                  </div>
                  <div className="flex flex-col gap-1.5 mb-2">
                     <label htmlFor="message" className="text-xs font-mono text-gray-500 uppercase tracking-widest pl-1">Message</label>
                     <textarea id="message" name="message" required rows={3} placeholder="Hello Kabir..." className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/50 transition-all font-light resize-none"></textarea>
                  </div>
                  <button type="submit" disabled={isSending} className="w-full px-8 py-3.5 bg-white text-black font-semibold rounded-xl hover:bg-neon-blue transition-all hover:-translate-y-1 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(0,243,255,0.4)] flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSending ? 'Sending...' : 'Send Message'}
                    {!isSending && (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    )}
                  </button>
                  {sendSuccess === true && <p className="text-green-500 text-sm text-center mt-2">Message sent successfully!</p>}
                  {sendSuccess === false && <p className="text-red-500 text-sm text-center mt-2">Failed to send message. Please try again.</p>}
                </form>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black py-16">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-xl font-bold tracking-tighter text-white">
                PORT<span className="text-neon-blue">FOLIO</span>
            </div>
            <div className="font-mono text-sm text-gray-500">
                © {new Date().getFullYear()} All rights reserved.
            </div>
        </div>
      </footer>

    </main>
  );
}

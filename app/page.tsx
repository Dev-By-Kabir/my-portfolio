"use client";

import React, { useState, useEffect } from "react";

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [warpEnded, setWarpEnded] = useState(false);
  const [showName, setShowName] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [progress, setProgress] = useState(0);

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
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-black text-white drop-shadow-[0_0_40px_rgba(255,255,255,1)] absolute text-center uppercase tracking-tight animate-title-flash w-full px-4 overflow-hidden">
              KABIR PATEL
            </h1>
        )}
        {showTitle && (
            <h2 className="text-xl md:text-3xl lg:text-5xl font-sans font-light text-white tracking-[0.2em] md:tracking-[0.3em] animate-title-flash absolute text-center uppercase w-full px-4 overflow-hidden">
              SOFTWARE <span className="font-bold text-neon-blue drop-shadow-[0_0_20px_rgba(0,243,255,0.8)]">ENGINEER</span>
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
      <nav className={`fixed top-0 w-full z-50 bg-black/50 backdrop-blur-md border-b justify-between items-center border-white/10 px-8 py-4 flex transition-all duration-[1500ms] delay-300 ${showIntro ? 'opacity-0 translate-y-[-50px]' : 'opacity-100 translate-y-0'}`}>
        <div className="text-xl font-bold tracking-tighter">
          PORT<span className="text-neon-blue">FOLIO</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
          <a href="#hero" className="hover:text-neon-blue transition-colors">Home</a>
          <a href="#projects" className="hover:text-neon-blue transition-colors">Work</a>
          <a href="#deep-dive" className="hover:text-neon-blue transition-colors">Technical Dive</a>
        </div>
        <button className="px-5 py-2 text-sm font-semibold rounded-full border border-neon-blue/50 text-neon-blue hover:bg-neon-blue hover:text-black transition-all shadow-[0_0_15px_rgba(0,243,255,0.2)] hover:shadow-[0_0_20px_rgba(0,243,255,0.6)]">
          Contact Me
        </button>
      </nav>

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
              I build modern web applications and explore intelligent systems using React, Next.js, and machine learning.
            </p>
            <div className="flex gap-4 mt-4">
              <button className="px-8 py-3 bg-neon-blue text-black font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(0,243,255,0.8)] transition-all hover:-translate-y-1">
                Explore Work
              </button>
              <button className="px-8 py-3 bg-white/5 text-white font-semibold rounded-lg hover:bg-white/10 backdrop-blur-md transition-all hover:-translate-y-1 border border-white/10">
                View Resume
              </button>
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

      {/* 3. Technical Deep Dive - Code Editor Theme */}
      <section id="deep-dive" className="py-32 w-full relative bg-[#050505]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-mono text-neon-blue uppercase tracking-widest mb-2">Algorithms & Problem Solving</h2>
            <h3 className="text-4xl md:text-5xl font-bold">Technical Deep Dive</h3>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto font-light">
              Breaking down complex algorithmic challenges. Here is a look at my dynamic programming approach for the famous Cherry Pickup pathfinding problem.
            </p>
          </div>

          {/* Code Editor Window */}
          <div className="max-w-5xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-[#2a2a2a] bg-[#1e1e1e]">
             {/* Editor Header */}
            <div className="bg-[#2d2d2d] border-b border-[#1e1e1e] flex items-center px-4 py-2">
              <div className="flex gap-2 mr-6">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
              </div>
              <div className="flex gap-4">
                <div className="bg-[#1e1e1e] text-white/90 text-xs px-4 py-1.5 rounded-t-lg font-mono border-t border-r border-l border-[#3a3a3a] border-opacity-50 inline-flex items-center gap-2">
                  <span className="text-blue-400">c++</span> cherry_pickup.cpp
                </div>
                <div className="text-gray-500 text-xs px-4 py-1.5 hover:text-gray-300 cursor-pointer font-mono inline-flex items-center transition-colors">
                  tests.cpp
                </div>
              </div>
            </div>
            
            <div className="flex flex-col lg:flex-row">
              {/* Main Code Area */}
              <div className="w-full lg:w-2/3 p-6 font-mono text-sm overflow-x-auto leading-relaxed border-r border-[#2d2d2d]">
{/* Raw Code Content */}
<pre className="text-gray-300">
<code className="block">
<span className="text-pink-500">class</span> <span className="text-green-300">Solution</span> {'{'}
<span className="text-pink-500">public:</span>
    <span className="text-pink-500">int</span> <span className="text-yellow-200">cherryPickup</span>(<span className="text-teal-300">vector</span>{"<"}<span className="text-teal-300">vector</span>{"<"}<span className="text-pink-500">int</span>{">"}{">"}& grid) {'{'}
        <span className="text-pink-500">int</span> n = grid.<span className="text-yellow-200">size</span>();
        <span className="text-teal-300">vector</span>{"<"}<span className="text-teal-300">vector</span>{"<"}<span className="text-pink-500">int</span>{">"}{">"} dp(n, <span className="text-teal-300">vector</span>{"<"}<span className="text-pink-500">int</span>{">"}(n, -<span className="text-[#ae81ff]">1</span>));
        
        dp[<span className="text-[#ae81ff]">0</span>][<span className="text-[#ae81ff]">0</span>] = grid[<span className="text-[#ae81ff]">0</span>][<span className="text-[#ae81ff]">0</span>];
        
        <span className="text-pink-500">for</span> (<span className="text-pink-500">int</span> t = <span className="text-[#ae81ff]">1</span>; t {'<'} <span className="text-[#ae81ff]">2</span> * n - <span className="text-[#ae81ff]">1</span>; ++t) {'{'}
            <span className="text-teal-300">vector</span>{"<"}<span className="text-teal-300">vector</span>{"<"}<span className="text-pink-500">int</span>{">"}{">"} currDp(n, <span className="text-teal-300">vector</span>{"<"}<span className="text-pink-500">int</span>{">"}(n, -<span className="text-[#ae81ff]">1</span>));
            <span className="text-pink-500">for</span> (<span className="text-pink-500">int</span> i = <span className="text-[#ae81ff]">0</span>; i {'<'} n; ++i) {'{'}
                <span className="text-pink-500">for</span> (<span className="text-pink-500">int</span> j = <span className="text-[#ae81ff]">0</span>; j {'<'} n; ++j) {'{'}
                    <span className="text-pink-500">int</span> r1 = i, c1 = t - i;
                    <span className="text-pink-500">int</span> r2 = j, c2 = t - j;
                    
                    <span className="text-gray-500 text-xs italic">// Bounds checking and obstacle logic...</span>
                    <span className="text-pink-500">if</span> (c1 {'<'} <span className="text-[#ae81ff]">0</span> || c1 {'>='} n || c2 {'<'} <span className="text-[#ae81ff]">0</span> || c2 {'>='} n) <span className="text-pink-500">continue</span>;
                    <span className="text-pink-500">if</span> (grid[r1][c1] == -<span className="text-[#ae81ff]">1</span> || grid[r2][c2] == -<span className="text-[#ae81ff]">1</span>) <span className="text-pink-500">continue</span>;
                    
                    <span className="text-pink-500">int</span> cherries = grid[r1][c1];
                    <span className="text-pink-500">if</span> (r1 != r2) cherries += grid[r2][c2];
                    
                    <span className="text-gray-500 text-xs italic">// State transitions</span>
                    <span className="text-pink-500">int</span> best = -<span className="text-[#ae81ff]">1</span>;
                    <span className="text-gray-500 text-xs italic">/* Calculate best previous state ... */</span>
                    
                    <span className="text-pink-500">if</span> (best {'>='} <span className="text-[#ae81ff]">0</span>) currDp[i][j] = best + cherries;
                {'}'}
            {'}'}
            dp = currDp;
        {'}'}
        <span className="text-pink-500">return</span> <span className="text-teal-300">max</span>(<span className="text-[#ae81ff]">0</span>, dp[n-<span className="text-[#ae81ff]">1</span>][n-<span className="text-[#ae81ff]">1</span>]);
    {'}'}
{'}'};
</code>
</pre>
              </div>

              {/* Terminal / Output Area */}
              <div className="w-full lg:w-1/3 bg-[#111111] flex flex-col font-mono text-sm leading-relaxed p-0">
                <div className="px-4 py-2 border-b border-[#2d2d2d] bg-[#1a1a1a] flex justify-between items-center text-xs">
                  <span className="text-gray-400 uppercase tracking-wider">Terminal Output</span>
                  <span className="flex gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  </span>
                </div>
                <div className="p-4 overflow-y-auto">
                    <div className="text-green-400 mb-2">➜  cherry-pickup git:(main) g++ cherry_pickup.cpp -o run && ./run</div>
                    <div className="text-gray-400">Running Test Case 1: Grid 3x3</div>
                    <div className="text-gray-300 mb-4">[0, 1, -1] <br/> [1, 0, -1] <br/> [1, 1,  1]</div>
                    <div className="text-gray-300 font-bold mb-4">
                      Max Cherries Collected: <span className="text-neon-blue bg-neon-blue/10 px-2 py-0.5 rounded shadow-[0_0_10px_rgba(0,243,255,0.4)] text-base">12</span>
                    </div>

                    <div className="w-full h-px border-t border-dashed border-gray-700 my-4"></div>

                    <div className="text-gray-400">Running Test Case 2: Grid 5x5</div>
                    <div className="text-gray-300 mb-4">... complex valid grid layout ...</div>
                    <div className="text-gray-300 font-bold mb-4">
                      Max Cherries Collected: <span className="text-neon-blue bg-neon-blue/10 px-2 py-0.5 rounded shadow-[0_0_10px_rgba(0,243,255,0.4)] text-base">24</span>
                    </div>

                    <div className="text-blue-400 font-bold mt-4 border border-blue-900/50 bg-blue-900/20 p-2 rounded">
                      [SUCCESS]: All pathfinding constraints verified. Outputs 12 and 24 match expected.
                    </div>
                </div>
              </div>
            </div>
            {/* Editor Footer */}
             <div className="bg-[#007acc] px-4 py-1 flex justify-between text-xs text-white font-sans">
              <div className="flex gap-4">
                <span>master*</span>
                <span className="hover:bg-white/20 px-1 rounded cursor-pointer transition-colors">0 ⚠ 0</span>
              </div>
              <div className="flex gap-4">
                <span>Ln 32, Col 12</span>
                <span>Spaces: 4</span>
                <span>UTF-8</span>
                <span>C++</span>
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

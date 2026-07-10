'use client';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useEffect, useState } from 'react';

export default function LearningHub() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All Courses");
  
  const [userProgress, setUserProgress] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch Continue Learning Progress
  useEffect(() => {
    async function fetchProgress() {
      try {
        setLoadingProgress(true);
        const res = await fetch('http://127.0.0.1:5001/hernova-13f01/us-central1/api/users/demo-user-123/userProgress', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setUserProgress(data.progress || []);
        }
      } catch (error) {
        console.error("Failed to fetch progress:", error);
      } finally {
        setLoadingProgress(false);
      }
    }
    fetchProgress();
  }, []);

  // Search Debounce Effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      setShowDropdown(true);
      try {
        const res = await fetch(`http://127.0.0.1:5001/hernova-13f01/us-central1/api/search?q=${encodeURIComponent(searchQuery)}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.results || []);
        }
      } catch (error) {
        console.error("Failed to search:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleCourseClick = async (e, courseId, url) => {
    e.preventDefault();
    // Simulate updating access time
    try {
      await fetch('http://127.0.0.1:5001/hernova-13f01/us-central1/api/users/demo-user-123/userProgress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, currentModule: 1, totalModules: 5 }) // dummy values
      });
    } catch (err) {
      console.error(err);
    }
    // Navigate to course (in real app, this might be a local route)
    if (url) {
      window.open(url, '_blank');
    }
  };

  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true);
        // Using localhost emulator API
        const url = activeCategory === "All Courses" 
          ? 'http://127.0.0.1:5001/hernova-13f01/us-central1/api/courses'
          : `http://127.0.0.1:5001/hernova-13f01/us-central1/api/courses?category=${encodeURIComponent(activeCategory)}`;
          
        const res = await fetch(url, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setCourses(data.courses || []);
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, [activeCategory]);

  useEffect(() => {
    const container = document.getElementById('particles-container');
    if (!container) return;
    
    // Clear existing particles
    container.innerHTML = '';
    
    const particleCount = 15;
    const particles = [];

    // Generate particles
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        // Simple inline styles for nova-particle to keep it self-contained
        particle.style.position = 'absolute';
        particle.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
        particle.style.borderRadius = '50%';
        particle.style.boxShadow = '0 0 8px 2px rgba(255, 179, 0, 0.4)';
        
        // Randomize properties
        const size = Math.random() * 4 + 2; // 2px to 6px
        const x = Math.random() * 100; // vw
        const y = Math.random() * 100; // vh
        const depth = Math.random() * 0.5 + 0.1; // parallax depth factor
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${x}vw`;
        particle.style.top = `${y}vh`;
        
        // Store data for parallax calculation
        particle.dataset.depth = depth;
        particle.dataset.initialY = y;
        
        container.appendChild(particle);
        particles.push(particle);
    }

    // Parallax scroll effect
    const handleScroll = () => {
        const scrolled = window.scrollY;
        particles.forEach(p => {
            const depth = parseFloat(p.dataset.depth);
            const yOffset = scrolled * depth * 0.1; // Slow down the movement
            p.style.transform = `translateY(-${yOffset}px)`;
        });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative text-on-surface flex-grow flex flex-col min-h-screen">
      <div id="particles-container" className="fixed inset-0 pointer-events-none z-0"></div>
      
      <Sidebar activeItem="learn" />
      <Header />
      
      {/* Main Content Area */}
      <main className="md:ml-64 pt-24 md:pt-28 px-margin-mobile md:px-margin-desktop pb-32 md:pb-12 max-w-container-max mx-auto relative z-10 w-full">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-stack-lg gap-stack-md">
          <div>
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">Learning Hub</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Elevate your skills, one glass step at a time.</p>
          </div>
          <div className="w-full md:w-96 relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-tertiary-fixed-dim text-xl">search</span>
            </div>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => { if (searchQuery.trim()) setShowDropdown(true); }}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              className="w-full bg-glass-overlay backdrop-blur-xl border border-glass-border rounded-full py-3 pl-12 pr-4 text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-2 focus:ring-[#FFB300]/50 focus:border-[#FFB300]/50 transition-all font-body-md text-body-md shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)]" 
              placeholder="Search courses, mentors..." 
              type="text"
            />
            
            {/* Search Dropdown */}
            {showDropdown && (
              <div className="absolute top-full mt-2 w-full glass-panel rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col max-h-[400px]">
                {isSearching ? (
                  <div className="p-6 flex justify-center items-center">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="p-6 text-center text-on-surface-variant font-body-sm">
                    No results found
                  </div>
                ) : (
                  <div className="overflow-y-auto no-scrollbar py-2">
                    {searchResults.map((result) => (
                      <a 
                        key={result.id} 
                        href={result.courseUrl || "#"} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center p-3 hover:bg-glass-overlay transition-colors border-b border-glass-border last:border-0 group cursor-pointer"
                        onMouseDown={(e) => {
                           // Prevent default so the input doesn't lose focus, which would close the dropdown before the click registers
                           e.preventDefault();
                        }}
                        onClick={() => {
                          // Optionally close dropdown after successful click
                          setShowDropdown(false);
                        }}
                      >
                        <div className="w-10 h-10 rounded-lg bg-surface-variant flex items-center justify-center mr-4 flex-shrink-0">
                           <span className="material-symbols-outlined text-on-surface-variant">
                             {result.source === 'ai' ? 'auto_awesome' : 'school'}
                           </span>
                        </div>
                        <div className="flex-grow min-w-0">
                          <h4 className="font-body-md text-on-surface truncate group-hover:text-primary transition-colors">{result.courseName}</h4>
                          <div className="flex items-center text-xs text-on-surface-variant mt-1 space-x-2">
                            <span className="truncate">{result.platform}</span>
                            <span>•</span>
                            <span>{result.pricing}</span>
                          </div>
                        </div>
                        <div className="ml-2 flex-shrink-0">
                          {result.source === 'local' ? (
                            <span className="px-2 py-1 rounded-full bg-primary-container/20 text-primary-container text-[10px] font-medium border border-primary-container/30">
                              In Learning Hub
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded-full bg-tertiary-container/20 text-tertiary-container text-[10px] font-medium border border-tertiary-container/30 flex items-center">
                              <span className="material-symbols-outlined text-[10px] mr-1">auto_awesome</span> Suggested
                            </span>
                          )}
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Filter Chips (Horizontal Scroll) */}
        <div className="mb-stack-xl relative overflow-hidden">
          <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-4 pr-8">
            {["All Courses", "Tech & Data", "Financial Literacy", "Career Skills", "Wellness", "Leadership"].map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 glass-panel rounded-full px-6 py-2 font-label-sm text-label-sm transition-all ${
                  activeCategory === cat 
                    ? "text-primary-container bg-surface-container-highest border-primary-container/30 hover:bg-surface-container-high" 
                    : "text-on-surface-variant hover:text-primary hover:bg-glass-overlay"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          {/* Fade gradient for scroll */}
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-bg-gradient-start to-transparent pointer-events-none"></div>
        </div>
        
        {/* Continue Where You Left Off */}
        <section className="mb-stack-xl">
          <div className="flex items-center justify-between mb-stack-md">
            <h3 className="font-headline-md text-headline-md text-on-surface">Continue Learning</h3>
            <span className="material-symbols-outlined text-primary-container cursor-pointer hover:scale-110 transition-transform">arrow_forward</span>
          </div>
          <div className="flex overflow-x-auto no-scrollbar space-x-6 pb-6 -mx-margin-mobile px-margin-mobile md:mx-0 md:px-0">
            {loadingProgress ? (
              <div className="flex justify-center w-full py-8">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : userProgress.length === 0 ? (
              <div className="w-full text-center py-12 glass-panel rounded-2xl border-dashed border-2 border-glass-border">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant/50 mb-2">school</span>
                <p className="text-on-surface-variant font-body-md">Start a course to see your progress here.</p>
              </div>
            ) : (
              userProgress.map((progress, index) => {
                const c = progress.courseDetails || {};
                // Assign a color based on index
                const colors = [
                  { from: 'from-primary-fixed-dim', to: 'to-primary', text: 'text-primary' },
                  { from: 'from-secondary-fixed-dim', to: 'to-secondary', text: 'text-secondary' },
                  { from: 'from-tertiary-fixed-dim', to: 'to-tertiary', text: 'text-tertiary' }
                ];
                const color = colors[index % colors.length];

                return (
                  <a 
                    href={c.courseUrl || "#"} 
                    onClick={(e) => handleCourseClick(e, progress.courseId, c.courseUrl)}
                    key={progress.courseId} 
                    className="flex-shrink-0 w-80 md:w-96 glass-panel rounded-2xl p-4 flex flex-col hover:shadow-[0_8px_30px_rgba(240,98,146,0.1)] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${color.from} ${color.to} flex items-center justify-center text-white flex-shrink-0 shadow-inner overflow-hidden relative`}>
                        {c.thumbnailUrl ? (
                           <img src={c.thumbnailUrl} alt="thumbnail" className="w-full h-full object-cover opacity-60 mix-blend-overlay" />
                        ) : (
                           <span className="material-symbols-outlined text-3xl z-10">insights</span>
                        )}
                      </div>
                      <div>
                        <p className={`font-label-sm text-label-sm ${color.text} mb-1 uppercase truncate`}>{c.category || 'COURSE'}</p>
                        <h4 className="font-body-lg text-body-lg text-on-surface line-clamp-2 leading-tight">{c.courseName || 'Loading...'}</h4>
                      </div>
                    </div>
                    <div className="mt-auto">
                      <div className="flex justify-between items-end mb-2">
                        <span className="font-label-sm text-label-sm text-on-surface-variant">Module {progress.currentModule} of {progress.totalModules}</span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">{progress.percentComplete}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-glass-overlay border border-glass-border rounded-full overflow-hidden relative">
                        {progress.percentComplete > 0 && (
                           <div className="absolute top-1/2 -translate-y-1/2 text-[8px] text-[#FFB300] z-10 -ml-1" style={{ left: `${progress.percentComplete}%` }}>✦</div>
                        )}
                        <div className={`h-full bg-gradient-to-r from-primary-container to-[#FFB300] rounded-full relative shadow-[0_0_8px_rgba(255,179,0,0.5)]`} style={{ width: `${progress.percentComplete}%` }}></div>
                      </div>
                    </div>
                  </a>
                );
              })
            )}
          </div>
        </section>
        
        {/* Recommended Courses Grid */}
        <section>
          <div className="flex items-center justify-between mb-stack-md">
            <h3 className="font-headline-md text-headline-md text-on-surface">{activeCategory === "All Courses" ? "Recommended for You" : `${activeCategory} Courses`}</h3>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12 glass-panel rounded-2xl">
              <p className="text-on-surface-variant font-body-md">No courses found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {courses.map(course => (
                <a href={course.courseUrl || "#"} target={course.courseUrl ? "_blank" : "_self"} rel="noopener noreferrer" key={course.id} className="glass-panel rounded-2xl overflow-hidden flex flex-col group hover:shadow-[0_10px_40px_rgba(216,27,96,0.08)] transition-all duration-300">
                  <div className="h-40 w-full relative overflow-hidden bg-surface-variant flex items-center justify-center">
                    {course.thumbnailUrl ? (
                      <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{backgroundImage: `url('${course.thumbnailUrl}')`}}></div>
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-fixed-dim/30 to-secondary-fixed-dim/30 group-hover:scale-105 transition-transform duration-500"></div>
                    )}
                    
                    {!course.thumbnailUrl && <span className="material-symbols-outlined text-5xl text-on-surface-variant/50 relative z-10">school</span>}
                    <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/60 to-transparent pointer-events-none z-10"></div>
                    
                    <div className="absolute top-3 right-3 glass-panel px-3 py-1 rounded-full flex items-center space-x-1 z-20">
                      <span className="font-label-sm text-label-sm text-white">{course.pricing}</span>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <p className="font-label-sm text-label-sm text-primary mb-2 uppercase">{course.category}</p>
                    <h4 className="font-body-lg text-body-lg font-medium text-on-surface mb-2">{course.courseName}</h4>
                    <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 mb-4">{course.goodFor}</p>
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-glass-border">
                      <div className="flex -space-x-2">
                        <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center">Platform: {course.platform}</span>
                      </div>
                      <button onClick={(e) => { e.preventDefault(); /* Prevent link click */ }} className="text-primary-container hover:text-primary transition-colors flex items-center justify-center w-8 h-8 rounded-full hover:bg-glass-overlay relative z-20">
                        <span className="material-symbols-outlined">bookmark_border</span>
                      </button>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

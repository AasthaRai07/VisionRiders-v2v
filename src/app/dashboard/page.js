'use client';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

const successStories = [
  {
    title: "From Hobby to Bakery",
    description: "How Anita used HerNova's micro-loans and mentorship to turn her passion into a thriving business.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZUYZjFc7JvODaxXSO-GSacBLJx_Mg0jOV0YfFEgoteqgGRfyU-fSlC6mrVZqsFsB9M70p5WX_ExQTsE7AMYAroo2D0gISrof7GZbnYmwBUs4q7587oku0X1WbJyJKM5cD8QT1T9h4Py59kXUMFpYyTP7W5xpIk8VPYGjZ66GLiPlLEeHxTOjiR2EN84JZHGNGMURoN9loc8w2xkQTVsYCdZer4SBI7iyWEwUcHyBFgdqPYVRLQdEMCoDx97CjYaNTsh_LuG0qAB4",
    searchQuery: "real women who turned a home bakery into a business with a micro-loan"
  },
  {
    title: "Mastering Investing",
    description: "Sarah shares her journey of building an independent portfolio after completing the Advanced Finance module.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDImEOrA_6zic9S9KsZ09PJt4c-q02yYBO0rg4VcUsk0EsVkm0F3ni9ccnO-5BsdO8CusTpQ6cYvKmBkZYZJDClLSRlAyBup6BB8CqVjY8UkjdubTYoFwi7N3NIMDHve6FQ6k1Pe_Zm7LfoEJ-hVn66xulTQoPWTtOAxxoNRv6RnsMDy8I1-5vyJH5gQ5AFeBJWKF194lvOxd-SJMYF4eIYB0ABbiZuge9i1feooD_-VrXhtfHGGK8Iy8m65UXK9eH4ItEGTetrQx4",
    searchQuery: "real women who built investment portfolio after finance module training"
  },
  {
    title: "Building a Network",
    description: "The story of a local community circle that grew into a regional support network for female entrepreneurs.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA8Uis_QoeTutTmTmQsNcppUQLeDDqIwmr5V25bj2xCmUquMRCl-NqG673OhMPd_5VMUv4YZM4aNSpKuqYqTGg9hgKgrIuveogGK4mChC0XidbB-aWwUUP3GMIjEKjQtNDANylSY2XWTkIxLLevJbJHKbGtyE0P1GRvuLbKXRzfvfgEwDwdfMzx41NCRa3RPtbNfppJ3py7PiaZ_gSFlVtTFGwXIb7plwaE3qXDuDBHnYIpVvXvP24si6UR4Z-UJyTA-iVwN9_9iWs",
    searchQuery: "real women entrepreneur community circle regional network success stories"
  }
];

const CURRENT_USER_ID = 'aditi_123';
const BACKEND_URL = 'http://localhost:3001';

export default function Dashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState('Aditi');
  const [userFullName, setUserFullName] = useState('Aditi Roy');

  const [status, setStatus] = useState('idle'); // idle | requesting | sharing | error | denied
  const [address, setAddress] = useState('');
  const [lastSent, setLastSent] = useState('');
  const [showPanel, setShowPanel] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const watchIdRef = useRef(null);

  // New interactive states
  const [savings, setSavings] = useState(65400);
  const [module3Progress, setModule3Progress] = useState(45);
  const [connectedMentors, setConnectedMentors] = useState([]);
  
  // Modals / popups states
  const [savingOpen, setSavingOpen] = useState(false);
  const [savingsAmount, setSavingsAmount] = useState('');
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizCorrect, setQuizCorrect] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [tipsOpen, setTipsOpen] = useState(false);
  
  // Re-entry Planner states
  const [reentryPrevRole, setReentryPrevRole] = useState('');
  const [reentryDuration, setReentryDuration] = useState('');
  const [reentryTarget, setReentryTarget] = useState('');
  const [reentryPlan, setReentryPlan] = useState(null);
  const [reentryLoading, setReentryLoading] = useState(false);

  // Production-Ready Dashboard Feature states
  const [aiOpen, setAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiMessages, setAiMessages] = useState([
    { sender: 'ai', text: "Hello! I am your HerNova AI Companion. How can I help you take charge of your career or finances today?" }
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  const [tasks, setTasks] = useState([
    { id: 1, task_description: 'Complete React assessment', is_completed: true },
    { id: 2, task_description: 'Deposit ₹200 to Emergency Fund', is_completed: false },
    { id: 3, task_description: 'Read a success story', is_completed: false }
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Mentor Priya Sharma accepted your connection request.', type: 'mentor_reply', is_read: false },
    { id: 2, message: 'Upcoming meeting with Priya Sharma scheduled for July 15th.', type: 'interview_reminder', is_read: false }
  ]);
  const [bellOpen, setBellOpen] = useState(false);

  // Opportunities and events
  const [opportunities, setOpportunities] = useState([
    { 
      title: 'Amazon WoW - Software Development Engineer (Bengaluru)', 
      company: 'Amazon India', 
      location: 'Bengaluru, India (Hybrid)', 
      salary: '₹15-20 LPA', 
      type: 'Full-Time / Returnship', 
      link: 'https://www.amazon.jobs/en/teams/amazonwow' 
    },
    { 
      title: 'IBM Tech Re-Entry Program - Frontend Developer (Bengaluru)', 
      company: 'IBM India', 
      location: 'Bengaluru, India', 
      salary: '₹12-18 LPA', 
      type: 'Returnship', 
      link: 'https://www.ibm.com/careers/in-en/tech-reentry' 
    },
    { 
      title: 'Google Women Techmakers Program 2026', 
      company: 'Google', 
      location: 'Bengaluru / Online', 
      salary: 'Dev Support & Mentorship', 
      type: 'Scholarship', 
      link: 'https://buildyourfuture.withgoogle.com/programs/women-techmakers' 
    }
  ]);

  const [nearbyEvents, setNearbyEvents] = useState([
    { 
      id: 1, 
      title: 'Women in Tech Hackathon 2026', 
      type: 'Hackathon', 
      location: 'Community Tech Center, Bengaluru (1.2 km away)', 
      date: '2026-07-20T09:00:00Z', 
      lat: 12.9796, 
      lng: 77.5896, 
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Community+Tech+Center+Bengaluru',
      applyUrl: 'https://unstop.com/hackathons?page=1&status=open'
    },
    { 
      id: 2, 
      title: 'NGO Career Restart Summit & Workshop', 
      type: 'Workshop', 
      location: 'Women Empowerment Cell, Bengaluru (2.5 km away)', 
      date: '2026-07-28T10:00:00Z', 
      lat: 12.9596, 
      lng: 77.6096, 
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Women+Empowerment+Cell+Bengaluru',
      applyUrl: 'https://www.jobsforher.com/events'
    }
  ]);

  // Social feed states
  const [feedPosts, setFeedPosts] = useState([
    { id: 1, author: 'Aditi Roy', content: 'Excited to complete the React Redux Toolkit reskilling course today! Highly recommend.', likes: 5, comments: ['Keep it up!', 'Awesome!'] }
  ]);
  const [newPostContent, setNewPostContent] = useState('');
  const [newActionInput, setNewActionInput] = useState('');
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminUsers, setAdminUsers] = useState([
    { name: 'Aditi Roy', email: 'aditi@hernova.com', status: 'Approved' },
    { name: 'Priya Sharma', email: 'priya@hernova.com', status: 'Mentor' }
  ]);

  // Route guard: check for user session
  useEffect(() => {
    const session = localStorage.getItem('user_session');
    if (!session) {
      router.push('/login');
    } else {
      try {
        const parsed = JSON.parse(session);
        if (parsed.fullName) {
          setUserFullName(parsed.fullName);
          const first = parsed.fullName.trim().split(/\s+/)[0];
          setUserName(first);
          
          setAdminUsers(prev => [
            { name: parsed.fullName, email: parsed.email || 'user@hernova.com', status: 'Approved' },
            ...prev.slice(1)
          ]);
        }
      } catch (err) {
        console.error('Error parsing user session:', err);
      }
    }
  }, [router]);

  // Load dashboard data on mount
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/dashboard-data/${CURRENT_USER_ID}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.finance) {
          setSavings(Number(data.finance.emergency_fund_balance));
        }
        if (data.tasks && data.tasks.length > 0) {
          setTasks(data.tasks);
        }
        if (data.notifications && data.notifications.length > 0) {
          setNotifications(data.notifications);
        }
      })
      .catch((err) => console.error('Error fetching dashboard data:', err));

    // Get live nearby events if geolocated
    fetch(`${BACKEND_URL}/api/events/nearby`)
      .then(res => res.json())
      .then(data => {
        if (data.events) setNearbyEvents(data.events);
      })
      .catch(console.error);

    // Get opportunities
    fetch(`${BACKEND_URL}/api/opportunities/recommendations`)
      .then(res => res.json())
      .then(data => {
        if (data.opportunities) setOpportunities(data.opportunities);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    // Simple parallax effect for ambient particles (if any)
    const handleMouseMove = (e) => {
      const particles = document.getElementById('ambient-particles');
      if (particles) {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        particles.style.transform = `translate(${x}px, ${y}px)`;
      }
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const startSharing = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser.');
      setStatus('error');
      return;
    }

    setErrorMsg('');
    setStatus('requesting');

    const successCallback = (position) => {
      const { latitude: lat, longitude: lng } = position.coords;
      setStatus('sharing');

      // POST location to backend
      fetch(`${BACKEND_URL}/api/location/${CURRENT_USER_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng }),
      })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to send location');
          return res.json();
        })
        .then((data) => {
          setAddress(data.address);
          setLastSent(new Date(data.timestamp).toLocaleTimeString());
        })
        .catch((err) => {
          console.error(err);
          // Set fallback address
          setAddress(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)} (Failed to geocode)`);
          setLastSent(new Date().toLocaleTimeString());
        });
    };

    const errorCallback = (error) => {
      console.error('WatchPosition error:', error);
      if (error.code === error.PERMISSION_DENIED) {
        setStatus('denied');
        setErrorMsg('Location permission denied. Please enable location access in browser.');
      } else {
        setStatus('error');
        setErrorMsg(`Error fetching location: ${error.message}`);
      }
    };

    const options = {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 10000,
    };

    // Watch position
    watchIdRef.current = navigator.geolocation.watchPosition(successCallback, errorCallback, options);
  };

  const stopSharing = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    setStatus('idle');
    setAddress('');
    setLastSent('');
    setErrorMsg('');

    // DELETE location from backend
    fetch(`${BACKEND_URL}/api/location/${CURRENT_USER_ID}`, {
      method: 'DELETE',
    }).catch((err) => console.error('Failed to clear location on backend:', err));
  };

  // Clean up watch position on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // Handler: Add savings
  const handleAddSavings = (e) => {
    e.preventDefault();
    if (!savingsAmount || isNaN(savingsAmount) || Number(savingsAmount) <= 0) return;

    fetch(`${BACKEND_URL}/api/savings/${CURRENT_USER_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Number(savingsAmount) }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSavings(data.balance);
          setSavingsAmount('');
          setSavingOpen(false);
        }
      })
      .catch((err) => console.error('Error posting savings:', err));
  };

  // Handler: Quiz submission
  const handleQuizSubmit = (selectedAnswer) => {
    const correct = selectedAnswer === 'B'; // B: Standard mutual funds are managed by professional fund managers
    setQuizCorrect(correct);
    setQuizAnswered(true);

    if (correct) {
      const newProgress = Math.min(100, module3Progress + 15);
      fetch(`${BACKEND_URL}/api/learning/progress/${CURRENT_USER_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: 'module3', progress: newProgress }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setModule3Progress(newProgress);
          }
        })
        .catch((err) => console.error('Error updating course progress:', err));
    }
  };

  // Handler: Connect with mentor
  const handleConnectMentor = (mentorName) => {
    if (connectedMentors.includes(mentorName)) return;

    fetch(`${BACKEND_URL}/api/mentors/connect/${CURRENT_USER_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mentorName }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setConnectedMentors(data.connectedMentors);
        }
      })
      .catch((err) => console.error('Error connecting with mentor:', err));
  };

  // Handler: Generate Re-entry Plan
  const handleGenerateReentryPlan = (e) => {
    e.preventDefault();
    if (!reentryPrevRole || !reentryDuration || !reentryTarget) return;

    setReentryLoading(true);
    fetch(`${BACKEND_URL}/api/reentry-plan/${CURRENT_USER_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        previousRole: reentryPrevRole,
        breakDuration: reentryDuration,
        targetRole: reentryTarget,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setReentryPlan(data);
        }
        setReentryLoading(false);
      })
      .catch((err) => {
        console.error('Error generating re-entry plan:', err);
        setReentryLoading(false);
      });
  };

  const handleToggleTask = (taskId) => {
    fetch(`${BACKEND_URL}/api/tasks/toggle/${taskId}`, {
      method: 'POST'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTasks(tasks.map(t => t.id === taskId ? { ...t, is_completed: !t.is_completed } : t));
        }
      })
      .catch(console.error);
  };

  const handleAddNewAction = (e) => {
    e.preventDefault();
    if (!newActionInput.trim()) return;

    fetch(`${BACKEND_URL}/api/tasks/${CURRENT_USER_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskDescription: newActionInput })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTasks(prev => [...prev, data.task]);
          setNewActionInput('');
        }
      })
      .catch(console.error);
  };

  const handleSendAiMessage = (predefinedText) => {
    const textToSend = predefinedText || aiPrompt;
    if (!textToSend.trim()) return;

    const userMsg = { sender: 'user', text: textToSend };
    setAiMessages(prev => [...prev, userMsg]);
    if (!predefinedText) setAiPrompt('');
    setAiLoading(true);

    fetch(`${BACKEND_URL}/api/ai-companion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: CURRENT_USER_ID, prompt: textToSend })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAiMessages(prev => [...prev, { sender: 'ai', text: data.reply }]);
        }
        setAiLoading(false);
      })
      .catch(err => {
        console.error(err);
        setAiLoading(false);
        setAiMessages(prev => [...prev, { sender: 'ai', text: "Sorry, I am having trouble connecting to the HerNova companion service." }]);
      });
  };

  const handleAddPost = (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    const newPost = {
      id: feedPosts.length + 1,
      author: userFullName,
      content: newPostContent,
      likes: 0,
      comments: []
    };
    setFeedPosts([newPost, ...feedPosts]);
    setNewPostContent('');
  };

  const handleLikePost = (postId) => {
    setFeedPosts(feedPosts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const welcomeQuotes = [
    "Believe you can and you are halfway there.",
    "Every step forward is a step towards independence.",
    "Your break was a pause, not the end of your story.",
    "Small savings today build giant cushions tomorrow."
  ];
  const currentQuote = welcomeQuotes[Math.floor(new Date().getDate() % welcomeQuotes.length)];

  return (
    <div className="relative text-on-surface flex-grow flex flex-col min-h-screen">
      <Sidebar activeItem="home" />
      <Header />
      
      {/* Main Content Canvas */}
      <main className="md:ml-64 pt-24 md:pt-28 pb-32 px-margin-mobile md:px-margin-desktop relative z-10 w-auto overflow-x-hidden">
        <div className="max-w-container-max mx-auto w-full flex flex-col">
        {/* Soft Ambient Blurred Color Blobs for Frosted Glass Depth */}
        <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-[#F06292] opacity-[0.08] rounded-full blur-[80px] -z-10 pointer-events-none"></div>
        <div className="absolute top-[25%] right-[5%] w-80 h-80 bg-[#7B1FA2] opacity-[0.06] rounded-full blur-[90px] -z-10 pointer-events-none"></div>
        <div className="absolute bottom-[30%] left-[20%] w-64 h-64 bg-[#FFB300] opacity-[0.05] rounded-full blur-[70px] -z-10 pointer-events-none"></div>

        {/* Header Greeting */}
        <div className="mb-stack-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary shadow-[0_0_10px_rgba(194,24,91,0.2)]">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdF-QlM2QFdD4FQmOmqgRcu5EINIhYUaBu29EfgnaSnSpHdrY0K3Q6wlYObUPKjBsvNfQsgiVjyK88UKBYIqrDFHFd6YUbBFZwVDpdAc29E_hKKiL4D5Te8rtRK_8M4SMVz-rmOhl6hRvYxTowtG60rNeQdbnRv14BR0iraqIcYhJwVhbxZStD8BAM-zl1JH1LhqJSrIC2HLwOrHwDMlrIHz7KxMGbeUnK9YyCjasEEFuGNsMV03TPvgbXq8Y885cOmg0c4g_iUW4" alt={userFullName} />
            </div>
            <div>
              <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background flex items-center gap-2">
                {getGreeting()}, {userName}
                <span className="text-tertiary-fixed-dim inline-block ml-1">
                  <svg className="w-8 h-8 text-tertiary-fixed-dim animate-[spin_10s_linear_infinite]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"></path>
                  </svg>
                </span>
              </h2>
              <p className="text-xs text-[#C2185B] font-semibold flex items-center gap-1.5 mt-1">
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                <span>"{currentQuote}"</span>
              </p>
            </div>
          </div>
          
          {/* Notifications Bell & Admin Shortcut */}
          <div className="flex items-center gap-3 self-start md:self-auto relative z-50">
            <button 
              onClick={() => setAdminOpen(!adminOpen)}
              className="glass-panel px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-glass-overlay text-on-background border border-primary/20"
            >
              Admin Panel
            </button>
            <div className="relative">
              <button 
                onClick={() => setBellOpen(!bellOpen)}
                className="w-10 h-10 rounded-full bg-glass-overlay border border-glass-border flex items-center justify-center hover:bg-glass-overlay/50 transition-colors relative"
              >
                <span className="material-symbols-outlined text-lg text-on-background">notifications</span>
                {notifications.some(n => !n.is_read) && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-glass-border animate-pulse"></span>
                )}
              </button>
              
              {bellOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-[#281526] border border-glass-border rounded-xl shadow-2xl z-50 p-2 text-xs flex flex-col gap-2">
                  <div className="flex justify-between items-center px-2 py-1 border-b border-glass-border">
                    <span className="font-bold text-on-background">Notifications</span>
                    <button 
                      onClick={() => setNotifications(notifications.map(n => ({ ...n, is_read: true })))}
                      className="text-primary hover:underline text-[10px]"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-48 overflow-y-auto flex flex-col gap-1.5">
                    {notifications.length === 0 ? (
                      <p className="text-on-surface-variant text-center py-4">No notifications.</p>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className={`p-2 rounded-lg leading-relaxed ${n.is_read ? 'opacity-65' : 'bg-primary/10 border-l-2 border-primary'}`}>
                          <p className="text-[11px] text-on-background">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Hero: FinHer Score Widget */}
        <div className="glass-panel rounded-xl p-stack-lg mb-stack-lg nova-glow relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-stack-lg">
          {/* Background Decorative Glow */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary opacity-5 rounded-full blur-3xl"></div>
          
          <div className="flex-1 z-10">
            <h3 className="font-headline-md text-headline-md text-on-background mb-2">FinHer Score</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6 max-w-md">Your financial health is strong! You've improved your savings rate this month. Keep up the momentum.</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setDetailsOpen(true)}
                className="bg-primary text-on-primary hover:bg-opacity-90 font-label-sm text-label-sm py-2 px-6 rounded-full uppercase tracking-wider transition-colors"
              >
                View Details
              </button>
              <button 
                onClick={() => setTipsOpen(true)}
                className="bg-transparent border border-glass-border text-on-background font-label-sm text-label-sm py-2 px-6 rounded-full uppercase tracking-wider hover:bg-glass-overlay transition-colors"
              >
                Tips to Improve
              </button>
            </div>
          </div>
          
          <div className="relative w-48 h-48 flex items-center justify-center z-10">
            {/* Circular Progress Ring */}
            <svg className="w-full h-full" viewBox="0 0 150 150">
              <defs>
                <linearGradient id="amberGradient" x1="0%" x2="100%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFB300"></stop>
                  <stop offset="100%" stopColor="#ffdeac"></stop>
                </linearGradient>
              </defs>
              <circle cx="75" cy="75" fill="none" r="65" stroke="rgba(141, 111, 117, 0.2)" strokeWidth="8"></circle>
              <circle className="transition-all duration-1000 ease-out" cx="75" cy="75" fill="none" r="65" stroke="url(#amberGradient)" strokeDasharray="408.4" strokeDashoffset="89.8" strokeLinecap="round" strokeWidth="8"></circle>
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="font-headline-lg text-headline-lg text-on-background">78</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">/ 100</span>
            </div>
            {/* Orbiting Particle */}
            <div className="absolute w-full h-full flex items-center justify-center pointer-events-none">
              <svg className="w-3 h-3 text-tertiary-fixed-dim animate-[spin_10s_linear_infinite]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"></path></svg>
            </div>
          </div>
        </div>
        
        {/* Bento Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-lg mb-stack-lg">
          {/* SafeCircle Widget (Priority High) */}
          <div className="glass-panel rounded-xl p-5 flex flex-col justify-between col-span-1 md:col-span-1 relative overflow-hidden border border-success-emerald/30 min-h-[200px] md:min-h-[220px]">
            {/* Background Decorative Glow */}
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-success-emerald opacity-5 rounded-full blur-2xl"></div>

            <div className="z-10 flex-grow flex flex-col justify-between w-full">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-success-emerald">shield_person</span>
                  <h3 className="font-body-lg text-body-lg font-semibold text-on-background">SafeSphere</h3>
                </div>

                {/* Status Pill */}
                <div className={`border rounded-full py-1 px-3 flex items-center gap-2 w-max mb-3 transition-colors duration-300 ${
                  status === 'sharing' ? 'bg-success-emerald/10 border-success-emerald/20 text-success-emerald' :
                  status === 'requesting' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                  (status === 'error' || status === 'denied') ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' :
                  'bg-zinc-500/10 border-zinc-500/20 text-on-surface-variant'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    status === 'sharing' ? 'bg-success-emerald animate-pulse' :
                    status === 'requesting' ? 'bg-amber-500 animate-pulse' :
                    (status === 'error' || status === 'denied') ? 'bg-rose-500' :
                    'bg-zinc-400'
                  }`}></div>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider">
                    {status === 'sharing' ? 'Sharing Live' :
                     status === 'requesting' ? 'Requesting...' :
                     status === 'denied' ? 'Permission Denied' :
                     status === 'error' ? 'Tracking Error' :
                     'Live tracking idle'}
                  </span>
                </div>

                {/* Address & Timestamp Info */}
                {status === 'sharing' && (
                  <div className="mb-3 text-xs text-on-surface-variant animate-fade-in">
                    <p className="font-medium line-clamp-2">📍 {address || 'Fetching address...'}</p>
                    <p className="opacity-75 mt-1 font-label-sm">Sent: {lastSent}</p>
                  </div>
                )}

                {/* Error/Denied inline message */}
                {errorMsg && (
                  <p className="text-xs text-rose-500 mb-3 bg-rose-500/5 p-2 rounded-lg border border-rose-500/10 animate-fade-in">
                    {errorMsg}
                  </p>
                )}
              </div>

              {/* Avatars or Sharing Panel Toggle */}
              <div className="flex flex-col gap-2 mt-auto w-full">
                {/* User Trusted Contacts Avatars when idle/sharing */}
                {!showPanel && (
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-glass-border -mr-3">
                        <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKRshVAUirsC2AV0LlBtqTqG2l6yJBC4pUMFvshoZheoQK3g2fYvZ55hep4-2rLyrYZk8kN3leJx06LglNcX94iEmIVX5sgE_OSmcrlLMVNjIwWSOzeEsc6oUWT-9-HNc-nRVbYDH41cz3qtqhNojO9U1P5Y_Ra0biRDMssv8msQ03-r43R6YokjazsUugzIL9o7ewCU44EJElNxuK1N1iunbAUgi3M0OOdY6uzfjex5cHVo9JkuMA2PMpmY67WuUHp0ebzc2CMK8"/>
                      </div>
                      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-glass-border">
                        <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDws0VtM_i4c6MaiNqCrevm5hINH3ghpMYR6LuRKfCOGknjeDgbCHt2g-1CdCAVx3Or2s0wCIUyIQE69OZRdak9K6oI0q8UW9vx33zvKPa85bjn4ZhzJgKMwCcn-av4ZOznQ6SIu_0J6TgtRN7vTzEDXEAcmZfDCAzE5Vj-Pd81_eh81YgOppycVejDb7D_n-K_2fNqV35QUS-7JXWYUjwaAa3SoAzjbyWKK-q03dTMpGJkdZuuD3rORzYpAeT7f5QYMm8QkVwk7UE"/>
                      </div>
                      <span className="text-xs text-on-surface-variant ml-1 font-body-md opacity-85">2 contacts</span>
                    </div>
                  </div>
                )}

                {/* Manage Panel */}
                {showPanel && (
                  <div className="bg-glass-overlay/20 border border-glass-border p-3 rounded-xl mb-2 flex flex-col gap-2 animate-fade-up">
                    <p className="text-[11px] text-on-surface-variant">Live location sharing uses browser geotracking.</p>
                    {status === 'sharing' || status === 'requesting' ? (
                      <button 
                        onClick={stopSharing}
                        className="w-full bg-rose-600 hover:bg-rose-700 text-white font-label-sm text-label-sm py-2 px-3 rounded-lg uppercase tracking-wider transition-colors"
                      >
                        Stop Sharing
                      </button>
                    ) : (
                      <button 
                        onClick={startSharing}
                        className="w-full bg-success-emerald hover:bg-opacity-90 text-white font-label-sm text-label-sm py-2 px-3 rounded-lg uppercase tracking-wider transition-colors"
                      >
                        Start Live Share
                      </button>
                    )}
                  </div>
                )}

                <button 
                  onClick={() => setShowPanel(!showPanel)}
                  className="w-full bg-[#FFB300] hover:bg-opacity-90 font-label-sm text-label-sm py-2.5 px-4 rounded-xl uppercase tracking-wider flex items-center justify-center gap-2 cta-glow text-[#3f293b] transition-transform duration-200 hover:scale-[1.02]"
                >
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  <span>{showPanel ? 'Close Panel' : 'Manage Sharing'}</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Vertical Stack for smaller widgets */}
          <div className="flex flex-col gap-stack-lg col-span-1 md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg">
              {/* Continue Learning */}
              <div 
                onClick={() => setQuizOpen(true)}
                className="glass-panel rounded-xl p-5 flex gap-4 items-center cursor-pointer hover:bg-glass-overlay transition-colors min-h-[200px] md:min-h-[220px]"
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                  <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBA2vC-deUgNW69gA5GeCCY7A5KKLwphGN9fb_9agECdu6ltZwJJGXES_2oVtHvryOaCsm4z6hGF5iqyiPb5RwWIPylFq2BglaNqAAP5RVkZU4UBp9DFmRh3thxQUiPdeuiwm_-NpsShMYqgQFQ9MMCZ9O4cvr49iZVEz7iZiu6dqvSSjco0Mo4hPQIHmQVJKpgWO5bF8CcYZYxXshsEW25bkzr7wXp13XMT2q9EzG1TI09zvHnOuZ72mVJdDFk34PZ8QDNCCsuma0"/>
                </div>
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest">Module 3</span>
                    <span className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Play Quiz</span>
                  </div>
                  <h4 className="font-body-lg text-body-lg text-on-background mb-2 leading-tight">Basics of Mutual Funds</h4>
                  <div className="w-full bg-surface-variant rounded-full h-1.5 relative">
                    <div className="bg-primary h-1.5 rounded-full transition-all duration-500" style={{width: `${module3Progress}%`}}></div>
                  </div>
                  <span className="text-[11px] text-on-surface-variant opacity-80 mt-1 block">Progress: {module3Progress}%</span>
                </div>
              </div>
              
              {/* Mentor Match */}
              <div className="glass-panel rounded-xl p-5 flex flex-col justify-between min-h-[200px] md:min-h-[220px]">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-body-lg text-body-lg text-on-background">Mentor Match</h4>
                  <span className="material-symbols-outlined text-tertiary-fixed-dim text-sm">1k</span>
                </div>
                <div>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-2.5 text-xs">Based on your tech career goals.</p>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-fixed-dim">
                      <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdF-QlM2QFdD4FQmOmqgRcu5EINIhYUaBu29EfgnaSnSpHdrY0K3Q6wlYObUPKjBsvNfQsgiVjyK88UKBYIqrDFHFd6YUbBFZwVDpdAc29E_hKKiL4D5Te8rtRK_8M4SMVz-rmOhl6hRvYxTowtG60rNeQdbnRv14BR0iraqIcYhJwVhbxZStD8BAM-zl1JH1LhqJSrIC2HLwOrHwDMlrIHz7KxMGbeUnK9YyCjasEEFuGNsMV03TPvgbXq8Y885cOmg0c4g_iUW4"/>
                    </div>
                    <div>
                      <p className="font-body-md text-body-md text-on-background font-medium text-sm">Priya Sharma</p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant text-[11px]">VP Engineering</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleConnectMentor('Priya Sharma')}
                    disabled={connectedMentors.includes('Priya Sharma')}
                    className={`w-full font-label-sm text-[10px] py-2 px-3 rounded-lg uppercase tracking-wider font-semibold text-center border transition-all ${
                      connectedMentors.includes('Priya Sharma') 
                        ? 'bg-success-emerald/10 border-success-emerald/20 text-success-emerald' 
                        : 'bg-transparent border-primary text-primary hover:bg-primary hover:text-white'
                    }`}
                  >
                    {connectedMentors.includes('Priya Sharma') ? 'Connection Requested ✔' : 'Request Connection'}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Savings Goal (Wide Chart Widget) */}
            <div className="glass-panel rounded-xl p-5 flex-1 flex flex-col justify-between min-h-[140px]">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h4 className="font-body-lg text-body-lg text-on-background">Emergency Fund</h4>
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mt-0.5 text-[11px]">Target: ₹1,00,000</p>
                </div>
                <div className="text-right flex flex-col items-end">
                  <p className="font-headline-md text-headline-md text-primary font-bold">₹{savings.toLocaleString()}</p>
                  <button 
                    onClick={() => setSavingOpen(true)}
                    className="text-[#FFB300] font-label-sm text-[11px] font-bold uppercase tracking-wider hover:underline flex items-center gap-0.5 mt-0.5"
                  >
                    <span className="material-symbols-outlined text-[13px]">add_circle</span>
                    <span>Deposit</span>
                  </button>
                </div>
              </div>
              <div className="w-full h-16 mt-auto relative">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="chartGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="#F06292" stopOpacity="0.2"></stop>
                      <stop offset="100%" stopColor="#F06292" stopOpacity="0"></stop>
                    </linearGradient>
                  </defs>
                  {/* Render the chart curve and point dynamically based on contribution progress */}
                  <path d={`M0,100 L0,80 Q20,60 40,70 T80,40 L100,${100 - Math.min(1.0, savings / 100000) * 80} L100,100 Z`} fill="url(#chartGradient)"></path>
                  <path d={`M0,80 Q20,60 40,70 T80,40 L100,${100 - Math.min(1.0, savings / 100000) * 80}`} fill="none" stroke="#F06292" strokeLinecap="round" strokeWidth="2"></path>
                  <circle cx="100" cy={100 - Math.min(1.0, savings / 100000) * 80} fill="#FFB300" r="4" className="animate-pulse"></circle>
                </svg>
              </div>
            </div>
          </div>
         </div>

        {/* Today's AI Action Plan Row (Achievements removed per feedback) */}
        <div className="mb-stack-lg">
          {/* Today's AI Action Plan */}
          <div className="glass-panel rounded-xl p-5 flex flex-col justify-between w-full">
            <div>
              <h3 className="font-body-lg text-body-lg font-semibold text-on-background mb-3 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">task_alt</span>
                  <span>Today's AI Action Plan</span>
                </span>
                <span className="text-[9px] bg-primary/15 text-primary px-1.5 py-0.5 rounded uppercase font-bold">Dynamic</span>
              </h3>
              
              <div className="flex flex-col gap-2.5">
                {tasks.map(task => (
                  <div 
                    key={task.id} 
                    onClick={() => handleToggleTask(task.id)}
                    className="flex items-center gap-3 cursor-pointer group text-xs text-on-background"
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      task.is_completed ? 'bg-success-emerald border-success-emerald text-white' : 'border-glass-border group-hover:border-primary'
                    }`}>
                      {task.is_completed && <span className="material-symbols-outlined text-[11px] font-bold">check</span>}
                    </div>
                    <span className={task.is_completed ? 'line-through text-on-surface-variant opacity-75' : 'font-medium'}>
                      {task.task_description}
                    </span>
                  </div>
                ))}
              </div>

              {/* Form to Add New Action */}
              <form onSubmit={handleAddNewAction} className="flex gap-2 mt-4 pt-4 border-t border-glass-border/30">
                <input 
                  type="text" 
                  value={newActionInput}
                  onChange={e => setNewActionInput(e.target.value)}
                  placeholder="Add next custom action..." 
                  className="flex-grow bg-glass-overlay border border-glass-border rounded-xl px-3 py-1.5 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
                <button type="submit" className="bg-[#FFB300] hover:bg-opacity-95 text-[#281526] font-bold text-[10px] py-1.5 px-3.5 rounded-lg uppercase tracking-wider shrink-0 flex items-center gap-1 transition-all">
                  <span className="material-symbols-outlined text-xs">add</span>
                  <span>Add Action</span>
                </button>
              </form>
            </div>
            
            <span className="text-[10px] text-on-surface-variant mt-4 italic block">Checklists synchronize with reskilling paths.</span>
          </div>
        </div>

        {/* Geolocated Events Map Row */}
        <div className="mb-stack-lg">
          {/* Geolocation events */}
          <div className="glass-panel rounded-xl p-5 flex flex-col justify-between w-full">
            <div>
              <h3 className="font-body-lg text-body-lg font-semibold text-on-background mb-1 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">map</span>
                <span>Nearby Networking & NGO Events</span>
              </h3>
              <p className="text-[10px] text-on-surface-variant mb-3 leading-relaxed">Geolocated programs in Bengaluru convention tracks.</p>
              
              <div className="flex flex-col gap-2.5">
                {nearbyEvents.map(ev => (
                  <div key={ev.id} className="p-2.5 bg-glass-overlay/10 border border-glass-border rounded-lg text-[11px] flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <a 
                          href={ev.applyUrl || '#'} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="font-semibold text-on-background hover:text-primary hover:underline transition-colors cursor-pointer"
                        >
                          {ev.title}
                        </a>
                        <span className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.2 rounded font-bold uppercase shrink-0">{ev.type}</span>
                      </div>
                      <p className="text-[10px] text-on-surface-variant mt-1">📍 {ev.location}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {ev.applyUrl && (
                        <a href={ev.applyUrl} target="_blank" rel="noopener noreferrer" className="bg-[#FFB300] hover:bg-opacity-95 text-[#281526] font-bold text-[10px] py-1.5 px-3.5 rounded-lg uppercase tracking-wider transition-all">
                          Apply
                        </a>
                      )}
                      <a href={ev.mapsUrl} target="_blank" rel="noopener noreferrer" className="bg-transparent border border-primary text-primary hover:bg-primary hover:text-white font-bold text-[10px] py-1.5 px-3.5 rounded-lg uppercase tracking-wider transition-all">
                        Directions
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => router.push('/events')} className="text-primary font-label-sm text-[10px] uppercase font-bold text-center w-full mt-4 hover:underline">
              View Event Maps Grid →
            </button>
          </div>
        </div>

        {/* Row: Community Feed & AI Opportunities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-stack-lg mb-stack-lg">
          {/* Opportunities Section */}
          <div className="glass-panel rounded-xl p-5 flex flex-col justify-between">
            <div>
              <h3 className="font-body-lg text-body-lg font-semibold text-on-background mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">work_outline</span>
                <span>AI Recommended Opportunities</span>
              </h3>
              
              <div className="flex flex-col gap-2.5">
                {opportunities.map((opp, index) => (
                  <div key={index} className="p-3 bg-glass-overlay/10 border border-glass-border rounded-lg text-[11px] flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-on-background text-xs">
                        <a 
                          href={opp.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="hover:text-primary hover:underline transition-colors cursor-pointer"
                        >
                          {opp.title}
                        </a>
                      </h4>
                      <p className="text-[10px] text-on-surface-variant mt-0.5">{opp.company} • {opp.location}</p>
                      <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-semibold mt-1 inline-block">{opp.type}</span>
                    </div>
                    <a href={opp.link} target="_blank" rel="noopener noreferrer" className="bg-[#FFB300] hover:bg-opacity-95 text-[#281526] font-bold text-[10px] py-1.5 px-3.5 rounded-lg uppercase tracking-wider shrink-0 transition-all">
                      Apply
                    </a>
                  </div>
                ))}
              </div>
            </div>
            
            <button onClick={() => router.push('/jobs')} className="text-primary font-label-sm text-[10px] uppercase font-bold text-center w-full mt-4 hover:underline">
              View Jobs & Internship Feeds →
            </button>
          </div>

          {/* Community Feed Section */}
          <div className="glass-panel rounded-xl p-5 flex flex-col justify-between">
            <div>
              <h3 className="font-body-lg text-body-lg font-semibold text-on-background mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">forum</span>
                <span>HerNova Community Feed</span>
              </h3>
              
              {/* Add Post Form */}
              <form onSubmit={handleAddPost} className="flex gap-2 mb-3.5">
                <input 
                  type="text" 
                  value={newPostContent}
                  onChange={e => setNewPostContent(e.target.value)}
                  placeholder="Share a milestone or ask a doubt..." 
                  className="flex-grow bg-glass-overlay border border-glass-border rounded-xl px-3 py-1.5 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button type="submit" className="bg-[#FFB300] text-[#281526] font-bold text-[10px] py-1.5 px-3.5 rounded-lg uppercase tracking-wider shrink-0">Post</button>
              </form>

              <div className="flex flex-col gap-2.5 max-h-48 overflow-y-auto pr-1 no-scrollbar">
                {feedPosts.map(post => (
                  <div key={post.id} className="p-3 bg-glass-overlay/10 border border-glass-border rounded-lg text-[11px] animate-fade-in">
                    <p className="font-bold text-on-background text-[11px]">{post.author}</p>
                    <p className="text-on-surface-variant mt-1 leading-relaxed text-[11px]">{post.content}</p>
                    
                    <div className="flex gap-4 mt-2 border-t border-glass-border/30 pt-1.5 text-[10px] text-on-surface-variant font-semibold">
                      <button type="button" onClick={() => handleLikePost(post.id)} className="flex items-center gap-1 hover:text-primary">
                        <span className="material-symbols-outlined text-xs">thumb_up</span>
                        <span>{post.likes} Likes</span>
                      </button>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">comment</span>
                        <span>{post.comments.length} Comments</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => router.push('/community')} className="text-primary font-label-sm text-[10px] uppercase font-bold text-center w-full mt-4 hover:underline">
              View Full Community Forum →
            </button>
          </div>
        </div>

        {/* SOS Helpline & Emergency Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-stack-lg mb-stack-lg">
          <div className="glass-panel rounded-xl p-5 flex flex-col justify-between">
            <div>
              <h3 className="font-body-lg text-body-lg font-semibold text-on-background mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-rose-500 text-base">emergency</span>
                <span>Emergency Safety Widget</span>
              </h3>
              <div className="grid grid-cols-2 gap-2 text-[10px] mb-3">
                <a href="tel:1091" className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-bold p-2 rounded-lg flex items-center gap-1.5 justify-center border border-rose-500/20">
                  <span className="material-symbols-outlined text-xs">phone_in_talk</span>
                  <span>Helpline (1091)</span>
                </a>
                <a href="tel:112" className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-bold p-2 rounded-lg flex items-center gap-1.5 justify-center border border-rose-500/20">
                  <span className="material-symbols-outlined text-xs">phone</span>
                  <span>Police (112)</span>
                </a>
              </div>
              <div className="bg-glass-overlay/10 border border-glass-border p-3 rounded-lg flex flex-col gap-1.5 mb-2 text-[11px]">
                <p className="font-semibold text-on-background">Trusted Contact:</p>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Ravi Roy (Husband)</span>
                  <a href="tel:+919876543210" className="text-primary font-bold hover:underline">+91 98765 43210</a>
                </div>
              </div>
            </div>
            
            <button onClick={() => router.push('/safety')} className="bg-rose-600 hover:bg-rose-700 text-white font-label-sm text-[10px] uppercase tracking-wider font-bold py-2 rounded-lg text-center transition-all shadow-[0_0_10px_rgba(225,29,72,0.2)]">
              SOS Broadcast Location
            </button>
          </div>

          {/* AI Career Re-entry Planner Section */}
          <div className="glass-panel rounded-xl p-5 flex flex-col justify-between border border-primary/20 relative overflow-hidden">
            {/* Ambient Glow */}
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary opacity-[0.04] rounded-full blur-2xl"></div>
            
            <div className="z-10 relative flex-grow">
              <h3 className="font-headline-md text-headline-md text-on-background mb-2 flex items-center gap-2">
                <span>Career Re-entry Pathmaker</span>
                <span className="text-primary text-xs bg-primary/15 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">AI Assistant</span>
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6 text-sm">
                Returning to work after a break? Tell us your background and goals, and we'll map out your learning, mentorship, and financial milestones.
              </p>

              {!reentryPlan ? (
                <form onSubmit={handleGenerateReentryPlan} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Previous Role</label>
                    <input 
                      type="text" 
                      value={reentryPrevRole} 
                      onChange={e => setReentryPrevRole(e.target.value)} 
                      placeholder="e.g. Software Engineer" 
                      className="w-full bg-glass-overlay border border-glass-border rounded-xl py-2.5 px-4 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Break Duration</label>
                    <select 
                      value={reentryDuration} 
                      onChange={e => setReentryDuration(e.target.value)}
                      className="w-full bg-glass-overlay border border-glass-border rounded-xl py-2.5 px-4 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
                      required
                    >
                      <option value="" disabled className="text-on-surface/50">Select duration</option>
                      <option value="1">1 Year</option>
                      <option value="2">2 Years</option>
                      <option value="3">3 Years</option>
                      <option value="5">5+ Years</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Target Goal</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={reentryTarget} 
                        onChange={e => setReentryTarget(e.target.value)} 
                        placeholder="e.g. Product Manager" 
                        className="flex-1 bg-glass-overlay border border-glass-border rounded-xl py-2.5 px-4 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                        required
                      />
                      <button 
                        type="submit" 
                        disabled={reentryLoading}
                        className="bg-primary text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-300 hover:bg-opacity-95 font-label-sm text-label-sm uppercase tracking-wider shrink-0 flex items-center justify-center min-w-[120px]"
                      >
                        {reentryLoading ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : 'Generate'}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="animate-fade-in">
                  <div className="flex justify-between items-center mb-4 bg-glass-overlay/25 border border-glass-border rounded-xl p-3">
                    <div>
                      <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">Your Profile</span>
                      <h4 className="font-body-lg text-body-lg text-on-background font-medium text-sm">
                        {reentryPrevRole} ➔ {reentryTarget} ({reentryPlan.breakDuration} break)
                      </h4>
                    </div>
                    <button 
                      onClick={() => {
                        setReentryPlan(null);
                        setReentryPrevRole('');
                        setReentryDuration('');
                        setReentryTarget('');
                      }}
                      className="text-primary hover:underline font-label-sm text-xs uppercase font-semibold"
                    >
                      Reset
                    </button>
                  </div>

                  {/* Timeline Roadmap */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2 relative">
                    {reentryPlan.plan.steps.map((step, idx) => (
                      <div key={idx} className="glass-panel p-3 rounded-xl relative flex flex-col justify-between hover:shadow-lg transition-all duration-300">
                        <div>
                          <span className="text-[9px] text-primary font-bold uppercase tracking-wider block mb-1">{step.phase}</span>
                          <p className="text-[10px] text-on-surface-variant mb-1.5 leading-relaxed">{step.description}</p>
                          <ul className="text-[9px] text-on-surface list-disc pl-3 space-y-0.5 font-medium leading-relaxed">
                            {step.items.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                        {idx === 0 && (
                          <button 
                            onClick={() => {
                              setModule3Progress(100);
                              fetch(`${BACKEND_URL}/api/learning/progress/${CURRENT_USER_ID}`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ courseId: 'module3', progress: 100 }),
                              }).catch(console.error);
                              alert("Skills Patched! Basics of Mutual Funds progress updated to 100%.");
                            }}
                            className="mt-3 w-full bg-[#FFB300] hover:bg-opacity-95 text-[#281526] py-1 rounded-lg font-label-sm text-[9px] uppercase tracking-wider font-bold text-center"
                          >
                            Enlist
                          </button>
                        )}
                        {idx === 1 && (
                          <button 
                            onClick={() => handleConnectMentor('Priya Sharma')}
                            disabled={connectedMentors.includes('Priya Sharma')}
                            className="mt-3 w-full bg-[#FFB300] hover:bg-opacity-95 text-[#281526] py-1 rounded-lg font-label-sm text-[9px] uppercase tracking-wider font-bold text-center disabled:bg-glass-overlay/10 disabled:text-on-surface-variant disabled:opacity-50"
                          >
                            {connectedMentors.includes('Priya Sharma') ? 'Connected' : 'Match'}
                          </button>
                        )}
                        {idx === 2 && (
                          <button 
                            onClick={() => {
                              const bufferVal = reentryPlan.breakDuration.includes('3') || reentryPlan.breakDuration.includes('5') ? 25000 : 15000;
                              fetch(`${BACKEND_URL}/api/savings/${CURRENT_USER_ID}`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ amount: bufferVal }),
                              })
                                .then(res => res.json())
                                .then(data => {
                                  if (data.success) {
                                    setSavings(data.balance);
                                    alert(`Successfully added ₹${bufferVal.toLocaleString()} cushion to your Emergency Fund!`);
                                  }
                                });
                            }}
                            className="mt-3 w-full bg-[#FFB300] hover:bg-opacity-95 text-[#281526] py-1 rounded-lg font-label-sm text-[9px] uppercase tracking-wider font-bold text-center"
                          >
                            Fund Buffer
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Success Stories Carousel Header */}
        <div className="mt-stack-xl mb-stack-md flex justify-between items-end">
          <h3 className="font-headline-md text-headline-md text-on-background">Success Stories</h3>
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-full border border-glass-border flex items-center justify-center text-on-surface-variant hover:bg-glass-overlay"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
            <button className="w-8 h-8 rounded-full border border-glass-border flex items-center justify-center text-on-surface-variant hover:bg-glass-overlay"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
          </div>
        </div>
        
        {/* Carousel Track */}
        <div className="flex gap-stack-lg overflow-x-auto pb-4 snap-x no-scrollbar">
          {successStories.map((story, index) => (
            <div 
              key={index} 
              onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(story.searchQuery)}`, "_blank", "noopener,noreferrer")}
              className="glass-panel rounded-xl p-stack-md min-w-[280px] snap-start flex flex-col gap-4 hover:-translate-y-[3px] cursor-pointer group"
              style={{ transition: 'transform 180ms ease-out' }}
            >
              <div className="w-full h-32 rounded-lg overflow-hidden">
                <img className="w-full h-full object-cover" src={story.image} alt={story.title}/>
              </div>
              <div className="flex flex-col flex-grow justify-between">
                <div>
                  <h4 className="font-body-lg text-body-lg font-medium text-on-background mb-1">{story.title}</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant text-sm line-clamp-3 mb-3">{story.description}</p>
                </div>
                <span className="text-[#C2185B] font-label-sm text-sm font-semibold hover:underline mt-auto self-start flex items-center gap-1">
                  Read real stories like this →
                </span>
              </div>
            </div>
          ))}
        </div>
        </div>
      </main>

      {/* Floating AI Companion */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {aiOpen && (
          <div className="glass-panel p-4 rounded-2xl w-80 h-96 shadow-2xl mb-3 flex flex-col justify-between border border-primary/30 animate-fade-up bg-[#281526]/90 backdrop-blur-md">
            <div className="flex justify-between items-center pb-2 border-b border-glass-border">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
                <span className="font-semibold text-xs text-on-background uppercase tracking-wider">HerNova AI Companion</span>
              </div>
              <button onClick={() => setAiOpen(false)} className="text-on-surface-variant hover:text-on-background">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            
            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto my-2 pr-1 flex flex-col gap-2 no-scrollbar text-[11px] leading-relaxed">
              {aiMessages.map((msg, i) => (
                <div key={i} className={`p-2.5 rounded-xl max-w-[85%] ${
                  msg.sender === 'user' 
                    ? 'bg-primary text-white self-end rounded-tr-none' 
                    : 'bg-glass-overlay border border-glass-border text-on-background self-start rounded-tl-none'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              ))}
              {aiLoading && (
                <div className="self-start bg-glass-overlay border border-glass-border p-2 rounded-xl flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              )}
            </div>

            {/* Quick Actions Suggestions */}
            <div className="flex gap-1 overflow-x-auto pb-2 no-scrollbar border-t border-glass-border/30 pt-2 shrink-0">
              <button onClick={() => handleSendAiMessage("Find scholarships near me.")} className="text-[9px] bg-primary/10 border border-primary/20 text-primary py-1 px-2 rounded-full shrink-0 font-medium hover:bg-primary/25">Scholarships</button>
              <button onClick={() => handleSendAiMessage("Am I ready for an internship?")} className="text-[9px] bg-primary/10 border border-primary/20 text-primary py-1 px-2 rounded-full shrink-0 font-medium hover:bg-primary/25">Readiness</button>
              <button onClick={() => handleSendAiMessage("Create savings plan for ₹5k.")} className="text-[9px] bg-primary/10 border border-primary/20 text-primary py-1 px-2 rounded-full shrink-0 font-medium hover:bg-primary/25">Savings Plan</button>
              <button onClick={() => handleSendAiMessage("Recommend courses based on career break.")} className="text-[9px] bg-primary/10 border border-primary/20 text-primary py-1 px-2 rounded-full shrink-0 font-medium hover:bg-primary/25">Break Courses</button>
            </div>

            {/* Prompt input */}
            <form onSubmit={(e) => { e.preventDefault(); handleSendAiMessage(); }} className="flex gap-1.5 border-t border-glass-border/30 pt-2 shrink-0">
              <input 
                type="text" 
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                placeholder="Ask me anything..." 
                className="flex-1 bg-glass-overlay border border-glass-border rounded-xl px-3 py-1.5 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button type="submit" className="bg-[#FFB300] text-[#281526] w-8 h-8 rounded-xl flex items-center justify-center font-bold hover:bg-opacity-95">
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </form>
          </div>
        )}
        <button 
          onClick={() => setAiOpen(!aiOpen)}
          className="w-14 h-14 rounded-full bg-primary hover:bg-opacity-95 text-white flex items-center justify-center shadow-[0_0_15px_rgba(194,24,91,0.4)] transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <span className="material-symbols-outlined text-2xl animate-pulse">auto_awesome</span>
        </button>
      </div>

      {/* Modal: Admin Panel */}
      {adminOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel p-6 rounded-2xl w-full max-w-[500px] shadow-2xl relative border border-primary/20 max-h-[85vh] overflow-y-auto bg-[#281526]">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-glass-border">
              <h4 className="font-body-lg text-body-lg text-on-background font-bold text-lg flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-base">admin_panel_settings</span>
                <span>HerNova Admin Control Panel</span>
              </h4>
              <button onClick={() => setAdminOpen(false)} className="text-on-surface-variant hover:text-on-background">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-4 text-xs">
              {/* Section: Users */}
              <div>
                <h5 className="font-bold text-primary mb-2 uppercase tracking-wide">Manage Users & Status</h5>
                <div className="flex flex-col gap-1.5">
                  {adminUsers.map((user, idx) => (
                    <div key={idx} className="p-2 bg-glass-overlay/10 border border-glass-border rounded-lg flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-on-background">{user.name}</p>
                        <p className="text-[10px] text-on-surface-variant">{user.email}</p>
                      </div>
                      <span className="text-[10px] bg-success-emerald/10 text-success-emerald px-2 py-0.5 rounded font-bold uppercase">{user.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section: Controls */}
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button onClick={() => { alert("Post uploaded! Added to opportunity feeds."); }} className="bg-glass-overlay hover:bg-glass-overlay/50 border border-glass-border p-2.5 rounded-lg font-semibold text-center flex flex-col items-center">
                  <span className="material-symbols-outlined text-primary mb-1">post_add</span>
                  <span>Post New Scholarship</span>
                </button>
                <button onClick={() => { alert("Story added! Appended to Success Stories carousel."); }} className="bg-glass-overlay hover:bg-glass-overlay/50 border border-glass-border p-2.5 rounded-lg font-semibold text-center flex flex-col items-center">
                  <span className="material-symbols-outlined text-primary mb-1">auto_stories</span>
                  <span>Upload Success Story</span>
                </button>
                <button onClick={() => { alert("Notification blast sent to all users."); }} className="bg-glass-overlay hover:bg-glass-overlay/50 border border-glass-border p-2.5 rounded-lg font-semibold text-center flex flex-col items-center">
                  <span className="material-symbols-outlined text-primary mb-1">campaign</span>
                  <span>Send Announcement Alert</span>
                </button>
                <button onClick={() => { alert("Mentor verification list refreshed."); }} className="bg-glass-overlay hover:bg-glass-overlay/50 border border-glass-border p-2.5 rounded-lg font-semibold text-center flex flex-col items-center">
                  <span className="material-symbols-outlined text-primary mb-1">verified</span>
                  <span>Approve Verified Mentors</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end mt-6 border-t border-glass-border/30 pt-3">
              <button onClick={() => setAdminOpen(false)} className="bg-[#FFB300] text-[#281526] font-label-sm text-xs py-2 px-6 rounded-lg uppercase tracking-wider font-semibold">Close Panel</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Savings Deposit */}
      {savingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel p-6 rounded-2xl w-full max-w-[320px] shadow-2xl relative border border-primary/20">
            <h4 className="font-body-lg text-body-lg text-on-background mb-4 font-semibold">Deposit Savings</h4>
            <form onSubmit={handleAddSavings}>
              <input 
                type="number" 
                value={savingsAmount}
                onChange={e => setSavingsAmount(e.target.value)}
                placeholder="Contribution amount (₹)" 
                className="w-full bg-glass-overlay border border-glass-border rounded-xl py-2 px-4 mb-4 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                required 
              />
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setSavingOpen(false)} className="px-4 py-2 text-xs font-semibold text-on-surface-variant uppercase tracking-wider hover:underline">Cancel</button>
                <button type="submit" className="bg-[#FFB300] text-[#281526] px-4 py-2 text-xs font-semibold rounded-lg uppercase tracking-wider shadow-[0_0_10px_rgba(255,179,0,0.2)]">Deposit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Module 3 Quick Quiz */}
      {quizOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel p-6 rounded-2xl w-full max-w-[400px] shadow-2xl relative border border-primary/20">
            <h4 className="font-body-lg text-body-lg text-on-background mb-2 font-semibold">Module 3 Quick Quiz</h4>
            <p className="text-[11px] text-on-surface-variant mb-4">Answer correctly to increase progress by +15%!</p>
            
            {!quizAnswered ? (
              <div>
                <p className="text-xs font-medium text-on-background mb-4">Question: Who manages the assets inside a standard Mutual Fund?</p>
                <div className="flex flex-col gap-2">
                  <button onClick={() => handleQuizSubmit('A')} className="w-full text-left bg-glass-overlay hover:bg-glass-overlay/50 border border-glass-border p-3 rounded-lg text-[11px] transition-colors">A) The individual investors themselves</button>
                  <button onClick={() => handleQuizSubmit('B')} className="w-full text-left bg-glass-overlay hover:bg-glass-overlay/50 border border-glass-border p-3 rounded-lg text-[11px] transition-colors font-semibold text-primary">B) Professional fund managers</button>
                  <button onClick={() => handleQuizSubmit('C')} className="w-full text-left bg-glass-overlay hover:bg-glass-overlay/50 border border-glass-border p-3 rounded-lg text-[11px] transition-colors">C) The government regulatory authorities</button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                {quizCorrect ? (
                  <div className="animate-fade-in flex flex-col items-center">
                    <span className="material-symbols-outlined text-4xl text-success-emerald mb-2">check_circle</span>
                    <p className="text-xs font-medium text-on-background">Correct Answer! Course progress increased.</p>
                  </div>
                ) : (
                  <div className="animate-fade-in flex flex-col items-center">
                    <span className="material-symbols-outlined text-4xl text-rose-500 mb-2">cancel</span>
                    <p className="text-xs font-medium text-on-background">Incorrect. Try again next time!</p>
                  </div>
                )}
                <button 
                  type="button"
                  onClick={() => { setQuizOpen(false); setQuizAnswered(false); }}
                  className="mt-6 bg-[#FFB300] text-[#281526] font-label-sm text-xs py-2 px-6 rounded-lg uppercase tracking-wider shadow-[0_0_10px_rgba(255,179,0,0.2)]"
                >
                  Close Quiz
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: FinHer Score Details */}
      {detailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel p-6 rounded-2xl w-full max-w-[450px] shadow-2xl relative border border-primary/20 bg-[#281526]">
            <h4 className="font-body-lg text-body-lg text-on-background mb-4 font-bold text-lg">FinHer Score Breakdown</h4>
            <div className="flex flex-col gap-4 text-xs">
              <div className="flex justify-between items-center bg-glass-overlay/10 p-3 rounded-lg border border-glass-border">
                <span className="font-semibold text-on-surface-variant">Savings Discipline (40%)</span>
                <span className="font-bold text-primary">
                  {savings >= 100000 ? 40 : Math.round((savings / 100000) * 40)}% (₹{savings.toLocaleString()} / ₹1,00,000)
                </span>
              </div>
              <div className="flex justify-between items-center bg-glass-overlay/10 p-3 rounded-lg border border-glass-border">
                <span className="font-semibold text-on-surface-variant">Learning & Reskilling (40%)</span>
                <span className="font-bold text-primary">
                  {Math.round((module3Progress / 100) * 40)}% (Module 3 at {module3Progress}%)
                </span>
              </div>
              <div className="flex justify-between items-center bg-glass-overlay/10 p-3 rounded-lg border border-glass-border">
                <span className="font-semibold text-on-surface-variant">Mentorship & Networks (20%)</span>
                <span className="font-bold text-primary">
                  {connectedMentors.length > 0 ? '20%' : '10%'} ({connectedMentors.length} connection active)
                </span>
              </div>
              
              <div className="mt-4 p-4 rounded-xl bg-primary/10 border border-primary/20 text-center">
                <p className="text-sm font-semibold text-primary">Overall FinHer Score</p>
                <p className="text-3xl font-bold text-on-background mt-1">
                  {Math.min(100, 
                    (savings >= 100000 ? 40 : Math.round((savings / 100000) * 40)) + 
                    Math.round((module3Progress / 100) * 40) + 
                    (connectedMentors.length > 0 ? 20 : 10)
                  )} / 100
                </p>
                <p className="text-[10px] text-on-surface-variant mt-2 italic">Based on real-time activity and milestone completions.</p>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={() => setDetailsOpen(false)} className="bg-[#FFB300] text-[#281526] font-label-sm text-xs py-2 px-6 rounded-lg uppercase tracking-wider font-semibold shadow-[0_0_10px_rgba(255,179,0,0.2)]">Close Breakdown</button>
            </div>
          </div>
        </div>
      )}

      

      {/* Modal: Admin Panel */}
      {adminOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel p-6 rounded-2xl w-full max-w-[500px] shadow-2xl relative border border-primary/20 max-h-[85vh] overflow-y-auto bg-[#281526]">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-glass-border">
              <h4 className="font-body-lg text-body-lg text-on-background font-bold text-lg flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-base">admin_panel_settings</span>
                <span>HerNova Admin Control Panel</span>
              </h4>
              <button onClick={() => setAdminOpen(false)} className="text-on-surface-variant hover:text-on-background">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-4 text-xs">
              {/* Section: Users */}
              <div>
                <h5 className="font-bold text-primary mb-2 uppercase tracking-wide">Manage Users & Status</h5>
                <div className="flex flex-col gap-1.5">
                  {adminUsers.map((user, idx) => (
                    <div key={idx} className="p-2 bg-glass-overlay/10 border border-glass-border rounded-lg flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-on-background">{user.name}</p>
                        <p className="text-[10px] text-on-surface-variant">{user.email}</p>
                      </div>
                      <span className="text-[10px] bg-success-emerald/10 text-success-emerald px-2 py-0.5 rounded font-bold uppercase">{user.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section: Controls */}
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button onClick={() => { alert("Post uploaded! Added to opportunity feeds."); }} className="bg-glass-overlay hover:bg-glass-overlay/50 border border-glass-border p-2.5 rounded-lg font-semibold text-center flex flex-col items-center">
                  <span className="material-symbols-outlined text-primary mb-1">post_add</span>
                  <span>Post New Scholarship</span>
                </button>
                <button onClick={() => { alert("Story added! Appended to Success Stories carousel."); }} className="bg-glass-overlay hover:bg-glass-overlay/50 border border-glass-border p-2.5 rounded-lg font-semibold text-center flex flex-col items-center">
                  <span className="material-symbols-outlined text-primary mb-1">auto_stories</span>
                  <span>Upload Success Story</span>
                </button>
                <button onClick={() => { alert("Notification blast sent to all users."); }} className="bg-glass-overlay hover:bg-glass-overlay/50 border border-glass-border p-2.5 rounded-lg font-semibold text-center flex flex-col items-center">
                  <span className="material-symbols-outlined text-primary mb-1">campaign</span>
                  <span>Send Announcement Alert</span>
                </button>
                <button onClick={() => { alert("Mentor verification list refreshed."); }} className="bg-glass-overlay hover:bg-glass-overlay/50 border border-glass-border p-2.5 rounded-lg font-semibold text-center flex flex-col items-center">
                  <span className="material-symbols-outlined text-primary mb-1">verified</span>
                  <span>Approve Verified Mentors</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end mt-6 border-t border-glass-border/30 pt-3">
              <button onClick={() => setAdminOpen(false)} className="bg-[#FFB300] text-[#281526] font-label-sm text-xs py-2 px-6 rounded-lg uppercase tracking-wider font-semibold">Close Panel</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Savings Deposit */}
      {savingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel p-6 rounded-2xl w-full max-w-[320px] shadow-2xl relative border border-primary/20">
            <h4 className="font-body-lg text-body-lg text-on-background mb-4 font-semibold">Deposit Savings</h4>
            <form onSubmit={handleAddSavings}>
              <input 
                type="number" 
                value={savingsAmount}
                onChange={e => setSavingsAmount(e.target.value)}
                placeholder="Contribution amount (₹)" 
                className="w-full bg-glass-overlay border border-glass-border rounded-xl py-2 px-4 mb-4 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                required 
              />
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setSavingOpen(false)} className="px-4 py-2 text-xs font-semibold text-on-surface-variant uppercase tracking-wider hover:underline">Cancel</button>
                <button type="submit" className="bg-[#FFB300] text-[#281526] px-4 py-2 text-xs font-semibold rounded-lg uppercase tracking-wider shadow-[0_0_10px_rgba(255,179,0,0.2)]">Deposit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Module 3 Quick Quiz */}
      {quizOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel p-6 rounded-2xl w-full max-w-[400px] shadow-2xl relative border border-primary/20">
            <h4 className="font-body-lg text-body-lg text-on-background mb-2 font-semibold">Module 3 Quick Quiz</h4>
            <p className="text-[11px] text-on-surface-variant mb-4">Answer correctly to increase progress by +15%!</p>
            
            {!quizAnswered ? (
              <div>
                <p className="text-xs font-medium text-on-background mb-4">Question: Who manages the assets inside a standard Mutual Fund?</p>
                <div className="flex flex-col gap-2">
                  <button onClick={() => handleQuizSubmit('A')} className="w-full text-left bg-glass-overlay hover:bg-glass-overlay/50 border border-glass-border p-3 rounded-lg text-[11px] transition-colors">A) The individual investors themselves</button>
                  <button onClick={() => handleQuizSubmit('B')} className="w-full text-left bg-glass-overlay hover:bg-glass-overlay/50 border border-glass-border p-3 rounded-lg text-[11px] transition-colors font-semibold text-primary">B) Professional fund managers</button>
                  <button onClick={() => handleQuizSubmit('C')} className="w-full text-left bg-glass-overlay hover:bg-glass-overlay/50 border border-glass-border p-3 rounded-lg text-[11px] transition-colors">C) The government regulatory authorities</button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                {quizCorrect ? (
                  <div className="animate-fade-in flex flex-col items-center">
                    <span className="material-symbols-outlined text-4xl text-success-emerald mb-2">check_circle</span>
                    <p className="text-xs font-medium text-on-background">Correct Answer! Course progress increased.</p>
                  </div>
                ) : (
                  <div className="animate-fade-in flex flex-col items-center">
                    <span className="material-symbols-outlined text-4xl text-rose-500 mb-2">cancel</span>
                    <p className="text-xs font-medium text-on-background">Incorrect. Try again next time!</p>
                  </div>
                )}
                <button 
                  type="button"
                  onClick={() => { setQuizOpen(false); setQuizAnswered(false); }}
                  className="mt-6 bg-[#FFB300] text-[#281526] font-label-sm text-xs py-2 px-6 rounded-lg uppercase tracking-wider shadow-[0_0_10px_rgba(255,179,0,0.2)]"
                >
                  Close Quiz
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: FinHer Score Details */}
      {detailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel p-6 rounded-2xl w-full max-w-[450px] shadow-2xl relative border border-primary/20 bg-[#281526]">
            <h4 className="font-bold text-white mb-4 text-lg">FinHer Score Breakdown</h4>
            <div className="flex flex-col gap-4 text-xs">
              <div className="flex justify-between items-center bg-glass-overlay/10 p-3 rounded-lg border border-glass-border">
                <span className="font-semibold text-white/85">Savings Discipline (40%)</span>
                <span className="font-bold text-primary">
                  {savings >= 100000 ? 40 : Math.round((savings / 100000) * 40)}% (₹{savings.toLocaleString()} / ₹1,00,000)
                </span>
              </div>
              <div className="flex justify-between items-center bg-glass-overlay/10 p-3 rounded-lg border border-glass-border">
                <span className="font-semibold text-white/85">Learning & Reskilling (40%)</span>
                <span className="font-bold text-primary">
                  {Math.round((module3Progress / 100) * 40)}% (Module 3 at {module3Progress}%)
                </span>
              </div>
              <div className="flex justify-between items-center bg-glass-overlay/10 p-3 rounded-lg border border-glass-border">
                <span className="font-semibold text-white/85">Mentorship & Networks (20%)</span>
                <span className="font-bold text-primary">
                  {connectedMentors.length > 0 ? '20%' : '10%'} ({connectedMentors.length} connection active)
                </span>
              </div>
              
              <div className="mt-4 p-4 rounded-xl bg-primary/10 border border-primary/20 text-center">
                <p className="text-sm font-semibold text-primary">Overall FinHer Score</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {Math.min(100, 
                    (savings >= 100000 ? 40 : Math.round((savings / 100000) * 40)) + 
                    Math.round((module3Progress / 100) * 40) + 
                    (connectedMentors.length > 0 ? 20 : 10)
                  )} / 100
                </p>
                <p className="text-[10px] text-white/60 mt-2 italic">Based on real-time activity and milestone completions.</p>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={() => setDetailsOpen(false)} className="bg-[#FFB300] text-[#281526] font-label-sm text-xs py-2 px-6 rounded-lg uppercase tracking-wider font-semibold shadow-[0_0_10px_rgba(255,179,0,0.2)]">Close Breakdown</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: FinHer Score Improvement Tips */}
      {tipsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel p-6 rounded-2xl w-full max-w-[420px] shadow-2xl relative border border-primary/20 bg-[#281526]">
            <h4 className="font-bold text-white mb-4 text-lg">Tips to Improve Your Score</h4>
            <div className="flex flex-col gap-3 text-xs leading-relaxed">
              <div className="p-3 bg-glass-overlay/10 border border-glass-border rounded-lg flex items-start gap-2">
                <span className="text-primary font-bold">1.</span>
                <p className="text-white/85 text-xs"><span className="font-semibold text-white">Grow your emergency savings:</span> Currently at ₹{savings.toLocaleString()}. Deposit another ₹{(Math.max(0, 100000 - savings)).toLocaleString()} to unlock the full savings multiplier (+{savings >= 100000 ? 0 : Math.round(((100000 - savings)/100000)*40)}% score potential).</p>
              </div>
              <div className="p-3 bg-glass-overlay/10 border border-glass-border rounded-lg flex items-start gap-2">
                <span className="text-primary font-bold">2.</span>
                <p className="text-white/85 text-xs"><span className="font-semibold text-white">Complete active courses:</span> Take the short quiz in the "Basics of Mutual Funds" card to earn +15% course progress and boost your literacy score.</p>
              </div>
              <div className="p-3 bg-glass-overlay/10 border border-glass-border rounded-lg flex items-start gap-2">
                <span className="text-primary font-bold">3.</span>
                <p className="text-white/85 text-xs"><span className="font-semibold text-white">Establish network contacts:</span> Connect with Priya Sharma (VP Engineering) in the Mentor Match card to activate the network engagement boost.</p>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={() => setTipsOpen(false)} className="bg-[#FFB300] text-[#281526] font-label-sm text-xs py-2 px-6 rounded-lg uppercase tracking-wider font-semibold shadow-[0_0_10px_rgba(255,179,0,0.2)]">Close Tips</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

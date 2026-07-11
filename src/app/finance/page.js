'use client';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useEffect, useState, useRef } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  BarChart, 
  Bar 
} from 'recharts';

export default function FinanceHub() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  // Comeback Timeline and PS Pillars states
  const [selectedMilestone, setSelectedMilestone] = useState({ id: 'm6', label: 'Today', date: 'Jul 2026', icon: 'workspace_premium', desc: 'FinHer score reaches 75. Reskilling verified, profile ready for hiring!' });
  const [milestones] = useState([
    { id: 'm1', label: 'Break Started', date: 'Oct 2024', icon: 'pause_circle', desc: 'Took a break from software engineering to focus on maternity & infant care.' },
    { id: 'm2', label: 'Reskilling Booted', date: 'Mar 2025', icon: 'menu_book', desc: 'Completed Advanced Excel & Financial Foundations courses.' },
    { id: 'm3', label: 'Mentor Matched', date: 'Sep 2025', icon: 'handshake', desc: 'Restart plan aligned with VP Mentor Priya Sharma.' },
    { id: 'm4', label: 'Scheme Applied', date: 'Jan 2026', icon: 'account_balance', desc: 'Applied for sovereign Stand-Up India entrepreneurship grant.' },
    { id: 'm5', label: 'Interview Practice', date: 'Jun 2026', icon: 'forum', desc: 'Cleared mock finance interview with HerNova AI Coach.' },
    { id: 'm6', label: 'Today', date: 'Jul 2026', icon: 'workspace_premium', desc: 'FinHer score reaches 75. Reskilling verified, profile ready for hiring!' }
  ]);
  const [pillars] = useState([
    { name: 'Learning Progress', value: '80%', icon: 'school', color: 'border-[#C2185B]/30 text-[#C2185B]' },
    { name: 'Mentorship Syncs', value: '3 completed', icon: 'handshake', color: 'border-[#7B1FA2]/30 text-[#7B1FA2]' },
    { name: 'Financial Health', value: '75 FinHer', icon: 'payments', color: 'border-[#FFB300]/30 text-[#FFB300]' },
    { name: 'Community Wins', value: 'Active', icon: 'groups', color: 'border-[#00BCD4]/30 text-[#00BCD4]' }
  ]);
  
  // Dashboard & Goals states
  const [goals, setGoals] = useState([]);
  const [goalTemplates] = useState([
    {
      id: 'template_emergency',
      title: 'Rebuild Emergency Fund after a Break',
      targetAmount: 100000,
      months: 12,
      category: 'financial inclusion',
      whyCopy: 'Having a secure emergency buffer is the foundational step for return-to-work confidence to absorb sudden transit or initial care costs.'
    },
    {
      id: 'template_upskilling',
      title: 'Save for Upskilling & Certification',
      targetAmount: 25000,
      months: 6,
      category: 'education',
      whyCopy: 'Academic reviews show targeted technical upskilling cuts wage penalty gaps by up to 22%.'
    },
    {
      id: 'template_business',
      title: 'Start a Small Business',
      targetAmount: 300000,
      months: 24,
      category: 'entrepreneurship',
      whyCopy: 'MSME Ministry indicators highlight a 68% credit gap for female business owners in India; starting a personal seed corpus unlocks matching Mudra Yojana schemes.'
    },
    {
      id: 'template_wardrobe',
      title: 'Return-to-Work Wardrobe & Transit Fund',
      targetAmount: 15000,
      months: 3,
      category: 'employment',
      whyCopy: 'Building a personal return-to-work transit and presentation allowance removes immediate out-of-pocket cash flow barriers.'
    },
    {
      id: 'template_custom',
      title: 'Custom Financial Goal',
      targetAmount: 50000,
      months: 10,
      category: 'financial inclusion',
      whyCopy: 'Set a custom milestone target to fund your financial security objectives.'
    }
  ]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('template_emergency');
  const [newGoal, setNewGoal] = useState({ title: 'Rebuild Emergency Fund after a Break', targetAmount: 100000, deadline: '2027-07-10', currentSavings: 0, monthlyContribution: 8333, category: 'financial inclusion' });
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [selectedGoalForContribution, setSelectedGoalForContribution] = useState(null);
  const [contributionAmount, setContributionAmount] = useState(5000);
  
  // Expenses states
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ title: '', amount: '', category: 'Food', date: new Date().toISOString().split('T')[0] });
  
  // AI Copilot states
  const [copilotMessages, setCopilotMessages] = useState([
    { id: 1, sender: 'ai', text: "Hello! I am your HerNova Financial Copilot. Ask me anything about budgeting, saving strategies, or how to reach your investment goals." }
  ]);
  const [copilotInput, setCopilotInput] = useState('');
  const [copilotTyping, setCopilotTyping] = useState(false);
  
  // AI Advisor states
  const [advisorForm, setAdvisorForm] = useState({ income: 50000, savings: 10000, riskAppetite: 'Moderate', timeHorizon: 5 });
  const [advisorRecommendation, setAdvisorRecommendation] = useState(null);
  const [advisorLoading, setAdvisorLoading] = useState(false);

  // SIP Simulator states
  const [sipAmount, setSipAmount] = useState(5000);
  const [sipRate, setSipRate] = useState(12);
  const [sipYears, setSipYears] = useState(10);
  
  // Virtual Portfolio states
  const [virtualBalance, setVirtualBalance] = useState(100000);
  const [portfolio, setPortfolio] = useState([
    { id: 'stock_hdfc', name: 'HDFC Bank (Stock)', qty: 5, avgPrice: 1550, currentPrice: 1580, type: 'Stock' },
    { id: 'mf_nifty', name: 'Nifty Index Fund (MF)', qty: 10, avgPrice: 220, currentPrice: 235, type: 'Mutual Fund' }
  ]);
  const [selectedAssetToBuy, setSelectedAssetToBuy] = useState('stock_hdfc');
  const [tradeQty, setTradeQty] = useState(1);
  const [assetsCatalog] = useState([
    { id: 'stock_hdfc', name: 'HDFC Bank (Stock)', price: 1580, type: 'Stock' },
    { id: 'stock_tcs', name: 'TCS (Stock)', price: 3420, type: 'Stock' },
    { id: 'mf_nifty', name: 'Nifty Index Fund (MF)', price: 235, type: 'Mutual Fund' },
    { id: 'mf_midcap', name: 'MidCap Opportunities (MF)', price: 110, type: 'Mutual Fund' },
    { id: 'gold_etf', name: 'Gold ETF', price: 6200, type: 'Gold' }
  ]);

  // Government Scheme Finder states
  const [schemeForm, setSchemeForm] = useState({ age: 24, state: 'Maharashtra', occupation: 'Entrepreneur', annualIncome: 300000, shgMember: false });
  const [schemes, setSchemes] = useState([]);
  const [allSchemes, setAllSchemes] = useState([]);
  const [lastUpdated, setLastUpdated] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [schemesLoading, setSchemesLoading] = useState(false);
  const [bookmarkedSchemes, setBookmarkedSchemes] = useState([]);

  // Safety Center & Emergency Mode states
  const [emergencyMode, setEmergencyMode] = useState(false);
  
  // Statement parser states
  const [statementText, setStatementText] = useState('');
  const [parseResults, setParseResults] = useState(null);
  const [parsing, setParsing] = useState(false);

  // Achievements/Gamification
  const [badges, setBadges] = useState(['Financial Beginner']);

  // Fetch Dashboard on Mount
  useEffect(() => {
    fetchDashboard();
    fetchBookmarks();
    fetchAchievements();
    fetchRealSchemes();
    
    // Setup background particles
    const container = document.getElementById('finance-particles');
    if (!container) return;
    container.innerHTML = '';
    const count = 15;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'absolute bg-white/20 rounded-full pointer-events-none';
      const size = Math.random() * 6 + 3;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${Math.random() * 100}vw`;
      p.style.top = `${Math.random() * 100}vh`;
      p.style.animation = `floatBg ${Math.random() * 15 + 15}s linear infinite`;
      container.appendChild(p);
    }
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://127.0.0.1:5001/hernova-13f01/us-central1/api/finance/demo-user-123/dashboard');
      if (!res.ok) throw new Error("API request failed");
      const data = await res.json();
      setDashboardData(data.profile);
      setGoals(data.goals || []);
      setExpenses(data.expenses || []);
    } catch (err) {
      console.warn("Dashboard load failed, loading fallback data", err);
      // Mock Fallbacks
      setDashboardData({
        finherScore: 75,
        emergencyFundBalance: 65400,
        emergencyFundTarget: 100000,
        monthlySavingsRate: 20,
        netWorth: 120400,
        savingsConsistency: 85,
        investmentReadiness: 78,
        upcomingBills: [
          { id: 'b1', name: 'LIC Insurance Premium', amount: 3200, dueDate: '2026-07-16', status: 'Pending' },
          { id: 'b2', name: 'Broadband/WiFi Bill', amount: 899, dueDate: '2026-07-21', status: 'Pending' }
        ],
        spendingTrends: [
          { month: 'Jan', savings: 4500, expenses: 18000, investments: 2000 },
          { month: 'Feb', savings: 5000, expenses: 17500, investments: 2500 },
          { month: 'Mar', savings: 6000, expenses: 16000, investments: 3000 },
          { month: 'Apr', savings: 5200, expenses: 19000, investments: 3200 },
          { month: 'May', savings: 6500, expenses: 15500, investments: 4000 },
          { month: 'Jun', savings: 7200, expenses: 15000, investments: 5000 }
        ],
        expenseBreakdown: [
          { name: 'Rent', value: 12000, color: '#C2185B' },
          { name: 'Food/Groceries', value: 6500, color: '#E91E63' },
          { name: 'Travel', value: 2500, color: '#FFB300' },
          { name: 'Bills & Utilities', value: 4100, color: '#9C27B0' },
          { name: 'Shopping & Leisure', value: 4900, color: '#00BCD4' }
        ]
      });
      setGoals([
        { id: 'g1', title: 'Emergency Fund', targetAmount: 100000, currentSavings: 65400, monthlyContribution: 3000, estCompletionDate: '2027-06-15', probability: 'High' },
        { id: 'g2', title: 'Startup Capital', targetAmount: 500000, currentSavings: 20000, monthlyContribution: 10000, estCompletionDate: '2030-02-01', probability: 'Medium' }
      ]);
      setExpenses([
        { id: 'e1', title: 'Grocery Shopping', amount: 1500, category: 'Food', date: '2026-07-09' },
        { id: 'e2', title: 'Apartment Rent', amount: 12000, category: 'Rent', date: '2026-07-01' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookmarks = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5001/hernova-13f01/us-central1/api/finance/demo-user-123/schemes/bookmark');
      const data = await res.json();
      setBookmarkedSchemes(data.bookmarks || []);
    } catch (_) {}
  };

  const fetchAchievements = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5001/hernova-13f01/us-central1/api/finance/demo-user-123/achievements');
      const data = await res.json();
      if (data.badges) setBadges(data.badges);
    } catch (_) {}
  };

  const handleTemplateChange = (templateId) => {
    setSelectedTemplateId(templateId);
    const template = goalTemplates.find(t => t.id === templateId);
    if (!template) return;

    const date = new Date();
    date.setMonth(date.getMonth() + template.months);
    const deadlineString = date.toISOString().split('T')[0];

    const contribution = Math.ceil(template.targetAmount / template.months);

    setNewGoal({
      title: template.title,
      targetAmount: template.targetAmount,
      currentSavings: 0,
      monthlyContribution: contribution,
      deadline: deadlineString,
      category: template.category
    });
  };

  // Add a new Goal
  const handleSaveGoal = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5001/hernova-13f01/us-central1/api/finance/demo-user-123/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGoal)
      });
      if (res.ok) {
        setGoalModalOpen(false);
        fetchDashboard();
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // Contribute savings to goal
  const handleGoalContribution = async () => {
    if (!selectedGoalForContribution) return;
    try {
      const res = await fetch(`http://127.0.0.1:5001/hernova-13f01/us-central1/api/finance/demo-user-123/goals/${selectedGoalForContribution.id}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: contributionAmount })
      });
      if (res.ok) {
        setSelectedGoalForContribution(null);
        fetchDashboard();
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // Delete a Goal
  const handleDeleteGoal = async (goalId) => {
    try {
      const res = await fetch(`http://127.0.0.1:5001/hernova-13f01/us-central1/api/finance/demo-user-123/goals/${goalId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchDashboard();
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // Add manual expense
  const handleAddExpense = async () => {
    if (!newExpense.title || !newExpense.amount) return;
    try {
      const res = await fetch('http://127.0.0.1:5001/hernova-13f01/us-central1/api/finance/demo-user-123/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExpense)
      });
      if (res.ok) {
        setNewExpense({ title: '', amount: '', category: 'Food', date: new Date().toISOString().split('T')[0] });
        fetchDashboard();
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // AI Copilot Query
  const handleSendCopilot = async () => {
    if (!copilotInput.trim() || copilotTyping) return;
    
    const userMsg = { id: Date.now(), sender: 'user', text: copilotInput.trim() };
    setCopilotMessages(prev => [...prev, userMsg]);
    setCopilotInput('');
    setCopilotTyping(true);

    try {
      const res = await fetch('http://127.0.0.1:5001/hernova-13f01/us-central1/api/finance/demo-user-123/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userQuestion: userMsg.text })
      });
      const data = await res.json();
      setCopilotMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: data.reply }]);
    } catch (err) {
      setCopilotMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: "I ran into a connection issue, but let's practice your budgeting and wealth planning again soon!" }]);
    } finally {
      setCopilotTyping(false);
    }
  };

  // Download Financial PDF Report
  const handleDownloadReport = async () => {
    try {
      setCopilotTyping(true);
      const res = await fetch('http://127.0.0.1:5001/hernova-13f01/us-central1/api/finance/demo-user-123/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isReportRequest: true })
      });
      const data = await res.json();
      
      // Simple dynamic print helper for report
      const reportWindow = window.open('', '_blank');
      reportWindow.document.write(`
        <html>
          <head>
            <title>HerNova AI Financial Report</title>
            <style>
              body { font-family: sans-serif; padding: 40px; color: #333; line-height: 1.6; }
              pre { white-space: pre-wrap; font-family: inherit; }
              h1, h2, h3 { color: #C2185B; }
              button { background: #FFB300; border: none; padding: 10px 20px; font-weight: bold; border-radius: 5px; cursor: pointer; margin-bottom: 20px; }
              @media print { button { display: none; } }
            </style>
          </head>
          <body>
            <button onclick="window.print()">Print / Export PDF</button>
            <pre>${data.reportMarkdown}</pre>
          </body>
        </html>
      `);
      reportWindow.document.close();
    } catch (err) {
      console.warn(err);
    } finally {
      setCopilotTyping(false);
    }
  };

  // AI Investment Advisor Allocation
  const handleGetAdvisory = async () => {
    try {
      setAdvisorLoading(true);
      const res = await fetch('http://127.0.0.1:5001/hernova-13f01/us-central1/api/finance/demo-user-123/investment-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(advisorForm)
      });
      const data = await res.json();
      setAdvisorRecommendation(data);
    } catch (err) {
      console.warn(err);
    } finally {
      setAdvisorLoading(false);
    }
  };

  // Simulated Portfolio Trade Action
  const handlePortfolioTrade = (action) => {
    const asset = assetsCatalog.find(a => a.id === selectedAssetToBuy);
    if (!asset) return;

    const totalCost = asset.price * tradeQty;

    if (action === 'BUY') {
      if (virtualBalance < totalCost) return alert("Insufficient virtual balance!");
      setVirtualBalance(prev => prev - totalCost);
      setPortfolio(prev => {
        const existing = prev.find(item => item.id === asset.id);
        if (existing) {
          const totalQty = existing.qty + tradeQty;
          const avgPrice = Math.round(((existing.qty * existing.avgPrice) + totalCost) / totalQty);
          return prev.map(item => item.id === asset.id ? { ...item, qty: totalQty, avgPrice, currentPrice: asset.price } : item);
        } else {
          return [...prev, { id: asset.id, name: asset.name, qty: tradeQty, avgPrice: asset.price, currentPrice: asset.price, type: asset.type }];
        }
      });
    } else { // SELL
      const existing = portfolio.find(item => item.id === asset.id);
      if (!existing || existing.qty < tradeQty) return alert("You don't own enough shares/units to sell!");
      setVirtualBalance(prev => prev + (asset.price * tradeQty));
      setPortfolio(prev => {
        return prev.map(item => {
          if (item.id === asset.id) {
            const nextQty = item.qty - tradeQty;
            return { ...item, qty: nextQty };
          }
          return item;
        }).filter(item => item.qty > 0);
      });
    }
  };

  // Fetch Real Government Schemes from local backend
  const fetchRealSchemes = async () => {
    try {
      setSchemesLoading(true);
      const res = await fetch('http://localhost:3001/api/schemes/women');
      const data = await res.json();
      setAllSchemes(data.schemes || []);
      setLastUpdated(data.lastUpdated || '');
    } catch (err) {
      console.warn("Failed to load real OGD schemes:", err);
    } finally {
      setSchemesLoading(false);
    }
  };

  const formatTimeAgo = (isoString) => {
    if (!isoString) return 'never';
    const diffMs = new Date() - new Date(isoString);
    const diffMins = Math.round(diffMs / 60000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.round(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return new Date(isoString).toLocaleDateString('en-IN');
  };

  // Match Government Schemes (Triggers manual refresh from backend)
  const handleFindSchemes = async () => {
    await fetchRealSchemes();
  };

  const getFilteredSchemes = () => {
    return allSchemes.filter(s => {
      // 1. Category Filter
      if (selectedCategory !== 'all' && s.category !== selectedCategory) {
        return false;
      }
      
      // 2. Age Filter matching
      if (schemeForm.age) {
        // Find numbers in eligibility/description to match min age
        const text = `${s.eligibility} ${s.description}`.toLowerCase();
        const ageMatch = text.match(/(?:min|minimum|age|above|years?|years?\s*old)\s*(\d+)/i);
        if (ageMatch) {
          const minAge = parseInt(ageMatch[1], 10);
          if (schemeForm.age < minAge) return false;
        }
      }
      
      // 3. State Domicile matching
      if (schemeForm.state && s.description) {
        const text = `${s.name} ${s.description} ${s.ministry}`.toLowerCase();
        const possibleStates = ['maharashtra', 'karnataka', 'uttar pradesh', 'delhi'];
        const matchesOtherState = possibleStates.some(st => 
          st !== schemeForm.state.toLowerCase() && text.includes(st)
        );
        if (matchesOtherState) return false;
      }

      return true;
    });
  };

  const filteredSchemesList = getFilteredSchemes();

  // Bookmark / Scheme Toggle
  const handleToggleBookmark = async (schemeId) => {
    try {
      const res = await fetch('http://127.0.0.1:5001/hernova-13f01/us-central1/api/finance/demo-user-123/schemes/bookmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schemeId })
      });
      if (res.ok) {
        fetchBookmarks();
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // Submit dynamic quiz answers in Learning Hub
  const handleCompleteLesson = async (moduleId, quizScore) => {
    try {
      const res = await fetch('http://127.0.0.1:5001/hernova-13f01/us-central1/api/finance/demo-user-123/learning/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleId, isCompleted: true, quizScore })
      });
      const data = await res.json();
      if (data.badges) setBadges(data.badges);
      alert(`Lesson completed! Unlocked badges: ${data.badges.join(', ')}`);
    } catch (err) {
      console.warn(err);
    }
  };

  // Upload/Parse Statements
  const handleParseStatement = async () => {
    if (!statementText.trim()) return;
    try {
      setParsing(true);
      const res = await fetch('http://127.0.0.1:5001/hernova-13f01/us-central1/api/finance/demo-user-123/statement-parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText: statementText })
      });
      const data = await res.json();
      setParseResults(data.records);
      fetchDashboard();
    } catch (err) {
      console.warn(err);
    } finally {
      setParsing(false);
    }
  };

  // Mathematical SIP wealth calculators
  const calculateSIP = () => {
    const P = sipAmount;
    const r = sipRate / 12 / 100;
    const n = sipYears * 12;
    const expectedWealth = Math.round(P * (((Math.pow(1 + r, n) - 1) / r) * (1 + r)));
    const totalInvested = P * n;
    const returns = expectedWealth - totalInvested;
    
    // Generate compound line growth path data
    const chartData = [];
    for (let yr = 1; yr <= sipYears; yr++) {
      const months = yr * 12;
      const val = Math.round(P * (((Math.pow(1 + r, months) - 1) / r) * (1 + r)));
      chartData.push({
        year: `Year ${yr}`,
        wealth: val,
        invested: P * months
      });
    }

    return { expectedWealth, totalInvested, returns, chartData };
  };

  const { expectedWealth, totalInvested, returns, chartData } = calculateSIP();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-[#FBEAF0] to-[#F4C0D1]">
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-[#C2185B] text-5xl animate-spin">rotate_right</span>
          <p className="font-semibold text-primary">Loading HerNova Finance Module...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative text-on-surface flex-grow flex flex-col min-h-screen">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes floatBg {
          0% { transform: translateY(100vh) translateX(0); opacity: 0; }
          10% { opacity: 0.3; }
          90% { opacity: 0.3; }
          100% { transform: translateY(-100px) translateX(50px); opacity: 0; }
        }
        .tab-btn-active {
          color: #C2185B;
          border-color: #C2185B;
          font-weight: bold;
        }
      `}} />
      <div id="finance-particles" className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden"></div>
      
      <Sidebar activeItem="finance" />
      <Header />

      <main className="md:ml-64 pt-24 md:pt-32 px-margin-mobile md:px-margin-desktop pb-32 max-w-container-max mx-auto relative z-10 w-full flex flex-col gap-6">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-glass-border mb-4 gap-6 text-sm font-semibold overflow-x-auto whitespace-nowrap pb-2">
          {[
            { id: 'dashboard', name: 'Dashboard 📊' },
            { id: 'goals', name: 'Goal Planner 🎯' },
            { id: 'schemes', name: 'Govt. Schemes Finder 🏛️' }
          ].map(t => (
            <button 
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`pb-3 px-1 transition-all border-b-2 ${activeTab === t.id ? 'tab-btn-active' : 'border-transparent text-on-surface-variant'}`}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* 1. DASHBOARD TAB */}
        {activeTab === 'dashboard' && dashboardData && (
          <div className="flex flex-col gap-6 animate-fade-slide-up">
            
            {/* Top row scores */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              {/* FinHer Score Widget */}
              <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden border border-primary/10 bg-white/50">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-primary text-3xl">workspace_premium</span>
                </div>
                <h4 className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">FinHer Score</h4>
                <p className="text-4xl font-extrabold text-[#C2185B] mt-1">{dashboardData.finherScore}/100</p>
                <div className="w-full bg-surface-variant h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-primary h-full" style={{ width: `${dashboardData.finherScore}%` }}></div>
                </div>
              </div>

              {/* Emergency Fund Score */}
              <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden border border-primary/10 bg-white/50">
                <div className="w-16 h-16 rounded-full bg-[#FFB300]/10 flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-[#FFB300] text-3xl">shield_with_heart</span>
                </div>
                <h4 className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">Emergency Fund</h4>
                <p className="text-xl font-extrabold text-on-surface mt-2">
                  ₹{dashboardData.emergencyFundBalance} / ₹{dashboardData.emergencyFundTarget}
                </p>
                <span className="text-[10px] text-success-emerald font-bold mt-1">65% Target Met</span>
              </div>

              {/* Savings Consistency */}
              <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden border border-primary/10 bg-white/50">
                <div className="w-16 h-16 rounded-full bg-[#9C27B0]/10 flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-[#9C27B0] text-3xl">savings</span>
                </div>
                <h4 className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">Consistency</h4>
                <p className="text-4xl font-extrabold text-[#9C27B0] mt-1">{dashboardData.savingsConsistency}%</p>
                <span className="text-[10px] text-on-surface-variant font-medium mt-1">Consistency Tracker</span>
              </div>

              {/* Investment Readiness */}
              <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden border border-primary/10 bg-white/50">
                <div className="w-16 h-16 rounded-full bg-[#00BCD4]/10 flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-[#00BCD4] text-3xl">trending_up</span>
                </div>
                <h4 className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">Investment Readiness</h4>
                <p className="text-4xl font-extrabold text-[#00BCD4] mt-1">{dashboardData.investmentReadiness}%</p>
                <span className="text-[10px] text-on-surface-variant font-medium mt-1">Advanced Profile Tier</span>
              </div>

             </div>

            {/* PILLARS STRIP & THIS WEEK'S FOCUS NUDGE */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* Pillars Strip */}
              <div className="lg:col-span-3 glass-panel p-6 rounded-2xl flex flex-col border border-glass-border bg-white/40">
                <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant mb-4">Your Comeback Status (Program Pillars)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {pillars.map((p, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border bg-white/20 flex flex-col gap-2 transition-all hover:scale-[1.02] ${p.color}`}>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">{p.icon}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">{p.name.split(' ')[0]}</span>
                      </div>
                      <p className="text-sm font-extrabold text-on-surface mt-1">{p.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lag-aware Suggestion Nudge */}
              <div className="lg:col-span-1 glass-panel p-6 rounded-2xl flex flex-col border border-glass-border bg-gradient-to-br from-[#7B1FA2]/10 to-transparent">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#7B1FA2] flex items-center gap-1.5 mb-2">
                  <span className="material-symbols-outlined text-sm">tips_and_updates</span>
                  This Week's Focus
                </h3>
                <p className="text-xs font-semibold text-on-surface leading-relaxed flex-grow">
                  "You have completed **80% of reskilling courses** but haven't checked in with the Returnship Circle this week. Share your savings win to inspire others!"
                </p>
                <button 
                  onClick={() => setActiveTab('learning')}
                  className="font-bold text-[10px] text-primary uppercase hover:underline mt-3 text-left flex items-center gap-1"
                >
                  View Learning Circle <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </button>
              </div>

            </div>

            {/* YOUR COMEBACK TIMELINE WIDGET */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col border border-glass-border bg-white/40 relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold text-base text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">timeline</span>
                    Your Comeback Timeline
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-1 font-medium">Tracking milestones since break start (2-year software engineering pause)</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] bg-success-emerald/20 text-success-emerald px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wide">
                    Comeback Ready
                  </span>
                </div>
              </div>

              {/* Horizontal Timeline Trail */}
              <div className="relative w-full flex items-center justify-between py-8 px-4 border-t border-b border-glass-border/30 bg-white/10 rounded-xl overflow-x-auto min-h-[140px]">
                {/* Horizontal Line connecting nodes */}
                <div className="absolute left-10 right-10 top-[60px] h-[3px] bg-glass-border/60 z-0"></div>
                {/* Colored progress path */}
                <div className="absolute left-10 w-[80%] top-[60px] h-[3px] bg-gradient-to-r from-primary to-success-emerald z-0"></div>

                {milestones.map((m, idx) => {
                  const isActive = selectedMilestone?.id === m.id;
                  return (
                    <div 
                      key={m.id} 
                      onClick={() => setSelectedMilestone(m)}
                      className="relative z-10 flex flex-col items-center cursor-pointer group px-2 select-none"
                    >
                      {/* Milestone Date (Top) */}
                      <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2 group-hover:text-primary transition-colors">
                        {m.date}
                      </span>
                      {/* Node circle */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${isActive ? 'bg-[#C2185B] border-white text-white shadow-[0_0_12px_rgba(194,24,91,0.5)] scale-110' : 'bg-white/80 border-glass-border text-on-surface-variant hover:border-primary hover:scale-105'}`}>
                        <span className="material-symbols-outlined text-sm">{m.icon}</span>
                      </div>
                      {/* Milestone Label (Bottom) */}
                      <span className={`text-[10px] font-bold mt-2 text-center group-hover:text-primary transition-colors whitespace-nowrap ${isActive ? 'text-[#C2185B]' : 'text-on-surface-variant'}`}>
                        {m.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Selected Milestone Detail Popover Card */}
              {selectedMilestone && (
                <div className="mt-4 p-4 rounded-xl border border-primary/20 bg-primary/5 flex items-start gap-3 animate-fade-slide-up">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-0.5">
                    <span className="material-symbols-outlined text-lg">{selectedMilestone.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-on-surface uppercase tracking-wider flex items-center gap-2">
                      {selectedMilestone.label}
                      <span className="text-[9px] bg-white/40 border border-glass-border px-1.5 py-0.5 rounded text-on-surface-variant font-bold">{selectedMilestone.date}</span>
                    </h4>
                    <p className="text-xs font-semibold text-on-surface-variant mt-1.5 leading-relaxed">
                      {selectedMilestone.desc}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Charts and trends */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Line chart showing savings trends */}
              <div className="lg:col-span-2 glass-panel p-6 rounded-2xl flex flex-col min-h-[350px]">
                <h3 className="font-headline-md text-sm font-bold text-on-surface mb-4">Savings vs Expense Trend</h3>
                <div className="flex-1 w-full min-h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dashboardData.spendingTrends}>
                      <defs>
                        <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#2E7D32" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#C2185B" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#C2185B" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" stroke="rgba(0,0,0,0.4)" fontSize={11}/>
                      <YAxis stroke="rgba(0,0,0,0.4)" fontSize={11}/>
                      <Tooltip />
                      <Area type="monotone" dataKey="savings" stroke="#2E7D32" fillOpacity={1} fill="url(#colorSavings)" strokeWidth={2}/>
                      <Area type="monotone" dataKey="expenses" stroke="#C2185B" fillOpacity={1} fill="url(#colorExpenses)" strokeWidth={2}/>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pie chart expense breakdown */}
              <div className="lg:col-span-1 glass-panel p-6 rounded-2xl flex flex-col min-h-[350px]">
                <h3 className="font-headline-md text-sm font-bold text-on-surface mb-4">Expense Breakdown</h3>
                <div className="flex-1 w-full min-h-[200px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={dashboardData.expenseBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {dashboardData.expenseBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `₹${value}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-2 justify-center mt-3">
                  {dashboardData.expenseBreakdown.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[11px] font-semibold text-on-surface-variant">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Upcoming bills */}
              <div className="glass-panel p-6 rounded-2xl flex flex-col">
                <h3 className="font-headline-md text-sm font-bold text-on-surface mb-4">Upcoming Due Bills</h3>
                <div className="flex flex-col gap-3">
                  {dashboardData.upcomingBills.map(bill => (
                    <div key={bill.id} className="p-4 rounded-xl border border-glass-border flex justify-between items-center bg-white/20">
                      <div>
                        <h4 className="font-bold text-sm text-on-surface">{bill.name}</h4>
                        <p className="text-xs text-on-surface-variant mt-1">Due: {bill.dueDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-extrabold text-sm text-[#C2185B]">₹{bill.amount}</p>
                        <button className="text-[10px] font-bold bg-[#FFB300]/20 text-[#FFB300] border border-[#FFB300]/40 px-3 py-1 rounded-full mt-2 hover:bg-[#FFB300] hover:text-[#320047] transition-all">
                          Pay Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Micro insights nudges */}
              <div className="glass-panel p-6 rounded-2xl flex flex-col">
                <h3 className="font-headline-md text-sm font-bold text-on-surface mb-4">Smart Insights & Nudges</h3>
                <div className="flex flex-col gap-3">
                  <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#C2185B]">lightbulb</span>
                    <p className="text-xs font-semibold text-on-surface-variant leading-relaxed">
                      "You spent **₹2,100 more on shopping** this month compared to average. Trimming shopping by 15% would fund a SIP investment!"
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#FFB300]/5 border border-[#FFB300]/10 flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#FFB300]">campaign</span>
                    <p className="text-xs font-semibold text-on-surface-variant leading-relaxed">
                      "Reducing your dining out/Swiggy expenses by **₹1,000/month** will help you achieve your Startup capital goal **3 months earlier**!"
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-success-emerald/5 border border-success-emerald/10 flex items-start gap-3">
                    <span className="material-symbols-outlined text-success-emerald">savings</span>
                    <p className="text-xs font-semibold text-on-surface-variant leading-relaxed">
                      "Emergency fund consistency rate is at **85%**. Transfer ₹3,000 this month to maintain your streak medal!"
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}



        {/* 3. GOAL PLANNER TAB */}
        {activeTab === 'goals' && (
          <div className="flex flex-col gap-6 animate-fade-slide-up">
            
            {/* Header / Trigger */}
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-on-surface-variant uppercase tracking-wider">Goal Planner</h3>
              <button 
                onClick={() => setGoalModalOpen(true)}
                className="font-bold text-xs bg-primary text-white px-4 py-2.5 rounded-xl hover:opacity-90 transition-all flex items-center gap-1 shadow-md"
              >
                <span className="material-symbols-outlined text-sm">add</span> Add New Goal
              </button>
            </div>

            {/* Goals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {goals.map(g => {
                const percent = Math.min(100, Math.round((g.currentSavings / g.targetAmount) * 100));
                
                // Calculate projected completion date based on monthly contribution rate (Requirement 4)
                const gap = Math.max(0, g.targetAmount - g.currentSavings);
                const remainingMonths = g.monthlyContribution > 0 ? Math.ceil(gap / g.monthlyContribution) : 999;
                
                const getProjectedDateString = (mLeft) => {
                  if (mLeft === 999) return 'Paused / Unspecified';
                  const d = new Date();
                  d.setMonth(d.getMonth() + mLeft);
                  return d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
                };

                const projDate = getProjectedDateString(remainingMonths);

                // Check for matched central/state schemes from OGD cache list (Requirement 3)
                const goalCategory = g.category || (g.title.toLowerCase().includes('business') ? 'entrepreneurship' : g.title.toLowerCase().includes('upskilling') ? 'education' : g.title.toLowerCase().includes('emergency') ? 'financial inclusion' : 'financial inclusion');
                const matchedSchemes = allSchemes.filter(s => s.category === goalCategory);

                return (
                  <div key={g.id} className="glass-panel p-6 rounded-2xl flex flex-col border border-glass-border relative">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-extrabold text-base text-on-surface">{g.title}</h4>
                        <p className="text-xs text-on-surface-variant mt-1">Target: **₹{g.targetAmount}**</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${g.probability === 'High' ? 'bg-success-emerald/20 text-success-emerald' : g.probability === 'Medium' ? 'bg-[#FFB300]/20 text-[#FFB300]' : 'bg-error/20 text-error'}`}>
                          {g.probability} Probability
                        </span>
                        <p className="text-[10px] text-on-surface-variant mt-1.5">Projected: **{projDate}**</p>
                      </div>
                    </div>

                    {/* Progress bar (Amber-to-Emerald Gradient) */}
                    <div className="w-full bg-surface-variant h-3.5 rounded-full overflow-hidden mt-6 relative border border-glass-border">
                      <div className="h-full bg-gradient-to-r from-[#FFB300] to-success-emerald" style={{ width: `${percent}%` }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-3 text-[11px] font-bold text-on-surface-variant">
                      <span>₹{g.currentSavings} saved</span>
                      <span>{percent}%</span>
                    </div>

                    {/* Inline Scheme Matching Recommendation Card */}
                    {matchedSchemes.length > 0 && (
                      <div className="mt-4 p-3 rounded-xl bg-[#FFB300]/5 border border-[#FFB300]/25 flex items-center justify-between text-[11px] animate-fade-slide-up">
                        <span className="font-semibold text-on-surface-variant flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm text-[#FFB300]">wb_incandescent</span>
                          {matchedSchemes.length} matching welfare schemes found!
                        </span>
                        <button 
                          onClick={() => {
                            setSelectedCategory(goalCategory);
                            setActiveTab('schemes');
                          }}
                          className="font-bold text-[#C2185B] hover:underline"
                        >
                          View Details
                        </button>
                      </div>
                    )}

                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-glass-border gap-4">
                      <button 
                        onClick={() => setSelectedGoalForContribution(g)}
                        className="flex-1 font-bold text-xs bg-[#FFB300]/20 text-[#FFB300] border border-[#FFB300]/40 py-2 rounded-xl hover:bg-[#FFB300] hover:text-[#320047] transition-all"
                      >
                        Add Savings
                      </button>
                      <button 
                        onClick={() => handleDeleteGoal(g.id)}
                        className="font-bold text-xs text-error hover:underline px-2 py-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Goal Modal with Templates (Requirement 1-2) */}
            {goalModalOpen && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center">
                <div className="absolute inset-0 bg-surface/40 backdrop-blur-sm" onClick={() => setGoalModalOpen(false)}></div>
                <div className="relative w-full max-w-md mx-4 glass-panel rounded-2xl p-6 border border-glass-border shadow-2xl overflow-y-auto max-h-[90vh]">
                  <h3 className="font-bold text-base text-primary mb-4">Create Financial Goal</h3>
                  
                  <div className="flex flex-col gap-4">
                    
                    {/* Pre-built Goal Templates */}
                    <div>
                      <label className="block text-[10px] text-on-surface-variant font-bold uppercase ml-1 mb-2">Select Goal Template</label>
                      <select 
                        value={selectedTemplateId}
                        onChange={(e) => handleTemplateChange(e.target.value)}
                        className="w-full bg-white/20 border border-glass-border rounded-xl px-4 py-2.5 text-xs text-on-surface font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        {goalTemplates.map(t => (
                          <option key={t.id} value={t.id}>{t.title}</option>
                        ))}
                      </select>
                    </div>

                    {/* "Why this matters" quote block */}
                    {goalTemplates.find(t => t.id === selectedTemplateId) && (
                      <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 text-[11px] leading-relaxed text-on-surface-variant italic font-medium">
                        <strong>Why this matters:</strong> "{goalTemplates.find(t => t.id === selectedTemplateId).whyCopy}"
                      </div>
                    )}

                    <div>
                      <label className="block text-[10px] text-on-surface-variant font-bold uppercase ml-1 mb-1">Goal Name</label>
                      <input 
                        type="text" 
                        value={newGoal.title}
                        onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                        disabled={selectedTemplateId !== 'template_custom'}
                        className="w-full bg-white/20 border border-glass-border rounded-xl px-4 py-2.5 text-xs text-on-surface disabled:opacity-75"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-on-surface-variant font-bold uppercase ml-1 mb-1">Target Amount (₹)</label>
                      <input 
                        type="number" 
                        value={newGoal.targetAmount}
                        onChange={(e) => setNewGoal({ ...newGoal, targetAmount: Number(e.target.value) })}
                        disabled={selectedTemplateId !== 'template_custom'}
                        className="w-full bg-white/20 border border-glass-border rounded-xl px-4 py-2.5 text-xs text-on-surface disabled:opacity-75"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-on-surface-variant font-bold uppercase ml-1 mb-1">Monthly Contribution (₹)</label>
                      <input 
                        type="number" 
                        value={newGoal.monthlyContribution}
                        onChange={(e) => setNewGoal({ ...newGoal, monthlyContribution: Number(e.target.value) })}
                        className="w-full bg-white/20 border border-glass-border rounded-xl px-4 py-2.5 text-xs text-on-surface"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-on-surface-variant font-bold uppercase ml-1 mb-1">Target Deadline</label>
                      <input 
                        type="date" 
                        value={newGoal.deadline}
                        onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                        className="w-full bg-white/20 border border-glass-border rounded-xl px-4 py-2.5 text-xs text-on-surface"
                      />
                    </div>

                    <button 
                      onClick={handleSaveGoal}
                      className="w-full font-bold text-xs bg-primary text-white py-3 rounded-xl hover:opacity-90 mt-2 transition-all font-bold"
                    >
                      Save Goal
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Contribution Modal */}
            {selectedGoalForContribution && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center">
                <div className="absolute inset-0 bg-surface/40 backdrop-blur-sm" onClick={() => setSelectedGoalForContribution(null)}></div>
                <div className="relative w-full max-w-sm mx-4 glass-panel rounded-2xl p-6 border border-glass-border shadow-2xl">
                  <h3 className="font-bold text-base text-primary mb-4">Add Savings to: {selectedGoalForContribution.title}</h3>
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="block text-[10px] text-on-surface-variant font-bold uppercase ml-1 mb-1">Savings Amount (₹)</label>
                      <input 
                        type="number" 
                        value={contributionAmount}
                        onChange={(e) => setContributionAmount(Number(e.target.value))}
                        className="w-full bg-white/20 border border-glass-border rounded-xl px-4 py-2 text-xs text-on-surface"
                      />
                    </div>
                    <button 
                      onClick={handleGoalContribution}
                      className="w-full font-bold text-xs bg-primary text-white py-3 rounded-xl hover:opacity-90"
                    >
                      Confirm Savings
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}



        {/* 5. GOVERNMENT SCHEME FINDER */}
        {activeTab === 'schemes' && (
          <div className="flex flex-col gap-6 animate-fade-slide-up">
            
            {/* OGD Header with lastUpdated Timestamp */}
            <div className="flex justify-between items-center bg-white/40 p-4 rounded-xl border border-glass-border">
              <div>
                <h3 className="font-bold text-sm text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#FFB300]">account_balance</span>
                  Real-time Government Welfare Schemes
                </h3>
                {lastUpdated && (
                  <p className="text-[10px] text-on-surface-variant mt-1 font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs text-success-emerald animate-pulse">check_circle</span>
                    Updated {formatTimeAgo(lastUpdated)} (Source: data.gov.in)
                  </p>
                )}
              </div>
              <button 
                onClick={handleFindSchemes}
                disabled={schemesLoading}
                className="font-bold text-xs bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
              >
                <span className={`material-symbols-outlined text-xs ${schemesLoading ? 'animate-spin' : ''}`}>sync</span>
                Sync Data
              </button>
            </div>

            {/* Category Filter Buttons */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {[
                { id: 'all', name: 'All Schemes 🌟' },
                { id: 'maternity/health', name: 'Maternity & Health 🤰' },
                { id: 'education', name: 'Education 🎓' },
                { id: 'employment', name: 'Employment & Skills 💼' },
                { id: 'financial inclusion', name: 'Financial Inclusion 🪙' },
                { id: 'entrepreneurship', name: 'Entrepreneurship 🚀' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl font-bold text-xs border transition-all whitespace-nowrap ${selectedCategory === cat.id ? 'bg-primary text-white border-transparent shadow-sm' : 'bg-white/30 border-glass-border text-on-surface-variant hover:bg-white/50'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Profile Filters Panel */}
              <div className="lg:col-span-1 glass-panel p-6 rounded-2xl flex flex-col border border-glass-border self-start">
                <h4 className="font-bold text-xs text-on-surface flex items-center gap-1.5 mb-4">
                  <span className="material-symbols-outlined text-sm">tune</span>
                  Filter by Eligibility
                </h4>
                
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-[10px] text-on-surface-variant font-bold uppercase ml-1 mb-1">Age</label>
                    <input 
                      type="number" 
                      value={schemeForm.age}
                      onChange={(e) => setSchemeForm({ ...schemeForm, age: Number(e.target.value) })}
                      className="w-full bg-white/20 border border-glass-border rounded-xl px-4 py-2.5 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-on-surface-variant font-bold uppercase ml-1 mb-1">State Domicile</label>
                    <select 
                      value={schemeForm.state}
                      onChange={(e) => setSchemeForm({ ...schemeForm, state: e.target.value })}
                      className="w-full bg-white/20 border border-glass-border rounded-xl px-4 py-2.5 text-xs text-on-surface font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Delhi">Delhi</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-on-surface-variant font-bold uppercase ml-1 mb-1">Occupation</label>
                    <select 
                      value={schemeForm.occupation}
                      onChange={(e) => setSchemeForm({ ...schemeForm, occupation: e.target.value })}
                      className="w-full bg-white/20 border border-glass-border rounded-xl px-4 py-2.5 text-xs text-on-surface font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="Entrepreneur">Entrepreneur / Business Owner</option>
                      <option value="Working Professional">Working Professional</option>
                      <option value="Homemaker">Homemaker</option>
                      <option value="Student">Student</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-on-surface-variant font-bold uppercase ml-1 mb-1">Annual Income (₹)</label>
                    <input 
                      type="number" 
                      value={schemeForm.annualIncome}
                      onChange={(e) => setSchemeForm({ ...schemeForm, annualIncome: Number(e.target.value) })}
                      className="w-full bg-white/20 border border-glass-border rounded-xl px-4 py-2.5 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between border border-glass-border p-3 rounded-xl bg-white/10 mt-1">
                    <span className="text-xs text-on-surface-variant font-semibold">Self-Help Group (SHG) Member?</span>
                    <input 
                      type="checkbox" 
                      checked={schemeForm.shgMember}
                      onChange={(e) => setSchemeForm({ ...schemeForm, shgMember: e.target.checked })}
                      className="w-5 h-5 rounded border-glass-border text-primary focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Matched Schemes Cards */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                
                {/* 1. LOADING SKELETON STATE */}
                {schemesLoading ? (
                  <div className="flex flex-col gap-4">
                    {[1, 2, 3].map(n => (
                      <div key={n} className="glass-panel p-6 rounded-2xl border border-glass-border flex flex-col gap-3 animate-pulse bg-white/30">
                        <div className="h-4 bg-primary/20 w-1/4 rounded"></div>
                        <div className="h-6 bg-on-surface/10 w-2/3 rounded mt-2"></div>
                        <div className="h-4 bg-on-surface/10 w-full rounded mt-1"></div>
                        <div className="h-4 bg-on-surface/10 w-5/6 rounded"></div>
                        <div className="h-10 bg-primary/10 rounded mt-3"></div>
                      </div>
                    ))}
                  </div>
                ) : filteredSchemesList.length === 0 ? (
                  /* 2. EMPTY STATE */
                  <div className="glass-panel p-12 text-center rounded-2xl border border-glass-border bg-white/30 flex flex-col items-center justify-center">
                    <span className="material-symbols-outlined text-[#FFB300] text-5xl mb-3 animate-bounce">info</span>
                    <h4 className="font-extrabold text-sm text-on-surface">No schemes matched your filters</h4>
                    <p className="text-xs text-on-surface-variant mt-1.5 max-w-sm leading-relaxed">
                      Try updating your profile details on the left, or change the category filter to explore other options.
                    </p>
                  </div>
                ) : (
                  /* 3. CARD GRID LISTING */
                  filteredSchemesList.map(s => {
                    const isBookmarked = bookmarkedSchemes.some(bm => bm.id === s.id);
                    return (
                      <div key={s.id} className="glass-panel p-6 rounded-2xl flex flex-col border border-glass-border relative hover:border-[#FFB300]/50 hover:shadow-md transition-all animate-fade-slide-up">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[9px] bg-primary/20 text-[#C2185B] px-2.5 py-0.5 rounded-full font-extrabold uppercase tracking-wide">
                              {s.ministry}
                            </span>
                            <h4 className="font-extrabold text-base text-on-surface mt-2.5 leading-snug">{s.name}</h4>
                          </div>
                          <button 
                            onClick={() => handleToggleBookmark(s.id)}
                            className="p-2 rounded-full bg-white/20 border border-glass-border hover:text-[#C2185B] transition-colors"
                          >
                            <span className={`material-symbols-outlined text-sm ${isBookmarked ? 'fill text-[#C2185B]' : 'text-on-surface-variant'}`}>
                              bookmark
                            </span>
                          </button>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-on-surface-variant leading-relaxed mt-3">{s.description}</p>
                        
                        {/* Benefits & Eligibility details */}
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-glass-border/30 text-xs">
                          <div>
                            <p className="font-bold text-[10px] text-primary uppercase mb-1">Key Benefits:</p>
                            <p className="text-on-surface-variant leading-relaxed font-semibold">{s.benefits}</p>
                          </div>
                          <div>
                            <p className="font-bold text-[10px] text-[#FFB300] uppercase mb-1">Eligibility Criteria:</p>
                            <p className="text-on-surface-variant leading-relaxed font-semibold">{s.eligibility}</p>
                          </div>
                        </div>

                        {/* Action apply portal */}
                        <div className="mt-6 pt-4 border-t border-glass-border flex justify-end">
                          <a 
                            href={s.applyUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="font-bold text-xs bg-[#FFB300] text-[#320047] hover:bg-[#FFC107] px-5 py-2.5 rounded-xl hover:opacity-95 shadow-sm text-center transition-all flex items-center gap-1"
                          >
                            Apply / Learn More
                            <span className="material-symbols-outlined text-xs">open_in_new</span>
                          </a>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>
        )}





      </main>
    </div>
  );
}
